"""
Models for Notifications App

This module defines the Notification model for user notifications.
"""

from django.db import models
from django.conf import settings


class Notification(models.Model):
    """
    Notification model for user notifications.
    
    Used to notify users about:
    - Job application submissions
    - Application status updates
    - Job recommendations
    - System announcements
    """
    
    NOTIFICATION_TYPES = [
        ('application_submitted', 'Application Submitted'),
        ('application_status', 'Application Status Update'),
        ('job_recommendation', 'Job Recommendation'),
        ('job_deadline', 'Job Deadline Reminder'),
        ('profile_update', 'Profile Update'),
        ('system', 'System Notification'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # User reference
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    # Notification content
    title = models.CharField('Title', max_length=255)
    message = models.TextField('Message')
    notification_type = models.CharField(
        'Type',
        max_length=30,
        choices=NOTIFICATION_TYPES,
        default='system'
    )
    
    # Related object (optional)
    related_object_type = models.CharField(
        'Related Object Type',
        max_length=50,
        blank=True,
        help_text='e.g., JobApplication, Job'
    )
    related_object_id = models.PositiveIntegerField(
        'Related Object ID',
        null=True,
        blank=True
    )
    
    # Status
    is_read = models.BooleanField('Read', default=False)
    read_at = models.DateTimeField('Read At', null=True, blank=True)
    
    # Priority
    priority = models.CharField(
        'Priority',
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='normal'
    )
    
    # Action URL (optional)
    action_url = models.CharField(
        'Action URL',
        max_length=255,
        blank=True,
        help_text='URL to navigate when notification is clicked'
    )
    
    # Timestamps
    created_at = models.DateTimeField('Created At', auto_now_add=True)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    class Meta:
        db_table = 'notifications_notification'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.email} ({self.created_at.date()})"
    
    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            from django.utils import timezone
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at', 'updated_at'])
    
    def mark_as_unread(self):
        """Mark notification as unread."""
        if self.is_read:
            self.is_read = False
            self.read_at = None
            self.save(update_fields=['is_read', 'read_at', 'updated_at'])
    
    @property
    def is_unread(self):
        """Check if notification is unread."""
        return not self.is_read


def create_notification(
    user,
    title,
    message,
    notification_type='system',
    priority='normal',
    related_object_type=None,
    related_object_id=None,
    action_url=None
):
    """
    Helper function to create a notification.
    
    Args:
        user: User instance
        title: Notification title
        message: Notification message
        notification_type: Type of notification
        priority: Notification priority
        related_object_type: Type of related object
        related_object_id: ID of related object
        action_url: URL for action
    
    Returns:
        Notification instance
    """
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        priority=priority,
        related_object_type=related_object_type,
        related_object_id=related_object_id,
        action_url=action_url or ''
    )


def notify_application_submitted(user, job_title, application_id):
    """Create notification when job application is submitted."""
    return create_notification(
        user=user,
        title='Application Submitted',
        message=f'Your application for "{job_title}" has been submitted successfully.',
        notification_type='application_submitted',
        priority='normal',
        related_object_type='JobApplication',
        related_object_id=application_id,
        action_url=f'/applications/{application_id}'
    )


def notify_application_status_update(
    user,
    job_title,
    application_id,
    old_status,
    new_status
):
    """Create notification when application status is updated."""
    status_messages = {
        'pending': 'Your application is now pending review.',
        'reviewing': 'Your application is being reviewed.',
        'shortlisted': 'Congratulations! Your application has been shortlisted.',
        'rejected': 'Unfortunately, your application was not selected.',
        'hired': 'Congratulations! You have been selected for the position.',
    }
    
    message = status_messages.get(new_status, f'Your application status changed from {old_status} to {new_status}.')
    
    return create_notification(
        user=user,
        title='Application Status Update',
        message=f'{job_title}: {message}',
        notification_type='application_status',
        priority='high' if new_status in ['shortlisted', 'hired'] else 'normal',
        related_object_type='JobApplication',
        related_object_id=application_id,
        action_url=f'/applications/{application_id}'
    )

