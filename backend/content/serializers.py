from rest_framework import serializers
from .models import NewsItem, VisitorCount

class NewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsItem
        fields = ['id', 'title', 'description', 'content', 'image', 'link_url', 'created_at']

class VisitorCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorCount
        fields = ['count']
