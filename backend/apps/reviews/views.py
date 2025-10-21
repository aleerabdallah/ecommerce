from rest_framework import generics, permissions

from .models import ProductReview

from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get("product")
        qs = ProductReview.objects.filter(approved=True)
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs.order_by("-created_at")

    def perform_create(self, serializer):
        # Reviews start unapproved
        serializer.save(user=self.request.user, approved=False)


class ReviewModerationView(generics.UpdateAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ReviewSerializer
    # permission_classes = [permissions.IsAdminUser]
