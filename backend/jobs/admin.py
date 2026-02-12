"""
 App

This moduleAdmin Configuration for Jobs configures the Django admin interface for job management.
"""

from django.contrib import admin
from jobs.models import Job, JobRequirement, JobApplication, ApplicationResponse


class JobRequirementInline(admin.TabularInline):
    """Inline admin for JobRequirement model."""
    model = JobRequirement
    extra = 0
    min_num = 0
    max_num = 20
    fields = [
        'question_text', 'field_type', 'field_name',
        'is_required', 'options', 'help_text', 'display_order'
    ]


    """Inline admin for ApplicationResponse model."""
    model = ApplicationResponse
    extra = 1  # Allow adding new responses
    # readonly_fields = ['requirement', 'response_value']  # Allow editing
    can_delete = True  # Allow deleting
    
    # def has_add_permission(self, request, obj=None):
    #     return True  # Allow adding


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    """Admin for Job model."""
    
    list_display = [
        'title', 'company_name', 'location', 'job_type',
        'status', 'apply_deadline', 'is_featured', 'created_at'
    ]
    list_filter = ['job_type', 'status', 'is_featured', 'created_at']
    search_fields = ['title', 'company_name', 'location', 'description']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'company_name', 'location', 'job_type')
        }),
        ('Job Details', {
            'fields': ('description', 'skills_required')
        }),
        ('Additional Info', {
            'fields': ('salary_range', 'experience_required'),
            'classes': ('collapse',)
        }),
        ('Status & Dates', {
            'fields': ('status', 'apply_deadline', 'is_featured')
        }),
        ('Admin', {
            'fields': ('created_by',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'created_by']
    
    inlines = [JobRequirementInline]
    
    def save_model(self, request, obj, form, change):
        """Set created_by when creating a new job."""
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(JobRequirement)
class JobRequirementAdmin(admin.ModelAdmin):
    """Admin for JobRequirement model."""
    
    list_display = [
        'question_text', 'job', 'field_type', 'is_required', 'display_order'
    ]
    list_filter = ['field_type', 'is_required', 'job__job_type']
    search_fields = ['question_text', 'field_name', 'job__title']
    ordering = ['job', 'display_order']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    """Admin for JobApplication model."""
    
    list_display = [
        'full_name', 'email', 'job', 'status', 'applied_at'
    ]
    list_filter = ['status', 'job__job_type', 'applied_at']
    search_fields = ['full_name', 'email', 'mobile', 'job__title']
    date_hierarchy = 'applied_at'
    ordering = ['-applied_at']
    
    fieldsets = (
        ('Applicant Information', {
            'fields': ('job', 'applicant', 'full_name', 'email', 'mobile')
        }),
        ('Resume & Links', {
            'fields': ('resume', 'linkedin_url', 'portfolio_url')
        }),
        ('Additional Details', {
            'fields': ('expected_salary', 'notice_period', 'cover_letter'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['applied_at', 'updated_at', 'resume']
    # inlines = [ApplicationResponseInline]  # Replaced by get_inlines logic
    
    def get_inlines(self, request, obj):
        """Only show ApplicationResponse inline when editing an existing application."""
        if obj:
            return [ApplicationResponseInline]
        return []
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields read-only for existing applications."""
        if obj:
            return ['job', 'applicant', 'full_name', 'email', 'mobile',
                   'resume', 'applied_at', 'updated_at']
        return []
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of applications."""
        return False


@admin.register(ApplicationResponse)
class ApplicationResponseAdmin(admin.ModelAdmin):
    """Admin for ApplicationResponse model."""
    
    list_display = ['application', 'requirement', 'response_value']
    list_filter = ['requirement', 'application__job']
    search_fields = ['response_value', 'application__full_name']

