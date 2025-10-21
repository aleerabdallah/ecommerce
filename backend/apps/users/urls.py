from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import (
    LoginView,
    LogoutView,
    UserDetailsView,
    PasswordResetView,
    PasswordResetConfirmView,
    PasswordChangeView,

)
from dj_rest_auth.jwt_auth import get_refresh_view
from allauth.socialaccount.views import signup
from django.urls import path
from django.http import HttpResponseRedirect
from django.conf import settings
from .views import (
    VerifyEmailView,
    GoogleLogin,
    RetrieveUpdateDestroyUser,
    ListCreateAddressAPIView,
    UpdateUserProfilePicture,
)


def email_confirm_redirect(request, key):
    return HttpResponseRedirect(f"{settings.EMAIL_CONFIRM_REDIRECT_BASE_URL}{key}/")


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )


urlpatterns = [
    path("register/", RegisterView.as_view(), name="rest_register"),
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("token/refresh/", get_refresh_view().as_view(), name='token_refresh'),
    path("user/", UserDetailsView.as_view(), name="rest_user_details"),
    path(
        "user/info/<int:id>/", RetrieveUpdateDestroyUser.as_view(), name="user_detail"
    ),
    path(
        "verify-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    path(
        "account-confirm-email/<str:key>/",
        email_confirm_redirect,
        name="account_confirm_email",
    ),
    # ==========================================================
    # ===================== password reset =====================
    path("password/reset/", PasswordResetView.as_view(), name="account_reset_password"),
    path(
        "password/reset/<str:uidb64>/<str:token>/",
        password_reset_confirm_redirect,
        name="password_reset_confirm",
    ),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view()),
    # ===========================================================
    # ====================== Password change ====================
    path("password/change/", PasswordChangeView.as_view()),
    # OAUTH 2
    path("google/", GoogleLogin.as_view(), name="account_login"),
    path("signup/", signup, name="account_signup"),
    # user address
    path("user/address/", ListCreateAddressAPIView.as_view()),
    path("user/picture/update/", UpdateUserProfilePicture.as_view()),
]
