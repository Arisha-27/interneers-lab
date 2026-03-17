from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.products.services.category_service import ProductCategoryService
from apps.products.serializers.category_serializer import CategorySerializer


class CategoryAPI(APIView):

    def get(self, request):
        categories = ProductCategoryService.get_all_categories()

        data = [
            {
                "id": str(c.id),
                "title": c.title,
                "description": c.description
            }
            for c in categories
        ]

        return Response(data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = ProductCategoryService.create_category(
            serializer.validated_data
        )

        return Response(
            {
                "id": str(category.id),
                "title": category.title
            },
            status=status.HTTP_201_CREATED
        )

class CategoryProductsAPI(APIView):

    def get(self, request, category_id):

        products = ProductCategoryService.get_products_by_category(category_id)

        data = [
            {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "brand": p.brand
            }
            for p in products
        ]

        return Response(data)