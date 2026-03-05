"""
URL Configuration for Feedback App

This module defines the URL patterns for user feedback.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from feedback.views import FeedbackViewSet, TestimonialViewSet, TeamMemberViewSet

app_name = 'feedback'

router = DefaultRouter()
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'testimonials', TestimonialViewSet, basename='testimonials')
router.register(r'team-members', TeamMemberViewSet, basename='team-members')

urlpatterns = [
    path('', include(router.urls)),
]

