"""
Custom User Model for Recruit Art

This module defines the CustomUser model that extends Django's AbstractBaseUser.
It uses email as the primary identifier instead of username.
Supports Firebase Authentication with Firebase UID tracking.
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import random


class CustomUserManager(BaseUserManager):
    """Custom user manager for CustomUser model."""
    
    def create_user(self, email, mobile, password=None, **extra_fields):
        """Create and save a regular user with the given email, mobile and password."""
        if not email:
            raise ValueError('Users must have an email address')
        if not mobile:
            raise ValueError('Users must have a mobile number')
        
        email = self.normalize_email(email)
        user = self.model(email=email, mobile=mobile, **extra_fields)
        
        if password:
            user.set_password(password)
        else:
            # Generate a random password for OTP users
            user.set_password(''.join([str(random.randint(0, 9)) for _ in range(8)]))
        
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, mobile, password=None, **extra_fields):
        """Create and save a superuser with the given email, mobile and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('email_verified', True)
        extra_fields.setdefault('mobile_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, mobile, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model that uses email as the primary identifier.
    Supports both email/password and mobile/OTP authentication.
    Also supports Firebase Authentication with Firebase UID.
    """
    
    # Primary identifiers
    email = models.EmailField('Email Address', unique=True, db_index=True)
    mobile = models.CharField('Mobile Number', max_length=15, unique=True, db_index=True)
    
    # Personal information
    full_name = models.CharField('Full Name', max_length=255, blank=True)
    current_position = models.CharField('Current Position', max_length=255, blank=True, null=True)
    
    # Authentication flags
    email_verified = models.BooleanField('Email Verified', default=False)
    mobile_verified = models.BooleanField('Mobile Verified', default=False)
    is_active = models.BooleanField('Active', default=True)
    is_staff = models.BooleanField('Staff Status', default=False)
    
    # Timestamps
    date_joined = models.DateTimeField('Date Joined', default=timezone.now)
    last_login = models.DateTimeField('Last Login', blank=True, null=True)
    
    # Firebase Authentication
    firebase_uid = models.CharField(
        'Firebase UID', 
        max_length=128, 
        blank=True, 
        null=True,
        unique=True,
        db_index=True,
        help_text="Firebase Authentication UID for Firebase-based login"
    )
    auth_provider = models.CharField(
        'Authentication Provider',
        max_length=20,
        choices=[
            ('email', 'Email'),
            ('phone', 'Phone (Firebase)'),
            ('google', 'Google (Firebase)'),
        ],
        default='email',
        blank=True
    )
    
    # Social Auth (legacy)
    google_id = models.CharField('Google ID', max_length=255, blank=True, null=True)

    # Role-based access control
    ROLE_CHOICES = [
        ('SUPERUSER', 'Superuser'),
        ('ADMIN', 'Admin'),
        ('USER', 'User'),
    ]
    role = models.CharField(
        'User Role',
        max_length=10,
        choices=ROLE_CHOICES,
        default='USER',
        help_text="User role for access control"
    )

    # Social Links
    linkedin_url = models.URLField('LinkedIn URL', blank=True, null=True)
    portfolio_url = models.URLField('Portfolio URL', blank=True, null=True)

    profile_image = models.ImageField(
        'Profile Image',
        upload_to='profile_images/',
        blank=True,
        null=True,
        help_text="User's profile picture"
    )

    # Resume upload for users
    resume = models.FileField(
        'Resume',
        upload_to='resumes/',
        blank=True,
        null=True,
        help_text="User's resume file (PDF/DOC)"
    )

    # Firestore sync
    firestore_doc_id = models.CharField(
        'Firestore Document ID',
        max_length=255,
        blank=True,
        null=True,
        help_text="Reference to Firebase Firestore document"
    )
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['mobile']
    
    class Meta:
        db_table = 'accounts_customuser'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the full name or email if name is not set."""
        if self.full_name:
            return self.full_name
        return self.email.split('@')[0]
    
    def get_short_name(self):
        """Return the first part of the email or full name."""
        return self.get_full_name()
    
    def save(self, *args, **kwargs):
        """Override save to normalize email."""
        self.email = self.email.lower()
        super().save(*args, **kwargs)


class FirebaseUserProfile(models.Model):
    """
    Profile model for storing additional Firebase user data.
    Syncs with Firestore 'users' collection.
    """
    user = models.OneToOneField(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='firebase_profile'
    )
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    display_name = models.CharField(max_length=255, blank=True, null=True)
    photo_url = models.URLField(max_length=500, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accounts_firebase_user_profile'
        verbose_name = 'Firebase User Profile'
        verbose_name_plural = 'Firebase User Profiles'
    
    def __str__(self):
        return f"Firebase Profile: {self.firebase_uid}"

