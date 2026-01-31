"""
Admin Configuration for Enquiries App

This module configures the Django admin interface for corporate enquiries.
"""

from django.contrib import admin
from enquiries.models import CorporateEnquiry


@admin.register(CorporateEnquiry)
class CorporateEnquiryAdmin(admin.ModelAdmin):
    """Admin for CorporateEnquiry model."""
    
    list_display = [
        'company_name', 'hr_name', 'hr_email', 'hr_phone',
        'hiring_for', 'status', 'created_at'
    ]
    list_filter = ['status', 'preferred_contact_method', 'created_at']
    search_fields = [
        'company_name', 'hr_name', 'hr_email', 'hr_phone',
        'message', 'hiring_for'
    ]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Company Information', {
            'fields': ('company_name', 'hr_name', 'hr_email', 'hr_phone')
        }),
        ('Enquiry Details', {
            'fields': ('subject', 'message')
        }),
        ('Hiring Information', {
            'fields': ('hiring_for', 'no_of_positions', 'estimated_start_date')
        }),
        ('Contact Preferences', {
            'fields': ('preferred_contact_method', 'attachment'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('status', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_readonly_fields(self, request, obj=None):
        """Make core fields read-only for existing enquiries."""
        if obj:
            return [
                'company_name', 'hr_name', 'hr_email', 'hr_phone',
                'subject', 'message', 'hiring_for', 'no_of_positions',
                'preferred_contact_method', 'estimated_start_date',
                'attachment', 'created_at', 'updated_at'
            ]
        return []
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion."""
        return True

