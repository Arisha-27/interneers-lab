from django.urls import path

from apps.products.views.category_views import (
    CategoryAPI,
    CategoryProductsAPI
)

from apps.products.views.product_views import (
    ProductAPI,
    AddProductToCategoryAPI,
    RemoveProductFromCategoryAPI,
    ProductFilterAPI,
    BulkProductUploadAPI
)

urlpatterns = [
    # Category APIs
    path("categories/", CategoryAPI.as_view()),
    path("categories/<str:category_id>/", CategoryAPI.as_view()),
    path("categories/<str:category_id>/products/", CategoryProductsAPI.as_view()),

    # Product APIs
    path("products/", ProductAPI.as_view()),
    path("products/add-to-category/", AddProductToCategoryAPI.as_view()),
    path("products/remove-from-category/", RemoveProductFromCategoryAPI.as_view()),

    # Advanced
    path("products/filter/", ProductFilterAPI.as_view()),
    path("products/bulk-upload/", BulkProductUploadAPI.as_view()),
]