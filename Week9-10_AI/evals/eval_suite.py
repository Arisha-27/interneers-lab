import sys
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from tools.product_tools import get_product_info, check_inventory, calculate_quote
from tools.policy_check import enforce_discount_policy
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
BLUE   = "\033[94m"
RESET  = "\033[0m"
BOLD   = "\033[1m"
def passed(msg="PASS"):
    return f"{GREEN}✅  {msg}{RESET}"
def failed(msg="FAIL"):
    return f"{RED}❌  {msg}{RESET}"
def section(title):
    print(f"\n{BOLD}{BLUE}{'─'*60}{RESET}")
    print(f"{BOLD}{BLUE}  {title}{RESET}")
    print(f"{BOLD}{BLUE}{'─'*60}{RESET}")
results = []
def run_eval(name: str, fn, *args, expect_key=None, expect_value=None, expect_not_key=None):
    """Run a single eval, compare output, record result."""
    try:
        output = fn(*args)
        ok = True
        if expect_key and expect_value is not None:
            keys  = expect_key.split(".")
            value = output
            for k in keys:
                if isinstance(value, dict) and k in value:
                    value = value[k]
                else:
                    value = None
                    break
            ok = value == expect_value
        if expect_not_key:
            keys  = expect_not_key.split(".")
            value = output
            for k in keys:
                value = value.get(k) if isinstance(value, dict) else None
            ok = value is None or value == "error"
        status = "PASS" if ok else "FAIL"
        results.append({"name": name, "status": status, "output": output})
        print(f"  {passed(name) if ok else failed(name)}")
        if not ok:
            print(f"    Expected {expect_key}={expect_value!r}, got {value!r}")
        return output
    except Exception as exc:
        results.append({"name": name, "status": "ERROR", "error": str(exc)})
        print(f"  {failed(name)} — exception: {exc}")
        return None
def eval_simple():
    section("SIMPLE SCENARIOS — Tool Unit Tests")
    run_eval(
        "S1: get_product_info valid ID",
        get_product_info, "LEGO-001",
        expect_key="status", expect_value="success",
    )
    out = run_eval(
        "S2: get_product_info keyword 'lego'",
        get_product_info, "lego",
        expect_key="status", expect_value="success",
    )
    run_eval(
        "S3: get_product_info unknown product",
        get_product_info, "DOES-NOT-EXIST",
        expect_key="status", expect_value="error",
    )
    run_eval(
        "S4: check_inventory valid product",
        check_inventory, "LEGO-001",
        expect_key="quantity_available", expect_value=200,
    )
    run_eval(
        "S5: check_inventory unknown product",
        check_inventory, "UNKNOWN-999",
        expect_key="status", expect_value="error",
    )
    out = run_eval(
        "S6: calculate_quote qty=5 → 0% discount",
        calculate_quote, "LEGO-001", 5,
        expect_key="quote.discount_pct", expect_value=0.0,
    )
    run_eval(
        "S7: calculate_quote qty=15 → 5% discount",
        calculate_quote, "LEGO-001", 15,
        expect_key="quote.discount_pct", expect_value=5.0,
    )
    run_eval(
        "S8: calculate_quote qty=60 → 15% discount",
        calculate_quote, "LEGO-001", 60,
        expect_key="quote.discount_pct", expect_value=15.0,
    )
    run_eval(
        "S9: calculate_quote qty=100 → 20% discount",
        calculate_quote, "LEGO-001", 100,
        expect_key="quote.discount_pct", expect_value=20.0,
    )
    out = calculate_quote("LEGO-001", 60)
    if out and out.get("status") == "success":
        q      = out["quote"]
        manual = round(q["unit_price"] * q["quantity_requested"] * (1 - q["discount_pct"] / 100), 2)
        ok     = abs(manual - q["total_price"]) < 0.01
        status = "PASS" if ok else "FAIL"
        results.append({"name": "S10: Quote math verification", "status": status})
        print(f"  {passed('S10: Quote math verification') if ok else failed('S10: Quote math verification')}")
