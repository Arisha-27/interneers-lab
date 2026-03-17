from bson import ObjectId
from apps.products.models.product import Product


def filter_products(filters):

    query = {}

    # Filter by brand
    if "brand" in filters and filters["brand"]:
        query["brand"] = filters["brand"]

    # Filter by categories (LIST)
    if "categories" in filters and filters["categories"]:
        try:
            category_ids = [
                ObjectId(cat_id) for cat_id in filters["categories"]
            ]
            query["category__in"] = category_ids
        except Exception:
            raise ValueError("Invalid category IDs")

    # Price filters
    if "min_price" in filters:
        query["price__gte"] = filters["min_price"]

    if "max_price" in filters:
        query["price__lte"] = filters["max_price"]

    return Product.objects(**query)