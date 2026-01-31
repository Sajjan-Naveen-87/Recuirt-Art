"""
Views for Notifications App

This module contains API views for user notifications.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from notifications.models import Notification
from notifications.serializers import (
    NotificationSerializer,
    NotificationListSerializer,
    NotificationCreateSerializer,
    MarkAsReadSerializer,
)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user notifications.
    
    GET: List user's notifications
    POST: Create notification (admin only)
    PUT/PATCH: Update notification (admin only)
    DELETE: Delete notification
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return NotificationCreateSerializer
        if self.action == 'list':
            return NotificationListSerializer
        return NotificationSerializer
    
    def get_queryset(self):
        """Get notifications for the current user."""
        queryset = Notification.objects.filter(user=self.request.user)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Filter by type
        notif_type = self.request.query_params.get('type')
        if notif_type:
            queryset = queryset.filter(notification_type=notif_type)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter recent (last N days)
        days = self.request.query_params.get('days')
        if days:
            from django.utils import timezone as dt
            from datetime import timedelta
            cutoff = dt.now() - timedelta(days=int(days))
            queryset = queryset.filter(created_at__gte=cutoff)
        
        return queryset.order_by('-created_at')
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action == 'create':
            from rest_framework.permissions import AllowAny
            if self.request.user.is_staff:
                return [IsAuthenticated()]
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        """List user's notifications."""
        queryset = self.get_queryset()
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = NotificationListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = NotificationListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """Create a new notification (admin only)."""
        # Only admin users can create notifications
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can create notifications.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        
        return Response(
            {
                'message': 'Notification created successfully.',
                'notification': NotificationListSerializer(notification).data
            },
            status=status.HTTP_201_CREATED
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete a notification."""
        instance = self.get_object()
        
        # Ensure user can only delete their own notifications
        if instance.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to delete this notification.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        self.perform_destroy(instance)
        return Response(
            {'message': 'Notification deleted successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get only unread notifications."""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = NotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get notification count."""
        queryset = Notification.objects.filter(user=request.user)
        total = queryset.count()
        unread = queryset.filter(is_read=False).count()
        
        # Count by type
        unread_by_type = {}
        for notif_type, _ in Notification.NOTIFICATION_TYPES:
            count = queryset.filter(
                notification_type=notif_type,
                is_read=False
            ).count()
            if count > 0:
                unread_by_type[notif_type] = count
        
        return Response({
            'total': total,
            'unread': unread,
            'unread_by_type': unread_by_type
        })
    
    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        """Mark notifications as read."""
        serializer = MarkAsReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        notification_ids = serializer.validated_data.get('notification_ids', [])
        
        if notification_ids:
            # Mark specific notifications as read
            notifications = self.get_queryset().filter(
                id__in=notification_ids,
                is_read=False
            )
        else:
            # Mark all as read
            notifications = self.get_queryset().filter(is_read=False)
        
        now = timezone.now()
        count = notifications.update(is_read=True, read_at=now)
        
        return Response({
            'message': f'{count} notification(s) marked as read.',
            'count': count
        })
    
    @action(detail=False, methods=['post'])
    def mark_as_unread(self, request):
        """Mark notifications as unread."""
        serializer = MarkAsReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        notification_ids = serializer.validated_data.get('notification_ids', [])
        
        if notification_ids:
            notifications = self.get_queryset().filter(
                id__in=notification_ids,
                is_read=True
            )
        else:
            return Response(
                {'error': 'Please specify notification IDs.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        count = notifications.update(is_read=False, read_at=None)
        
        return Response({
            'message': f'{count} notification(s) marked as unread.',
            'count': count
        })
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Clear all read notifications."""
        deleted_count, _ = self.get_queryset().filter(
            is_read=True
        ).delete()
        
        return Response({
            'message': f'{deleted_count} notification(s) cleared.',
            'count': deleted_count
        })
    
    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        """Mark a single notification as read."""
        notification = self.get_object()
        notification.mark_as_read()
        
        return Response({
            'message': 'Notification marked as read.',
            'notification': NotificationListSerializer(notification).data
        })
    
    @action(detail=True, methods=['post'])
    def unread_action(self, request, pk=None):
        """Mark a single notification as unread."""
        notification = self.get_object()
        notification.mark_as_unread()
        
        return Response({
            'message': 'Notification marked as unread.',
            'notification': NotificationListSerializer(notification).data
        })

