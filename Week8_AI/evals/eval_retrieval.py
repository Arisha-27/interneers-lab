import sys
from pathlib import Path

# Add src to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from retriever import retrieve_relevant_chunks

def eval_retrieval():
    test_cases = [
        {
            "query": "What's the return policy for damaged items?",
            "expected_source": "return_policy.txt"
        },
        {
            "query": "How do I become a vendor for ToyWorld?",
            "expected_source": "vendor_faq.txt"
        },
        {
            "query": "How to assemble the Lego Castle?",
            "expected_source": "product_manual.txt"
        }
    ]
    
    success = 0
    print("--- Running Retrieval Evaluation ---\n")
    for i, case in enumerate(test_cases, 1):
        query = case["query"]
        expected = case["expected_source"]
        
        print(f"Test {i}: {query}")
        results = retrieve_relevant_chunks(query, top_k=3)
        sources = [r["source"] for r in results]
        
        passed = any(expected in s for s in sources)
        print(f"  Expected Source: {expected}")
        print(f"  Retrieved Sources: {sources}")
        
        if passed:
            print("  Result: PASS\n")
            success += 1
        else:
            print("  Result: FAIL\n")
            
    print(f"Retrieval Eval Score: {success}/{len(test_cases)}")
    
    # LangSmith tracing check (just prints instruction if LANGCHAIN_API_KEY is present)
    import os
    if os.getenv("LANGCHAIN_API_KEY"):
        print("LangSmith tracing is enabled. You can view the traces in your LangSmith project.")
        
    return success == len(test_cases)

if __name__ == "__main__":
    passed = eval_retrieval()
    if not passed:
        sys.exit(1)
