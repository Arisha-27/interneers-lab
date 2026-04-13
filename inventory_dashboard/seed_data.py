"""
seed_data.py
Run this ONCE to fill your database with sample products.
python seed_data.py
"""

from utils.db import get_connection
from models.product import Product, CATEGORY_CHOICES

get_connection()

SAMPLE_PRODUCTS = [
    dict(name="Wireless Bluetooth Headphones", sku="ELEC-001", category="Electronics",
         quantity=45, price=2499.00, supplier="SoundMax India", low_stock_threshold=10),

    dict(name="USB-C Charging Cable 2m", sku="ELEC-002", category="Electronics",
         quantity=8, price=349.00, supplier="CablePro", low_stock_threshold=15),

    dict(name="Mechanical Keyboard TKL", sku="ELEC-003", category="Electronics",
         quantity=12, price=3999.00, supplier="KeyCraft", low_stock_threshold=5),

    dict(name="27-inch 4K Monitor", sku="ELEC-004", category="Electronics",
         quantity=3, price=28999.00, supplier="ViewTech", low_stock_threshold=5),

    dict(name="Men's Cotton Polo Shirt", sku="CLTH-001", category="Clothing",
         quantity=60, price=799.00, supplier="FabIndia", low_stock_threshold=20),

    dict(name="Women's Kurta Set Navy", sku="CLTH-002", category="Clothing",
         quantity=5, price=1299.00, supplier="EthnicWear Co.", low_stock_threshold=10),

    dict(name="Organic Green Tea 100 Bags", sku="FOOD-001", category="Food & Beverage",
         quantity=7, price=299.00, supplier="TeaGarden", low_stock_threshold=15),

    dict(name="Multigrain Cookies 500g", sku="FOOD-002", category="Food & Beverage",
         quantity=50, price=149.00, supplier="BakeRight", low_stock_threshold=20),

    dict(name="Ergonomic Office Chair", sku="FURN-001", category="Furniture",
         quantity=4, price=12999.00, supplier="ComfortZone", low_stock_threshold=3),

    dict(name="Solid Wood Coffee Table", sku="FURN-002", category="Furniture",
         quantity=2, price=8499.00, supplier="WoodWorks", low_stock_threshold=2),

    dict(name="Clean Code – Robert C. Martin", sku="BOOK-001", category="Books",
         quantity=25, price=699.00, supplier="Pearson India", low_stock_threshold=5),

    dict(name="Atomic Habits – James Clear", sku="BOOK-002", category="Books",
         quantity=3, price=499.00, supplier="Penguin India", low_stock_threshold=5),

    dict(name="Vitamin C Serum 30ml", sku="HLTH-001", category="Health & Beauty",
         quantity=6, price=549.00, supplier="GlowLab", low_stock_threshold=10),
 
    dict(name="Yoga Mat Non-Slip 6mm", sku="SPRT-001", category="Sports & Outdoors",
         quantity=20, price=999.00, supplier="FitLife", low_stock_threshold=10),

    dict(name="Resistance Band Set", sku="SPRT-002", category="Sports & Outdoors",
         quantity=2, price=599.00, supplier="FlexFit", low_stock_threshold=5),
 
    dict(name="Car Dash Cam Full HD", sku="AUTO-001", category="Automotive",
         quantity=11, price=3499.00, supplier="DriveSafe", low_stock_threshold=5),

    dict(name="Tyre Puncture Repair Kit", sku="AUTO-002", category="Automotive",
         quantity=35, price=249.00, supplier="PitStop", low_stock_threshold=10),

    dict(name="LEGO Classic Brick Box 484pcs", sku="TOYS-001", category="Toys & Games",
         quantity=8, price=2299.00, supplier="LEGO India", low_stock_threshold=5),
]


def seed():
    inserted = 0
    updated  = 0

    for data in SAMPLE_PRODUCTS:
        existing = Product.objects(sku=data["sku"]).first()
        Product.add_product(**data)

        if existing:
            updated += 1
        else:
            inserted += 1

    print(f"\n Done: {inserted} inserted, {updated} updated")
    print(f"   Total in DB: {Product.objects.count()}\n")

if __name__ == "__main__":
    seed()