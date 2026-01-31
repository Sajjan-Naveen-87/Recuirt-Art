"""
URL Configuration for Enquiries App

This module defines the URL patterns for corporate enquiries.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from enquiries.views import (
    CorporateEnquiryViewSet,
    EnquirySubmitView,
    ContactUsView,
)

app_name = 'enquiries'

router = DefaultRouter()
router.register(r'enquiries', CorporateEnquiryViewSet, basename='enquiry')

urlpatterns = [
    # Alternative endpoints
    path('enquiry/submit/', EnquirySubmitView.as_view(), name='enquiry-submit'),
    path('contact-us/', ContactUsView.as_view(), name='contact-us'),
    
    # Router URLs
    path('', include(router.urls)),
]

