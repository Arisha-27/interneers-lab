from apps.products.models.product import Product
from apps.products.models.category import ProductCategory


class ProductService:

    @staticmethod
    def create_product(data):
        return Product(**data).save()

    @staticmethod
    def add_product_to_category(product_id, category_id):

        product = Product.objects(id=product_id).first()
        category = ProductCategory.objects(id=category_id).first()

        if not product or not category:
            return None

        product.category = category
        product.save()

        return product

    @staticmethod
    def remove_product_from_category(product_id):

        product = Product.objects(id=product_id).first()

        if not product:
            return None

        product.category = None
        product.save()

        return product

    @staticmethod
    def get_all_products():
        return Product.objects()