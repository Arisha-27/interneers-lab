import os
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_core.output_parsers import StrOutputParser

from retriever import retrieve_relevant_chunks

load_dotenv()

SYSTEM_PROMPT = """You are "Ask the Expert", a helpful assistant for ToyWorld customers.
Answer the user's question ONLY based on the provided context documents.
If the answer is not in the context, say: "I don't have that information in our documents. Please contact support."
Be concise, accurate, and friendly.

Context:
{context}
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "{question}"),
])

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0,
)


def format_context(chunks: list[dict]) -> str:
    """Format retrieved chunks into a single context string."""
    parts = []
    for chunk in chunks:
        parts.append(f"[Source: {chunk['source']}]\n{chunk['content']}")
    return "\n\n---\n\n".join(parts)


def retrieve_and_format(question: str) -> dict:
    """Retrieve chunks and format them for the prompt."""
    chunks = retrieve_relevant_chunks(question, top_k=3)
    context = format_context(chunks)
    return {"context": context, "question": question, "chunks": chunks}


def build_rag_chain():
    """Build and return the RAG chain."""
    chain = (
        RunnableLambda(lambda x: {
            "context": format_context(retrieve_relevant_chunks(x["question"], top_k=3)),
            "question": x["question"],
        })
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain


def ask(question: str) -> dict:
    """
    Ask a question and get a grounded answer with source chunks.

    Returns:
        dict with 'answer' (str) and 'chunks' (list of retrieved chunks)
    """
    retrieved = retrieve_and_format(question)
    chain = build_rag_chain()
    answer = chain.invoke({"question": question})
    return {
        "answer": answer,
        "chunks": retrieved["chunks"],
    }


if __name__ == "__main__":
    q = "What is the warranty period for the Lego Castle?"
    print(f"\nQ: {q}")
    result = ask(q)
    print(f"A: {result['answer']}\n")
    print("Sources used:")
    for c in result["chunks"]:
        print(f"  - {c['source']} (score: {c['score']})")