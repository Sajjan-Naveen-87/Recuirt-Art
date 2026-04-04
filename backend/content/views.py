from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import NewsItem, VisitorCount
from .serializers import NewsItemSerializer, VisitorCountSerializer

class NewsItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for active News Items.
    """
    queryset = NewsItem.objects.all().filter(is_active=True)
    serializer_class = NewsItemSerializer
    permission_classes = [AllowAny]

class VisitorStatsView(generics.RetrieveUpdateAPIView):
    """
    View to get and atomically increment site visitor count.
    """
    serializer_class = VisitorCountSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        obj, created = VisitorCount.objects.get_or_create(id=1)
        if created:
            obj.count = 1000
            obj.save()
        return obj

    def post(self, request, *args, **kwargs):
        """
        Increment the visitor count atomically.
        """
        with transaction.atomic():
            obj, created = VisitorCount.objects.select_for_update().get_or_create(id=1)
            if created:
                obj.count = 1000 # Start at 1000
            else:
                obj.count += 1
            obj.save()
            
        return Response({'count': obj.count}, status=status.HTTP_200_OK)
