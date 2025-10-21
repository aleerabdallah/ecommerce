from django.urls import path
from . import views

urlpatterns = [
    # Brand Endpoints
    path("brands/", views.BrandListView.as_view(), name="brand-list"),
    path("brands/<slug:slug>/", views.BrandDetailView.as_view(), name="brand-detail"),
    # Product Endpoints
    path("", views.ProductListCreateView.as_view(), name="product-list"),
    path("<slug:slug>/", views.ProductDetailView.as_view(), name="product-detail"),
    # Product Image Upload (Optional)
    path(
        "product-images/bulk-upload/",
        views.ProductImageBulkUploadView.as_view(),
        name="productimage-bulk-upload",
    ),
]
