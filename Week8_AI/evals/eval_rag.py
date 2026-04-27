import sys
from pathlib import Path

# Add src to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from advanced_rag import ask_with_stock

def eval_rag():
    test_cases = [
        {
            "query": "What is the warranty period for the Lego Castle?",
            "expected_keywords": ["2", "year"] # from MOCK_INVENTORY_DB
        },
        {
            "query": "What's the return policy for damaged items?",
            "expected_keywords": ["return", "damaged"] # generally should be in the answer
        },
        {
            "query": "Recommend a toy under ₹3000 that is in stock.",
            "expected_keywords": ["Creative Studio Art Kit"] # AS-2210 price is 2099
        }
    ]
    
    success = 0
    print("--- Running RAG Pipeline Evaluation ---\n")
    for i, case in enumerate(test_cases, 1):
        query = case["query"]
        expected = case["expected_keywords"]
        
        print(f"Test {i}: {query}")
        result = ask_with_stock(query)
        answer = result["answer"].lower()
        
        passed = all(k.lower() in answer for k in expected)
        
        print(f"  Expected Keywords: {expected}")
        print(f"  Answer: {result['answer']}")
        
        if passed:
            print("  Result: PASS\n")
            success += 1
        else:
            print("  Result: FAIL\n")
            
    print(f"RAG Eval Score: {success}/{len(test_cases)}")
    
    import os
    if os.getenv("LANGCHAIN_API_KEY"):
        print("LangSmith tracing is enabled. You can view the traces in your LangSmith project.")

    return success == len(test_cases)

if __name__ == "__main__":
    passed = eval_rag()
    if not passed:
        sys.exit(1)
