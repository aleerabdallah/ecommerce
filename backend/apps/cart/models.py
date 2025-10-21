# from common.models import BaseModel
from django.db import models
from users.models import UserAccount
from products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, related_name="cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    def total_price(self):
        return sum(item.total_price() for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ["cart", "product"]

    def __str__(self):
        return f"{self.quantity} × {self.product.name}"

    def total_price(self):
        return self.quantity * self.product.get_price()
