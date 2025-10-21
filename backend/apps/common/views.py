from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# from rest_framework.parsers import MultiPartParser


class CategoryAPIView(generics.ListCreateAPIView):
    """An endpoint for creating and listing categories"""

    # permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class RetrieveUpdateDestroyCategoryAPIView(generics.RetrieveUpdateDestroyAPIView):
    """An endpoint for retrieving, updating and delete a category"""

    # permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    lookup_field = "id"
