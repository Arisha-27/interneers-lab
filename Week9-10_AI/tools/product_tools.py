from typing import Union
PRODUCTS = {
    "LEGO-001": {
        "product_id": "LEGO-001",
        "name": "Classic Building Blocks Set",
        "brand": "Lego",
        "category": "Toys & Games",
        "unit_price": 2.50,
        "description": "Standard coloured building blocks, compatible with all major brick systems.",
        "sku": "LG-BLK-001",
        "image_path": "assets/lego-001.png",
    },
    "LEGO-002": {
        "product_id": "LEGO-002",
        "name": "Lego Technic Gear Pack",
        "brand": "Lego",
        "category": "Toys & Games",
        "unit_price": 5.00,
        "description": "Technic gears and axles for complex builds.",
        "sku": "LG-TCH-002",
        "image_path": "assets/lego-002.png",
    },
    "STATIONERY-001": {
        "product_id": "STATIONERY-001",
        "name": "Premium Colour Pencils (12-pack)",
        "brand": "Faber-Castell",
        "category": "Stationery",
        "unit_price": 1.20,
        "description": "Artist-grade colour pencils for school and studio use.",
        "sku": "FC-PEN-012",
        "image_path": "assets/stationery-001.png",
    },
    "BOOK-001": {
        "product_id": "BOOK-001",
        "name": "Science Workbook Grade 5",
        "brand": "Oxford Press",
        "category": "Books",
        "unit_price": 8.00,
        "description": "Curriculum-aligned science workbook.",
        "sku": "OX-SCI-G5",
        "image_path": "assets/book-001.png",
    },
}
INVENTORY = {
    "LEGO-001":       {"quantity_available": 200, "warehouse": "Mumbai-W1",  "restock_days": 3},
    "LEGO-002":       {"quantity_available": 45,  "warehouse": "Mumbai-W1",  "restock_days": 7},
    "STATIONERY-001": {"quantity_available": 500, "warehouse": "Delhi-W2",   "restock_days": 2},
    "BOOK-001":       {"quantity_available": 80,  "warehouse": "Pune-W3",    "restock_days": 5},
}
DISCOUNT_RULES = [
    {"min_qty": 1,   "max_qty": 9,    "discount_pct": 0.00,  "label": "No discount"},
    {"min_qty": 10,  "max_qty": 24,   "discount_pct": 0.05,  "label": "5% — Small bulk"},
    {"min_qty": 25,  "max_qty": 49,   "discount_pct": 0.10,  "label": "10% — Medium bulk"},
    {"min_qty": 50,  "max_qty": 99,   "discount_pct": 0.15,  "label": "15% — Large bulk"},
    {"min_qty": 100, "max_qty": 9999, "discount_pct": 0.20,  "label": "20% — Wholesale"},
]
MAX_ALLOWED_DISCOUNT = 0.20                                       
def get_product_info(product_id: str) -> dict:
    """
    Returns product details for a given product_id.
    Args:
        product_id: The unique product identifier (e.g. 'LEGO-001').
    Returns:
        dict with keys: product_id, name, brand, category, unit_price,
        description, sku  — or an 'error' key if not found.
    """
    product_id = product_id.strip().upper()
    if product_id in PRODUCTS:
        return {"status": "success", **PRODUCTS[product_id]}
    keyword = product_id.lower()
    for pid, info in PRODUCTS.items():
        if (keyword in info["name"].lower()
                or keyword in info["brand"].lower()
                or keyword in info["category"].lower()):
            return {"status": "success", **info}
    return {"status": "error", "error": f"Product '{product_id}' not found.",
            "available_ids": list(PRODUCTS.keys())}
def check_inventory(product_id: str) -> dict:
    """
    Returns current inventory levels for a product.
    Args:
        product_id: The unique product identifier.
    Returns:
        dict with keys: product_id, quantity_available, warehouse,
        restock_days, in_stock  — or an 'error' key if not found.
    """
    product_id = product_id.strip().upper()
    if product_id not in INVENTORY:
        product_result = get_product_info(product_id)
        if product_result.get("status") == "success":
            product_id = product_result["product_id"]
        else:
            return {"status": "error",
                    "error": f"No inventory record for '{product_id}'."}
    inv = INVENTORY[product_id]
    return {
        "status": "success",
        "product_id": product_id,
        "quantity_available": inv["quantity_available"],
        "warehouse": inv["warehouse"],
        "restock_days": inv["restock_days"],
        "in_stock": inv["quantity_available"] > 0,
    }
