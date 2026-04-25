import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from retriever import retrieve_relevant_chunks

load_dotenv()

MOCK_INVENTORY_DB = {
    "LG-4001": {"name": "LEGO Castle Set",             "sku": "LG-4001", "stock": 23, "price": 7499.00, "price_usd": 89.99, "warranty_years": 2, "location": "Aisle 3B"},
    "RC-7520": {"name": "Turbo X RC Car",               "sku": "RC-7520", "stock": 0,  "price": 2899.00, "price_usd": 34.99, "warranty_years": 1, "location": "Warehouse"},
    "AS-2210": {"name": "Creative Studio Art Kit",      "sku": "AS-2210", "stock": 15, "price": 2099.00, "price_usd": 24.99, "warranty_years": 0.5, "location": "Aisle 1A"},
    "BG-3305": {"name": "Mystery Mansion Board Game",   "sku": "BG-3305", "stock": 8,  "price": 3749.00, "price_usd": 44.99, "warranty_years": 1, "location": "Aisle 5C"},
}

PRODUCT_KEYWORD_MAP = {
    "lego castle":       "LG-4001",
    "lego":              "LG-4001",
    "castle set":        "LG-4001",
    "lg-4001":           "LG-4001",
    "turbo x":           "RC-7520",
    "rc car":            "RC-7520",
    "remote control car":"RC-7520",
    "rc-7520":           "RC-7520",
    "art kit":           "AS-2210",
    "creative studio":   "AS-2210",
    "art supplies":      "AS-2210",
    "as-2210":           "AS-2210",
    "mystery mansion":   "BG-3305",
    "board game":        "BG-3305",
    "bg-3305":           "BG-3305",
}


def get_stock_info(question: str) -> list[dict]:
    question_lower = question.lower()
    matched_ids = set()
    for keyword, item_id in PRODUCT_KEYWORD_MAP.items():
        if keyword in question_lower:
            matched_ids.add(item_id)
    return [MOCK_INVENTORY_DB[pid] for pid in matched_ids if pid in MOCK_INVENTORY_DB]


def get_all_products() -> list[dict]:
    return list(MOCK_INVENTORY_DB.values())


def _is_inventory_query(question: str) -> bool:
    """Detect if the user is asking about stock, price, or availability."""
    keywords = ["stock", "available", "availability", "price", "cost",
                "how much", "in store", "where", "aisle", "location",
                "buy", "purchase", "order", "out of stock"]
    q = question.lower()
    return any(kw in q for kw in keywords)


def _is_recommendation_query(question: str) -> bool:
    """Detect if the user is asking for a recommendation / comparison across products."""
    keywords = ["recommend", "suggest", "under", "budget", "cheapest", "best",
                "compare", "which toy", "all products", "what toys"]
    q = question.lower()
    return any(kw in q for kw in keywords)


def _format_inventory_block(products: list[dict]) -> str:
    """Format inventory records into a readable block for the LLM."""
    if not products:
        return "No inventory data matched for this query."
    lines = []
    for p in products:
        status = f" In Stock ({p['stock']} units)" if p["stock"] > 0 else " Out of Stock"
        lines.append(
            f"- **{p['name']}** (SKU: {p['sku']})\n"
            f"  Status: {status} | Price: ₹{p['price']:,.0f} (${p['price_usd']}) | "
            f"Warranty: {p['warranty_years']} year(s) | Location: {p['location']}"
        )
    return "\n".join(lines)

COMBINED_SYSTEM_PROMPT = """You are "Ask the Expert", a helpful assistant for ToyWorld customers.
You have TWO data sources:

1. **Documentation** (product manuals, return policy, vendor FAQ):
{context}

2. **Live Inventory Database** (real-time stock, prices, location):
{inventory}

RULES:
- Answer using BOTH sources when relevant.
- When asked about stock / availability / price, use the Inventory Database.
- When asked about warranty, assembly, returns, etc., use the Documentation.
- For questions that span both (e.g. "Is it in stock AND what's the warranty?"), combine both.
- For recommendation queries (e.g. "recommend a toy under ₹3000 in stock"), filter the inventory and add doc details.
- If neither source has the answer, say: "I don't have that information in our documents. Please contact support."
- Be concise, accurate, and friendly.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", COMBINED_SYSTEM_PROMPT),
    ("human", "{question}"),
])

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0,
)

chain = prompt | llm | StrOutputParser()


def format_context(chunks: list[dict]) -> str:
    """Format retrieved document chunks into a single context string."""
    parts = []
    for chunk in chunks:
        parts.append(f"[Source: {chunk['source']}]\n{chunk['content']}")
    return "\n\n---\n\n".join(parts)


def ask_with_stock(question: str) -> dict:
    """
    Combined RAG + DB answer.
    Returns dict with 'answer', 'doc_chunks', 'stock_info', 'needs_inventory'.
    """
    needs_inventory = _is_inventory_query(question) or _is_recommendation_query(question)

    chunks = retrieve_relevant_chunks(question, top_k=3)
    context = format_context(chunks)

    stock_hits = []
    if needs_inventory:
        stock_hits = get_stock_info(question)
        if _is_recommendation_query(question) and not stock_hits:
            stock_hits = get_all_products()

    inventory_text = _format_inventory_block(stock_hits) if stock_hits else "Not requested for this query."

    answer = chain.invoke({
        "context": context,
        "inventory": inventory_text,
        "question": question,
    })

    return {
        "answer": answer,
        "doc_chunks": chunks,
        "stock_info": stock_hits if needs_inventory else [],
        "needs_inventory": needs_inventory,
    }


if __name__ == "__main__":
    questions = [
        "What is the warranty for the Lego Castle and is it in stock?",
        "Tell me about the Turbo X RC car return policy",
        "Recommend a toy under ₹3000 that is in stock and has at least 1-year warranty.",
        "How do I clean art supplies?",
    ]

    for q in questions:
        print(f"\nQ: {q}")
        result = ask_with_stock(q)
        print(f"A: {result['answer']}")
        if result["stock_info"]:
            print(f"   [DB hits: {', '.join(p['name'] for p in result['stock_info'])}]")
        print()