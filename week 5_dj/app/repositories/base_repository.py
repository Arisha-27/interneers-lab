from typing import Type, TypeVar, Optional, List
from pymongo.collection import Collection
from bson import ObjectId

T = TypeVar("T")


class BaseRepository:
    def __init__(self, collection: Collection, model: Type[T]):
        self.collection = collection
        self.model = model

    def find_all(self) -> List[T]:
        return [self.model.from_dict(doc) for doc in self.collection.find()]

    def find_by_id(self, obj_id: str) -> Optional[T]:
        doc = self.collection.find_one({"_id": ObjectId(obj_id)})
        return self.model.from_dict(doc) if doc else None

    def create(self, obj: T) -> T:
        result = self.collection.insert_one(obj.to_dict())
        obj.id = str(result.inserted_id)
        return obj

    def update(self, obj_id: str, data: dict) -> bool:
        result = self.collection.update_one(
            {"_id": ObjectId(obj_id)}, {"$set": data}
        )
        return result.modified_count > 0

    def delete(self, obj_id: str) -> bool:
        result = self.collection.delete_one({"_id": ObjectId(obj_id)})
        return result.deleted_count > 0