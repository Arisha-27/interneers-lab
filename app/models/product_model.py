from mongoengine import (
    Document,
    StringField,
    FloatField,
    DateTimeField
)
from datetime import datetime

class Product(Document):
    name = StringField(required=True, max_length=200)
    description = StringField()
    price = FloatField(required=True, min_value=0)

    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "products",
        "indexes": [
            "-created_at",
            "-updated_at"
        ]
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Product, self).save(*args, **kwargs)