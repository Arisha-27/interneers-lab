from apps.products.models.category import ProductCategory
from apps.products.models.product import Product


class ProductCategoryService:

    @staticmethod
    def create_category(data):

        existing = ProductCategory.objects(
            title=data["title"]
        ).first()

        if existing:
            return existing

        return ProductCategory(**data).save()

    @staticmethod
    def get_all_categories():
        return ProductCategory.objects()

    @staticmethod
    def get_category(category_id):
        return ProductCategory.objects(id=category_id).first()

    @staticmethod
    def delete_category(category_id):
        category = ProductCategory.objects(id=category_id).first()

        if category:
            category.delete()

        return True

    @staticmethod
    def get_products_by_category(category_id):
        return Product.objects(category=category_id)