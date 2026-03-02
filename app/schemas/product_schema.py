from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: Optional[str]
    price: float = Field(..., gt=0)

class ProductResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    created_at: datetime
    updated_at: datetime