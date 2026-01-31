"""
Serializers for Enquiries App

This module contains serializers for corporate enquiries.
"""

from rest_framework import serializers
from enquiries.models import CorporateEnquiry


class CorporateEnquirySerializer(serializers.ModelSerializer):
    """Serializer for CorporateEnquiry model."""
    
    class Meta:
        model = CorporateEnquiry
        fields = [
            'id', 'company_name', 'hr_name', 'hr_email', 'hr_phone',
            'subject', 'message', 'hiring_for', 'no_of_positions',
            'preferred_contact_method', 'estimated_start_date',
            'attachment', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def validate_attachment(self, value):
        """Validate attachment file type and size."""
        from django.core.exceptions import ValidationError
        from django.conf import settings
        
        if value:
            # Check file size (max 10MB)
            max_size = 10 * 1024 * 1024
            if value.size > max_size:
                raise ValidationError('File size must be less than 10MB.')
        
        return value


class CorporateEnquiryCreateSerializer(serializers.ModelSerializer):
    """Lightweight serializer for creating enquiries."""
    
    class Meta:
        model = CorporateEnquiry
        fields = [
            'company_name', 'hr_name', 'hr_email', 'hr_phone',
            'subject', 'message', 'hiring_for', 'no_of_positions',
            'preferred_contact_method', 'estimated_start_date', 'attachment'
        ]
    
    def validate_hr_email(self, value):
        """Validate HR email format."""
        return value.lower()


class EnquiryStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating enquiry status."""
    
    status = serializers.ChoiceField(
        choices=['new', 'in_progress', 'resolved', 'closed']
    )
    admin_notes = serializers.CharField(required=False, allow_blank=True)


class EnquiryAdminSerializer(serializers.ModelSerializer):
    """Admin serializer for CorporateEnquiry with all details."""
    
    class Meta:
        model = CorporateEnquiry
        fields = [
            'id', 'company_name', 'hr_name', 'hr_email', 'hr_phone',
            'subject', 'message', 'hiring_for', 'no_of_positions',
            'preferred_contact_method', 'estimated_start_date',
            'attachment', 'status', 'admin_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

