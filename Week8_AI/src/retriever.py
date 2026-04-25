import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

CHROMA_DIR = Path(__file__).parent.parent / "chroma_db"


def get_vectorstore():
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )
    vectorstore = Chroma(
        persist_directory=str(CHROMA_DIR),
        embedding_function=embeddings,
        collection_name="toyworld_docs",
    )
    return vectorstore


def retrieve_relevant_chunks(query: str, top_k: int = 3) -> list[dict]:
    vectorstore = get_vectorstore()
    results = vectorstore.similarity_search_with_relevance_scores(query, k=top_k)

    chunks = []
    for doc, score in results:
        chunks.append({
            "content": doc.page_content,
            "source": doc.metadata.get("source", "unknown"),
            "score": round(score, 4),
        })
    return chunks


if __name__ == "__main__":
    test_query = "What's the return policy for damaged items?"
    print(f"\nQuery: {test_query}\n")
    results = retrieve_relevant_chunks(test_query, top_k=3)
    for i, r in enumerate(results, 1):
        print(f"--- Chunk {i} (source: {r['source']}, score: {r['score']}) ---")
        print(r["content"][:300])
        print()