from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
#from django.conf import settings
#from django.http import HttpResponseRedirect
#from dj_rest_auth.registration.views import VerifyEmailView
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
#from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from dj_rest_auth.registration.serializers import VerifyEmailSerializer
from rest_framework.decorators import api_view, APIView
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from dj_rest_auth.views import LoginView
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
    UserInfoSerializer,
    PermissionSerializer,
    AddressSerializer,
    InputUserSerializer,
)
from .models import Address, UserAccount
#from django.contrib.auth.models import Permission
from common.permissions import IsOwnerOrReadOnly

import logging


logger = logging.getLogger(__file__)

logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.DEBUG)




class GoogleLogin(
    SocialLoginView
):  # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/api/v1/auth/callback/google"
    client_class = OAuth2Client


class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)
    allowed_methods = ("POST", "OPTIONS", "HEAD")

    def get_serializer(self, *args, **kwargs):
        return VerifyEmailSerializer(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        key = request.data.get("key")
        if key is not None:
            logger.info("Key exists")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.kwargs["key"] = serializer.validated_data["key"]
        try:
            confirmation = self.get_object()
            confirmation.confirm(self.request)
            return Response(
                {"detail": _("Successfully confirmed email.")},
                status=status.HTTP_200_OK,
            )
        except EmailConfirmation.DoesNotExist:
            return Response(
                {"detail": _("Error. Incorrect key.")}, status=status.HTTP_404_NOT_FOUND
            )

    def get_object(self, queryset=None):
        key = self.kwargs["key"]
        emailconfirmation = EmailConfirmationHMAC.from_key(key)
        if not emailconfirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                emailconfirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                raise EmailConfirmation.DoesNotExist
        return emailconfirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs


class RetrieveUpdateDestroyUser(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserInfoSerializer
    queryset = UserAccount.objects.all()
    lookup_field = "id"


# ========================= User Profile image =========


class UpdateUserProfilePicture(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def patch(self, request):
        # instance = UserAccount.objects.get(id=id)
        # print(request.data)
        serializer = InputUserSerializer(data=request.data, instance=request.user)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"detail": "updated Successfully"})

        return Response({"detail": "ok"})


# ============= Address endpoints ============


class ListCreateAddressAPIView(ListCreateAPIView):
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class RetrieveUpdateDestroyAddressAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    queryset = Address.objects.all()
    lookup_field = "id"


class GetUserAddressAPIView(APIView):
    def get(self, request, id):
        """Filter address based on user id"""
        try:

            address = Address.objects.get(user=id)
            return Response(AddressSerializer(address).data)
        except Exception as e:
            return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
