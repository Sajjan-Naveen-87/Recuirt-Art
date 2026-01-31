"""
URL Configuration for Notifications App

This module defines the URL patterns for notifications.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from notifications.views import NotificationViewSet

app_name = 'notifications'

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]

