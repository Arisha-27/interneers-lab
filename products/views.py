from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import ProductSerializer
import uuid

IN_MEMORY_PRODUCTS = {}

class ProductPagination(PageNumberPagination):
    page_size = 2  
    page_size_query_param = 'size' 
    max_page_size = 100

def format_error_response(errors):
    """
    ADVANCED TASK 2: Responding with meaningful error messages.
    Wraps standard DRF errors in a professional error envelope.
    """
    return {
        "success": False,
        "error_code": "VALIDATION_FAILED",
        "message": "The provided data is invalid. Please check the 'details' object.",
        "details": errors
    }

class ProductViewSet(viewsets.ViewSet):
    """A ViewSet for routing CRUD operations to our in-memory dictionary."""

    def list(self, request):
        """Fetch a paginated list of all products."""

        products_list = list(IN_MEMORY_PRODUCTS.values())
        
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products_list, request, view=self)
        
        serializer = ProductSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)

    def create(self, request):
        """Create a new product with custom error formatting."""
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product_id = str(uuid.uuid4())
            product_data = serializer.validated_data
            product_data['id'] = product_id
            
            IN_MEMORY_PRODUCTS[product_id] = product_data
            return Response(product_data, status=status.HTTP_201_CREATED)
        
        return Response(format_error_response(serializer.errors), status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """Fetch a single product by its ID."""
        product = IN_MEMORY_PRODUCTS.get(pk)
        if product:
            return Response(product)
        return Response(
            {"success": False, "message": f"Product with ID '{pk}' not found."}, 
            status=status.HTTP_404_NOT_FOUND
        )

    def update(self, request, pk=None):
        """Update an existing product with custom error formatting."""
        if pk not in IN_MEMORY_PRODUCTS:
            return Response(
                {"success": False, "message": f"Product with ID '{pk}' not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product_data = serializer.validated_data
            product_data['id'] = pk 
            IN_MEMORY_PRODUCTS[pk] = product_data
            return Response(product_data)
            
        return Response(format_error_response(serializer.errors), status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """Delete a product from memory."""
        if pk in IN_MEMORY_PRODUCTS:
            del IN_MEMORY_PRODUCTS[pk]
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(
            {"success": False, "message": f"Product with ID '{pk}' not found."}, 
            status=status.HTTP_404_NOT_FOUND
        )