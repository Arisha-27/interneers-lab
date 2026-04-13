
import os
import sys

import pandas as pd
import plotly.express as px     
import plotly.graph_objects as go
import streamlit as st
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(__file__))

from utils.db import get_connection
from models.product import CATEGORY_CHOICES, Product


# ════════════════════════════════════════════════════════════
# SECTION 1: Page Configuration
# ════════════════════════════════════════════════════════════

load_dotenv()

st.set_page_config(
    page_title="Inventory Dashboard",  
    page_icon="📦",                   
    layout="wide",                    
    initial_sidebar_state="expanded", 
)

# ════════════════════════════════════════════════════════════
# SECTION 2: Database Connection
# ════════════════════════════════════════════════════════════

@st.cache_resource
def init_db():
    get_connection()

init_db()


# ════════════════════════════════════════════════════════════
# SECTION 3: Helper Functions
# ════════════════════════════════════════════════════════════

def load_dataframe(categories: list = None) -> pd.DataFrame:

    df = Product.get_all_as_dataframe()

    if df.empty:
        return df

    if categories:
        df = df[df["Category"].isin(categories)]

    return df


def colour_low_stock(row: pd.Series) -> list:
  
    if row["Low Stock"]:
        style = "background-color: #ffe0e0; color: #b00000;"
    else:
        style = ""

    return [style] * len(row)


# ════════════════════════════════════════════════════════════
# SECTION 4: Custom CSS
# ════════════════════════════════════════════════════════════

