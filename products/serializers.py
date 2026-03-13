from rest_framework import serializers
from decimal import Decimal

class ProductSerializer(serializers.Serializer):
    
    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, required=False)
    category = serializers.CharField(max_length=100)
    brand = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.00'))
    quantity = serializers.IntegerField(min_value=0, default=0)

    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Product name must be at least 3 characters long.")
        return value

    def validate_category(self, value):
        return value.title()

    def validate(self, data):
        price = data.get('price', 0)
        description = data.get('description', '')

        if price >= 500 and not description.strip():
            raise serializers.ValidationError({
                "description": "A detailed description is required for premium products priced at $500 or more."
            })

        category = data.get('category', '').lower()
        quantity = data.get('quantity', 0)
        if category == 'clearance' and quantity == 0:
            raise serializers.ValidationError({
                "quantity": "Clearance items must have a starting quantity greater than zero."
            })

        return data