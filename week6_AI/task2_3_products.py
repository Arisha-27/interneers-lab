from pydantic import ValidationError
from models import Product
from gemini_service import generate_products
from mongo_service import save_products, count_products

def validate_products(raw_products: list[dict]) -> tuple[list[Product], list[dict]]:
    valid  : list[Product] = []
    failed : list[dict]    = []

    for i, item in enumerate(raw_products):
        try:
            product = Product(**item)   
            valid.append(product)
        except ValidationError as e:
            
            print(f"  ❌ Product #{i+1} FAILED: '{item.get('name', 'unknown')}'")
            for error in e.errors():
                field = error["loc"][0]
                msg   = error["msg"]
                got   = item.get(str(field), "missing")
                print(f"     Field '{field}': {msg}  (got: {got!r})")
            failed.append({"raw": item, "errors": e.errors()})

    return valid, failed

def print_product_table(products: list[Product], limit: int = 10) -> None:
    """Print a formatted preview table of validated products."""
    print(f"\n  {'NAME':<30} {'CATEGORY':<16} {'PRICE':>8} {'QTY':>5}  SKU")
    print(f"  {'─'*30} {'─'*16} {'─'*8} {'─'*5}  {'─'*9}")
    for p in products[:limit]:
        print(
            f"  {p.name:<30.29} {p.category:<16.15} "
            f"${p.price:>7.2f} {p.quantity:>5}  {p.sku or 'N/A'}"
        )
    if len(products) > limit:
        print(f"  ... and {len(products) - limit} more")

def main() -> None:
    print("=" * 60)
    print("  TASK 2 + 3: Generate 50 Products & Validate with Pydantic")
    print("=" * 60)

    print("\n📡 STEP 1: Generating 50 products via Gemini...\n")
    raw_products = generate_products(count=10)
    print(f"  📦 Gemini returned {len(raw_products)} raw product dicts")

    print("\n🔍 STEP 2: Validating with Pydantic...\n")
    valid_products, failed_products = validate_products(raw_products)

    print(f"\n  ✅ Valid   : {len(valid_products)}")
    print(f"  ❌ Invalid : {len(failed_products)}")
    print(f"  📊 Pass rate: {len(valid_products)/len(raw_products)*100:.1f}%")

    print(f"\n📋 STEP 3: Preview of validated products:")
    print_product_table(valid_products)

    print(f"\n💾 STEP 4: Saving {len(valid_products)} valid products to MongoDB...")
    inserted = save_products(valid_products)
    total    = count_products()
    print(f"  ✅ Inserted: {inserted} documents")
    print(f"  📊 Total products in DB now: {total}")

    print("\n🎉 Tasks 2 + 3 complete!")


if __name__ == "__main__":
    main()