from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ProductCategory:
    name: str
    description: str
    id: Optional[str] = field(default=None)

    def to_dict(self) -> dict:
        result = {"name": self.name, "description": self.description}
        if self.id:
            result["_id"] = self.id
        return result

    @staticmethod
    def from_dict(data: dict) -> "ProductCategory":
        return ProductCategory(
            id=str(data.get("_id", "")),
            name=data["name"],
            description=data.get("description", ""),
        )