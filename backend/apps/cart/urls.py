from django.urls import path
from .views import (
    CartDetailView,
    AddToCartView,
    UpdateCartItemView,
    RemoveCartItemView,
    ClearCartView,
)

urlpatterns = [
    path("", CartDetailView.as_view(), name="cart-detail"),
    path("add/", AddToCartView.as_view(), name="add-to-cart"),
    path(
        "item/<int:pk>/update/", UpdateCartItemView.as_view(), name="update-cart-item"
    ),
    path(
        "item/<int:pk>/remove/", RemoveCartItemView.as_view(), name="remove-cart-item"
    ),
    path("clear/", ClearCartView.as_view(), name="cart-clear"),
]