st.markdown("""
<style>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Apply font to everything */
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}

/* Style the KPI metric cards */
div[data-testid="metric-container"] {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
}

/* Red alert banner class */
.alert-box {
    background: #fff5f5;
    border-left: 4px solid #e53e3e;
    padding: 12px 18px;
    border-radius: 6px;
    margin-bottom: 1rem;
    color: #742a2a;
    font-weight: 500;
}
</style>
""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
# SECTION 5: SIDEBAR
# ════════════════════════════════════════════════════════════

with st.sidebar:
    st.title("📦 Inventory Controls")
    st.divider()  

    st.markdown("**📂 Filter by Category**")

    selected_categories = st.multiselect(
        label="Select categories",
        options=list(CATEGORY_CHOICES),    
        default=list(CATEGORY_CHOICES),    
        label_visibility="collapsed",       
        help="Uncheck categories to hide them from the table and charts.",
    )

    st.divider()

    st.markdown("**📊 Filter by Quantity**")

    qty_min, qty_max = st.slider(
        "Quantity range",
        min_value=0,
        max_value=500,
        value=(0, 500),     
        label_visibility="collapsed",
    )

    st.divider()

    st.markdown("**🔔 Alert Threshold**")

    global_threshold = st.number_input(
        "Items below this qty are flagged red",
        min_value=0,
        max_value=200,
        value=int(os.getenv("LOW_STOCK_THRESHOLD", 10)),
        step=1,
        label_visibility="collapsed",
        help="Changes display only. Edit .env to make permanent.",
    )

    st.divider()

    st.markdown("**⚡ Quick Actions**")

    if st.button("🔄 Refresh Data", use_container_width=True):
        st.cache_data.clear()
        st.rerun()

    if st.button("🌱 Seed Sample Data", use_container_width=True):
        try:
            from seed_data import seed
            seed()
            st.success("Sample data loaded!")
            st.rerun()
        except Exception as e:
            st.error(f"Failed: {e}")

    st.divider()
    st.caption("Inventory System v1.0")


# ════════════════════════════════════════════════════════════
# SECTION 6: Load Data (uses sidebar filter values)
# ════════════════════════════════════════════════════════════

raw_df = load_dataframe(categories=selected_categories)

if not raw_df.empty:
    
    display_df = raw_df[
        (raw_df["Quantity"] >= qty_min) & (raw_df["Quantity"] <= qty_max)
    ].copy()
   
    display_df["Low Stock"] = display_df["Quantity"] <= global_threshold
else:
    display_df = raw_df.copy()


# ════════════════════════════════════════════════════════════
# SECTION 7: Page Header + KPI Metrics
# ════════════════════════════════════════════════════════════

st.title("📦 Inventory Management Dashboard")
st.markdown("Real-time stock tracker powered by **MongoDB** + **MongoEngine**.")
st.divider()

col1, col2, col3, col4, col5 = st.columns(5)

if not display_df.empty:
    total_products  = len(display_df)
    total_quantity  = int(display_df["Quantity"].sum())
    total_value     = display_df["Total Value (₹)"].sum()
    low_stock_count = int(display_df["Low Stock"].sum())
    categories_count = display_df["Category"].nunique()

else:
    total_products = total_quantity = total_value = low_stock_count = categories_count = 0

col1.metric("🏷️ Products",         total_products)
col2.metric("📦 Total Units",       f"{total_quantity:,}")

col3.metric("💰 Inventory Value",   f"₹{total_value:,.0f}")

col4.metric(
    "🔴 Low Stock",
    low_stock_count,
    delta=f"-{low_stock_count}" if low_stock_count else None,
    delta_color="inverse",
)
col5.metric("📂 Categories",        categories_count)

st.divider()

if low_stock_count > 0:

    low_names = display_df[display_df["Low Stock"]]["Name"].tolist()

    preview   = ", ".join(f"**{n}**" for n in low_names[:5])
    extra     = f" … and {low_stock_count - 5} more" if low_stock_count > 5 else ""

    st.markdown(
        f'<div class="alert-box">'
        f'⚠️ {low_stock_count} item(s) below threshold — {preview}{extra}'
        f'</div>',
        unsafe_allow_html=True,
    )


# ════════════════════════════════════════════════════════════
# SECTION 8: Tabs
# ════════════════════════════════════════════════════════════

tab_table, tab_add, tab_remove, tab_analytics = st.tabs([
    "📋 Inventory Table",
    "➕ Add Product",
    "🗑️ Remove Product",
    "📊 Analytics",
])


# ────────────────────────────────────────────────────────────
# TAB 1: INVENTORY TABLE
# ────────────────────────────────────────────────────────────
with tab_table:
    st.subheader("Current Inventory")

    if display_df.empty:
      
        st.info("No products found. Use 'Add Product' tab or seed from sidebar.")
    else:
       
        search = st.text_input(
            "🔍 Search by name or SKU",
            placeholder="e.g. keyboard, ELEC-003",
        )

        if search:
           
            mask = (
                display_df["Name"].str.contains(search, case=False, na=False)
                | display_df["SKU"].str.contains(search, case=False, na=False)
            )
           
            display_df = display_df[mask]

        styled = (
            display_df.style
            .apply(colour_low_stock, axis=1)

            .format({
                "Price (₹)":       "₹{:.2f}",
                "Total Value (₹)": "₹{:.2f}",
            })
        )

        st.dataframe(
            styled,
            use_container_width=True,   
            height=420,
            column_config={
                "Low Stock": st.column_config.CheckboxColumn("⚠️ Low?"),
                "Quantity":  st.column_config.NumberColumn("Qty", format="%d"),
            },
        )

        st.caption(f"Showing **{len(display_df)}** products.")

        csv = display_df.to_csv(index=False).encode("utf-8")

        st.download_button(
            label="⬇️ Export to CSV",
            data=csv,
            file_name="inventory.csv",
            mime="text/csv",
        )

        low_df = display_df[display_df["Low Stock"]]

        if not low_df.empty:
            st.markdown("---")
            st.markdown("### 🚨 Items Needing Restock")

            card_cols = st.columns(3)

            for idx, (_, row) in enumerate(low_df.iterrows()):

                with card_cols[idx % 3]:
                    deficit = int(row["Threshold"]) - int(row["Quantity"])

                    st.error(
                        f"**{row['Name']}**\n\n"
                        f"SKU: `{row['SKU']}`\n\n"
                        f"Stock: **{row['Quantity']}** / Threshold: {row['Threshold']}\n\n"
                        f"📉 Order **{deficit}** more"
                    )


# ────────────────────────────────────────────────────────────
# TAB 2: ADD PRODUCT
# ────────────────────────────────────────────────────────────
with tab_add:
    st.subheader("Add or Update a Product")
    st.markdown(
        "If the **SKU already exists**, the product is **updated**, not duplicated."
    )

    with st.form("add_form", clear_on_submit=True):

        left, right = st.columns(2)

        with left:
            f_name     = st.text_input("Product Name *", placeholder="Wireless Mouse")
            f_sku      = st.text_input("SKU *",          placeholder="ELEC-099")
            f_category = st.selectbox("Category *",      CATEGORY_CHOICES)
            f_supplier = st.text_input("Supplier",        placeholder="Logitech India")

        with right:
            f_quantity  = st.number_input("Quantity *",          min_value=0,   step=1,   value=0)
            f_price     = st.number_input("Price (₹) *",         min_value=0.0, step=0.5, value=0.0, format="%.2f")
            f_threshold = st.number_input("Alert Threshold",     min_value=0,   step=1,   value=global_threshold)

        f_desc = st.text_area("Description (optional)", max_chars=500)

        submitted = st.form_submit_button("💾 Save Product", use_container_width=True, type="primary")

        if submitted:
            # ── Validation before touching the DB ──────────────
            errors = []

            if not f_name.strip():
                errors.append("Product Name cannot be empty.")
            if not f_sku.strip():
                errors.append("SKU cannot be empty.")
            if f_price <= 0:
                errors.append("Price must be greater than zero.")

            if errors:
                for e in errors:
                    st.error(e)
            else:
                try:
                    Product.add_product(
                        name=f_name.strip(),
                        sku=f_sku.strip().upper(),    
                        category=f_category,
                        quantity=f_quantity,
                        price=f_price,
                        supplier=f_supplier.strip(),
                        description=f_desc.strip(),
                        low_stock_threshold=f_threshold,
                    )
                    st.success(f"✅ **{f_name}** saved! (SKU: `{f_sku.upper()}`)")
                    st.balloons()   
                    st.cache_data.clear()  

                except Exception as e:
                    st.error(f"❌ Database error: {e}")


# ────────────────────────────────────────────────────────────
# TAB 3: REMOVE PRODUCT
# ────────────────────────────────────────────────────────────
with tab_remove:
    st.subheader("Remove a Product")
    st.warning("⚠️ Deletion is **permanent**.")

    if display_df.empty:
        st.info("No products to remove.")
    else:

        skus = ["— select —"] + sorted(display_df["SKU"].tolist())
        chosen_sku = st.selectbox("Choose product by SKU", skus)

        if chosen_sku and chosen_sku != "— select —":
            
            row = display_df[display_df["SKU"] == chosen_sku].iloc[0]

            st.markdown("**Product to delete:**")
            c1, c2 = st.columns(2)
            c1.markdown(f"- **Name:** {row['Name']}\n- **SKU:** `{row['SKU']}`\n- **Category:** {row['Category']}")
            c2.markdown(f"- **Quantity:** {row['Quantity']}\n- **Price:** ₹{row['Price (₹)']:.2f}")

            confirmed = st.checkbox(f"I confirm I want to permanently delete **{chosen_sku}**")

            if st.button("🗑️ Delete", type="primary", disabled=not confirmed):
                if Product.remove_product(sku=chosen_sku):
                    st.success(f"✅ `{chosen_sku}` deleted.")
                    st.cache_data.clear()
                    st.rerun()
                else:
                    st.error("SKU not found. Refresh the page.")

        st.markdown("---")
        st.markdown("**Or type SKU manually:**")
        manual = st.text_input("SKU", placeholder="ELEC-099")
        if st.button("🗑️ Delete by SKU", disabled=not manual.strip()):
            if Product.remove_product(sku=manual.strip().upper()):
                st.success(f"✅ Deleted `{manual.upper()}`.")
                st.cache_data.clear()
                st.rerun()
            else:
                st.error("SKU not found.")


# ────────────────────────────────────────────────────────────
# TAB 4: ANALYTICS CHARTS
# ────────────────────────────────────────────────────────────
with tab_analytics:
    st.subheader("Inventory Analytics")

    if display_df.empty:
        st.info("No data to chart.")
    else:
        row1_left, row1_right = st.columns(2)

        with row1_left:
            st.markdown("#### Units per Category")

            cat_qty = (
                display_df
                .groupby("Category")["Quantity"]
                .sum()
                .reset_index()
                .sort_values("Quantity", ascending=True)
            )
            fig = px.bar(
                cat_qty,
                x="Quantity",
                y="Category",
                orientation="h",       
                color="Quantity",
                color_continuous_scale="Blues",
            )
            fig.update_layout(coloraxis_showscale=False, margin=dict(l=0,r=0,t=20,b=0))
            st.plotly_chart(fig, use_container_width=True)

        with row1_right:
            st.markdown("#### Inventory Value by Category")
            cat_val = display_df.groupby("Category")["Total Value (₹)"].sum().reset_index()
            fig = px.pie(
                cat_val,
                names="Category",
                values="Total Value (₹)",
                hole=0.4,   
            )
            fig.update_layout(margin=dict(l=0,r=0,t=20,b=0))
            st.plotly_chart(fig, use_container_width=True)

        row2_left, row2_right = st.columns(2)

        with row2_left:
            st.markdown("#### Quantity Distribution")
            fig = px.histogram(
                display_df,
                x="Quantity",
                nbins=20,    
                color_discrete_sequence=["#4299e1"],
            )
            fig.update_layout(margin=dict(l=0,r=0,t=20,b=0))
            st.plotly_chart(fig, use_container_width=True)

        with row2_right:
            st.markdown("#### Low Stock vs Adequate")
            counts = display_df["Low Stock"].value_counts().reset_index()
            counts.columns = ["Low Stock", "Count"]
            counts["Label"] = counts["Low Stock"].map(
                {True: "🔴 Low", False: "🟢 OK"}
            )
            fig = px.pie(
                counts,
                names="Label",
                values="Count",
                hole=0.5,
                color="Label",
                color_discrete_map={"🔴 Low": "#e53e3e", "🟢 OK": "#38a169"},
            )
            fig.update_layout(margin=dict(l=0,r=0,t=20,b=0))
            st.plotly_chart(fig, use_container_width=True)

        st.markdown("#### Price vs Quantity (bubble size = total value)")
        fig = px.scatter(
            display_df,
            x="Quantity",
            y="Price (₹)",
            size="Total Value (₹)",
            color="Category",
            hover_name="Name",          
            hover_data={"SKU": True},
            size_max=50,
        )
        fig.update_layout(margin=dict(l=0,r=0,t=30,b=0))
        st.plotly_chart(fig, use_container_width=True)

        st.markdown("#### Top 10 Most Valuable Products")
        top10 = display_df.nlargest(10, "Total Value (₹)")[
            ["Name", "Category", "Quantity", "Price (₹)", "Total Value (₹)"]
        ]
        st.dataframe(
            top10.style.format({"Price (₹)": "₹{:.2f}", "Total Value (₹)": "₹{:.2f}"}),
            use_container_width=True,
            hide_index=True,
        )