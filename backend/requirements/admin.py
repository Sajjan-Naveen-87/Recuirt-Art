"""
Admin Configuration for Requirements App

This module configures the Django admin interface for requirement templates.
"""

from django.contrib import admin
from requirements.models import RequirementTemplate, RequirementField


class RequirementFieldInline(admin.TabularInline):
    """Inline admin for RequirementField model."""
    model = RequirementField
    extra = 0
    min_num = 0
    max_num = 50
    fields = [
        'question_text', 'field_type', 'field_name',
        'is_required', 'options', 'help_text', 'display_order'
    ]


@admin.register(RequirementTemplate)
class RequirementTemplateAdmin(admin.ModelAdmin):
    """Admin for RequirementTemplate model."""
    
    list_display = ['name', 'description', 'is_active', 'fields_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Template Information', {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    inlines = [RequirementFieldInline]
    
    def fields_count(self, obj):
        """Return the count of fields in the template."""
        return obj.fields.count()
    fields_count.short_description = 'Fields'
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields read-only for existing templates."""
        if obj:
            return ['created_at', 'updated_at']
        return []


@admin.register(RequirementField)
class RequirementFieldAdmin(admin.ModelAdmin):
    """Admin for RequirementField model."""
    
    list_display = [
        'question_text', 'template', 'field_type', 'field_name',
        'is_required', 'display_order'
    ]
    list_filter = ['field_type', 'is_required', 'template__is_active']
    search_fields = ['question_text', 'field_name', 'template__name']
    ordering = ['template', 'display_order']
