"""
URL Configuration for Accounts App

This module defines the URL patterns for authentication endpoints.
"""

from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView
from accounts.views import (
    RegistrationView,
    OTPVerificationView,
    OTPSendView,
    LoginView,
    LogoutView,
    ProfileView,
    PasswordChangeView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    TokenRefreshView,
    GoogleAuthView,
)
from accounts.firebase_views import (
    FirebaseLoginView,
    FirebaseVerifyTokenView,
    FirebasePhoneLoginView,
    FirebaseGoogleLoginView,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication endpoints
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # OTP endpoints
    path('otp/send/', OTPSendView.as_view(), name='otp-send'),
    path('otp/verify/', OTPVerificationView.as_view(), name='otp-verify'),
    
    # Google OAuth (legacy)
    path('google/', GoogleAuthView.as_view(), name='google-auth'),
    path('google/login/', GoogleAuthView.as_view(), name='google-login'),
    
    # Firebase Authentication endpoints
    path('firebase/login/', FirebaseLoginView.as_view(), name='firebase-login'),
    path('firebase/verify-token/', FirebaseVerifyTokenView.as_view(), name='firebase-verify-token'),
    path('firebase/phone/', FirebasePhoneLoginView.as_view(), name='firebase-phone'),
    path('firebase/google/', FirebaseGoogleLoginView.as_view(), name='firebase-google'),
    
    # Profile endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileView.as_view(), name='profile-update'),
    
    # Password management
    path('password/change/', PasswordChangeView.as_view(), name='password-change'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # JWT Token endpoints
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),
    
    # Social Auth URLs (handled by django-social-auth)
    path('social/', include('social_django.urls', namespace='social')),
]

