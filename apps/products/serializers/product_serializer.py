from rest_framework import serializers


class ProductSerializer(serializers.Serializer):

    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    price = serializers.FloatField()
    brand = serializers.CharField(required=True)
    category = serializers.CharField(required=False)

    def validate_brand(self, value):

        if not value or value.strip() == "":
            raise serializers.ValidationError(
                "Brand is required and cannot be empty"
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Brand name too short"
            )

        return value
    def validate_price(self, value):

      if value <= 0:
          raise serializers.ValidationError(
              "Price must be greater than 0"
          )

      return value