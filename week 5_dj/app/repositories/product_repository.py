from pymongo.collection import Collection
from app.models.product import Product
from app.repositories.base_repository import BaseRepository


class ProductRepository(BaseRepository):
    def __init__(self, collection: Collection):
        super().__init__(collection, Product)

    def find_by_category(self, category_id: str):
        return [
            Product.from_dict(doc)
            for doc in self.collection.find({"category_id": category_id})
        ] 