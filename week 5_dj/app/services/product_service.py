from typing import Optional
from app.models.product import Product
from app.repositories.product_repository import ProductRepository


class ProductService:
    def __init__(self, repository: ProductRepository):
        self.repository = repository

    def get_all_products(self) -> list[Product]:
        return self.repository.find_all()

    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        product = self.repository.find_by_id(product_id)
        if not product:
            raise ValueError(f"Product with id {product_id} not found")
        return product

    def get_products_by_category(self, category_id: str) -> list[Product]:
        return self.repository.find_by_category(category_id)

    def create_product(
        self, name: str, price: float, category_id: str, stock: int
    ) -> Product:
        if not name or not name.strip():
            raise ValueError("Product name cannot be empty")
        if price < 0:
            raise ValueError("Price cannot be negative")
        if stock < 0:
            raise ValueError("Stock cannot be negative")
        product = Product(
            name=name.strip(),
            price=price,
            category_id=category_id,
            stock=stock,
        )
        return self.repository.create(product)

    def update_product(self, product_id: str, data: dict) -> bool:
        self.get_product_by_id(product_id)
        allowed_fields = {"name", "price", "stock", "category_id"}
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        if not update_data:
            raise ValueError("No valid fields to update")
        if "price" in update_data and update_data["price"] < 0:
            raise ValueError("Price cannot be negative")
        return self.repository.update(product_id, update_data)

    def delete_product(self, product_id: str) -> bool:
        self.get_product_by_id(product_id)
        return self.repository.delete(product_id)