from pymongo.collection import Collection
from app.models.product_category import ProductCategory
from app.repositories.base_repository import BaseRepository


class ProductCategoryRepository(BaseRepository):
    def __init__(self, collection: Collection):
        super().__init__(collection, ProductCategory)