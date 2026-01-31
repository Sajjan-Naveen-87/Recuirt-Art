"""
Serializers for Notifications App

This module contains serializers for notifications.
"""

from rest_framework import serializers
from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'title', 'message', 'notification_type',
            'related_object_type', 'related_object_id',
            'is_read', 'read_at', 'priority', 'action_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'title', 'message', 'notification_type',
            'related_object_type', 'related_object_id',
            'priority', 'created_at', 'updated_at'
        ]


class NotificationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for notification list."""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'is_read', 'priority', 'action_url', 'created_at'
        ]
        read_only_fields = fields


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications (admin only)."""
    
    class Meta:
        model = Notification
        fields = [
            'user', 'title', 'message', 'notification_type',
            'related_object_type', 'related_object_id',
            'priority', 'action_url'
        ]
    
    def validate_user(self, value):
        """Ensure user exists."""
        return value


class MarkAsReadSerializer(serializers.Serializer):
    """Serializer for marking notifications as read."""
    
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text='List of notification IDs to mark as read. If empty, mark all as read.'
    )


class NotificationCountSerializer(serializers.Serializer):
    """Serializer for notification count response."""
    
    total = serializers.IntegerField()
    unread = serializers.IntegerField()
    unread_by_type = serializers.DictField(
        child=serializers.IntegerField(),
        required=False
    )

