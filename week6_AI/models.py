from pydantic import BaseModel, Field, ValidationError, field_validator
from typing import Literal, Optional
from datetime import datetime

class Product(BaseModel):
    """
    Represents a single toy store product.
    Every field has a type, and some have extra constraints via Field().
    """

    name: str = Field(
        ...,                   
        min_length=2,
        max_length=100,
        description="Product name"
    )

    category: Literal[
        "Action Figures", "Puzzles", "Board Games", "Dolls",
        "Educational", "Outdoor", "Arts & Crafts", "Vehicles",
        "Stuffed Animals", "STEM Kits", "Sports", "Other"
    ]

    price: float = Field(..., gt=0, description="Price in USD")

    quantity: int = Field(..., ge=0, description="Units in stock")

    description: Optional[str] = Field(None, max_length=300)

    sku: Optional[str] = Field(None, description="Format: TOY-XXXX")


    @field_validator("price")
    @classmethod
    def round_price_to_cents(cls, v: float) -> float:
        return round(v, 2)

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return v.strip().title()

    @field_validator("sku")
    @classmethod
    def validate_sku_format(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return v.strip().upper()

class StockEvent(BaseModel):

    event_id: str = Field(..., description="Format: EVT-XXXX")

    product_name: str = Field(..., min_length=2)

    event_type: Literal[
        "Expected Delivery",
        "Scheduled Restock",
        "Seasonal Spike",
        "Clearance Sale",
        "Supplier Delay",
        "Stock Expiry",
    ]

    expected_date: str = Field(..., description="ISO date YYYY-MM-DD")

    quantity_change: int = Field(..., description="+incoming / -outgoing")

    notes: str = Field(..., max_length=200)

    @field_validator("expected_date")
    @classmethod
    def validate_date_format(cls, v: str) -> str:
       
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError(
                f"Date '{v}' must be in YYYY-MM-DD format (e.g. 2025-02-01)"
            )
        return v

    @field_validator("event_id")
    @classmethod
    def normalize_event_id(cls, v: str) -> str:
        return v.strip().upper()