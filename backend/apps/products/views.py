from rest_framework import generics
from .models import Brand, Product, ProductImage
from .serializers import (
    BrandSerializer,
    ProductSerializer,
    ProductImageUploadSerializer,
)


# ------- Brand Views -------
class BrandListView(generics.ListCreateAPIView):  # Supports GET and POST
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    # permission_classes = [IsAuthenticated, IsAdminGroupUser]  # Protect create


class BrandDetailView(generics.RetrieveAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = "slug"


# ------- Product Views -------
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"


# ------- Product Image View (Optional Upload) -------
class ProductImageBulkUploadView(generics.CreateAPIView):
    serializer_class = ProductImageUploadSerializer
    # permission_classes = [IsAuthenticated, IsAdminGroupUser]
