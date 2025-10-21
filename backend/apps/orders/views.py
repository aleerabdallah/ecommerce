from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.db import transaction

from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


class CheckoutView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer  # For returning the created order

    def create(self, request, *args, **kwargs):
        user = request.user

        try:
            cart = Cart.objects.get(user=user)
            if not cart.items.exists():
                return Response(
                    {"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST
                )
        except Cart.DoesNotExist:
            return Response(
                {"detail": "Cart not found."}, status=status.HTTP_404_NOT_FOUND
            )

        with transaction.atomic():
            # Create order
            order = Order.objects.create(user=user)

            total = 0
            for item in cart.items.all():
                price = item.product.get_price()
                total += price * item.quantity

                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=price,  # snapshot
                )

            order.total = total
            order.save()

            # Clear cart
            cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
