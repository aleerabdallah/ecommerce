from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "active",
        ]
        read_only = ["id", "active"]


class UUIDTokenSerializer(serializers.Serializer):
    token = serializers.UUIDField(format="hex")