def calculate_quote(product_id: str, quantity: int) -> dict:
    """
    Calculates a price quote with volume-based discount rules.
    Discount schedule:
        1–9   units → 0 %
        10–24 units → 5 %
        25–49 units → 10 %
        50–99 units → 15 %
        100+  units → 20 % (hard ceiling — policy enforced)
    Args:
        product_id: The unique product identifier.
        quantity:   Number of units requested (must be ≥ 1).
    Returns:
        dict with full quote breakdown including policy_warning if applicable.
    """
    product_result = get_product_info(product_id)
    if product_result.get("status") != "success":
        return {"status": "error", "error": product_result.get("error")}
    pid           = product_result["product_id"]
    unit_price    = product_result["unit_price"]
    product_name  = product_result["name"]
    quantity = int(quantity)
    if quantity < 1:
        return {"status": "error", "error": "Quantity must be at least 1."}
    inv = check_inventory(pid)
    if inv.get("status") != "success":
        return {"status": "error", "error": inv.get("error")}
    available = inv["quantity_available"]
    applied_discount = 0.0
    discount_label   = "No discount"
    for rule in DISCOUNT_RULES:
        if rule["min_qty"] <= quantity <= rule["max_qty"]:
            applied_discount = rule["discount_pct"]
            discount_label   = rule["label"]
            break
    policy_warning = None
    if applied_discount > MAX_ALLOWED_DISCOUNT:
        policy_warning   = (
            f"⚠️  Policy Override: Requested discount {applied_discount*100:.0f}% "
            f"exceeds the maximum allowed {MAX_ALLOWED_DISCOUNT*100:.0f}%. "
            f"Discount capped at {MAX_ALLOWED_DISCOUNT*100:.0f}%."
        )
        applied_discount = MAX_ALLOWED_DISCOUNT
        discount_label  += " [CAPPED BY POLICY]"
    subtotal        = unit_price * quantity
    discount_amount = subtotal * applied_discount
    total_price     = subtotal - discount_amount
    unit_final      = total_price / quantity
    return {
        "status": "success",
        "quote": {
            "product_id":        pid,
            "product_name":      product_name,
            "quantity_requested": quantity,
            "quantity_available": available,
            "can_fulfill":        available >= quantity,
            "unit_price":         round(unit_price, 2),
            "discount_pct":       round(applied_discount * 100, 1),
            "discount_label":     discount_label,
            "discount_amount":    round(discount_amount, 2),
            "subtotal":           round(subtotal, 2),
            "total_price":        round(total_price, 2),
            "unit_final_price":   round(unit_final, 4),
            "currency":           "USD",
        },
        "policy_warning": policy_warning,
        "inventory": {
            "warehouse":    inv["warehouse"],
            "restock_days": inv["restock_days"],
        },
    }
def get_full_quote(query: str, quantity: int) -> dict:
    """Consolidated tool for the agent to reduce Gemini turns.
    Searches for product and calculates a quote in one step.
    """
    info = get_product_info(query)
    if info.get("status") != "success":
        return info
    return calculate_quote(info["product_id"], quantity)
if __name__ == "__main__":
    import json
    print("=" * 60)
    print("TEST 1 — get_product_info('LEGO-001')")
    print(json.dumps(get_product_info("LEGO-001"), indent=2))
    print("\nTEST 2 — get_product_info('lego') [keyword match]")
    print(json.dumps(get_product_info("lego"), indent=2))
    print("\nTEST 3 — check_inventory('LEGO-001')")
    print(json.dumps(check_inventory("LEGO-001"), indent=2))
    print("\nTEST 4 — calculate_quote('LEGO-001', 60)")
    print(json.dumps(calculate_quote("LEGO-001", 60), indent=2))
    print("\nTEST 5 — calculate_quote('LEGO-001', 5) [no discount]")
    print(json.dumps(calculate_quote("LEGO-001", 5), indent=2))
    print("\nTEST 6 — product not found")
    print(json.dumps(get_product_info("UNKNOWN-999"), indent=2))
