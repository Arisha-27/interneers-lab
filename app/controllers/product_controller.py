from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime
from mongoengine.errors import ValidationError

from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from app.services.product_service import ProductService
from app.constants.product_paths import ProductPaths


router = APIRouter(prefix="/products", tags=["Products"])


def serialize(product):
    return ProductResponse(
        id=str(product.id),
        name=product.name,
        description=product.description,
        price=product.price,
        created_at=product.created_at,
        updated_at=product.updated_at,
    )


@router.post(ProductPaths.ROOT, response_model=ProductResponse)
def create_product(product: ProductCreate):
    new_product = ProductService.create_product(product.model_dump())
    return serialize(new_product)


@router.get(ProductPaths.ROOT, response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 10,
    sort: str = "-created_at",
    updated_after: Optional[datetime] = Query(None),
    created_from: Optional[datetime] = Query(None),
    created_to: Optional[datetime] = Query(None),
):
    products = ProductService.get_products(
        skip=skip,
        limit=limit,
        sort=sort,
        updated_after=updated_after,
        created_from=created_from,
        created_to=created_to,
    )
    return [serialize(p) for p in products]


@router.get(ProductPaths.BY_ID, response_model=ProductResponse)
def get_product(product_id: str):
    try:
        product = ProductService.get_product(product_id)
        return serialize(product)
    except (ValueError, ValidationError):
        raise HTTPException(status_code=404, detail="Product not found")


@router.put(ProductPaths.BY_ID, response_model=ProductResponse)
def update_product(product_id: str, product: ProductUpdate):
    try:
        updated = ProductService.update_product(
            product_id,
            product.model_dump(exclude_unset=True),
        )
        return serialize(updated)
    except (ValueError, ValidationError):
        raise HTTPException(status_code=404, detail="Product not found")


@router.delete(ProductPaths.BY_ID)
def delete_product(product_id: str):
    try:
        ProductService.delete_product(product_id)
        return {"message": "Product deleted successfully"}
    except (ValueError, ValidationError):
        raise HTTPException(status_code=404, detail="Product not found")