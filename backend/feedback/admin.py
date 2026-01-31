"""
Admin Configuration for Feedback App

This module configures the Django admin interface for user feedback.
"""

from django.contrib import admin
from feedback.models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """Admin for Feedback model."""
    
    list_display = [
        'feedback_type', 'name', 'email', 'rating',
        'subject', 'status', 'created_at'
    ]
    list_filter = ['feedback_type', 'status', 'rating', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'name', 'email')
        }),
        ('Feedback Details', {
            'fields': ('feedback_type', 'rating', 'subject', 'message')
        }),
        ('Additional Info', {
            'fields': ('page_url', 'attachment'),
            'classes': ('collapse',)
        }),
        ('Admin', {
            'fields': ('status', 'admin_response'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_readonly_fields(self, request, obj=None):
        """Make core fields read-only for existing feedback."""
        if obj:
            return [
                'user', 'name', 'email', 'feedback_type',
                'rating', 'subject', 'message', 'page_url',
                'attachment', 'created_at', 'updated_at'
            ]
        return []

