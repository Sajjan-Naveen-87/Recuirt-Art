from django.contrib import admin
from import_export import resources, fields
from import_export.admin import ExportMixin
from jobs.models import Job, JobRequirement, JobApplication, ApplicationResponse
from django.db.models import Prefetch
from django.utils.html import format_html
from django.http import HttpResponse

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


class ApplicationResponseInline(admin.TabularInline):
    """Inline admin for ApplicationResponse model."""
    model = ApplicationResponse
    extra = 1
    can_delete = True


class JobApplicationResource(resources.ModelResource):
    """Resource class for JobApplication export."""
    
    id = fields.Field(attribute='id', column_name='ID')
    job_title = fields.Field(attribute='job__title', column_name='Job Title')
    job_category = fields.Field(attribute='job__category', column_name='Category')
    full_name = fields.Field(attribute='full_name', column_name='Applicant Name')
    email = fields.Field(attribute='email', column_name='Email')
    mobile = fields.Field(attribute='mobile', column_name='Mobile')
    alternative_mobile = fields.Field(attribute='alternative_mobile', column_name='Alternative Mobile')
    preferred_job_designation = fields.Field(attribute='preferred_job_designation', column_name='Preferred Designation')
    preferred_job_location = fields.Field(attribute='preferred_job_location', column_name='Preferred Location')
    total_experience = fields.Field(attribute='total_experience', column_name='Total Experience')
    join_after = fields.Field(attribute='join_after', column_name='Can Join After')
    status = fields.Field(attribute='get_status_display', column_name='Status')
    applied_at = fields.Field(attribute='applied_at', column_name='Applied At')
    expected_salary = fields.Field(attribute='expected_salary', column_name='Expected Salary')
    notice_period = fields.Field(attribute='notice_period', column_name='Notice Period')
    resume_file = fields.Field(attribute='resume_file_name', column_name='Resume File')
    cover_letter = fields.Field(attribute='cover_letter', column_name='Cover Letter')
    responses = fields.Field(column_name='Custom Questionnaire Responses')

    class Meta:
        model = JobApplication
        fields = (
            'id', 'job_title', 'job_category', 'full_name', 'email', 'mobile',
            'alternative_mobile', 'preferred_job_designation', 'preferred_job_location',
            'total_experience', 'join_after', 'status', 'applied_at', 
            'expected_salary', 'notice_period', 'resume_file', 'cover_letter', 'responses'
        )
        export_order = fields

    def dehydrate_applied_at(self, obj):
        return obj.applied_at.strftime('%Y-%m-%d %H:%M:%S') if obj.applied_at else ''

    def dehydrate_responses(self, obj):
        """Concatenate all custom responses into a readable string for Excel."""
        responses = obj.responses.all()
        if not responses:
            return "No custom responses"
        return " | ".join([f"{r.requirement.question_text}: {r.response_value}" for r in responses])

    def get_export_queryset(self):
        """Optimize queryset for export."""
        return super().get_export_queryset().select_related('job').prefetch_related(
            Prefetch('responses', queryset=ApplicationResponse.objects.select_related('requirement'))
        )

    def export(self, queryset=None, *args, **kwargs):
        """
        Extending export to include dynamic columns for custom requirements.
        Note: This is a simplified approach. For highly dynamic columns, 
        one would usually override ExportMixin's get_export_data.
        """
        data = super().export(queryset, *args, **kwargs)
        
        # If we have queryset, we can try to add dynamic headers
        # However, django-import-export Resource.export returns a Tablib dataset.
        # Tablib dataset columns are fixed at initialization in this library.
        # For true dynamic Excel with custom questions, the previous CSV method was more flexible
        # but the user wants "Excel format". Tablib supports XLSX.
        return data


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    """Admin for Job model."""
    
    list_display = [
        'title', 'company_name', 'location', 'job_type',
        'status', 'apply_deadline', 'is_featured', 'created_at'
    ]
    list_filter = ['job_type', 'status', 'is_featured', 'created_at', 'category']
    search_fields = ['title', 'company_name', 'location', 'description']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'company_name', 'location', 'job_type', 'category')
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
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    inlines = [JobRequirementInline]
    
    def save_model(self, request, obj, form, change):
        """Set created_by when creating a new job."""
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(JobApplication)
class JobApplicationAdmin(ExportMixin, admin.ModelAdmin):
    """Admin for JobApplication model with Excel Export."""
    
    resource_class = JobApplicationResource
    actions = ['export_selected_to_excel']
    
    list_display = [
        'full_name', 'email', 'job', 'status', 'applied_at'
    ]
    list_filter = ['status', 'job__job_type', 'applied_at', 'job__category']
    search_fields = ['full_name', 'email', 'mobile', 'job__title']
    date_hierarchy = 'applied_at'
    ordering = ['-applied_at']
    
    fieldsets = (
        ('Applicant Information', {
            'fields': ('job', 'applicant', 'full_name', 'email', 'mobile', 'alternative_mobile')
        }),
        ('Job Preferences', {
            'fields': (
                'preferred_job_designation', 'preferred_job_location', 
                'total_experience', 'join_after'
            )
        }),
        ('Resume & Links', {
            'fields': ('resume_link',)
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
    
    def get_inlines(self, request, obj):
        """Only show ApplicationResponse inline when editing an existing application."""
        if obj:
            return [ApplicationResponseInline]
        return []

    def get_readonly_fields(self, request, obj=None):
        """
        Make fields editable but keep timestamps and resume_link readonly.
        """
        return ['applied_at', 'updated_at', 'resume_link']
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion if needed, but usually kept restricted."""
        return request.user.is_superuser

    @admin.action(description="Export selected applications to Excel")
    def export_selected_to_excel(self, request, queryset):
        """Action to export selected applications to Excel with all fields."""
        resource = JobApplicationResource()
        dataset = resource.export(queryset)
        response = HttpResponse(
            dataset.xlsx, 
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="job_applications_export.xlsx"'
        return response

    def resume_link(self, obj):
        """Safely render a link to the resume without crashing if storage is broken."""
        if not obj.resume:
            return "No resume uploaded"
        try:
            return format_html(
                '<a href="{}" target="_blank" style="font-weight: bold; color: #264b5d; text-decoration: underline;">'
                '<span style="margin-right: 5px;">📄</span>View Resume ({})'
                '</a>',
                obj.resume.url,
                obj.resume_file_name or "PDF file"
            )
        except Exception as e:
            return format_html(
                '<span style="color: #ba2121;">⚠️ File Error (Check Cloudinary)</span>'
            )
    
    resume_link.short_description = 'Resume/CV'


@admin.register(JobRequirement)
class JobRequirementAdmin(admin.ModelAdmin):
    """Admin for JobRequirement model."""
    
    list_display = [
        'question_text', 'job', 'field_type', 'is_required', 'display_order'
    ]
    list_filter = ['field_type', 'is_required', 'job__job_type']
    search_fields = ['question_text', 'field_name', 'job__title']
    ordering = ['job', 'display_order']


@admin.register(ApplicationResponse)
class ApplicationResponseAdmin(admin.ModelAdmin):
    """Admin for ApplicationResponse model."""
    
    list_display = ['application', 'requirement', 'response_value']
    list_filter = ['requirement', 'application__job']
    search_fields = ['response_value', 'application__full_name']

