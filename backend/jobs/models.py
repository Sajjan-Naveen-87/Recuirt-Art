"""
Job Models for Jobs App

This module defines the models for job vacancies, applications,
and custom requirements per job.
"""

from django.db import models
from django.conf import settings
from django.utils import timezone


class Job(models.Model):
    """
    Job vacancy model for posting job openings.
    """
    
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('internship', 'Internship'),
        ('contract', 'Contract'),
        ('part_time', 'Part-time'),
    ]
    
    JOB_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('closed', 'Closed'),
    ]

    JOB_CATEGORY_CHOICES = [
        ('clinician', 'Clinician'),
        ('non_clinician', 'Non Clinician'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    title = models.CharField('Job Title', max_length=255)
    company_name = models.CharField('Company Name', max_length=255)
    location = models.CharField('Location', max_length=255, blank=True)
    
    # Job Details
    job_type = models.CharField(
        'Job Type',
        max_length=20,
        choices=JOB_TYPE_CHOICES,
        default='full_time'
    )
    description = models.TextField('Job Description')
    skills_required = models.TextField(
        'Skills Required',
        help_text='Comma-separated list of skills'
    )
    category = models.CharField(
        'Category',
        max_length=20,
        choices=JOB_CATEGORY_CHOICES,
        default='other'
    )
    
    # Additional Information
    salary_range = models.CharField('Salary Range', max_length=100, blank=True)
    experience_required = models.CharField(
        'Experience Required',
        max_length=100,
        blank=True,
        help_text='e.g., 2-3 years'
    )
    
    # Status and Dates
    status = models.CharField(
        'Status',
        max_length=20,
        choices=JOB_STATUS_CHOICES,
        default='active'
    )
    apply_deadline = models.DateTimeField('Apply Deadline')
    is_featured = models.BooleanField('Featured Job', default=False)
    
    # Timestamps
    created_at = models.DateTimeField('Created At', auto_now_add=True)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    # Admin tracking
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_jobs'
    )
    
    class Meta:
        db_table = 'jobs_job'
        verbose_name = 'Job Vacancy'
        verbose_name_plural = 'Job Vacancies'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} at {self.company_name}"
    
    @property
    def is_expired(self):
        """Check if the job application deadline has passed."""
        return timezone.now() > self.apply_deadline
    
    @property
    def is_active(self):
        """Check if the job is active and not expired."""
        return self.status == 'active' and not self.is_expired
    
    def get_skills_list(self):
        """Return skills as a list."""
        if self.skills_required:
            return [s.strip() for s in self.skills_required.split(',')]
        return []
    
    def get_applications_count(self):
        """Return the count of applications for this job."""
        return self.applications.count()


class JobRequirement(models.Model):
    """
    Custom requirement/question form per job.
    This allows admin to create custom application forms for each job.
    """
    
    FIELD_TYPE_CHOICES = [
        ('text', 'Short Text'),
        ('textarea', 'Long Text'),
        ('number', 'Number'),
        ('date', 'Date'),
        ('select', 'Dropdown'),
        ('checkbox', 'Checkbox'),
        ('file', 'File Upload'),
        ('email', 'Email'),
    ]
    
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='requirements'
    )
    question_text = models.CharField('Question', max_length=500)
    field_type = models.CharField(
        'Field Type',
        max_length=20,
        choices=FIELD_TYPE_CHOICES,
        default='text'
    )
    field_name = models.CharField(
        'Field Name',
        max_length=100,
        help_text='Technical name for the field (snake_case)'
    )
    is_required = models.BooleanField('Required', default=False)
    options = models.TextField(
        'Options',
        blank=True,
        help_text='For dropdown fields, comma-separated options'
    )
    help_text = models.CharField(
        'Help Text',
        max_length=255,
        blank=True,
        help_text='Placeholder or helper text'
    )
    display_order = models.PositiveIntegerField(
        'Display Order',
        default=0,
        help_text='Order in which to display the field'
    )
    
    class Meta:
        db_table = 'jobs_requirement'
        verbose_name = 'Job Requirement'
        verbose_name_plural = 'Job Requirements'
        ordering = ['job', 'display_order']
    
    def __str__(self):
        return f"{self.question_text} ({self.job.title})"
    
    def get_options_list(self):
        """Return options as a list."""
        if self.options:
            return [opt.strip() for opt in self.options.split(',')]
        return []


class JobApplication(models.Model):
    """
    Job application model for storing applicant submissions.
    """
    
    APPLICATION_STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewing', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]
    
    # Job reference
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    
    # Basic Information
    full_name = models.CharField('Full Name', max_length=255)
    email = models.EmailField('Email Address')
    mobile = models.CharField('Mobile Number', max_length=15)
    
    # Resume
    resume = models.FileField(
        'Resume/CV',
        upload_to='resumes/%Y/%m/'
    )
    resume_file_name = models.CharField(
        'Resume File Name',
        max_length=255,
        blank=True
    )
    
    # Additional Information
    linkedin_url = models.URLField('LinkedIn URL', blank=True)
    portfolio_url = models.URLField('Portfolio URL', blank=True)
    expected_salary = models.CharField(
        'Expected Salary',
        max_length=100,
        blank=True
    )
    notice_period = models.CharField(
        'Notice Period',
        max_length=100,
        blank=True
    )
    
    # Status and Tracking
    status = models.CharField(
        'Status',
        max_length=20,
        choices=APPLICATION_STATUS_CHOICES,
        default='pending'
    )
    cover_letter = models.TextField('Cover Letter', blank=True)
    
    # Timestamps
    applied_at = models.DateTimeField('Applied At', auto_now_add=True)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    # Applicant reference (if logged in)
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applications'
    )
    
    class Meta:
        db_table = 'jobs_application'
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.full_name} - {self.job.title}"
    
    def save(self, *args, **kwargs):
        """Override save to store resume file name."""
        if self.resume:
            self.resume_file_name = self.resume.name
        super().save(*args, **kwargs)


class ApplicationResponse(models.Model):
    """
    Stores responses to custom job requirements.
    """
    
    application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    requirement = models.ForeignKey(
        JobRequirement,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    response_value = models.TextField('Response')
    
    class Meta:
        db_table = 'jobs_application_response'
        verbose_name = 'Application Response'
        verbose_name_plural = 'Application Responses'
    
    def __str__(self):
        return f"Response to {self.requirement.question_text}"

