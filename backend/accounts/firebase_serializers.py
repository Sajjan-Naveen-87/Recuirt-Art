"""
Firebase Authentication Serializers

This module contains serializers for Firebase authentication.
"""

from rest_framework import serializers


class FirebaseLoginSerializer(serializers.Serializer):
    """Serializer for Firebase login."""
    id_token = serializers.CharField(required=True)


class FirebasePhoneLoginSerializer(serializers.Serializer):
    """Serializer for Firebase phone login."""
    id_token = serializers.CharField(required=True)
    phone_number = serializers.CharField(max_length=15, required=True)


class FirebaseVerifyTokenSerializer(serializers.Serializer):
    """Serializer for Firebase token verification."""
    id_token = serializers.CharField(required=True)
