from typing import Optional
from pymongo.collection import Collection
from app.models.product_category import ProductCategory


class ProductCategoryRepository:
    def __init__(self, collection: Collection):
        self.collection = collection

    def find_all(self) -> list[ProductCategory]:
        return [ProductCategory.from_dict(doc) for doc in self.collection.find()]

    def find_by_id(self, category_id: str) -> Optional[ProductCategory]:
        from bson import ObjectId
        doc = self.collection.find_one({"_id": ObjectId(category_id)})
        return ProductCategory.from_dict(doc) if doc else None

    def create(self, category: ProductCategory) -> ProductCategory:
        result = self.collection.insert_one(category.to_dict())
        category.id = str(result.inserted_id)
        return category

    def update(self, category_id: str, data: dict) -> bool:
        from bson import ObjectId
        result = self.collection.update_one(
            {"_id": ObjectId(category_id)}, {"$set": data}
        )
        return result.modified_count > 0

    def delete(self, category_id: str) -> bool:
        from bson import ObjectId
        result = self.collection.delete_one({"_id": ObjectId(category_id)})
        return result.deleted_count > 0