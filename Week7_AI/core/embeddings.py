from __future__ import annotations

import hashlib
import os
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
CACHE_DIR = ROOT / "cache"
CACHE_DIR.mkdir(exist_ok=True)

INVENTORY_CSV = DATA_DIR / "inventory.csv"

MODELS = {
    "minilm": "all-MiniLM-L6-v2",      
    "mpnet":  "all-mpnet-base-v2",       
}
DEFAULT_MODEL = "minilm"


def _product_text(row: pd.Series) -> str:
    return (
        f"{row['name']}. "
        f"Category: {row['category']}. "
        f"{row['description']} "
        f"Age range: {row['age_min']}–{row['age_max']} years."
    )


def _cache_path(model_key: str) -> Path:
    return CACHE_DIR / f"embeddings_{model_key}.npy"


def _ids_cache_path() -> Path:
    return CACHE_DIR / "product_ids.npy"


def load_inventory() -> pd.DataFrame:
    df = pd.read_csv(INVENTORY_CSV)
    df["embed_text"] = df.apply(_product_text, axis=1)
    return df


def get_model(model_key: str = DEFAULT_MODEL) -> SentenceTransformer:
    model_name = MODELS.get(model_key, model_key)
    print(f"[embeddings] Loading model: {model_name}")
    return SentenceTransformer(model_name)


def build_embeddings(
    df: pd.DataFrame,
    model_key: str = DEFAULT_MODEL,
    force: bool = False,
) -> np.ndarray:
   
    cache = _cache_path(model_key)
    ids_cache = _ids_cache_path()

    if cache.exists() and ids_cache.exists() and not force:
        print(f"[embeddings] Loading cached embeddings from {cache}")
        return np.load(str(cache))

    print(f"[embeddings] Encoding {len(df)} products with model '{model_key}'…")
    model = get_model(model_key)
    texts = df["embed_text"].tolist()
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True,   
    )
    np.save(str(cache), embeddings)
    np.save(str(ids_cache), df["id"].values)
    print(f"[embeddings] Saved embeddings shape={embeddings.shape} → {cache}")
    return embeddings


def load_embeddings(model_key: str = DEFAULT_MODEL) -> Optional[np.ndarray]:

    cache = _cache_path(model_key)
    if not cache.exists():
        return None
    return np.load(str(cache))


def embed_query(
    query: str,
    model_key: str = DEFAULT_MODEL,
    model: Optional[SentenceTransformer] = None,
) -> np.ndarray:

    if model is None:
        model = get_model(model_key)
    vec = model.encode([query], normalize_embeddings=True, convert_to_numpy=True)
    return vec[0]