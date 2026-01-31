"""
Profile Views for Accounts App

This module contains API views for user profile management.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer, UserUpdateSerializer
from jobs.models import JobApplication
from jobs.serializers import JobApplicationSummarySerializer

User = get_user_model()


class ProfileView(APIView):
    """
    API view for user profile management.

    GET: Retrieve current user's profile with applications
    PUT: Update current user's profile
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve user profile with applications."""
        try:
            user = request.user
            applications = JobApplication.objects.filter(applicant=user).select_related('job')

            user_data = UserSerializer(user, context={'request': request}).data
            applications_data = JobApplicationSummarySerializer(applications, many=True).data

            return Response({
                'user': user_data,
                'applications': applications_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        """Update user profile."""
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully.',
                'user': UserSerializer(user, context={'request': request}).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