def eval_complex():
    section("COMPLEX SCENARIOS — Policy + Edge Cases")
    result = enforce_discount_policy(15.0, "LEGO-001", 60)
    ok     = result["approved"] is True
    results.append({"name": "C1: Policy allows 15%", "status": "PASS" if ok else "FAIL"})
    print(f"  {passed('C1: Policy allows 15%') if ok else failed('C1: Policy allows 15%')}")
    result = enforce_discount_policy(25.0, "LEGO-001", 200)
    ok     = result["approved"] is False and result["final_discount"] == 20.0
    results.append({"name": "C2: Policy caps 25% → 20%", "status": "PASS" if ok else "FAIL"})
    print(f"  {passed('C2: Policy caps 25% → 20%') if ok else failed('C2: Policy caps 25% → 20%')}")
    if not ok:
        print(f"    Got: {result}")
    result = enforce_discount_policy(20.0, "LEGO-001", 100)
    ok     = result["approved"] is True
    results.append({"name": "C3: Policy allows exactly 20%", "status": "PASS" if ok else "FAIL"})
    print(f"  {passed('C3: Policy allows exactly 20%') if ok else failed('C3: Policy allows exactly 20%')}")
    out = calculate_quote("LEGO-002", 50)
    if out and out.get("status") == "success":
        ok = out["quote"]["can_fulfill"] is False
        results.append({"name": "C4: Detects insufficient inventory", "status": "PASS" if ok else "FAIL"})
        print(f"  {passed('C4: Detects insufficient inventory') if ok else failed('C4: Detects insufficient inventory')}")
    else:
        results.append({"name": "C4: Detects insufficient inventory", "status": "FAIL"})
        print(f"  {failed('C4: Detects insufficient inventory')}")
    out = calculate_quote("LEGO-001", 0)
    ok  = out.get("status") == "error"
    results.append({"name": "C5: Rejects qty=0", "status": "PASS" if ok else "FAIL"})
    print(f"  {passed('C5: Rejects qty=0') if ok else failed('C5: Rejects qty=0')}")
    out1 = get_product_info("LEGO-001")
    out2 = get_product_info("lego-001")
    ok   = out1.get("name") == out2.get("name")
    results.append({"name": "C6: Product ID case-insensitive", "status": "PASS" if ok else "FAIL"})
    print(f"  {passed('C6: Product ID case-insensitive') if ok else failed('C6: Product ID case-insensitive')}")
    products = ["LEGO-001", "STATIONERY-001", "BOOK-001"]
    all_ok = all(check_inventory(p).get("status") == "success" for p in products)
    results.append({"name": "C7: Multi-product inventory check", "status": "PASS" if all_ok else "FAIL"})
    print(f"  {passed('C7: Multi-product inventory check') if all_ok else failed('C7: Multi-product inventory check')}")
    run_eval(
        "C8: calculate_quote stationery product",
        calculate_quote, "STATIONERY-001", 30,
        expect_key="quote.discount_pct", expect_value=10.0,
    )
    run_eval(
        "C9: Discount boundary at qty=49 → 10%",
        calculate_quote, "LEGO-001", 49,
        expect_key="quote.discount_pct", expect_value=10.0,
    )
    run_eval(
        "C10: Discount boundary at qty=50 → 15%",
        calculate_quote, "LEGO-001", 50,
        expect_key="quote.discount_pct", expect_value=15.0,
    )
def print_summary():
    section("EVAL SUMMARY")
    total  = len(results)
    passed_n = sum(1 for r in results if r["status"] == "PASS")
    failed_n = total - passed_n
    pct    = round(passed_n / total * 100) if total else 0
    print(f"\n  Total  : {total}")
    print(f"  {GREEN}Passed : {passed_n}{RESET}")
    print(f"  {RED}Failed : {failed_n}{RESET}")
    print(f"  Score  : {BOLD}{pct}%{RESET}\n")
    if failed_n:
        print(f"  {YELLOW}Failed tests:{RESET}")
        for r in results:
            if r["status"] != "PASS":
                print(f"    • {r['name']}")
    print()
    return passed_n, failed_n
if __name__ == "__main__":
    print(f"\n{BOLD}AI Quote Agent — Eval Suite{RESET}")
    eval_simple()
    eval_complex()
    passed_n, failed_n = print_summary()
    sys.exit(0 if failed_n == 0 else 1)
