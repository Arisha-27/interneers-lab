from __future__ import annotations

from typing import Optional

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

from core.embeddings import embed_query, DEFAULT_MODEL

def cosine_similarity_manual(a: np.ndarray, b: np.ndarray) -> float:
    dot = float(np.dot(a, b))
    norm_a = float(np.linalg.norm(a))
    norm_b = float(np.linalg.norm(b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)


def pairwise_cosine_matrix(embeddings: np.ndarray) -> np.ndarray:
    return embeddings @ embeddings.T


def semantic_search(
    query: str,
    df: pd.DataFrame,
    embeddings: np.ndarray,
    top_k: int = 5,
    model_key: str = DEFAULT_MODEL,
    model: Optional[SentenceTransformer] = None,
) -> pd.DataFrame:

    query_vec = embed_query(query, model_key=model_key, model=model)
    scores = embeddings @ query_vec
    top_indices = np.argsort(scores)[::-1][:top_k]
    results = df.iloc[top_indices].copy()
    results["similarity"] = scores[top_indices].round(4)
    return results.reset_index(drop=True)


def keyword_search(
    query: str,
    df: pd.DataFrame,
    columns: list[str] | None = None,
) -> pd.DataFrame:

    if columns is None:
        columns = ["name", "description", "category"]

    terms = query.lower().split()
    mask = pd.Series([True] * len(df), index=df.index)
    for term in terms:
        term_mask = pd.Series([False] * len(df), index=df.index)
        for col in columns:
            term_mask |= df[col].str.lower().str.contains(term, na=False)
        mask &= term_mask

    return df[mask].copy().reset_index(drop=True)


def find_similar(
    product_id: str,
    df: pd.DataFrame,
    embeddings: np.ndarray,
    top_k: int = 5,
) -> pd.DataFrame:

    idx_series = df.index[df["id"] == product_id]
    if idx_series.empty:
        raise ValueError(f"Product ID '{product_id}' not found in DataFrame.")
    idx = int(idx_series[0])

    query_vec = embeddings[idx]         
    scores = embeddings @ query_vec
    scores[idx] = -1.0                   

    top_indices = np.argsort(scores)[::-1][:top_k]
    results = df.iloc[top_indices].copy()
    results["similarity"] = scores[top_indices].round(4)
    return results.reset_index(drop=True)