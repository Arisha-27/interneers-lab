import streamlit as st
import pandas as pd
from pydantic import ValidationError

from models import Product
from gemini_service import generate_products
from mongo_service import save_products, count_products
import google.generativeai as genai
from config import GEMINI_MODEL

st.set_page_config(
    page_title="🧸 Toy Store Simulator",
    page_icon="🧸",
    layout="wide",
    initial_sidebar_state="expanded",
)

SCENARIOS: dict[str, dict] = {
    "🎄 Holiday Rush": {
        "desc": "Christmas & New Year peak season with high gift demand.",
        "hint": (
            "Generate premium gift-ready toys. Stock levels must be HIGH (200–500). "
            "Focus on gift sets, board games, action figures, dolls, and STEM kits. "
            "Prices between $15–$80. Products should feel gift-wrappable and festive."
        ),
        "color": "#e74c3c",
        "emoji": "🎄",
    },
    "☀️ Summer Sale": {
        "desc": "Back-to-school and outdoor play season clearance.",
        "hint": (
            "Focus on outdoor toys, sports equipment, water toys, and arts & crafts. "
            "Stock moderate (50–200). Mix of new arrivals and clearance items. "
            "Prices $5–$40."
        ),
        "color": "#f39c12",
        "emoji": "☀️",
    },
    "🏫 Back to School": {
        "desc": "Educational toys and learning kits in high demand.",
        "hint": (
            "Focus on STEM kits, educational toys, puzzles, and art supplies. "
            "Stock HIGH (150–400). Target ages 5–14. Prices $10–$60. "
            "Products should have clear learning outcomes."
        ),
        "color": "#2980b9",
        "emoji": "🏫",
    },
    "🎃 Halloween Special": {
        "desc": "Spooky-themed toys for Halloween season.",
        "hint": (
            "Generate Halloween-themed toys: monster figures, spooky puzzles, "
            "costume accessories, glow-in-dark toys. Stock LIMITED (20–80) for urgency. "
            "Prices $8–$35."
        ),
        "color": "#8e44ad",
        "emoji": "🎃",
    },
    "🧹 Clearance Event": {
        "desc": "End-of-season deep discount clearance.",
        "hint": (
            "Mix of ALL categories. Stock VERY LOW (1–25 units) — these are last units. "
            "Prices LOW (under $12). Products are previous-season or overstocked items."
        ),
        "color": "#27ae60",
        "emoji": "🧹",
    },
}

def validate_products(raw: list[dict]) -> tuple[list[Product], list[dict]]:
    valid, failed = [], []
    for item in raw:
        try:
            valid.append(Product(**item))
        except ValidationError as e:
            failed.append({"raw": item, "errors": e.errors()})
    return valid, failed

with st.sidebar:
    st.header("⚙️ Configuration")

    gemini_key = st.text_input(
        "🔑 Gemini API Key",
        type="password",
    )

    mongo_uri = st.text_input(
        "🍃 MongoDB URI",
        value="mongodb://localhost:27017",
        help="Local MongoDB default URI",
    )

    st.divider()

    if st.button("🔄 Refresh DB Stats"):
        st.rerun()

    try:
        total_products = count_products()
        st.metric("Products in DB", total_products)
    except Exception:
        st.warning("MongoDB not connected")

    st.divider()

st.title("🧸 Toy Store AI Scenario Simulator")
st.caption(
    "Choose a sales scenario → Gemini generates realistic inventory → "
    "Pydantic validates → Save to MongoDB"
)

st.subheader("Step 1 — Choose a Scenario")

cols = st.columns(len(SCENARIOS))
selected_scenario = st.session_state.get("selected_scenario", list(SCENARIOS.keys())[0])

