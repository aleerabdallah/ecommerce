from django.db import models
from django.contrib.auth.models import AbstractUser
from common.utils import get_image_storage
from django_cryptography.fields import encrypt


class UserAccount(AbstractUser):
    first_name = encrypt(models.CharField(max_length=255))
    last_name = encrypt(models.CharField(max_length=255))
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=50, blank=True, unique=True, null=True)
    phone_number = encrypt(models.CharField(max_length=150, blank=True, null=True))
    picture = models.ImageField(upload_to="profiles", blank=True, null=True)
    gender = models.CharField(max_length=6, blank=True, null=True)
    birth_date = encrypt(models.DateField(blank=True, null=True))
    bio = encrypt(models.CharField(blank=True, null=True))
    phone_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email.strip("@")


class Address(models.Model):
    user = models.OneToOneField(
        UserAccount, on_delete=models.DO_NOTHING, related_name="address"
    )
    country = models.CharField(max_length=60, blank=True, null=True)
    province = models.CharField(max_length=60, blank=True, null=True)
    district = models.CharField(max_length=60, blank=True, null=True)
    community = models.CharField(max_length=100, blank=True, null=True)
    postal_code = encrypt(models.CharField(blank=True, null=True))
    street = encrypt(models.CharField(blank=True, null=True))

    def __str__(self):
        return f"Address - for {self.user.first_name}"
