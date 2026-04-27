import sys
import json
import os
from pathlib import Path
import streamlit as st
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent))
load_dotenv()

from tools.product_tools import get_product_info, check_inventory, calculate_quote, PRODUCTS
from tools.policy_check import enforce_discount_policy

st.set_page_config(
    page_title="AI Quote Agent",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Outfit', sans-serif; }
    .main-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
        padding: 2.5rem; border-radius: 20px; margin-bottom: 2.5rem;
        text-align: center; color: white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
    }
    .main-header h1 { font-size: 2.8rem; font-weight: 700; margin: 0; color: #e0e7ff; }
    .main-header p  { font-size: 1.1rem; opacity: 0.85; margin: 0.8rem 0 0 0; color: #a5b4fc; }
    .invoice-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 1.8rem; margin-top: 1.5rem;
    }
    .badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; 
                     border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; 
                     border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-error   { background: rgba(239, 68, 68, 0.2); color: #f87171; 
                     border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(239, 68, 68, 0.3); }
    .price-highlight { font-size: 2.8rem; font-weight: 700; color: #818cf8; }
    .policy-warning-box {
        background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b;
        padding: 1.2rem; border-radius: 8px; margin: 1rem 0; color: #fcd34d;
    }
    .metric-card {
        background: rgba(255,255,255,0.02); border-radius: 12px; padding: 1.2rem;
        text-align: left; border: 1px solid rgba(255,255,255,0.05);
        transition: transform 0.2s ease, background 0.2s ease;
    }
    .metric-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.05); }
    .stButton > button {
        background: linear-gradient(135deg, #6366f1, #a855f7);
        color: white; border: none; border-radius: 12px;
        font-weight: 600; padding: 0.6rem 2rem; width: 100%;
        transition: all 0.15s ease;
    }
    .stButton > button:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="main-header">
    <h1>AI Quote Agent</h1>
    <p>Intelligent Inventory & Pricing Automation</p>
</div>
""", unsafe_allow_html=True)

with st.sidebar:
    st.markdown("## AI Quote Agent")
    st.markdown("Welcome to the automated quoting system. Please configure your API key below to enable intelligent responses.")
    st.markdown("---")
    st.markdown("### System Configuration")
    api_key = st.text_input("Gemini API Key", value=os.getenv("GEMINI_API_KEY", ""), type="password")
    if api_key: os.environ["GEMINI_API_KEY"] = api_key
    st.markdown("---")
    st.markdown("### System Status")
    st.success("All systems operational.")

tab_catalog, tab_agent, tab_tools, tab_evals = st.tabs(["Product Catalog", "AI Agent", "Tool Tester", "Eval Suite"])

with tab_catalog:
    st.markdown("## Product Catalog")
    st.markdown("Browse our available inventory and standard pricing.")
    cols = st.columns(2)
    for idx, (pid, info) in enumerate(PRODUCTS.items()):
        col = cols[idx % 2]
        with col:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            if "image_path" in info and os.path.exists(info["image_path"]):
                st.image(info["image_path"], width=250)
            st.markdown(f"#### {info['name']}")
            st.markdown(f"**ID:** `{pid}`  |  **Price:** ${info['unit_price']:.2f}/unit")
            st.markdown(f"<p style='opacity: 0.8; font-size: 0.9rem;'>{info['description']}</p>", unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
            st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("---")
    st.markdown("## Discount Rules")
    st.markdown("""
| Quantity | Discount |
|----------|---------|
| 1–9      | 0%      |
| 10–24    | 5%      |
| 25–49    | 10%     |
| 50–99    | 15%     |
| 100+     | 20%     |
    """)
    st.info("Policy: Maximum discount is 20% — enforced automatically by the policy engine.")

with tab_agent:
    st.markdown("## Ask the Quote Agent")
    st.markdown("Type a natural language request to generate a quote invoice.")
    example_queries = ["I need 60 building blocks for a school project", "Can I get 120 lego sets?", "Get me 10 science workbooks"]
    selected_example = st.selectbox("Try an example:", ["(type your own)"] + example_queries)
    user_query = st.text_area("Your request:", value="" if selected_example == "(type your own)" else selected_example)
    if st.button("Generate Quote") and user_query.strip():
        if not os.getenv("GEMINI_API_KEY"): st.error("Please enter your Gemini API key in the sidebar.")
        else:
            with st.spinner("Agent thinking..."):
                try:
                    from agent.quote_agent import run_quote_agent
                    result = run_quote_agent(user_query, verbose=False)
                    if result["success"]:
                        st.success("Quote generated successfully.")
                        st.markdown("### Agent Response")
                        st.markdown(result["agent_response"])
                    else: st.error(f"Agent error: {result['error']}")
                except Exception as e: st.error(f"Error: {e}")

with tab_tools:
    st.markdown("## Interactive Tool Tester")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("### 1. `get_product_info`")
        product_query = st.text_input("Product ID or keyword", value="LEGO-001")
        if st.button("Lookup Product"):
            result = get_product_info(product_query)
            if result.get("status") == "success":
                st.markdown(f"**Name:** {result.get('name')}")
                if "image_path" in result and os.path.exists(result["image_path"]): st.image(result["image_path"], width=150)
                with st.expander("View JSON"): st.json(result)
            else: st.error(result.get("error"))
    with col2:
        st.markdown("### 2. `check_inventory`")
        inv_query = st.text_input("Product ID", value="LEGO-001", key="inv_in")
        if st.button("Check Stock"):
            result = check_inventory(inv_query)
            if result.get("status") == "success":
                st.metric("Available", result["quantity_available"])
                with st.expander("View JSON"): st.json(result)
            else: st.error(result.get("error"))
    st.markdown("---")
    st.markdown("### 3. `calculate_quote`")
    q_pid = st.selectbox("Product", options=list(PRODUCTS.keys()))
    q_qty = st.number_input("Quantity", min_value=1, value=60)
    if st.button("Calculate Quote"):
        result = calculate_quote(q_pid, q_qty)
        if result.get("status") == "success":
            q = result["quote"]
            if result.get("policy_warning"): st.warning(result["policy_warning"])
            st.metric("Total Price", f"${q['total_price']:.2f}", delta=f"-${q['discount_amount']:.2f}")
            with st.expander("View JSON"): st.json(result)
        else: st.error(result.get("error"))

with tab_evals:
    st.markdown("## Evaluation Suite")
    if st.button("Run Full Eval Suite"):
        import io, contextlib
        from evals.eval_suite import results as eval_results_list, eval_simple, eval_complex
        import evals.eval_suite as es
        es.results.clear()
        captured = io.StringIO()
        with contextlib.redirect_stdout(captured):
            es.eval_simple()
            es.eval_complex()
        raw_out = captured.getvalue()
        passed = sum(1 for r in es.results if r["status"] == "PASS")
        st.metric("Passed", f"{passed}/{len(es.results)}")
        with st.expander("Raw Output"): st.code(raw_out)
