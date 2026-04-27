from typing import Union
MAX_DISCOUNT_PCT = 20.0                                         
def enforce_discount_policy(
    proposed_discount_pct: Union[float, int],
    product_id: str = "",
    quantity: int = 0,
) -> dict:
    """
    Validates an LLM-proposed discount against business policy.
    If the proposed discount exceeds MAX_DISCOUNT_PCT (20%), this function
    overrides it, emits a structured warning, and returns the capped value.
    Args:
        proposed_discount_pct:  Discount percentage the LLM wants to give (0–100 scale).
        product_id:             Optional — for richer logging.
        quantity:               Optional — for richer logging.
    Returns:
        {
            "approved":          bool,
            "original_discount": float,
            "final_discount":    float,
            "warning":           str | None,
            "policy_note":       str,
        }
    """
    proposed = float(proposed_discount_pct)
    if proposed <= MAX_DISCOUNT_PCT:
        return {
            "approved":          True,
            "original_discount": proposed,
            "final_discount":    proposed,
            "warning":           None,
            "policy_note":       f"Discount of {proposed:.1f}% is within policy limits.",
        }
    warning = (
        f"⚠️  POLICY VIOLATION DETECTED\n"
        f"   Product   : {product_id or 'N/A'}\n"
        f"   Quantity  : {quantity or 'N/A'}\n"
        f"   Proposed  : {proposed:.1f}%  ← exceeds maximum allowed {MAX_DISCOUNT_PCT:.0f}%\n"
        f"   Overridden: {MAX_DISCOUNT_PCT:.1f}%  ← enforced by policy engine\n"
        f"   Reason    : Business rule — no order may receive more than {MAX_DISCOUNT_PCT:.0f}% discount."
    )
    return {
        "approved":          False,
        "original_discount": proposed,
        "final_discount":    MAX_DISCOUNT_PCT,
        "warning":           warning,
        "policy_note": (
            f"Discount capped at {MAX_DISCOUNT_PCT:.0f}% per company policy. "
            f"The original request for {proposed:.1f}% has been overridden."
        ),
    }
def validate_quote_output(quote_dict: dict) -> dict:
    """
    Post-processing guard: re-validates a complete quote dict produced by the
    agent and enforces policy on the discount_pct field.
    Pass in the 'quote' sub-dict from calculate_quote() output.
    Returns the (possibly corrected) quote dict plus any policy_warning.
    """
    if "discount_pct" not in quote_dict:
        return {"quote": quote_dict, "policy_warning": None}
    result = enforce_discount_policy(
        proposed_discount_pct=quote_dict["discount_pct"],
        product_id=quote_dict.get("product_id", ""),
        quantity=quote_dict.get("quantity_requested", 0),
    )
    policy_warning = result["warning"]
    if not result["approved"]:
        original_subtotal = quote_dict.get("subtotal", 0)
        new_discount_pct  = result["final_discount"]
        new_discount_amt  = original_subtotal * (new_discount_pct / 100)
        new_total         = original_subtotal - new_discount_amt
        qty               = quote_dict.get("quantity_requested", 1)
        quote_dict["discount_pct"]      = new_discount_pct
        quote_dict["discount_amount"]   = round(new_discount_amt, 2)
        quote_dict["total_price"]       = round(new_total, 2)
        quote_dict["unit_final_price"]  = round(new_total / qty, 4) if qty else 0
        quote_dict["discount_label"]   += " [CAPPED BY POLICY]"
    return {
        "quote":          quote_dict,
        "policy_warning": policy_warning,
    }
if __name__ == "__main__":
    print("Policy check — 15% (should pass)")
    print(enforce_discount_policy(15, "LEGO-001", 60))
    print("\nPolicy check — 25% (should be overridden to 20%)")
    print(enforce_discount_policy(25, "LEGO-001", 200))
