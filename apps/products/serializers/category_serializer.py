from rest_framework import serializers


class CategorySerializer(serializers.Serializer):

    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)