"""
Serializers for Accounts App

This module contains serializers for user registration, authentication,
and profile management.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from accounts.otps import OTP

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with email and mobile."""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'email', 'mobile', 'full_name', 'password', 'confirm_password'
        ]
        extra_kwargs = {
            'full_name': {'required': True}
        }
    
    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })
        return attrs
    
    def create(self, validated_data):
        """Create a new user with the given data."""
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class OTPVerificationSerializer(serializers.Serializer):
    """Serializer for OTP verification."""
    
    mobile = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    otp_type = serializers.ChoiceField(
        choices=['registration', 'login', 'password_reset']
    )
    
    def validate_otp_code(self, value):
        """Validate OTP format."""
        if not value.isdigit() or len(value) != 6:
            raise serializers.ValidationError('OTP must be a 6-digit number.')
        return value


class OTPSendSerializer(serializers.Serializer):
    """Serializer for requesting OTP."""
    
    mobile = serializers.CharField(max_length=15)
    otp_type = serializers.ChoiceField(
        choices=['registration', 'login', 'password_reset']
    )
    email = serializers.EmailField(required=False, allow_blank=True)


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    login_type = serializers.ChoiceField(
        choices=['email', 'mobile', 'google']
    )
    email = serializers.EmailField(required=False)
    mobile = serializers.CharField(max_length=15, required=False)
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )
    otp_code = serializers.CharField(max_length=6, required=False)
    
    def validate(self, attrs):
        """Validate login credentials based on login type."""
        login_type = attrs.get('login_type')
        
        if login_type == 'email':
            if not attrs.get('email') or not attrs.get('password'):
                raise serializers.ValidationError({
                    'error': 'Email and password are required for email login.'
                })
        elif login_type == 'mobile':
            if not attrs.get('mobile') or not attrs.get('otp_code'):
                raise serializers.ValidationError({
                    'error': 'Mobile number and OTP are required for mobile login.'
                })
        elif login_type == 'google':
            # Google login is handled by social auth
            pass
        
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'mobile', 'full_name', 'email_verified',
            'mobile_verified', 'date_joined', 'last_login', 'google_id'
        ]
        read_only_fields = ['id', 'email', 'mobile', 'date_joined', 'last_login']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ['full_name']
    
    def update(self, instance, validated_data):
        """Update user profile."""
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.save()
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password."""
    
    old_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    
    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context.get('user')
        if user and not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=15)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""
    
    mobile = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })
        return attrs


class GoogleAuthSerializer(serializers.Serializer):
    """Serializer for Google OAuth authentication."""
    
    access_token = serializers.CharField(required=True)
    id_token = serializers.CharField(required=True)

