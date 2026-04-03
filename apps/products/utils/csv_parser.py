import csv
from apps.products.services.product_service import ProductService


def parse_products_csv(file):

    decoded = file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(decoded)

    products = []

    for row in reader:
        product = ProductService.create_product({
            "name": row["name"],
            "price": float(row["price"]),
            "brand": row["brand"]
        })
        products.append(product)

    return products