"""
Firebase Authentication Views

This module contains API views for Firebase authentication.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.firebase_auth import verify_firebase_token, initialize_firebase
from accounts.firebase_serializers import (
    FirebaseLoginSerializer,
    FirebasePhoneLoginSerializer,
    FirebaseVerifyTokenSerializer,
)
from accounts.serializers import UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def FirebaseLoginView(request):
    """
    Firebase login view.

    POST: Authenticate user with Firebase ID token.
    """
    serializer = FirebaseLoginSerializer(data=request.data)

    if serializer.is_valid():
        id_token = serializer.validated_data['id_token']

        try:
            # Initialize Firebase if needed
            initialize_firebase()

            # Verify Firebase token
            decoded_token = verify_firebase_token(id_token)
            firebase_uid = decoded_token['uid']
            email = decoded_token.get('email')
            name = decoded_token.get('name')

            # Get or create user
            user, created = User.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    'email': email,
                    'full_name': name,
                    'email_verified': decoded_token.get('email_verified', False),
                }
            )

            # Update user info if not created
            if not created:
                user.email = email or user.email
                user.full_name = name or user.full_name
                user.email_verified = decoded_token.get('email_verified', user.email_verified)
                user.last_login = timezone.now()
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Firebase login successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Firebase authentication failed: {str(e)}'
            }, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def FirebasePhoneLoginView(request):
    """
    Firebase phone login view.

    POST: Authenticate user with Firebase phone ID token.
    """
    serializer = FirebasePhoneLoginSerializer(data=request.data)

    if serializer.is_valid():
        id_token = serializer.validated_data['id_token']
        phone_number = serializer.validated_data['phone_number']

        try:
            # Initialize Firebase if needed
            initialize_firebase()

            # Verify Firebase token
            decoded_token = verify_firebase_token(id_token)
            firebase_uid = decoded_token['uid']

            # Get or create user
            user, created = User.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    'mobile': phone_number,
                    'mobile_verified': True,
                }
            )

            # Update user info if not created
            if not created:
                user.mobile = phone_number
                user.mobile_verified = True
                user.last_login = timezone.now()
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Firebase phone login successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Firebase phone authentication failed: {str(e)}'
            }, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def FirebaseVerifyTokenView(request):
    """
    Firebase token verification view.

    POST: Verify Firebase ID token and return user info.
    """
    serializer = FirebaseVerifyTokenSerializer(data=request.data)

    if serializer.is_valid():
        id_token = serializer.validated_data['id_token']

        try:
            # Initialize Firebase if needed
            initialize_firebase()

            # Verify Firebase token
            decoded_token = verify_firebase_token(id_token)

            return Response({
                'message': 'Token verified successfully.',
                'decoded_token': decoded_token
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Token verification failed: {str(e)}'
            }, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def FirebaseGoogleLoginView(request):
    """
    Firebase Google OAuth login URL view.

    GET: Return Google OAuth login URL.
    """
    # This would typically return the Firebase Auth UI URL or redirect URL
    # For now, return a placeholder response
    return Response({
        'message': 'Use Firebase Auth UI for Google login',
        'auth_url': 'https://your-firebase-project.firebaseapp.com'  # Replace with actual URL
    }, status=status.HTTP_200_OK)
