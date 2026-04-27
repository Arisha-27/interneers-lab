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
        background: linear-gradient(135deg, 
        padding: 2.5rem; border-radius: 20px; margin-bottom: 2.5rem;
        text-align: center; color: white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
    }
    /* Fixed header text clipping issue */
    .main-header h1 { font-size: 2.8rem; font-weight: 700; margin: 0; color: 
    .main-header p  { font-size: 1.1rem; opacity: 0.85; margin: 0.8rem 0 0 0; color: 
    .invoice-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 1.8rem; margin-top: 1.5rem;
    }
    .invoice-header {
        display: flex; justify-content: space-between; align-items: flex-start;
        border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1rem;
    }
    .badge-success { background: rgba(16, 185, 129, 0.2); color: 
                     border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-warning { background: rgba(245, 158, 11, 0.2); color: 
                     border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-error   { background: rgba(239, 68, 68, 0.2); color: 
                     border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(239, 68, 68, 0.3); }
    .price-highlight {
        font-size: 2.8rem; font-weight: 700; color: 
    }
    .policy-warning-box {
        background: rgba(245, 158, 11, 0.1); border-left: 4px solid 
        padding: 1.2rem; border-radius: 8px; margin: 1rem 0; color: 
    }
    /* Product card constraints */
    .metric-card {
        background: rgba(255,255,255,0.02); border-radius: 12px; padding: 1.2rem;
        text-align: left; border: 1px solid rgba(255,255,255,0.05);
        transition: transform 0.2s ease, background 0.2s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .metric-card:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,0.05);
    }
    .product-details {
        width: 100%;
        margin-top: 1rem;
    }
    .stButton > button {
        background: linear-gradient(135deg, 
        color: white; border: none; border-radius: 12px;
        font-weight: 600; font-size: 1rem;
        padding: 0.6rem 2rem; width: 100%;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .stButton > button:hover { 
        transform: translateY(-2px); 
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }
    /* Image thumbnail styles */
    .product-thumb {
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
        transition: transform 0.2s;
    }
    .product-thumb:hover {
        transform: scale(1.05);
    }
</style>
""", unsafe_allow_html=True)
st.markdown("""
<div class="main-header">
    <h1>AI Quote Agent</h1>
    <p>Intelligent Inventory & Pricing Automation</p>
</div>
""", unsafe_allow_html=True)
with st.sidebar:
    st.markdown("
    st.markdown("Welcome to the automated quoting system. Please configure your API key below to enable intelligent responses.")
    st.markdown("---")
    st.markdown("
    api_key = st.text_input(
        "Gemini API Key",
        value=os.getenv("GEMINI_API_KEY", ""),
        type="password",
        help="Get a free key at https://aistudio.google.com/app/apikey",
    )
    if api_key:
        os.environ["GEMINI_API_KEY"] = api_key
    st.markdown("---")
    st.markdown("
    st.success("All systems operational.")
tab_catalog, tab_agent, tab_tools, tab_evals = st.tabs(
    ["Product Catalog", "AI Agent", "Tool Tester", "Eval Suite"]
)
with tab_catalog:
    st.markdown("
    st.markdown("Browse our available inventory and standard pricing.")
    st.markdown("<br>", unsafe_allow_html=True)
    cols = st.columns(2)
    for idx, (pid, info) in enumerate(PRODUCTS.items()):
        col = cols[idx % 2]
        with col:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            if "image_path" in info and os.path.exists(info["image_path"]):
                st.image(info["image_path"], width=250)
            st.markdown('<div class="product-details">', unsafe_allow_html=True)
            st.markdown(f"
            st.markdown(f"**ID:** `{pid}`  |  **Price:** ${info['unit_price']:.2f}/unit")
            st.markdown(f"<p style='opacity: 0.8; font-size: 0.9rem;'>{info['description']}</p>", unsafe_allow_html=True)
            st.markdown('</div></div>', unsafe_allow_html=True)
            st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("---")
    st.markdown("
    st.markdown("Volume-based pricing discounts applied automatically during checkout.")
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
    st.markdown("
    st.markdown("Type a natural language request and the agent will identify the product, check inventory, apply discounts, and generate a quote invoice.")
    st.markdown("<br>", unsafe_allow_html=True)
    example_queries = [
        "I need 60 building blocks for a school project, can I get a deal?",
        "Can I get 120 lego sets? What's the best price?",
        "I want to order 30 colour pencils for my classroom",
        "Get me 10 science workbooks for grade 5",
    ]
    selected_example = st.selectbox("Try an example:", ["(type your own below)"] + example_queries)
    user_query = st.text_area(
        "Your request:",
        value="" if selected_example == "(type your own below)" else selected_example,
        height=80,
        placeholder="e.g. I need 60 building blocks for a school project, can I get a deal?",
    )
    col_btn, col_info = st.columns([1, 3])
    with col_btn:
        run_agent = st.button("Generate Quote", use_container_width=True)
    if run_agent and user_query.strip():
        if not os.getenv("GEMINI_API_KEY"):
            st.error("Please enter your Gemini API key in the sidebar.")
        else:
            with st.spinner("Agent thinking..."):
                try:
                    from agent.quote_agent import run_quote_agent
                    result = run_quote_agent(user_query, verbose=False)
                    if result["success"]:
                        st.success("Quote generated successfully.")
                        for pid, info in PRODUCTS.items():
                            if pid in result["agent_response"] or info["name"].lower() in result["agent_response"].lower() or pid.lower() in result["agent_response"].lower():
                                if "image_path" in info and os.path.exists(info["image_path"]):
                                    st.image(info["image_path"], width=200)
                                break
                        st.markdown("
                        st.markdown(result["agent_response"])
                    else:
                        st.error(f"Agent error: {result['error']}")
                except Exception as e:
                    st.error(f"Error running agent: {e}")
                    st.info("Tip: Make sure your Gemini API key is valid and you have internet access.")
with tab_tools:
    st.markdown("
    st.markdown("Test the underlying Python functions independently of the LLM.")
    st.markdown("<br>", unsafe_allow_html=True)
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("
        product_query = st.text_input("Product ID or keyword", value="LEGO-001", key="t1_input")
        if st.button("Lookup Product", key="t1_btn"):
            result = get_product_info(product_query)
            if result.get("status") == "success":
                st.success("Product found")
                st.markdown(f"**Name:** {result.get('name')}")
                st.markdown(f"**ID:** `{result.get('product_id')}` | **SKU:** `{result.get('sku')}`")
                st.markdown(f"**Brand:** {result.get('brand')} | **Category:** {result.get('category')}")
                st.markdown(f"**Price:** ${result.get('unit_price', 0):.2f}")
                st.markdown(f"**Description:** {result.get('description')}")
                if "image_path" in result and os.path.exists(result["image_path"]):
                    st.image(result["image_path"], width=150)
                with st.expander("View JSON Data"):
                    st.json(result)
            else:
                st.error(result.get("error"))
                with st.expander("View JSON Data"):
                    st.json(result)
    with col2:
        st.markdown("
        inv_query = st.text_input("Product ID", value="LEGO-001", key="t2_input")
        if st.button("Check Stock", key="t2_btn"):
            result = check_inventory(inv_query)
            if result.get("status") == "success":
                qty = result["quantity_available"]
                if qty > 50:
                    st.success(f"In stock: {qty} units")
                elif qty > 0:
                    st.warning(f"Low stock: {qty} units")
                else:
                    st.error("Out of stock")
                c_a, c_b = st.columns(2)
                c_a.metric("Available", qty)
                c_b.metric("Restock Days", result.get("restock_days"))
                st.markdown(f"**Warehouse:** {result.get('warehouse')}")
                st.markdown(f"**In Stock:** {'Yes' if result.get('in_stock') else 'No'}")
                with st.expander("View JSON Data"):
                    st.json(result)
            else:
                st.error(result.get("error"))
    st.markdown("---")
    st.markdown("
    col3, col4 = st.columns(2)
    with col3:
        quote_product = st.selectbox(
            "Product",
            options=list(PRODUCTS.keys()),
            format_func=lambda x: f"{x} — {PRODUCTS[x]['name']}",
            key="t3_product",
        )
    with col4:
        quote_qty = st.number_input("Quantity", min_value=1, max_value=1000, value=60, key="t3_qty")
    if st.button("Calculate Quote", key="t3_btn"):
        result = calculate_quote(quote_product, quote_qty)
        if result.get("status") == "success":
            q = result["quote"]
            if result.get("policy_warning"):
                st.markdown(f"""
                <div class="policy-warning-box">
                    <strong>Policy Override Applied</strong><br>
                    {result['policy_warning']}
                </div>
                """, unsafe_allow_html=True)
            col_img_invoice, col_metrics = st.columns([1, 3])
            with col_img_invoice:
                product_info = PRODUCTS.get(q['product_id'])
                if product_info and "image_path" in product_info and os.path.exists(product_info["image_path"]):
                    st.image(product_info["image_path"], width=150)
            with col_metrics:
                col_a, col_b, col_c, col_d = st.columns(4)
                col_a.metric("Unit Price",     f"${q['unit_price']:.2f}")
                col_b.metric("Quantity",        str(q['quantity_requested']))
                col_c.metric("Discount",        f"{q['discount_pct']:.1f}%")
                col_d.metric("Total Price",     f"${q['total_price']:.2f}", delta=f"-${q['discount_amount']:.2f}")
                st.markdown("---")
                st.markdown(f"**Product:** {q['product_name']}  |  **Can Fulfill:** {'Yes' if q['can_fulfill'] else 'No (check restock)'}  |  **Warehouse:** {result['inventory']['warehouse']}")
                st.markdown(f"**Discount Label:** {q['discount_label']}")
            with st.expander("View JSON Data"):
                st.json(result)
        else:
            st.error(result.get("error"))
with tab_evals:
    st.markdown("
    st.markdown("Run all evaluation scenarios directly from the UI.")
    st.markdown("<br>", unsafe_allow_html=True)
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
        import re
        clean = re.sub(r'\033\[[0-9;]*m', '', raw_out)
        total   = len(es.results)
        passed  = sum(1 for r in es.results if r["status"] == "PASS")
        failed  = total - passed
        score   = round(passed / total * 100) if total else 0
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Total Tests",  total)
        c2.metric("Passed",    passed)
        c3.metric("Failed",    failed)
        c4.metric("Score",        f"{score}%")
        st.markdown("---")
        for r in es.results:
            status_icon = "Pass" if r["status"] == "PASS" else "Fail"
            st.markdown(f"**[{status_icon}]** {r['name']}")
        with st.expander("Raw eval output"):
            st.code(clean, language="text")
