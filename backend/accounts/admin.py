"""
Admin Configuration for Accounts App

This module configures the Django admin interface for user management.
"""

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.otps import OTP

User = get_user_model()


class OTPInline(admin.TabularInline):
    """Inline admin for OTP model."""
    model = OTP
    extra = 0
    readonly_fields = ['otp_code', 'created_at', 'expires_at']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for CustomUser model."""
    
    list_display = ['email', 'mobile', 'full_name', 'is_active', 
                   'email_verified', 'mobile_verified', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'email_verified', 
                   'mobile_verified', 'date_joined']
    search_fields = ['email', 'mobile', 'full_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'mobile', 'password')
        }),
        ('Personal Info', {
            'fields': ('full_name',)
        }),
        ('Verification Status', {
            'fields': ('email_verified', 'mobile_verified')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 
                      'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('date_joined', 'last_login')
        }),
        ('Social Auth', {
            'fields': ('google_id',),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Authentication', {
            'fields': ('email', 'mobile', 'password1', 'password2')
        }),
        ('Personal Info', {
            'fields': ('full_name',)
        }),
    )
    
    inlines = [OTPInline]
    
    def get_readonly_fields(self, request, obj=None):
        """Make email and mobile read-only for existing users."""
        if obj:
            return ['email', 'mobile', 'date_joined', 'last_login', 'google_id']
        return []


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    """Admin for OTP model."""
    
    list_display = ['mobile', 'otp_type', 'is_used', 'created_at', 'expires_at']
    list_filter = ['otp_type', 'is_used', 'created_at']
    search_fields = ['mobile', 'email']
    readonly_fields = ['otp_code', 'created_at', 'expires_at']
    can_delete = True
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False

