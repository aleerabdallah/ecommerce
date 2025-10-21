from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django.conf.urls.static import static
from users.views import (
    ListCreateAddressAPIView,
    GetUserAddressAPIView,
    RetrieveUpdateDestroyAddressAPIView,
)

urlpatterns = [
    path("o/a/boss/space/", admin.site.urls),
    path("api/v1/auth/", include("users.urls")),
    path("api/v1/user/address/<int:id>/", GetUserAddressAPIView.as_view()),
    path("api/v1/address/", ListCreateAddressAPIView.as_view()),
    path("api/v1/address/<int:id>/", RetrieveUpdateDestroyAddressAPIView.as_view()),
    # ========================== Common app ==================
    path("api/v1/", include("common.urls")),
    # ========================== Products =====================
    path("api/v1/products/", include("products.urls")),
    # ========================== Reviews =======================
    path("api/v1/reviews/", include("reviews.urls")),
    # ========================== Cart ==========================
    path("api/v1/cart/", include("cart.urls")),
    # ========================== Orders ========================
    path("api/v1/orders/", include("orders.urls")),
    # ========================== Newsletter ===================
    # path("api/v1/newsletter/", include("newsletter.urls")),
    path("api/schema/a/b/do/", SpectacularAPIView.as_view(), name="schema"),
    # Optional UI:
    path(
        "api/v1/a/b/do/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/v1/a/b/do/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("qstash/webhook/", include("django_qstash.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
