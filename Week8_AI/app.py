import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

import streamlit as st
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="ToyWorld — Ask the Expert",
    page_icon="🧸",
    layout="wide",
)

st.title("🧸 ToyWorld — Ask the Expert")
st.markdown(
    "Ask me anything about our **products**, **return policy**, **vendor information**, "
    "or **stock availability**. "
    "Powered by **Gemini 2.5 Flash** 🆓 — answers are grounded in our documents **and** live inventory."
)

@st.cache_resource(show_spinner="Loading knowledge base + inventory...")
def load_rag():
    from src.advanced_rag import ask_with_stock
    return ask_with_stock

try:
    ask_fn = load_rag()
    rag_ready = True
except Exception as e:
    rag_ready = False
    st.error(
        f"⚠️ Knowledge base not found. Please run `python src/ingest.py` first.\n\n{e}"
    )

with st.sidebar:
    st.header("💡 Example Questions")
    examples = [
        "Is the LEGO Castle in stock and what is its warranty?",
        "Recommend a toy under ₹3000 that is in stock",
        "What's the return policy for damaged items?",
        "What batteries does the Turbo X RC Car need?",
        "What certifications are required for toy products?",
        "How do I return an item I bought online?",
        "What is the minimum order quantity for vendors?",
        "Can I return an opened video game?",
    ]
    for ex in examples:
        if st.button(ex, use_container_width=True):
            st.session_state["pending_query"] = ex

    st.divider()
    st.markdown("**Settings**")
    show_sources = st.toggle("Show source chunks", value=True)

    st.divider()
    st.markdown("**ℹ️ How it works**")
    st.caption(
        "📄 **Documents** → ChromaDB vector search\n\n"
        "🗄️ **Inventory** → Mock DB (keyword match)\n\n"
        "🤖 **Gemini** merges both into one answer\n\n"
        "Inventory cards appear only when you ask about stock, price, or availability."
    )

    st.divider()
    st.markdown("**Model Info**")
    st.info("🤖 Gemini 2.5 Flash\n📦 ChromaDB (local)\n🗄️ Inventory DB\n🔗 LangSmith tracing")

def render_response(result, show_sources_flag):
    """Render answer, and conditionally show stock badges + source chunks."""
    st.markdown(result["answer"])

    if result.get("needs_inventory") and result.get("stock_info"):
        st.markdown("---")
        cols = st.columns(min(len(result["stock_info"]), 4))
        for i, product in enumerate(result["stock_info"]):
            with cols[i % len(cols)]:
                if product["stock"] > 0:
                    st.success(
                        f"**{product['name']}**\n\n"
                        f" {product['stock']} units · ₹{product['price']:,.0f}\n\n"
                        f"📍 {product['location']}"
                    )
                else:
                    st.error(
                        f"**{product['name']}**\n\n"
                        f" Out of Stock · ₹{product['price']:,.0f}"
                    )

    if show_sources_flag and result.get("doc_chunks"):
        with st.expander("📄 Source chunks used"):
            for chunk in result["doc_chunks"]:
                st.markdown(f"**Source:** `{chunk['source']}` | **Score:** {chunk['score']}")
                st.code(chunk["content"], language=None)

if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        if msg["role"] == "assistant" and msg.get("result"):
            render_response(msg["result"], show_sources)
        else:
            st.markdown(msg["content"])

if "pending_query" in st.session_state:
    pending = st.session_state.pop("pending_query")
    if rag_ready:
        st.session_state.messages.append({"role": "user", "content": pending})
        with st.chat_message("user"):
            st.markdown(pending)
        with st.chat_message("assistant"):
            with st.spinner("Searching docs + inventory with Gemini..."):
                result = ask_fn(pending)
            render_response(result, show_sources)
        st.session_state.messages.append({
            "role": "assistant", "content": result["answer"], "result": result
        })

user_input = st.chat_input("Ask about products, returns, stock, vendors...")

if user_input and rag_ready:
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    with st.chat_message("assistant"):
        with st.spinner("Searching docs + inventory with Gemini..."):
            result = ask_fn(user_input)
        render_response(result, show_sources)

    st.session_state.messages.append({
        "role": "assistant", "content": result["answer"], "result": result,
    })

st.divider()
st.caption("Powered by LangChain + ChromaDB + Gemini 2.5 Flash (FREE) + Inventory DB | Traced with LangSmith")