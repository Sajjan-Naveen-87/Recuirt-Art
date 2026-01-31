"""
OTP Verification Models

This module handles OTP (One-Time Password) generation and verification
for mobile number authentication.
"""

from django.db import models
from django.utils import timezone
from datetime import timedelta
import random


class OTP(models.Model):
    """
    OTP model for storing verification codes.
    Each OTP is valid for a limited time and can only be used once.
    """
    
    OTP_TYPE_CHOICES = [
        ('registration', 'Registration'),
        ('login', 'Login'),
        ('password_reset', 'Password Reset'),
    ]
    
    user = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.CASCADE,
        related_name='otps',
        null=True,
        blank=True
    )
    mobile = models.CharField('Mobile Number', max_length=15)
    email = models.EmailField('Email Address', null=True, blank=True)
    otp_code = models.CharField('OTP Code', max_length=6)
    otp_type = models.CharField('OTP Type', max_length=20, choices=OTP_TYPE_CHOICES)
    is_used = models.BooleanField('Is Used', default=False)
    created_at = models.DateTimeField('Created At', auto_now_add=True)
    expires_at = models.DateTimeField('Expires At')
    
    class Meta:
        db_table = 'accounts_otp'
        verbose_name = 'OTP'
        verbose_name_plural = 'OTPs'
    
    def __str__(self):
        return f"OTP for {self.mobile} - {self.otp_type}"
    
    def save(self, *args, **kwargs):
        """Override save to set expiry time and generate OTP code."""
        if not self.pk:
            # Generate 6-digit OTP
            self.otp_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            # Set expiry to 10 minutes from now
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        """Check if the OTP has expired."""
        return timezone.now() > self.expires_at
    
    def verify_otp(self, code):
        """
        Verify if the given OTP code matches and is valid.
        
        Args:
            code (str): The OTP code to verify.
            
        Returns:
            bool: True if OTP is valid, False otherwise.
        """
        if self.is_used or self.is_expired:
            return False
        return self.otp_code == code
    
    @classmethod
    def generate_otp(cls, mobile, otp_type, user=None, email=None):
        """
        Generate a new OTP for the given mobile number.
        
        Args:
            mobile (str): The mobile number to send OTP.
            otp_type (str): Type of OTP (registration, login, password_reset).
            user (CustomUser): User instance (optional).
            email (str): Email address (optional).
            
        Returns:
            OTP: The newly created OTP instance.
       validate any existing unused """
        # In OTPs for this mobile and type
        cls.objects.filter(
            mobile=mobile,
            otp_type=otp_type,
            is_used=False
        ).update(is_used=True)
        
        return cls.objects.create(
            mobile=mobile,
            otp_type=otp_type,
            user=user,
            email=email
        )

