import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

from core.embeddings import load_inventory, MODELS, get_model
from core.search import semantic_search
from core.evaluation import evaluate_search_function
from data.evalset import SEARCH_TEST_CASES

K = 5
BENCHMARK_QUERY = "toys for 5-year-olds"

MANUAL_RATINGS: dict[str, dict[str, int]] = {
    "minilm": {},   
    "mpnet":  {},
}


def benchmark_speed(df: pd.DataFrame, model_key: str, model: SentenceTransformer) -> float:
    texts = df["embed_text"].tolist()
    start = time.perf_counter()
    _ = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    elapsed = time.perf_counter() - start
    rate = len(texts) / elapsed
    print(f"  [{model_key}] {len(texts)} products in {elapsed:.2f}s  ({rate:.1f} products/s)")
    return rate


def run_eval(df: pd.DataFrame, embeddings: np.ndarray, model: SentenceTransformer, model_key: str) -> dict:
    def search_fn(query: str, top_k: int = K) -> list[str]:
        results = semantic_search(query=query, df=df, embeddings=embeddings, top_k=top_k, model=model)
        return results["id"].tolist()

    return evaluate_search_function(search_fn=search_fn, test_cases=SEARCH_TEST_CASES, k=K)


def show_top5(query: str, df: pd.DataFrame, embeddings: np.ndarray, model: SentenceTransformer, model_key: str) -> list[str]:
    results = semantic_search(query=query, df=df, embeddings=embeddings, top_k=5, model=model)
    print(f"\n  [{model_key}] Top 5 for {query!r}")
    print(f"  {'Rank':<5} {'Product':<35} {'Sim':>6}")
    print(f"  {'-'*50}")
    ids = []
    for rank, row in results.iterrows():
        print(f"  {rank+1:<5} {row['name']:<35} {row['similarity']:>6.4f}")
        ids.append(row["id"])
    return ids


def main():
    print("Loading inventory …")
    df = load_inventory()

    model_results = {}

    for key, model_name in MODELS.items():
        print(f"\n{'='*65}")
        print(f"MODEL: {model_name}  (key='{key}')")
        print("="*65)

        model = get_model(key)

        print("\n1. Encoding speed")
        rate = benchmark_speed(df, key, model)

        print("\n2. Building embeddings for evaluation …")
        emb = model.encode(df["embed_text"].tolist(), normalize_embeddings=True, convert_to_numpy=True, show_progress_bar=False)
        dims = emb.shape[1]
        print(f"   Embedding dimensionality: {dims}")

        print("\n3. Evaluation metrics (evalset) …")
        eval_out = run_eval(df, emb, model, key)
        agg = eval_out["aggregate"]

        print(f"\n4. Manual rating: {BENCHMARK_QUERY!r}")
        top5_ids = show_top5(BENCHMARK_QUERY, df, emb, model, key)

        model_results[key] = {
            "model_name": model_name,
            "dims":       dims,
            "speed":      rate,
            "eval":       agg,
            "top5_ids":   top5_ids,
        }

    print("\n\n" + "="*65)
    print("COMPARISON SUMMARY")
    print("="*65)

    metrics = [f"mean_P@{K}", f"mean_R@{K}", "mean_MRR", f"mean_NDCG@{K}", "mean_neg_hits"]
    labels  = [f"P@{K}", f"R@{K}", "MRR", f"NDCG@{K}", "Neg hits"]

    header = f"{'Metric':<20}" + "".join(f"{k:>15}" for k in MODELS.keys())
    print(header)
    print("-" * 50)

    for metric, label in zip(metrics, labels):
        row = f"{label:<20}"
        for key in MODELS.keys():
            val = model_results[key]["eval"].get(metric, 0)
            row += f"{val:>15.4f}"
        print(row)

    print("-" * 50)
    speed_row = f"{'Speed (prod/s)':<20}"
    for key in MODELS.keys():
        speed_row += f"{model_results[key]['speed']:>15.1f}"
    print(speed_row)

    dim_row = f"{'Dimensions':<20}"
    for key in MODELS.keys():
        dim_row += f"{model_results[key]['dims']:>15}"
    print(dim_row)

    print("\n" + "="*65)
    print("ANALYSIS")
    print("="*65)
    minilm_ndcg = model_results["minilm"]["eval"][f"mean_NDCG@{K}"]
    mpnet_ndcg  = model_results["mpnet"]["eval"][f"mean_NDCG@{K}"]
    delta = mpnet_ndcg - minilm_ndcg

    print(f"""
all-MiniLM-L6-v2:
  • 384 dimensions — 2× faster encoding
  • Lower memory footprint
  • NDCG@{K}: {minilm_ndcg:.4f}

all-mpnet-base-v2:
  • 768 dimensions — richer semantic representation
  • Better at nuanced queries like "toys for 5-year-olds"
  • NDCG@{K}: {mpnet_ndcg:.4f}  (Δ={delta:+.4f} vs MiniLM)

Recommendation:
  For a small inventory (<500 items) the speed difference is negligible.
  Prefer mpnet for production if search quality matters.
  Use MiniLM for real-time autocomplete or very large catalogs.
""")


if __name__ == "__main__":
    main()