from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.models import EmailAddress, SocialAccount
from allauth.socialaccount.providers.base import AuthProcess
from allauth.utils import get_username_max_length
from rest_framework import serializers
from .models import Address, UserAccount
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext as _
import logging


logger = logging.getLogger(__file__)

logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.DEBUG)


def get_or_none(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except ObjectDoesNotExist:
        return None


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["email", "password"]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["name"]


class UserInfoSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = UserAccount
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "picture",
            "groups",
            "bio",
            "birth_date",
            "gender",
        ]
        read_only_fields = ["groups"]

        def update(self, instance, validated_data):
            logger.info(validated_data)

            for k, v in validated_data.items():
                if k and v:
                    setattr(instance, k, v)
            instance.save()

            return instance


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "country",
            "province",
            "district",
            "community",
            "postal_code",
            "street",
        ]
        read_only_read = ["id"]


class AddressPortionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "community",
            "street",
            "postal_code",
        ]


class UserPersonalInfoSerializer(serializers.ModelSerializer):
    address = AddressPortionSerializer(read_only=True)

    class Meta:
        model = UserAccount
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "birth_date",
            "picture",
            "gender",
            "address",
        ]


class InputUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["picture"]


class CustomRegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()
    email = serializers.EmailField(required=allauth_account_settings.EMAIL_REQUIRED)
    password = serializers.CharField(write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_account_settings.UNIQUE_EMAIL:
            if email and EmailAddress.objects.is_verified(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."),
                )
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
            "phone_number": self.validated_data.get("phone_number"),
            "email": self.validated_data.get("email", ""),
            "password": self.validated_data.get("password", ""),
        }

    def save(self, request):
        email = self.get_cleaned_data()["email"]
        user = get_or_none(UserAccount, email=email)
        if user is None:
            user_group = Group.objects.get(name="user")
            adapter = get_adapter()
            user = adapter.new_user(request)
            self.cleaned_data = self.get_cleaned_data()
            user = adapter.save_user(request, user, self, commit=False)
            print(user_group)
            user.save()
            user.groups.add(user_group)

            user_address = Address(user=user)
            user_address.save()

            self.custom_signup(request, user)
            setup_user_email(request, user, [])
            return user
        else:
            print("User already exists")
            raise serializers.ValidationError("Error")


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["name", "codename"]
