"""
URL Configuration for Jobs App

This module defines the URL patterns for job vacancies and applications.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import (
    JobViewSet,
    JobRequirementViewSet,
    JobApplicationViewSet,
    JobApplicationDetailView,
)

app_name = 'jobs'

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', JobApplicationViewSet, basename='application')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Job requirements URLs (nested under jobs)
    path('jobs/<int:job_pk>/requirements/', 
         JobRequirementViewSet.as_view({'get': 'list', 'post': 'create'}),
         name='job-requirements'),
    path('jobs/<int:job_pk>/requirements/<int:pk>/',
         JobRequirementViewSet.as_view({
             'get': 'retrieve',
             'put': 'update',
             'patch': 'partial_update',
             'delete': 'destroy'
         }),
         name='job-requirement-detail'),
    
    # Application detail URL
    path('applications/<int:pk>/', 
         JobApplicationDetailView.as_view(),
         name='application-detail'),
    
    # Additional endpoints
    path('jobs/<int:pk>/applications/',
         JobViewSet.as_view({'get': 'applications'}),
         name='job-applications'),
]

