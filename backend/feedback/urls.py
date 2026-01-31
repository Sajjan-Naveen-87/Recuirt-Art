"""
URL Configuration for Feedback App

This module defines the URL patterns for user feedback.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from feedback.views import FeedbackViewSet

app_name = 'feedback'

router = DefaultRouter()
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
]

