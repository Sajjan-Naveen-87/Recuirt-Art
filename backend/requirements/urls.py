"""
URL Configuration for Requirements App

This module defines the URL patterns for requirement templates.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from requirements.views import RequirementTemplateViewSet

app_name = 'requirements'

router = DefaultRouter()
router.register(r'templates', RequirementTemplateViewSet, basename='template')

urlpatterns = [
    path('', include(router.urls)),
]

