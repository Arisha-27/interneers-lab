from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.products.services.product_service import ProductService
from apps.products.serializers.product_serializer import ProductSerializer
from apps.products.utils.csv_parser import parse_products_csv
from apps.products.utils.filters import filter_products

class ProductAPI(APIView):

    def get(self, request):

        products = ProductService.get_all_products()

        data = [
            {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "brand": p.brand,
                "category": str(p.category.id) if p.category else None
            }
            for p in products
        ]

        return Response(data)

    def post(self, request):

        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = ProductService.create_product(
            serializer.validated_data
        )

        return Response(
            {
                "id": str(product.id),
                "name": product.name
            },
            status=status.HTTP_201_CREATED
        )
class AddProductToCategoryAPI(APIView):

    def post(self, request):

        product_id = request.data.get("product_id")
        category_id = request.data.get("category_id")

        product = ProductService.add_product_to_category(
            product_id, category_id
        )

        if not product:
            return Response(
                {"error": "Invalid product or category"},
                status=400
            )

        return Response({"message": "Product added to category"})
class RemoveProductFromCategoryAPI(APIView):

    def post(self, request):

        product_id = request.data.get("product_id")

        product = ProductService.remove_product_from_category(product_id)

        if not product:
            return Response(
                {"error": "Invalid product"},
                status=400
            )

        return Response({"message": "Product removed from category"})
class BulkProductUploadAPI(APIView):

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response({"error": "CSV file required"}, status=400)

        products = parse_products_csv(file)

        return Response({
            "created": len(products)
        })
class ProductFilterAPI(APIView):

    def post(self, request):

        try:
            products = filter_products(request.data)

            data = [
                {
                    "id": str(p.id),
                    "name": p.name,
                    "price": p.price,
                    "brand": p.brand,
                    "category": str(p.category.id) if p.category else None
                }
                for p in products
            ]

            return Response(data)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )