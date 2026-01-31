"""
Models for Requirements App

This module defines reusable requirement templates that can be
applied across multiple jobs.
"""

from django.db import models


class RequirementTemplate(models.Model):
    """
    Reusable requirement template that can be applied to multiple jobs.
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
    
    name = models.CharField('Template Name', max_length=255)
    description = models.TextField('Description', blank=True)
    is_active = models.BooleanField('Active', default=True)
    created_at = models.DateTimeField('Created At', auto_now_add=True)
    updated_at = models.DateTimeField('Updated At', auto_now=True)
    
    class Meta:
        db_table = 'requirements_template'
        verbose_name = 'Requirement Template'
        verbose_name_plural = 'Requirement Templates'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class RequirementField(models.Model):
    """
    Individual fields for requirement templates.
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
    
    template = models.ForeignKey(
        RequirementTemplate,
        on_delete=models.CASCADE,
        related_name='fields'
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
    display_order = models.PositiveIntegerField('Display Order', default=0)
    
    class Meta:
        db_table = 'requirements_field'
        verbose_name = 'Requirement Field'
        verbose_name_plural = 'Requirement Fields'
        ordering = ['template', 'display_order']
    
    def __str__(self):
        return f"{self.question_text} ({self.template.name})"
    
    def get_options_list(self):
        """Return options as a list."""
        if self.options:
            return [opt.strip() for opt in self.options.split(',')]
        return []

