from typing import Optional
from app.models.product_category import ProductCategory
from app.repositories.product_category_repository import ProductCategoryRepository


class ProductCategoryService:
    def __init__(self, repository: ProductCategoryRepository):
        self.repository = repository

    def get_all_categories(self) -> list[ProductCategory]:
        return self.repository.find_all()

    def get_category_by_id(self, category_id: str) -> Optional[ProductCategory]:
        category = self.repository.find_by_id(category_id)
        if not category:
            raise ValueError(f"Category with id {category_id} not found")
        return category

    def create_category(self, name: str, description: str) -> ProductCategory:
        if not name or not name.strip():
            raise ValueError("Category name cannot be empty")
        category = ProductCategory(name=name.strip(), description=description.strip())
        return self.repository.create(category)

    def update_category(self, category_id: str, data: dict) -> bool:
        self.get_category_by_id(category_id)
        allowed_fields = {"name", "description"}
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        if not update_data:
            raise ValueError("No valid fields to update")
        return self.repository.update(category_id, update_data)

    def delete_category(self, category_id: str) -> bool:
        self.get_category_by_id(category_id)
        return self.repository.delete(category_id)