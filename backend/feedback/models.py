"""
Models for Feedback App

This module defines the model for user feedback.
"""

from django.db import models


class Feedback(models.Model):
    """
    Feedback model for collecting user feedback.
    """
    
    FEEDBACK_TYPE_CHOICES = [
        ('general', 'General Feedback'),
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
        ('complaint', 'Complaint'),
        ('suggestion', 'Suggestion'),
        ('praise', 'Praise'),
    ]
    
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    # User Information (optional for anonymous feedback)
    user = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedbacks'
    )
    name = models.CharField('Name', max_length=255, blank=True)
    email = models.EmailField('Email', blank=True)
    
    # Feedback Details
    feedback_type = models.CharField(
        'Feedback Type',
        max_length=20,
        choices=FEEDBACK_TYPE_CHOICES,
        default='general'
    )
    rating = models.PositiveIntegerField(
        'Rating',
        choices=RATING_CHOICES,
        null=True,
        blank=True
    )
    subject = models.CharField('Subject', max_length=255, blank=True)
    message = models.TextField('Message')
    
    # Additional Information
    page_url = models.URLField(
        'Page URL',
        blank=True,
        help_text='The page where the feedback was submitted'
    )
    attachment = models.FileField(
        'Attachment',
        upload_to='feedback/%Y/%m/',
        null=True,
        blank=True
    )
    
    # Status (for admin tracking)
    status = models.CharField(
        'Status',
        max_length=20,
        choices=[
            ('new', 'New'),
            ('reviewed', 'Reviewed'),
            ('resolved', 'Resolved'),
        ],
        default='new'
    )
    admin_response = models.TextField(
        'Admin Response',
        blank=True
    )
    
    # Timestamps
    created_at = models.DateTimeField('Created At', auto_now_add=True)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    class Meta:
        db_table = 'feedback_feedback'
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedbacks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.feedback_type} - {self.name or 'Anonymous'} ({self.created_at.date()})"


class Testimonial(models.Model):
    """
    Model for storing client and candidate testimonials.
    """
    author_name = models.CharField('Author Name', max_length=255)
    author_position = models.CharField('Position/Company', max_length=255, help_text='e.g., CEO, Apple or Candidate')
    content = models.TextField('Testimonial Content')
    original_url = models.URLField('Original Post URL', blank=True, null=True, help_text='Link to the original testimonial post')
    is_active = models.BooleanField('Is Active', default=True)
    order = models.PositiveIntegerField('Display Order', default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'feedback_testimonial'
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.author_name} - {self.author_position}"

class TeamMember(models.Model):
    """
    Model for storing team member information for the Leadership section.
    """
    name = models.CharField('Name', max_length=255)
    role = models.CharField('Role', max_length=255)
    image = models.ImageField('Image', upload_to='team/', help_text='Arched profile image')
    linkedin_url = models.URLField('LinkedIn URL', blank=True, null=True)
    order = models.PositiveIntegerField('Display Order', default=0)
    is_active = models.BooleanField('Is Active', default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'feedback_teammember'
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} - {self.role}"
