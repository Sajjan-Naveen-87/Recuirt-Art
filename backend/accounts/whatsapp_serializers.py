"""
Serializers for WhatsApp OTP Authentication

This module provides serializers for WhatsApp-only OTP authentication.
"""

from rest_framework import serializers
from accounts.whatsapp_models import WhatsAppUser, OTP


class WhatsAppUserSerializer(serializers.ModelSerializer):
    """Serializer for WhatsApp user data."""
    
    class Meta:
        model = WhatsAppUser
        fields = [
            'id', 'mobile_number', 'full_name', 
            'is_active', 'created_at', 'last_login'
        ]
        read_only_fields = ['id', 'created_at', 'last_login', 'is_active']


class SendOTPSerializer(serializers.Serializer):
    """Serializer for OTP send request."""
    mobile_number = serializers.CharField(
        max_length=20,
        help_text="Mobile number in international format (e.g., +1234567890)"
    )
    
    def validate_mobile_number(self, value):
        """Validate and normalize mobile number."""
        import re
        # Remove spaces and special characters
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        
        # Must start with + and have at least 10 digits after
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise serializers.ValidationError(
                "Invalid mobile number format. Use: +1234567890"
            )
        
        return cleaned


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for OTP verification request."""
    mobile_number = serializers.CharField(
        max_length=20,
        help_text="Mobile number in international format"
    )
    otp = serializers.CharField(
        min_length=6,
        max_length=6,
        help_text="6-digit OTP code"
    )
    
    def validate_mobile_number(self, value):
        """Validate mobile number format."""
        import re
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise serializers.ValidationError("Invalid mobile number format.")
        return cleaned
    
    def validate_otp(self, value):
        """Validate OTP format (6 digits)."""
        if not value.isdigit():
            raise serializers.ValidationError("OTP must contain only digits.")
        return value


class OTPSendResponseSerializer(serializers.Serializer):
    """Serializer for OTP send response."""
    message = serializers.CharField()
    expires_in_minutes = serializers.IntegerField()
    remaining_attempts = serializers.IntegerField()


class OTPVerifyResponseSerializer(serializers.Serializer):
    """Serializer for OTP verification response."""
    message = serializers.CharField()
    user = WhatsAppUserSerializer()
    tokens = serializers.DictField()


class WhatsAppUserCreateSerializer(serializers.Serializer):
    """Serializer for creating/updating WhatsApp user."""
    mobile_number = serializers.CharField(max_length=20)
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
