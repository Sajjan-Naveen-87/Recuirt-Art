"""
URL Configuration for WhatsApp OTP Authentication

This module defines the URL patterns for WhatsApp-only OTP authentication.
"""

from django.urls import path
from accounts.whatsapp_views import (
    SendOTPView,
    VerifyOTPView,
    WhatsAppUserProfileView,
    HealthCheckView,
)

app_name = 'whatsapp_auth'

urlpatterns = [
    # OTP endpoints
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    
    # User profile
    path('profile/', WhatsAppUserProfileView.as_view(), name='profile'),
    
    # Health check
    path('health/', HealthCheckView.as_view(), name='health'),
]
