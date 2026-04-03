from mongoengine import Document, StringField, DateTimeField
import datetime


class ProductCategory(Document):

    title = StringField(required=True, unique=True)
    description = StringField()

    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        "collection": "product_categories"
    }