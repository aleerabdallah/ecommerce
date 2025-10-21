from django.urls import path
from .views import CategoryAPIView, RetrieveUpdateDestroyCategoryAPIView

urlpatterns = [
    path("category/", CategoryAPIView.as_view()),
    path("category/<int:id>/", RetrieveUpdateDestroyCategoryAPIView.as_view()),
]
