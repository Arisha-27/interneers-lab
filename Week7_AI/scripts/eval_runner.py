import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

from core.embeddings import load_inventory, build_embeddings, DEFAULT_MODEL
from core.search import semantic_search
from core.evaluation import evaluate_search_function
from data.evalset import SEARCH_TEST_CASES

K = 5   


def make_search_fn(df: pd.DataFrame, embeddings: np.ndarray, model: SentenceTransformer):

    def _fn(query: str, top_k: int = K) -> list[str]:
        results = semantic_search(
            query=query,
            df=df,
            embeddings=embeddings,
            top_k=top_k,
            model=model,
        )
        return results["id"].tolist()
    return _fn


def print_results(eval_output: dict, k: int) -> None:
    agg = eval_output["aggregate"]
    per = eval_output["per_query"]

    print("\n" + "="*70)
    print(f"EVALUATION RESULTS  (k={k})")
    print("="*70)

    header = f"{'Query':<35} {'P@K':>6} {'R@K':>6} {'MRR':>6} {'NDCG@K':>8} {'Neg':>4}"
    print(header)
    print("-" * 70)
    for r in per:
        print(
            f"{r['query'][:34]:<35} "
            f"{r[f'P@{k}']:>6.3f} "
            f"{r[f'R@{k}']:>6.3f} "
            f"{r['MRR']:>6.3f} "
            f"{r[f'NDCG@{k}']:>8.3f} "
            f"{r['negative_hits']:>4}"
        )

    print("=" * 70)
    print(
        f"{'MEAN':<35} "
        f"{agg[f'mean_P@{k}']:>6.3f} "
        f"{agg[f'mean_R@{k}']:>6.3f} "
        f"{agg['mean_MRR']:>6.3f} "
        f"{agg[f'mean_NDCG@{k}']:>8.3f} "
        f"{agg['mean_neg_hits']:>4.1f}"
    )
    print("=" * 70)
    print(f"\nQueries evaluated : {agg['n_queries']}")
    print(f"P@{k}  (precision)  : {agg[f'mean_P@{k}']:.3f}  — fraction of top-{k} that are relevant")
    print(f"R@{k}  (recall)     : {agg[f'mean_R@{k}']:.3f}  — fraction of relevant items retrieved")
    print(f"MRR   (recip. rank): {agg['mean_MRR']:.3f}  — position of first relevant result")
    print(f"NDCG@{k}            : {agg[f'mean_NDCG@{k}']:.3f}  — quality of ranking order")
    print(f"Neg hits (avg)     : {agg['mean_neg_hits']:.1f}  — irrelevant items in top-{k}")

    print("\n" + "-"*70)
    print("RETRIEVED PRODUCT IDs PER QUERY")
    print("-"*70)
    for r in per:
        print(f"\n  Query: {r['query']!r}")
        for rank, pid in enumerate(r["retrieved"], 1):
            print(f"    {rank}. {pid}")


def main():
    print("Loading inventory …")
    df = load_inventory()

    print(f"Building/loading embeddings (model: {DEFAULT_MODEL}) …")
    embeddings = build_embeddings(df, model_key=DEFAULT_MODEL, force=False)

    print("Loading sentence-transformer for query encoding …")
    from core.embeddings import get_model
    model = get_model(DEFAULT_MODEL)

    search_fn = make_search_fn(df, embeddings, model)

    print(f"Running {len(SEARCH_TEST_CASES)} test cases at k={K} …")
    eval_output = evaluate_search_function(
        search_fn=search_fn,
        test_cases=SEARCH_TEST_CASES,
        k=K,
    )

    print_results(eval_output, k=K)


if __name__ == "__main__":
    main()