for col, (name, info) in zip(cols, SCENARIOS.items()):
    with col:

        is_selected = name == selected_scenario
        border = f"3px solid {info['color']}" if is_selected else "2px solid #ddd"
        bg     = "#f8f9fa" if is_selected else "white"

        st.markdown(
            f"""
            <div style="border:{border}; border-radius:12px; padding:12px;
                        background:{bg}; text-align:center; cursor:pointer;
                        min-height:90px;">
                <div style="font-size:1.6rem">{info['emoji']}</div>
                <div style="font-size:0.75rem; font-weight:600; color:{info['color']}">{name[2:]}</div>
                <div style="font-size:0.65rem; color:#666; margin-top:4px">{info['desc']}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button("Select", key=f"btn_{name}", use_container_width=True):
            st.session_state["selected_scenario"] = name
            selected_scenario = name
            st.rerun()

scenario_info = SCENARIOS[selected_scenario]
st.info(f"**{selected_scenario}** — {scenario_info['desc']}")

st.divider()

st.subheader("Step 2 — Configure & Generate")

col1, col2 = st.columns([2, 1])
with col1:
    product_count = st.slider(
        "Number of products to generate",
        min_value=5, max_value=100, value=20, step=5,
        help="More products = more API tokens used. 20 is a good start."
    )
with col2:
    st.metric("Estimated tokens", f"~{product_count * 120:,}")
    st.caption("(rough estimate, actual varies)")

generate_btn = st.button(
    f"🚀 Generate {product_count} Products for {selected_scenario}",
    type="primary",
    use_container_width=True,
    disabled=not gemini_key,
)

if not gemini_key:
    st.warning("⚠️ Enter your Gemini API key in the sidebar to continue.")

if generate_btn and gemini_key:
    genai.configure(api_key=gemini_key)

    with st.spinner(f"🤖 Asking Gemini to generate {product_count} products..."):
        try:
            raw_products = generate_products(
                count=product_count,
                scenario_hint=scenario_info["hint"],
            )
        except Exception as e:
            st.error(f"❌ Gemini API error: {e}")
            st.stop()

    with st.spinner("🔍 Validating with Pydantic..."):
        valid_products, failed_products = validate_products(raw_products)

    st.session_state["valid_products"]   = valid_products
    st.session_state["failed_products"]  = failed_products
    st.session_state["current_scenario"] = selected_scenario

    col1, col2, col3 = st.columns(3)
    col1.success(f"✅ Generated: {len(raw_products)}")
    col2.success(f"✅ Valid: {len(valid_products)}")
    if failed_products:
        col3.error(f"❌ Failed: {len(failed_products)}")
    else:
        col3.success("❌ Failed: 0")

if "valid_products" in st.session_state and st.session_state["valid_products"]:
    valid   = st.session_state["valid_products"]
    failed  = st.session_state["failed_products"]
    current = st.session_state["current_scenario"]

    st.divider()
    st.subheader("Step 3 — Preview Generated Products")

    df = pd.DataFrame([p.model_dump() for p in valid])
    m1, m2, m3, m4, m5 = st.columns(5)
    m1.metric("Total Products",  len(valid))
    m2.metric("Avg Price",       f"${df['price'].mean():.2f}")
    m3.metric("Total Stock",     f"{int(df['quantity'].sum()):,}")
    m4.metric("Categories",      df["category"].nunique())
    m5.metric("Scenario",        current.split(" ", 1)[1] if " " in current else current)

    display_df = df[["name", "category", "price", "quantity", "sku", "description"]].copy()
    display_df.columns = ["Name", "Category", "Price ($)", "Quantity", "SKU", "Description"]
    st.dataframe(display_df, use_container_width=True, height=350)

    cat_counts = df["category"].value_counts()
    st.bar_chart(cat_counts)

    if failed:
        with st.expander(f"⚠️ {len(failed)} Validation Failures (click to expand)"):
            for f in failed:
                st.json(f)

    st.divider()
    st.subheader("Step 4 — Save to MongoDB")

    save_btn = st.button(
        f"💾 Save {len(valid)} Products to MongoDB",
        type="primary",
        use_container_width=True,
    )

    if save_btn:
        try:
            inserted = save_products(valid, scenario=current)
            st.success(
                f"🍃 Successfully saved **{inserted} products** to MongoDB!\n\n"
                f"Collection: `toy_store_week6.products`  |  Scenario tag: `{current}`"
            )
            del st.session_state["valid_products"]
        except Exception as e:
            st.error(f"❌ MongoDB error: {e}\n\nIs MongoDB running?")