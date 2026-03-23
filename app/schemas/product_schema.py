from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)

class ProductResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    price: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)