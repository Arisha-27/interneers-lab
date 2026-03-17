from apps.products.models.product import Product
from apps.products.models.category import ProductCategory


def migrate_products():

    print("Starting migration...")

    # Create default category
    default_category = ProductCategory.objects(
        title="Uncategorized"
    ).first()

    if not default_category:
        default_category = ProductCategory(
            title="Uncategorized",
            description="Default category for old products"
        ).save()

    # Find products without category
    products = Product.objects(category=None)

    count = 0

    for p in products:
        p.category = default_category
        p.save()
        count += 1

    print(f"Migration completed. Updated {count} products.")