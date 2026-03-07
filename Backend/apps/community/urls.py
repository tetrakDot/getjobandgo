from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ThoughtPostViewSet, AdminThoughtPostViewSet

router = DefaultRouter()
router.register(r'thoughts', ThoughtPostViewSet, basename='thoughts')
router.register(r'admin-thoughts', AdminThoughtPostViewSet, basename='admin-thoughts')

urlpatterns = [
    path('', include(router.urls)),
]

