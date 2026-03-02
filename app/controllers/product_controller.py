from fastapi import APIRouter, HTTPException
from app.schemas.product_schema import ProductCreate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])

def serialize(product):
    return ProductResponse(
        id=str(product.id),
        name=product.name,
        description=product.description,
        price=product.price,
        created_at=product.created_at,
        updated_at=product.updated_at
    )

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate):
    new_product = ProductService.create_product(product.model_dump())
    return serialize(new_product)

from fastapi import Query
from datetime import datetime
from typing import Optional


@router.get("/", response_model=list[ProductResponse])
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

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    try:
        product = ProductService.get_product(product_id)
        return serialize(product)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, product: ProductCreate):
    try:
        updated = ProductService.update_product(product_id, product.model_dump())
        return serialize(updated)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{product_id}")
def delete_product(product_id: str):
    try:
        ProductService.delete_product(product_id)
        return {"message": "Product deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))