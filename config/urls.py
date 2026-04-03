from django.urls import path, include
from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "API Running"})


urlpatterns = [
    path('', home),
    path('api/', include('apps.products.urls')),
]