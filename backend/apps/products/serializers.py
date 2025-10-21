from rest_framework import serializers
from .models import Brand, Product, ProductImage


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "slug"]


class ProductImageUploadSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    images = serializers.ListField(child=serializers.ImageField(), write_only=True)
    alt_text = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        product = validated_data["product"]
        images = validated_data["images"]
        alt_text = validated_data.get("alt_text", "")

        image_instances = [
            ProductImage(product=product, image=image, alt_text=alt_text)
            for image in images
        ]
        return ProductImage.objects.bulk_create(image_instances)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_final_price(self, obj):
        return obj.get_price()
