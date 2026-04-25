import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

DATA_DIR = Path(__file__).parent.parent / "data"
CHROMA_DIR = Path(__file__).parent.parent / "chroma_db"


def load_documents():
    """Load all .txt files from the data directory."""
    docs = []
    for txt_file in DATA_DIR.glob("*.txt"):
        print(f"  Loading: {txt_file.name}")
        loader = TextLoader(str(txt_file), encoding="utf-8")
        loaded = loader.load()
        for doc in loaded:
            doc.metadata["source"] = txt_file.name
        docs.extend(loaded)
    print(f"  Total documents loaded: {len(docs)}")
    return docs


def chunk_documents(docs):
    """Split documents into overlapping chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", ".", " ", ""],
    )
    chunks = splitter.split_documents(docs)
    print(f"  Total chunks created: {len(chunks)}")
    return chunks


def build_vectorstore(chunks):
    """Embed chunks using Gemini and persist to ChromaDB."""
    print("  Embedding chunks using Gemini (models/embedding-001)...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR),
        collection_name="toyworld_docs",
    )
    print(f"  ChromaDB saved to: {CHROMA_DIR}")
    return vectorstore


def main():
    print("\n=== ToyWorld RAG — Ingestion Pipeline (Gemini) ===\n")

    print("Step 1: Loading documents...")
    docs = load_documents()

    print("\nStep 2: Chunking documents...")
    chunks = chunk_documents(docs)

    print("\nStep 3: Building vector store with Gemini embeddings...")
    build_vectorstore(chunks)

    print("\n Ingestion complete! Vector store is ready.\n")


if __name__ == "__main__":
    main()