from __future__ import annotations

import math
from typing import Sequence

def precision_at_k(retrieved: Sequence[str], relevant: Sequence[str], k: int) -> float:
    if k == 0:
        return 0.0
    top_k = list(retrieved)[:k]
    hits = sum(1 for r in top_k if r in relevant)
    return hits / k


def recall_at_k(retrieved: Sequence[str], relevant: Sequence[str], k: int) -> float:
    if not relevant:
        return 0.0
    top_k = list(retrieved)[:k]
    hits = sum(1 for r in top_k if r in relevant)
    return hits / len(relevant)


def reciprocal_rank(retrieved: Sequence[str], relevant: Sequence[str]) -> float:
    for rank, item in enumerate(retrieved, start=1):
        if item in relevant:
            return 1.0 / rank
    return 0.0


def ndcg_at_k(retrieved: Sequence[str], relevant: Sequence[str], k: int) -> float:
    def dcg(items: Sequence[str]) -> float:
        return sum(
            1.0 / math.log2(i + 2)
            for i, item in enumerate(items)
            if item in relevant
        )

    top_k = list(retrieved)[:k]
    actual_dcg = dcg(top_k)

    ideal_top = list(relevant)[:k]
    ideal_dcg = dcg(ideal_top)
    return actual_dcg / ideal_dcg if ideal_dcg > 0 else 0.0


def evaluate_search_function(
    search_fn,
    test_cases: list[dict],
    k: int = 5,
) -> dict:
 
    results = []

    for case in test_cases:
        query = case["query"]
        relevant = set(case["relevant_products"])
        irrelevant = set(case.get("irrelevant_products", []))

        retrieved = search_fn(query=query, top_k=k)  

        p_k   = precision_at_k(retrieved, relevant, k)
        r_k   = recall_at_k(retrieved, relevant, k)
        rr    = reciprocal_rank(retrieved, relevant)
        ndcg  = ndcg_at_k(retrieved, relevant, k)

        top_k_set = set(list(retrieved)[:k])
        neg_hits  = len(top_k_set & irrelevant)

        results.append({
            "query":           query,
            f"P@{k}":          round(p_k, 4),
            f"R@{k}":          round(r_k, 4),
            "MRR":             round(rr, 4),
            f"NDCG@{k}":       round(ndcg, 4),
            "negative_hits":   neg_hits,
            "retrieved":       retrieved,
        })

    avg_p    = sum(r[f"P@{k}"]    for r in results) / len(results)
    avg_r    = sum(r[f"R@{k}"]    for r in results) / len(results)
    avg_mrr  = sum(r["MRR"]       for r in results) / len(results)
    avg_ndcg = sum(r[f"NDCG@{k}"] for r in results) / len(results)
    avg_neg  = sum(r["negative_hits"] for r in results) / len(results)

    return {
        "per_query": results,
        "aggregate": {
            f"mean_P@{k}":    round(avg_p,    4),
            f"mean_R@{k}":    round(avg_r,    4),
            "mean_MRR":       round(avg_mrr,  4),
            f"mean_NDCG@{k}": round(avg_ndcg, 4),
            "mean_neg_hits":  round(avg_neg,  4),
            "n_queries":      len(results),
            "k":              k,
        },
    }