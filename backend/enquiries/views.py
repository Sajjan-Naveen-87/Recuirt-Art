"""
Views for Enquiries App

This module contains API views for corporate enquiries.
"""

from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.shortcuts import get_object_or_404
from enquiries.models import CorporateEnquiry
from enquiries.serializers import (
    CorporateEnquirySerializer,
    CorporateEnquiryCreateSerializer,
    EnquiryStatusUpdateSerializer,
    EnquiryAdminSerializer,
)


class CorporateEnquiryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing corporate enquiries.
    
    POST: Submit new enquiry (public)
    GET: List enquiries (admin only)
    """
    
    queryset = CorporateEnquiry.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return CorporateEnquiryCreateSerializer
        if self.action in ['update', 'partial_update', 'status']:
            return EnquiryStatusUpdateSerializer
        if self.request.user.is_staff:
            return EnquiryAdminSerializer
        return CorporateEnquirySerializer
    
    def get_queryset(self):
        """Filter enquiries based on user role."""
        queryset = CorporateEnquiry.objects.all()
        
        # Admin sees all enquiries with filtering
        if self.request.user.is_staff:
            # Filter by status
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            
            # Filter by date range
            from_date = self.request.query_params.get('from_date')
            if from_date:
                queryset = queryset.filter(created_at__date__gte=from_date)
            
            to_date = self.request.query_params.get('to_date')
            if to_date:
                queryset = queryset.filter(created_at__date__lte=to_date)
            
            return queryset.order_by('-created_at')
        
        # Regular users cannot list enquiries (security)
        return CorporateEnquiry.objects.none()
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['update', 'partial_update', 'destroy', 'status']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def create(self, request, *args, **kwargs):
        """Submit a new corporate enquiry."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save()
        
        return Response(
            {
                'message': 'Enquiry submitted successfully. Our team will contact you soon.',
                'enquiry_id': enquiry.id
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update enquiry status (admin only)."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle status update
        if 'status' in request.data:
            serializer = EnquiryStatusUpdateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            instance.status = serializer.validated_data['status']
            if 'admin_notes' in serializer.validated_data:
                instance.admin_notes = serializer.validated_data['admin_notes']
            instance.save()
            
            return Response(
                {
                    'message': 'Enquiry status updated.',
                    'enquiry': EnquiryAdminSerializer(instance).data
                }
            )
        
        return Response(
            {'error': 'Only status updates are allowed.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete an enquiry (admin only)."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Enquiry deleted successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def status(self, request, pk=None):
        """Update enquiry status (admin only)."""
        enquiry = self.get_object()
        
        serializer = EnquiryStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        enquiry.status = serializer.validated_data['status']
        if 'admin_notes' in serializer.validated_data:
            enquiry.admin_notes = serializer.validated_data['admin_notes']
        enquiry.save()
        
        return Response(
            {
                'message': 'Enquiry status updated.',
                'status': enquiry.status
            }
        )


class EnquirySubmitView(views.APIView):
    """
    API view for submitting corporate enquiries (alternative endpoint).
    
    POST: Submit new enquiry
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Submit a new corporate enquiry."""
        serializer = CorporateEnquiryCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            enquiry = serializer.save()
            
            return Response(
                {
                    'message': 'Thank you for your enquiry! Our team will get back to you within 24 hours.',
                    'enquiry_id': enquiry.id
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactUsView(views.APIView):
    """
    API view for general contact us form.
    
    POST: Submit general contact message
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Submit a general contact message."""
        from django.core.mail import send_mail
        from django.conf import settings
        
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip().lower()
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()
        
        if not all([name, email, subject, message]):
            return Response(
                {'error': 'All fields are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Send email to admin
        try:
            admin_email = settings.DEFAULT_FROM_EMAIL or 'admin@recruitart.com'
            
            send_mail(
                subject=f"Contact Us: {subject}",
                message=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
                from_email=email,
                recipient_list=[admin_email],
                fail_silently=False,
            )
            
            return Response(
                {'message': 'Thank you for contacting us! We will respond shortly.'},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'message': 'Thank you for contacting us! We will respond shortly.'},
                status=status.HTTP_200_OK
            )

