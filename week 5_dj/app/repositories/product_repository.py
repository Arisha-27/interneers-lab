from typing import Optional
from pymongo.collection import Collection
from app.models.product import Product


class ProductRepository:
    def __init__(self, collection: Collection):
        self.collection = collection

    def find_all(self) -> list[Product]:
        return [Product.from_dict(doc) for doc in self.collection.find()]

    def find_by_id(self, product_id: str) -> Optional[Product]:
        from bson import ObjectId
        doc = self.collection.find_one({"_id": ObjectId(product_id)})
        return Product.from_dict(doc) if doc else None

    def find_by_category(self, category_id: str) -> list[Product]:
        return [
            Product.from_dict(doc)
            for doc in self.collection.find({"category_id": category_id})
        ]

    def create(self, product: Product) -> Product:
        result = self.collection.insert_one(product.to_dict())
        product.id = str(result.inserted_id)
        return product

    def update(self, product_id: str, data: dict) -> bool:
        from bson import ObjectId
        result = self.collection.update_one(
            {"_id": ObjectId(product_id)}, {"$set": data}
        )
        return result.modified_count > 0

    def delete(self, product_id: str) -> bool:
        from bson import ObjectId
        result = self.collection.delete_one({"_id": ObjectId(product_id)})
        return result.deleted_count > 0