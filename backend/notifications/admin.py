"""
Admin Configuration for Notifications App

This module configures the Django admin interface for notifications.
"""

from django.contrib import admin
from notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin for Notification model."""
    
    list_display = [
        'title', 'user', 'notification_type', 'priority',
        'is_read', 'created_at'
    ]
    list_filter = ['notification_type', 'is_read', 'priority', 'created_at']
    search_fields = ['title', 'message', 'user__email', 'user__full_name']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Notification Content', {
            'fields': ('user', 'title', 'message', 'notification_type')
        }),
        ('Related Object', {
            'fields': ('related_object_type', 'related_object_id', 'action_url'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_read', 'read_at', 'priority')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'read_at']
    
    def get_readonly_fields(self, request, obj=None):
        """Make core fields read-only for existing notifications."""
        if obj:
            return ['user', 'title', 'message', 'notification_type',
                   'related_object_type', 'related_object_id',
                   'created_at', 'updated_at', 'read_at']
        return []
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion."""
        return True

