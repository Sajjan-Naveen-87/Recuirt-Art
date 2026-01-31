"""
URL configuration for recruit_art project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # API URLs
    path("api/accounts/", include("accounts.urls", namespace="accounts")),
    # path("api/auth/", include("accounts.whatsapp_urls", namespace="whatsapp_auth")),
    path("api/jobs/", include("jobs.urls", namespace="jobs")),
    path("api/enquiries/", include("enquiries.urls", namespace="enquiries")),
    path("api/feedback/", include("feedback.urls", namespace="feedback")),
    path("api/requirements/", include("requirements.urls", namespace="requirements")),
    path("api/notifications/", include("notifications.urls", namespace="notifications")),
    
    # Social Auth URLs
    path("auth/", include("social_django.urls", namespace="social")),
]
