from apps.products.models.category import ProductCategory


def seed_categories():

    categories = [
        {"title": "Food", "description": "All food items"},
        {"title": "Electronics", "description": "Electronic devices"},
        {"title": "Clothing", "description": "Apparel and fashion"},
        {"title": "Kitchen Essentials", "description": "Kitchen items"}
    ]

    for c in categories:
        existing = ProductCategory.objects(title=c["title"]).first()

        if not existing:
            ProductCategory(**c).save()