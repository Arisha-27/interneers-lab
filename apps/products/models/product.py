from mongoengine import Document, StringField, FloatField, ReferenceField
from .category import ProductCategory


class Product(Document):

    name = StringField(required=True)

    price = FloatField(required=True)

    brand = StringField(required=True)

    category = ReferenceField(ProductCategory)

    meta = {
        "collection": "products"
    }