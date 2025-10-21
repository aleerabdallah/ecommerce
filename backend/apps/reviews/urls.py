from django.urls import path

from .views import *


urlpatterns = [
    path("reviews/", ReviewListCreateView.as_view(), name="review-list-create"),
    path(
        "reviews/<int:pk>/moderate/",
        ReviewModerationView.as_view(),
        name="review-moderate",
    ),
]
