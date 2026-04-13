from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Optional      

import mongoengine as me         
import pandas as pd               
from dotenv import load_dotenv

load_dotenv()

CATEGORY_CHOICES = (
    "Electronics",
    "Clothing",
    "Food & Beverage",
    "Furniture",
    "Books",
    "Toys & Games",
    "Health & Beauty",
    "Sports & Outdoors",
    "Automotive",
    "Other",
)

_GLOBAL_THRESHOLD = int(os.getenv("LOW_STOCK_THRESHOLD", 10))

class Product(me.Document):

    name = me.StringField(
        required=True,    
        max_length=120    
    )

    sku = me.StringField(
        required=True,
        unique=True,      
        max_length=40
    )

    category = me.StringField(
        required=True,
        choices=CATEGORY_CHOICES,   
        default="Other"            
    )

    quantity = me.IntField(
        required=True,
        min_value=0,      
        default=0
    )

    price = me.FloatField(
        required=True,
        min_value=0.0     
    )

    low_stock_threshold = me.IntField(
        default=_GLOBAL_THRESHOLD,  
        min_value=0
    )

    supplier    = me.StringField(max_length=120, default="")
    description = me.StringField(max_length=500, default="")

    created_at = me.DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = me.DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        "collection": "products",    
        "ordering": ["name"],        
        "indexes": ["sku", "category"],  
    }

    @property
    def is_low_stock(self) -> bool:
        return self.quantity <= self.low_stock_threshold

    @property
    def total_value(self) -> float:
        """How much all units of this product are worth combined."""
        return round(self.quantity * self.price, 2)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return super().save(*args, **kwargs)

    @classmethod
    def add_product(
        cls,             
        *,               
        name: str,
        sku: str,
        category: str,
        quantity: int,
        price: float,
        supplier: str = "",
        description: str = "",
        low_stock_threshold: Optional[int] = None,
    ) -> "Product":

        threshold = low_stock_threshold if low_stock_threshold is not None else _GLOBAL_THRESHOLD

        product = cls.objects(sku=sku).modify(
            upsert=True,
            new=True,
            set__name=name,
            set__category=category,
            set__quantity=quantity,
            set__price=price,
            set__supplier=supplier,
            set__description=description,
            set__low_stock_threshold=threshold,
            set__updated_at=datetime.now(timezone.utc),
        )
        return product


    @classmethod
    def remove_product(cls, sku: str) -> bool:
        result = cls.objects(sku=sku).delete()
        return result > 0


    @classmethod
    def get_all_as_dataframe(cls) -> pd.DataFrame:
      
        docs = cls.objects.all()

        if not docs:
            return pd.DataFrame()

        rows = [
            {
                "Name":            p.name,
                "SKU":             p.sku,
                "Category":        p.category,
                "Quantity":        p.quantity,
                "Price (₹)":       p.price,
                "Threshold":       p.low_stock_threshold,
                "Low Stock":       p.is_low_stock,     
                "Total Value (₹)": p.total_value,        
                "Supplier":        p.supplier,
                "Created At":      p.created_at.strftime("%Y-%m-%d") if p.created_at else "",
            }
            for p in docs  
        ]
        return pd.DataFrame(rows)


    @classmethod
    def get_low_stock_items(cls) -> list["Product"]:
        return [p for p in cls.objects.all() if p.is_low_stock]


    @classmethod
    def filter_by_category(cls, category: str):
        return cls.objects(category=category)