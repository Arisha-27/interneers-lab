from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import PCA

sys.path.insert(0, str(Path(__file__).resolve().parent))

from core.embeddings import (
    DEFAULT_MODEL,
    MODELS,
    build_embeddings,
    get_model,
    load_inventory,
)
from core.search import find_similar, keyword_search, semantic_search

st.set_page_config(
    page_title="Semantic Inventory Search",
    page_icon="search",
    layout="wide",
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

html, body, [class*="css"]  {
    font-family: 'Inter', sans-serif !important;
}

/* Minimal Header */
h1 {
    font-weight: 600 !important;
    margin-bottom: 0.2em !important;
}

/* Subtle Expanders */
[data-testid="stExpander"] {
    background: #1e293b;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Base button styling */
.stButton > button {
    border-radius: 6px !important;
    font-weight: 500 !important;
}

/* Find Similar Link Button styling */
[data-testid="baseButton-secondary"] {
    border-radius: 6px;
    font-weight: 500;
    border: 1px solid #3b82f6;
    color: #3b82f6;
    background: transparent;
}

[data-testid="baseButton-secondary"]:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
    border-color: #60a5fa;
}

/* Tab Styling */
button[data-baseweb="tab"] {
    font-weight: 500;
    font-size: 1rem;
}

/* Input Fields */
div[data-baseweb="input"], div[data-baseweb="select"] {
    border-radius: 6px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

div[data-baseweb="input"]:focus-within, div[data-baseweb="select"]:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
}

/* Sidebar styling */
[data-testid="stSidebar"] {
    border-right: 1px solid rgba(255,255,255,0.05);
}

/* Metric Cards */
[data-testid="stMetric"] {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>
""", unsafe_allow_html=True)


@st.cache_data
def get_inventory() -> pd.DataFrame:
    return load_inventory()


@st.cache_resource
def get_sentence_model(model_key: str) -> SentenceTransformer:
    return get_model(model_key)


@st.cache_data
def get_embeddings(model_key: str) -> np.ndarray:
    df = get_inventory()
    return build_embeddings(df, model_key=model_key, force=False)


@st.cache_data
def get_pca_coords(model_key: str) -> np.ndarray:
    emb = get_embeddings(model_key)
    pca = PCA(n_components=2, random_state=42)
    return pca.fit_transform(emb)

with st.sidebar:
    st.title("Settings")

    model_key = st.selectbox(
        "Embedding model",
        options=list(MODELS.keys()),
        format_func=lambda k: MODELS[k],
        index=0,
    )
    st.caption(f"Dimensions: {'384' if model_key == 'minilm' else '768'}")

    top_k = st.slider("Results to return (top-K)", min_value=3, max_value=15, value=5)
    show_pca = st.checkbox("Show 2D product map", value=True)
    show_eval = st.checkbox("Show evaluation metrics", value=False)

    st.markdown("---")
    st.markdown("**Model info**")
    st.markdown(
        "- **MiniLM**: 384 dims, fast\n"
        "- **mpnet** : 768 dims, higher quality"
    )

st.title("Semantic Inventory Search")
st.markdown(
    "Search your product catalog with **natural language** — "
    "finds conceptually similar products even when exact keywords don't match."
)

df = get_inventory()
model = get_sentence_model(model_key)
embeddings = get_embeddings(model_key)

st.markdown("### Inventory Overview")
m1, m2, m3, m4 = st.columns(4)
m1.metric("Total Products", len(df))
m2.metric("Categories", df["category"].nunique())
m3.metric("Avg Price", f"€{df['price'].mean():.2f}")
m4.metric("Avg Age", f"{(df['age_min'].mean() + df['age_max'].mean())/2:.1f}y")
st.markdown("---")

tab_semantic, tab_keyword, tab_similar, tab_pca = st.tabs(
    ["Semantic Search", "Keyword Search", "Find Similar", "Product Map"]
)

with tab_semantic:
    st.subheader("Semantic Search")
    st.markdown(
        "Type a **concept** or **need** — the system finds matching products "
        "even if the keywords aren't in the product name."
    )

    sem_query = st.text_input(
        "Search query",
        placeholder="e.g.  construction toys  /  gifts for toddlers  /  outdoor summer fun",
        key="sem_query",
    )

    if sem_query.strip():
        with st.spinner("Encoding query and searching …"):
            results = semantic_search(
                query=sem_query,
                df=df,
                embeddings=embeddings,
                top_k=top_k,
                model=model,
            )

        st.success(f"Top {len(results)} results for **{sem_query!r}**")

        for _, row in results.iterrows():
            sim_pct = int(row["similarity"] * 100)
            with st.expander(
                f"**{row['name']}** — {row['category']} — "
                f"€{row['price']:.2f} — similarity {sim_pct}%",
                expanded=True,
            ):
                col_a, col_b = st.columns([3, 1])
                with col_a:
                    st.markdown(f"*{row['description']}*")
                    st.markdown(
                        f"Age: {row['age_min']}–{row['age_max']}y  "
                        f"Stock: {row['stock']}"
                    )
                with col_b:
                    st.metric("Similarity", f"{sim_pct}%")
                    st.metric("Price", f"€{row['price']:.2f}")

                if st.button(f"Find similar to '{row['name']}'", key=f"sim_sem_{row['id']}"):
                    similar = find_similar(row["id"], df, embeddings, top_k=5)
                    st.markdown("**Similar products:**")
                    for _, s in similar.iterrows():
                        st.markdown(
                            f"- **{s['name']}** ({s['category']}) — "
                            f"sim {int(s['similarity']*100)}% — €{s['price']:.2f}"
                        )

    else:
        st.info("Enter a query above to start searching.")

with tab_keyword:
    st.subheader("Keyword Search")
    st.markdown("Traditional substring filter across product name, description, and category.")

    kw_query = st.text_input(
        "Keyword(s)",
        placeholder="e.g.  lego  /  wooden  /  puzzle",
        key="kw_query",
    )
    selected_cats = st.multiselect(
        "Filter by category",
        options=sorted(df["category"].unique()),
    )

    filtered_df = df.copy()
    if selected_cats:
        filtered_df = filtered_df[filtered_df["category"].isin(selected_cats)]

    if kw_query.strip():
        results_kw = keyword_search(kw_query, filtered_df)
        st.success(f"{len(results_kw)} products matched **{kw_query!r}**")
    else:
        results_kw = filtered_df

    if results_kw.empty:
        st.warning("No products match your criteria.")
    else:
        display_cols = ["name", "category", "price", "age_min", "age_max", "stock"]
        st.dataframe(
            results_kw[display_cols].rename(columns={
                "age_min": "age_min", "age_max": "age_max"
            }),
            use_container_width=True,
            hide_index=True,
        )

        st.markdown("---")
        st.markdown("**Full product cards**")
        for _, row in results_kw.iterrows():
            with st.expander(f"{row['name']} — €{row['price']:.2f}"):
                st.markdown(f"*{row['description']}*")
                st.markdown(
                    f"Age: {row['age_min']}–{row['age_max']}y  "
                    f"Stock: {row['stock']}  "
                    f"Category: {row['category']}"
                )
                if st.button(f"Find similar", key=f"sim_kw_{row['id']}"):
                    similar = find_similar(row["id"], df, embeddings, top_k=5)
                    st.markdown("**Similar products:**")
                    for _, s in similar.iterrows():
                        st.markdown(
                            f"- **{s['name']}** ({s['category']}) — "
                            f"sim {int(s['similarity']*100)}%"
                        )

with tab_similar:
    st.subheader("Find Similar Products")
    st.markdown(
        "Select any product to discover the most semantically similar items "
        "in your inventory using vector similarity."
    )

    product_options = dict(zip(df["name"] + " (" + df["id"] + ")", df["id"]))
    selected_label = st.selectbox("Choose a product", options=list(product_options.keys()))

    if selected_label:
        selected_id = product_options[selected_label]
        selected_row = df[df["id"] == selected_id].iloc[0]

        st.markdown("---")
        col1, col2 = st.columns([2, 1])
        with col1:
            st.markdown(f"### {selected_row['name']}")
            st.markdown(f"*{selected_row['description']}*")
            st.markdown(
                f"**Category:** {selected_row['category']}  "
                f"**Age:** {selected_row['age_min']}–{selected_row['age_max']}y"
            )
        with col2:
            st.metric("Price", f"€{selected_row['price']:.2f}")
            st.metric("Stock", selected_row["stock"])

        st.markdown("---")
        st.markdown(f"### Similar to **{selected_row['name']}**")

        with st.spinner("Finding similar products …"):
            similar = find_similar(selected_id, df, embeddings, top_k=top_k)

        for rank, (_, s) in enumerate(similar.iterrows(), 1):
            sim_pct = int(s["similarity"] * 100)
            col_l, col_r = st.columns([5, 1])
            with col_l:
                st.markdown(
                    f"**{rank}. {s['name']}** — {s['category']} — "
                    f"Age: {s['age_min']}–{s['age_max']}y"
                )
                st.markdown(f"  _{s['description'][:100]}…_")
            with col_r:
                st.metric("Sim", f"{sim_pct}%", label_visibility="visible")
                st.markdown(f"€{s['price']:.2f}")
            st.divider()

with tab_pca:
    st.subheader("2D Product Space (PCA)")
    st.markdown(
        "Each dot is a product. Products close together share semantic meaning. "
        "Clusters reveal natural categories in your catalog."
    )

    coords = get_pca_coords(model_key)
    plot_df = df.copy()
    plot_df["pc1"] = coords[:, 0]
    plot_df["pc2"] = coords[:, 1]

    fig = px.scatter(
        plot_df,
        x="pc1",
        y="pc2",
        color="category",
        hover_name="name",
        hover_data={"pc1": False, "pc2": False, "price": True, "age_min": True, "age_max": True},
        text="name",
        size_max=20,
        title=f"Product Embedding Space — {MODELS[model_key]}",
        labels={"pc1": "Principal Component 1", "pc2": "Principal Component 2"},
    )
    fig.update_traces(textposition="top center", textfont_size=9, marker_size=12)
    fig.update_layout(
        height=600,
        legend_title_text="Category",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
    )
    st.plotly_chart(fig, use_container_width=True)

    st.markdown(
        "**Reading the map:** Products that share semantic concepts "
        "(construction, animals, outdoor) cluster together even if they belong to "
        "different explicit categories. This is what enables semantic search."
    )

    st.markdown("---")
    map_query = st.text_input("Project a search query onto the map", key="map_query")
    if map_query.strip():
        from core.embeddings import embed_query
        from sklearn.decomposition import PCA as PCA2

        all_emb = get_embeddings(model_key)
        pca2 = PCA2(n_components=2, random_state=42)
        pca2.fit(all_emb)

        q_vec = embed_query(map_query, model_key=model_key, model=model)
        q_2d  = pca2.transform(q_vec.reshape(1, -1))[0]

        fig2 = go.Figure(fig)
        fig2.add_trace(go.Scatter(
            x=[q_2d[0]],
            y=[q_2d[1]],
            mode="markers+text",
            text=[f"Query: {map_query!r}"],
            textposition="top center",
            marker=dict(symbol="star", size=18, color="gold", line=dict(width=2, color="black")),
            name="Search query",
        ))
        st.plotly_chart(fig2, use_container_width=True)

if show_eval:
    st.sidebar.markdown("---")
    st.sidebar.markdown("**Eval metrics (k=5)**")
    with st.sidebar:
        with st.spinner("Running eval …"):
            from core.evaluation import evaluate_search_function
            from data.evalset import SEARCH_TEST_CASES

            def _search_fn(query: str, top_k: int = 5) -> list[str]:
                r = semantic_search(query=query, df=df, embeddings=embeddings, top_k=top_k, model=model)
                return r["id"].tolist()

            eval_out = evaluate_search_function(_search_fn, SEARCH_TEST_CASES, k=5)
            agg = eval_out["aggregate"]

        st.metric("P@5",    f"{agg['mean_P@5']:.3f}")
        st.metric("R@5",    f"{agg['mean_R@5']:.3f}")
        st.metric("MRR",    f"{agg['mean_MRR']:.3f}")
        st.metric("NDCG@5", f"{agg['mean_NDCG@5']:.3f}")