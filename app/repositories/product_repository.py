from app.models.product_model import Product
from typing import Optional, List
from datetime import datetime


class ProductRepository:

    @staticmethod
    def create(data: dict) -> Product:
        product = Product(**data)
        product.save()
        return product

    @staticmethod
    def get_all(
        skip: int = 0,
        limit: int = 10,
        sort: str = "-created_at",
        updated_after: Optional[datetime] = None,
        created_from: Optional[datetime] = None,
        created_to: Optional[datetime] = None,
    ) -> List[Product]:

        query = Product.objects

        if updated_after:
            query = query.filter(updated_at__gt=updated_after)

        if created_from:
            query = query.filter(created_at__gte=created_from)

        if created_to:
            query = query.filter(created_at__lte=created_to)

        return query.order_by(sort).skip(skip).limit(limit)

    @staticmethod
    def get_by_id(product_id: str) -> Optional[Product]:
        return Product.objects(id=product_id).first()

    @staticmethod
    def update(product_id: str, data: dict) -> Optional[Product]:
        product = Product.objects(id=product_id).first()
        if not product:
            return None

        for key, value in data.items():
            setattr(product, key, value)

        product.save()
        return product

    @staticmethod
    def delete(product_id: str) -> bool:
        product = Product.objects(id=product_id).first()
        if not product:
            return False

        product.delete()
        return True