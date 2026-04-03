from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Product:
    name: str
    price: float
    category_id: str
    stock: int
    id: Optional[str] = field(default=None)

    def to_dict(self) -> dict:
        result = {
            "name": self.name,
            "price": self.price,
            "category_id": self.category_id,
            "stock": self.stock,
        }
        if self.id:
            result["_id"] = self.id
        return result

    @staticmethod
    def from_dict(data: dict) -> "Product":
        return Product(
            id=str(data.get("_id", "")),
            name=data["name"],
            price=data["price"],
            category_id=data.get("category_id", ""),
            stock=data.get("stock", 0),
        )