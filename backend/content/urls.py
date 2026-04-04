from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsItemViewSet, VisitorStatsView

router = DefaultRouter()
router.register(r'news', NewsItemViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
    path('visitors/', VisitorStatsView.as_view(), name='visitor-stats'),
]
