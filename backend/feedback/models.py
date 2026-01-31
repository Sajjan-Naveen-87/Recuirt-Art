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

