"""
Serializers for Feedback App

This module contains serializers for user feedback.
"""

from rest_framework import serializers
from feedback.models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Feedback model."""
    
    class Meta:
        model = Feedback
        fields = [
            'id', 'user', 'name', 'email', 'feedback_type',
            'rating', 'subject', 'message', 'page_url',
            'attachment', 'status', 'admin_response',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'admin_response', 'created_at', 'updated_at']
    
    def validate_rating(self, value):
        """Ensure rating is between 1 and 5."""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class FeedbackCreateSerializer(serializers.ModelSerializer):
    """Lightweight serializer for creating feedback."""
    
    class Meta:
        model = Feedback
        fields = [
            'name', 'email', 'feedback_type', 'rating',
            'subject', 'message', 'page_url', 'attachment'
        ]
    
    def validate_email(self, value):
        """Validate and normalize email."""
        if value:
            return value.lower()
        return value


class FeedbackStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating feedback status."""
    
    status = serializers.ChoiceField(
        choices=['new', 'reviewed', 'resolved']
    )
    admin_response = serializers.CharField(required=False, allow_blank=True)


class FeedbackAdminSerializer(serializers.ModelSerializer):
    """Admin serializer for Feedback with all details."""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Feedback
        fields = [
            'id', 'user', 'user_email', 'name', 'email',
            'feedback_type', 'rating', 'subject', 'message',
            'page_url', 'attachment', 'status', 'admin_response',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

