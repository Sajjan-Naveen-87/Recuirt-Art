"""
Views for Feedback App

This module contains API views for user feedback.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from feedback.models import Feedback
from feedback.serializers import (
    FeedbackSerializer,
    FeedbackCreateSerializer,
    FeedbackStatusUpdateSerializer,
    FeedbackAdminSerializer,
)


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user feedback.
    
    POST: Submit new feedback (public)
    GET: List feedback (admin only)
    """
    
    queryset = Feedback.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return FeedbackCreateSerializer
        if self.action in ['update', 'partial_update', 'status']:
            return FeedbackStatusUpdateSerializer
        if self.request.user.is_staff:
            return FeedbackAdminSerializer
        return FeedbackSerializer
    
    def get_queryset(self):
        """Filter feedback based on user role."""
        queryset = Feedback.objects.all()
        
        # Admin sees all feedback with filtering
        if self.request.user.is_staff:
            # Filter by status
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            
            # Filter by type
            feedback_type = self.request.query_params.get('type')
            if feedback_type:
                queryset = queryset.filter(feedback_type=feedback_type)
            
            return queryset.order_by('-created_at')
        
        # Regular users see only their own feedback
        if self.request.user.is_authenticated:
            return queryset.filter(
                user=self.request.user
            ).order_by('-created_at')
        
        # Anonymous users cannot list feedback
        return Feedback.objects.none()
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['update', 'partial_update', 'destroy', 'status']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def create(self, request, *args, **kwargs):
        """Submit new feedback."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set user if logged in
        if request.user.is_authenticated:
            feedback = serializer.save(user=request.user)
        else:
            feedback = serializer.save()
        
        return Response(
            {
                'message': 'Thank you for your feedback!',
                'feedback_id': feedback.id
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update feedback status (admin only)."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle status update
        if 'status' in request.data:
            serializer = FeedbackStatusUpdateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            instance.status = serializer.validated_data['status']
            if 'admin_response' in serializer.validated_data:
                instance.admin_response = serializer.validated_data['admin_response']
            instance.save()
            
            return Response(
                {
                    'message': 'Feedback status updated.',
                    'feedback': FeedbackAdminSerializer(instance).data
                }
            )
        
        return Response(
            {'error': 'Only status updates are allowed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete feedback (admin only)."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Feedback deleted successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def status(self, request, pk=None):
        """Update feedback status (admin only)."""
        feedback = self.get_object()
        
        serializer = FeedbackStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        feedback.status = serializer.validated_data['status']
        if 'admin_response' in serializer.validated_data:
            feedback.admin_response = serializer.validated_data['admin_response']
        feedback.save()
        
        return Response(
            {
                'message': 'Feedback status updated.',
                'status': feedback.status
            }
        )

