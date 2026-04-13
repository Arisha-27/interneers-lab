from app.models.product_category import ProductCategory
from app.models.product import Product


SEED_CATEGORIES = [
    {"name": "Electronics", "description": "Electronic gadgets and devices"},
    {"name": "Clothing", "description": "Apparel and fashion items"},
    {"name": "Books", "description": "Fiction and non-fiction books"},
]

SEED_PRODUCTS = [
    {"name": "Laptop", "price": 999.99, "stock": 10},
    {"name": "T-Shirt", "price": 19.99, "stock": 100},
    {"name": "Python Crash Course", "price": 39.99, "stock": 50},
]


def seed_categories(db) -> list[str]:
    """Insert seed categories into the given db. Returns list of inserted IDs."""
    collection = db["categories"]
    inserted_ids = []
    for cat_data in SEED_CATEGORIES:
        result = collection.insert_one(cat_data.copy())
        inserted_ids.append(str(result.inserted_id))
    return inserted_ids


def seed_products(db, category_ids: list[str]) -> list[str]:
    """Insert seed products linked to the given category IDs."""
    collection = db["products"]
    inserted_ids = []
    for i, prod_data in enumerate(SEED_PRODUCTS):
        data = prod_data.copy()
        data["category_id"] = category_ids[i % len(category_ids)]
        result = collection.insert_one(data)
        inserted_ids.append(str(result.inserted_id))
    return inserted_ids


def seed_all(db) -> dict:
    """Seed everything. Returns a dict of inserted IDs for use in tests."""
    category_ids = seed_categories(db)
    product_ids = seed_products(db, category_ids)
    return {"category_ids": category_ids, "product_ids": product_ids}