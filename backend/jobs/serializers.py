"""
Serializers for Jobs App

This module contains serializers for job vacancies, applications,
and custom requirements.
"""

from rest_framework import serializers
from jobs.models import Job, JobRequirement, JobApplication, ApplicationResponse


class JobRequirementSerializer(serializers.ModelSerializer):
    """Serializer for JobRequirement model."""
    
    options_list = serializers.SerializerMethodField()
    
    class Meta:
        model = JobRequirement
        fields = [
            'id', 'question_text', 'field_type', 'field_name',
            'is_required', 'options', 'options_list', 'help_text', 'display_order'
        ]
    
    def get_options_list(self, obj):
        """Return options as a list."""
        return obj.get_options_list()


class JobSerializer(serializers.ModelSerializer):
    """Serializer for Job model."""
    
    requirements = JobRequirementSerializer(many=True, read_only=True)
    skills_list = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'location', 'job_type',
            'description', 'skills_required', 'skills_list',
            'salary_range', 'experience_required', 'status',
            'apply_deadline', 'is_featured', 'is_active', 'is_expired',
            'created_at', 'updated_at', 'requirements', 'applications_count'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_skills_list(self, obj):
        """Return skills as a list."""
        return obj.get_skills_list()
    
    def get_applications_count(self, obj):
        """Return the count of applications."""
        return obj.get_applications_count()
    
    def get_is_active(self, obj):
        """Check if job is active."""
        return obj.is_active
    
    def get_is_expired(self, obj):
        """Check if job is expired."""
        return obj.is_expired


class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for job listings."""
    
    skills_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'location', 'job_type',
            'skills_required', 'skills_list', 'salary_range',
            'apply_deadline', 'is_active', 'is_featured'
        ]
    
    def get_skills_list(self, obj):
        """Return skills as a list."""
        return obj.get_skills_list()


class ApplicationResponseSerializer(serializers.ModelSerializer):
    """Serializer for ApplicationResponse model."""
    
    class Meta:
        model = ApplicationResponse
        fields = ['id', 'requirement', 'response_value']
        read_only_fields = ['requirement']


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job applications."""
    
    responses = ApplicationResponseSerializer(many=True, required=False)
    
    class Meta:
        model = JobApplication
        fields = [
            'job', 'full_name', 'email', 'mobile',
            'resume', 'linkedin_url', 'portfolio_url',
            'expected_salary', 'notice_period', 'cover_letter', 'responses'
        ]
    
    def validate_resume(self, value):
        """Validate resume file type and size."""
        # Check file type
        allowed_types = [
            'application/pdf', 
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/webp'
        ]
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Resume must be a PDF, Word document, or Image.')
        
        # Check file size (max 5MB)
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('Resume file size must be less than 5MB.')
        
        return value
    
    def create(self, validated_data):
        """Create job application with responses."""
        responses_data = validated_data.pop('responses', [])
        
        application = JobApplication.objects.create(**validated_data)
        
        for response_data in responses_data:
            ApplicationResponse.objects.create(
                application=application,
                **response_data
            )
        
        return application


class ApplicationResponseDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for application responses."""
    
    question_text = serializers.CharField(source='requirement.question_text')
    field_type = serializers.CharField(source='requirement.field_type')
    
    class Meta:
        model = ApplicationResponse
        fields = ['id', 'question_text', 'field_type', 'response_value']


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for JobApplication model with responses."""
    
    responses = ApplicationResponseDetailSerializer(many=True, read_only=True)
    job_title = serializers.CharField(source='job.title')
    company_name = serializers.CharField(source='job.company_name')
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name',
            'full_name', 'email', 'mobile', 'resume', 'resume_file_name',
            'linkedin_url', 'portfolio_url', 'expected_salary',
            'notice_period', 'cover_letter', 'status',
            'applied_at', 'updated_at', 'responses'
        ]
        read_only_fields = ['job', 'applied_at', 'updated_at', 'resume']


class JobApplicationAdminSerializer(serializers.ModelSerializer):
    """Admin serializer for JobApplication with all details."""
    
    job_title = serializers.CharField(source='job.title')
    applicant_email = serializers.CharField(source='applicant.email')
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'applicant', 'applicant_email',
            'full_name', 'email', 'mobile', 'resume', 'resume_file_name',
            'linkedin_url', 'portfolio_url', 'expected_salary',
            'notice_period', 'cover_letter', 'status',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['applied_at', 'updated_at']


class JobApplicationSummarySerializer(serializers.ModelSerializer):
    """Summary serializer for job applications listed on a user's profile."""
    
    job_title = serializers.CharField(source='job.title')
    company_name = serializers.CharField(source='job.company_name')
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_title', 'company_name', 'status', 'applied_at'
        ]


class ApplicationStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating application status."""
    
    status = serializers.ChoiceField(
        choices=['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']
    )


class JobRequirementCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job requirements."""
    
    class Meta:
        model = JobRequirement
        fields = [
            'id', 'question_text', 'field_type', 'field_name',
            'is_required', 'options', 'help_text', 'display_order'
        ]
    
    def validate_field_name(self, value):
        """Ensure field_name is unique per job."""
        job = self.context.get('job')
        if job and self.instance:
            if JobRequirement.objects.filter(
                job=job,
                field_name=value
            ).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError(
                    'Field name must be unique for this job.'
                )
        elif job:
            if JobRequirement.objects.filter(
                job=job,
                field_name=value
            ).exists():
                raise serializers.ValidationError(
                    'Field name must be unique for this job.'
                )
        return value

