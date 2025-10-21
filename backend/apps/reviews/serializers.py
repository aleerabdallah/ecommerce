from .models import ProductReview
from rest_framework import serializers


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # show username

    class Meta:
        model = ProductReview
        fields = [
            "id",
            "product",
            "user",
            "rating",
            "comment",
            "created_at",
            "approved",
        ]
        read_only_fields = ["user", "approved", "created_at"]
