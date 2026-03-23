from app.repositories.product_repository import ProductRepository
from typing import Optional
from datetime import datetime


class ProductService:

    @staticmethod
    def create_product(data: dict):
        return ProductRepository.create(data)

    @staticmethod
    def get_products(
        skip: int = 0,
        limit: int = 10,
        sort: str = "-created_at",
        updated_after: Optional[datetime] = None,
        created_from: Optional[datetime] = None,
        created_to: Optional[datetime] = None,
    ):
        return ProductRepository.get_all(
            skip=skip,
            limit=limit,
            sort=sort,
            updated_after=updated_after,
            created_from=created_from,
            created_to=created_to,
        )

    @staticmethod
    def get_product(product_id: str):
        product = ProductRepository.get_by_id(product_id)
        if not product:
            raise ValueError("Product not found")
        return product

    @staticmethod
    def update_product(product_id: str, data: dict):
        product = ProductRepository.update(product_id, data)
        if not product:
            raise ValueError("Product not found")
        return product

    @staticmethod
    def delete_product(product_id: str):
        deleted = ProductRepository.delete(product_id)
        if not deleted:
            raise ValueError("Product not found")