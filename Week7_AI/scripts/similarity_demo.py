import sys
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from sklearn.decomposition import PCA
from sentence_transformers import SentenceTransformer

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

PRODUCTS = {
    "Lego Castle": (
        "Lego Castle. Category: Construction. "
        "Build a medieval castle with knights, towers, and drawbridges. "
        "Creative construction play set with 500 pieces for building imaginative structures. "
        "Age range: 6–12 years."
    ),
    "Wooden Blocks": (
        "Wooden Building Blocks. Category: Construction. "
        "Classic wooden blocks set for stacking, building, and creative construction. "
        "Natural wood, safe for toddlers and young children. "
        "Age range: 1–5 years."
    ),
    "Action Figure": (
        "Superhero Action Figure. Category: Action. "
        "Detailed superhero action figure with articulated joints and accessories. "
        "Popular character toy for adventure play and collecting. "
        "Age range: 4–12 years."
    ),
}

def cosine_similarity_numpy(a: np.ndarray, b: np.ndarray) -> float:
   
    dot_product   = np.dot(a, b)
    magnitude_a   = np.linalg.norm(a)
    magnitude_b   = np.linalg.norm(b)
    similarity    = dot_product / (magnitude_a * magnitude_b)
    return float(similarity)


def print_similarity_table(names: list[str], embeddings: list[np.ndarray]) -> None:
    n = len(names)
    print("\n" + "="*60)
    print("MANUAL COSINE SIMILARITY MATRIX")
    print("="*60)

    col_w = 18
    header = f"{'':>{col_w}}" + "".join(f"{n:>{col_w}}" for n in names)
    print(header)
    print("-" * (col_w * (n + 1)))
    for i, name_i in enumerate(names):
        row = f"{name_i:>{col_w}}"
        for j, _ in enumerate(names):
            sim = cosine_similarity_numpy(embeddings[i], embeddings[j])
            row += f"{sim:>{col_w}.4f}"
        print(row)

    print("\n" + "="*60)
    print("PAIRWISE SIMILARITIES")
    print("="*60)
    pairs = [(0, 1), (0, 2), (1, 2)]
    for i, j in pairs:
        sim = cosine_similarity_numpy(embeddings[i], embeddings[j])
        print(f"  {names[i]!r:>20s}  ↔  {names[j]!r:<20s}  →  {sim:.4f}")

    print("\n" + "="*60)
    print("WHY IS LEGO CLOSER TO WOODEN BLOCKS THAN ACTION FIGURE?")
    print("="*60)
    explanation = """
Both Lego Castle and Wooden Blocks share semantic content around:
  • The concept of "construction" and "building"
  • Physical assembly and spatial reasoning
  • Open-ended, creative play patterns
  • Structural vocabulary: "blocks", "pieces", "stacking"

Action Figure's embedding space is dominated by:
  • Character-based narrative play ("superhero", "adventure")
  • Collecting behaviour
  • Pre-defined roles rather than creative construction

Sentence-transformers capture these semantic clusters during training on
hundreds of millions of text pairs. Words like "build", "construct", and
"blocks" co-occur in similar contexts → nearby vectors.
"Superhero", "articulated", and "collecting" form a completely different
semantic neighbourhood → distant vectors.

This is the key insight of dense retrieval: even if "construction" doesn't
appear in "Lego Castle", the MODEL knows Lego is construction because of
how those words have been used together across the training corpus.
"""
    print(explanation)


def plot_pca(
    names: list[str],
    embeddings: list[np.ndarray],
    output_path: str = "pca_products.png",
) -> None:
   
    matrix = np.stack(embeddings)                 
    pca = PCA(n_components=2, random_state=42)
    coords_2d = pca.fit_transform(matrix)           

    fig, ax = plt.subplots(figsize=(8, 6))
    colors  = ["#5B4CF5", "#1CA77B", "#D85A30"]   
    markers = ["o", "s", "^"]

    for i, (name, color, marker) in enumerate(zip(names, colors, markers)):
        x, y = coords_2d[i]
        ax.scatter(x, y, c=color, marker=marker, s=220, zorder=5, edgecolors="white", linewidths=1.5)
        ax.annotate(
            name,
            xy=(x, y),
            xytext=(10, 10),
            textcoords="offset points",
            fontsize=12,
            fontweight="bold",
            color=color,
        )

    pair_indices = [(0, 1), (0, 2), (1, 2)]
    for i, j in pair_indices:
        xi, yi = coords_2d[i]
        xj, yj = coords_2d[j]
        sim = cosine_similarity_numpy(embeddings[i], embeddings[j])
        ax.plot([xi, xj], [yi, yj], "--", alpha=0.4, color="gray", linewidth=1.2)
        mx, my = (xi + xj) / 2, (yi + yj) / 2
        ax.text(mx, my, f"sim={sim:.3f}", fontsize=9, color="gray", ha="center")

    var_explained = pca.explained_variance_ratio_
    ax.set_xlabel(f"PC1  ({var_explained[0]*100:.1f}% variance)", fontsize=11)
    ax.set_ylabel(f"PC2  ({var_explained[1]*100:.1f}% variance)", fontsize=11)
    ax.set_title(
        "Product embeddings in 2D (PCA projection from 384D)\n"
        "all-MiniLM-L6-v2",
        fontsize=13,
        fontweight="bold",
    )
    ax.grid(True, alpha=0.3)
    ax.spines[["top", "right"]].set_visible(False)

    patches = [
        mpatches.Patch(color=c, label=n)
        for c, n in zip(colors, names)
    ]
    ax.legend(handles=patches, loc="best", fontsize=10)

    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    print(f"\nPCA plot saved → {output_path}")
    plt.show()

def main():
    print("Loading model: all-MiniLM-L6-v2 …")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    names = list(PRODUCTS.keys())
    texts = list(PRODUCTS.values())

    print(f"Encoding {len(texts)} product descriptions …")
    embeddings_matrix = model.encode(texts, convert_to_numpy=True)
    embeddings = [embeddings_matrix[i] for i in range(len(names))]

    print(f"\nEmbedding dimensionality: {embeddings[0].shape[0]}")

    print_similarity_table(names, embeddings)
    plot_pca(names, embeddings, output_path="pca_products.png")


if __name__ == "__main__":
    main()