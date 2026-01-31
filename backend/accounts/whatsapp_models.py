"""
WhatsApp OTP Authentication Models

This module defines the models for WhatsApp-only OTP authentication.
Uses Meta WhatsApp Cloud API for sending OTPs.
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
import random
import hashlib


def generate_otp():
    """Generate a 6-digit OTP code."""
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def hash_otp(otp_code):
    """Hash OTP for secure storage."""
    return hashlib.sha256(otp_code.encode()).hexdigest()


class WhatsAppUser(models.Model):
    """
    User model for WhatsApp-only authentication.
    
    Stores users authenticated via mobile number + WhatsApp OTP.
    No password-based authentication.
    """
    mobile_number = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text="Mobile number in international format (e.g., +1234567890)"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)
    
    # User profile information
    full_name = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.URLField(max_length=500, blank=True, null=True)
    
    class Meta:
        db_table = 'whatsapp_user'
        verbose_name = 'WhatsApp User'
        verbose_name_plural = 'WhatsApp Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.mobile_number
    
    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login = timezone.now()
        self.save(update_fields=['last_login', 'updated_at'])


class OTP(models.Model):
    """
    OTP model for WhatsApp verification.
    
    Stores OTPs sent via WhatsApp Cloud API.
    Implements security features:
    - 6-digit OTP
    - 5-minute validity
    - 3 maximum verification attempts
    - Single-use OTP
    - Old OTP invalidated on resend
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('expired', 'Expired'),
        ('invalidated', 'Invalidated'),
    ]
    
    mobile_number = models.CharField(
        max_length=20,
        db_index=True,
        help_text="Mobile number the OTP was sent to"
    )
    otp_hash = models.CharField(
        max_length=64,
        help_text="Hashed OTP for secure storage"
    )
    expires_at = models.DateTimeField(
        help_text="OTP expiration timestamp"
    )
    attempts = models.PositiveIntegerField(
        default=0,
        help_text="Number of verification attempts"
    )
    max_attempts = models.PositiveIntegerField(
        default=3,
        help_text="Maximum verification attempts allowed"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether OTP has been successfully verified"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'whatsapp_otp'
        verbose_name = 'OTP'
        verbose_name_plural = 'OTPs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.mobile_number} - {self.status}"
    
    @property
    def is_expired(self):
        """Check if OTP has expired."""
        return timezone.now() > self.expires_at
    
    @property
    def is_valid(self):
        """Check if OTP is valid for verification."""
        return (
            not self.is_verified and
            not self.is_expired and
            self.status == 'pending' and
            self.attempts < self.max_attempts
        )
    
    @property
    def remaining_attempts(self):
        """Get remaining verification attempts."""
        return max(0, self.max_attempts - self.attempts)
    
    def increment_attempts(self):
        """Increment verification attempts."""
        self.attempts += 1
        if self.attempts >= self.max_attempts:
            self.status = 'invalidated'
        self.save(update_fields=['attempts', 'status'])
    
    def mark_verified(self):
        """Mark OTP as verified."""
        self.is_verified = True
        self.status = 'verified'
        self.verified_at = timezone.now()
        self.save(update_fields=['is_verified', 'status', 'verified_at'])
    
    def invalidate(self):
        """Invalidate the OTP."""
        self.status = 'invalidated'
        self.save(update_fields=['status'])
    
    @classmethod
    def create_otp(cls, mobile_number):
        """
        Create a new OTP for a mobile number.
        Invalidates any existing pending OTPs for the number.
        """
        # Invalidate existing pending OTPs
        cls.objects.filter(
            mobile_number=mobile_number,
            status='pending'
        ).update(status='invalidated')
        
        # Generate new OTP
        otp_code = generate_otp()
        otp_hash = hash_otp(otp_code)
        expires_at = timezone.now() + settings.OTP_EXPIRY_MINUTES * 60
        
        # Create new OTP record
        otp = cls.objects.create(
            mobile_number=mobile_number,
            otp_hash=otp_hash,
            expires_at=expires_at,
            status='pending'
        )
        
        return otp, otp_code
    
    @classmethod
    def verify_otp(cls, mobile_number, otp_code):
        """
        Verify an OTP code.
        
        Returns:
            tuple: (success: bool, message: str, user: WhatsAppUser or None)
        """
        # Find the latest pending OTP for the mobile number
        try:
            otp = cls.objects.filter(
                mobile_number=mobile_number,
                status='pending'
            ).latest('created_at')
        except cls.DoesNotExist:
            return False, "No OTP found. Please request a new OTP.", None
        
        # Check if OTP is valid
        if not otp.is_valid:
            if otp.is_expired:
                otp.status = 'expired'
                otp.save(update_fields=['status'])
                return False, "OTP has expired. Please request a new OTP.", None
            elif otp.status == 'invalidated':
                return False, "OTP has been invalidated. Please request a new OTP.", None
            else:
                return False, "OTP is not valid for verification.", None
        
        # Verify OTP
        if otp.otp_hash == hash_otp(otp_code):
            otp.mark_verified()
            
            # Create or get user
            user, created = WhatsAppUser.objects.get_or_create(
                mobile_number=mobile_number,
                defaults={'is_active': True}
            )
            
            if not created:
                user.update_last_login()
            
            return True, "OTP verified successfully.", user
        else:
            otp.increment_attempts()
            remaining = otp.remaining_attempts
            if remaining > 0:
                return False, f"Invalid OTP. {remaining} attempts remaining.", None
            else:
                return False, "Maximum attempts exceeded. Please request a new OTP.", None


class OTPRequestLog(models.Model):
    """
    Log model for OTP requests.
    
    Used for rate limiting and monitoring.
    """
    REQUEST_TYPE_CHOICES = [
        ('send', 'Send OTP'),
        ('verify', 'Verify OTP'),
    ]
    
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('rate_limited', 'Rate Limited'),
    ]
    
    mobile_number = models.CharField(max_length=20, db_index=True)
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'otp_request_log'
        verbose_name = 'OTP Request Log'
        verbose_name_plural = 'OTP Request Logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.request_type} - {self.mobile_number} - {self.status}"
