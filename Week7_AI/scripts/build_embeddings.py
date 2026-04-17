import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.embeddings import load_inventory, build_embeddings, MODELS

def main():
    df = load_inventory()
    print(f"Loaded {len(df)} products.\n")

    for key, name in MODELS.items():
        print(f"{'='*60}")
        print(f"Model: {name}  (key='{key}')")
        emb = build_embeddings(df, model_key=key, force=False)
        print(f"Embeddings shape: {emb.shape}\n")

    print("Done. Embeddings cached in ./cache/")

if __name__ == "__main__":
    main()