"""
Models for Enquiries App

This module defines the model for corporate enquiries/contact forms.
"""

from django.db import models


class CorporateEnquiry(models.Model):
    """
    Corporate enquiry model for companies contacting admin for hiring.
    """
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    # Company Information
    company_name = models.CharField('Company Name', max_length=255)
    hr_name = models.CharField('HR Name', max_length=255)
    hr_email = models.EmailField('HR Email')
    hr_phone = models.CharField('HR Phone', max_length=15)
    
    # Enquiry Details
    subject = models.CharField('Subject', max_length=255, blank=True)
    message = models.TextField('Message')
    
    # Hiring Details
    hiring_for = models.CharField(
        'Hiring For',
        max_length=255,
        blank=True,
        help_text='Positions or roles to hire for'
    )
    no_of_positions = models.PositiveIntegerField(
        'Number of Positions',
        default=1
    )
    preferred_contact_method = models.CharField(
        'Preferred Contact Method',
        max_length=20,
        choices=[
            ('email', 'Email'),
            ('phone', 'Phone'),
            ('whatsapp', 'WhatsApp'),
        ],
        default='email'
    )
    estimated_start_date = models.DateField(
        'Estimated Start Date',
        null=True,
        blank=True
    )
    
    # Additional Files
    attachment = models.FileField(
        'Attachment',
        upload_to='enquiries/%Y/%m/',
        null=True,
        blank=True
    )
    
    # Status and Tracking
    status = models.CharField(
        'Status',
        max_length=20,
        choices=STATUS_CHOICES,
        default='new'
    )
    admin_notes = models.TextField(
        'Admin Notes',
        blank=True,
        help_text='Internal notes for admin'
    )
    
    # Timestamps
    created_at = models.DateTimeField('Created At', auto_now_add=True)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    class Meta:
        db_table = 'enquiries_corporateenquiry'
        verbose_name = 'Corporate Enquiry'
        verbose_name_plural = 'Corporate Enquiries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.company_name} - {self.hr_name} ({self.created_at.date()})"

