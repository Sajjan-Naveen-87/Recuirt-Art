"""
Views for Jobs App

This module contains API views for job vacancies, applications,
and custom requirements management.
"""

from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from jobs.models import Job, JobRequirement, JobApplication, ApplicationResponse
from jobs.serializers import (
    JobSerializer,
    JobListSerializer,
    JobRequirementSerializer,
    JobRequirementCreateSerializer,
    JobApplicationSerializer,
    JobApplicationCreateSerializer,
    ApplicationStatusUpdateSerializer,
)


class JobViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing job vacancies.
    
    GET: List all active jobs (public)
    POST: Create new job (admin only)
    PUT/PATCH: Update job (admin only)
    DELETE: Delete job (admin only)
    """
    
    queryset = Job.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return JobListSerializer
        return JobSerializer
    
    def get_queryset(self):
        """Filter jobs based on query parameters."""
        queryset = Job.objects.all()
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        else:
            # Default to active jobs for public users
            queryset = queryset.filter(status='active')
        
        # Filter by job type
        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(
                location__icontains=location
            )
        
        # Search by title or company
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Filter by featured
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Exclude expired jobs
        exclude_expired = self.request.query_params.get('exclude_expired')
        if exclude_expired and exclude_expired.lower() == 'true':
            queryset = queryset.filter(apply_deadline__gt=timezone.now())
        
        return queryset.order_by('-created_at')
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def create(self, request, *args, **kwargs):
        """Create a new job vacancy."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'message': 'Job created successfully.',
                'job': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update a job vacancy."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                'message': 'Job updated successfully.',
                'job': serializer.data
            }
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete a job vacancy."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Job deleted successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        """Get all applications for a specific job (admin only)."""
        job = self.get_object()
        applications = job.applications.all()
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def requirements(self, request, pk=None):
        """Get custom requirements for a specific job."""
        job = self.get_object()
        requirements = job.requirements.all().order_by('display_order')
        serializer = JobRequirementSerializer(requirements, many=True)
        return Response(serializer.data)


class JobRequirementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing job requirements (custom form fields).
    
    GET: List requirements for a job
    POST: Create new requirement
    PUT/PATCH: Update requirement
    DELETE: Delete requirement
    """
    
    serializer_class = JobRequirementSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        """Filter requirements by job."""
        job_id = self.kwargs.get('job_pk')
        if job_id:
            return JobRequirement.objects.filter(job_id=job_id)
        return JobRequirement.objects.all()
    
    def get_serializer_class(self):
        """Return appropriate serializer."""
        if self.action in ['create', 'update', 'partial_update']:
            return JobRequirementCreateSerializer
        return JobRequirementSerializer
    
    def get_serializer_context(self):
        """Add job to serializer context."""
        context = super().get_serializer_context()
        job_id = self.kwargs.get('job_pk')
        if job_id:
            context['job'] = get_object_or_404(Job, pk=job_id)
        return context
    
    def create(self, request, *args, **kwargs):
        """Create a new job requirement."""
        job_id = self.kwargs.get('job_pk')
        job = get_object_or_404(Job, pk=job_id)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(job=job)
        
        return Response(
            {
                'message': 'Requirement created successfully.',
                'requirement': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete a job requirement."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Requirement deleted successfully.'},
            status=status.HTTP_200_OK
        )


class JobApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing job applications.
    
    GET: List applications (admin sees all, users see their own)
    POST: Submit new application (public)
    PUT/PATCH: Update application (admin only)
    """
    
    queryset = JobApplication.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        """Return appropriate serializer."""
        if self.action == 'create':
            return JobApplicationCreateSerializer
        if self.action in ['update', 'partial_update', 'status']:
            return ApplicationStatusUpdateSerializer
        return JobApplicationSerializer
    
    def get_queryset(self):
        """Filter applications based on user role."""
        queryset = JobApplication.objects.all()
        
        # Admin sees all applications
        if self.request.user.is_staff:
            # Filter by job
            job_id = self.request.query_params.get('job_id')
            if job_id:
                queryset = queryset.filter(job_id=job_id)
            
            # Filter by status
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            
            return queryset.order_by('-applied_at')
        
        # Regular users see only their own applications
        if self.request.user.is_authenticated:
            return queryset.filter(
                applicant=self.request.user
            ).order_by('-applied_at')
        
        # Anonymous users can only see their applications by email
        email = self.request.query_params.get('email')
        if email:
            return queryset.filter(email=email).order_by('-applied_at')
        
        return JobApplication.objects.none()
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['update', 'partial_update', 'destroy', 'status']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def create(self, request, *args, **kwargs):
        """Submit a new job application."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the job
        job_id = serializer.validated_data.get('job').id
        job = get_object_or_404(Job, pk=job_id)
        
        # Check if job is active and not expired
        if not job.is_active:
            return Response(
                {'error': 'This job is no longer accepting applications.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for duplicate applications
        if request.user.is_authenticated:
            existing = JobApplication.objects.filter(
                job=job,
                applicant=request.user
            ).exists()
            if existing:
                return Response(
                    {'error': 'You have already applied for this job.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Save application
        application = serializer.save(job=job)
        
        # Set applicant if user is logged in
        if request.user.is_authenticated:
            application.applicant = request.user
            application.save()
            
            # Create notification for application submission
            try:
                from notifications.models import notify_application_submitted
                notify_application_submitted(
                    user=request.user,
                    job_title=job.title,
                    application_id=application.id
                )
            except Exception:
                # Notification creation failed, continue without it
                pass
        
        # Return full application details
        output_serializer = JobApplicationSerializer(application)
        
        return Response(
            {
                'message': 'Application submitted successfully.',
                'application': output_serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update application status (admin only)."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        old_status = instance.status
        
        # Handle status update
        if 'status' in request.data:
            status_serializer = ApplicationStatusUpdateSerializer(
                data=request.data
            )
            status_serializer.is_valid(raise_exception=True)
            new_status = status_serializer.validated_data['status']
            instance.status = new_status
            instance.save()
            
            # Notify applicant of status change
            if instance.applicant:
                try:
                    from notifications.models import notify_application_status_update
                    notify_application_status_update(
                        user=instance.applicant,
                        job_title=instance.job.title,
                        application_id=instance.id,
                        old_status=old_status,
                        new_status=new_status
                    )
                except Exception:
                    # Notification creation failed, continue without it
                    pass
            
            return Response(
                {
                    'message': 'Application status updated.',
                    'application': JobApplicationSerializer(instance).data
                }
            )
        
        # Handle other updates
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(
            {
                'message': 'Application updated successfully.',
                'application': serializer.data
            }
        )
    
    @action(detail=True, methods=['post'])
    def status(self, request, pk=None):
        """Update application status (admin only)."""
        application = self.get_object()
        old_status = application.status
        
        serializer = ApplicationStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_status = serializer.validated_data['status']
        application.status = new_status
        application.save()
        
        # Notify applicant of status change
        if application.applicant:
            try:
                from notifications.models import notify_application_status_update
                notify_application_status_update(
                    user=application.applicant,
                    job_title=application.job.title,
                    application_id=application.id,
                    old_status=old_status,
                    new_status=new_status
                )
            except Exception:
                # Notification creation failed, continue without it
                pass
        
        return Response(
            {
                'message': 'Application status updated.',
                'status': application.status
            }
        )


class JobApplicationDetailView(views.APIView):
    """
    API view for retrieving a single application.
    
    GET: Get application details (admin or owner)
    """
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        """Get application details."""
        application = get_object_or_404(
            JobApplication.objects.select_related('job'),
            pk=pk
        )
        
        # Check if user has access
        if request.user.is_authenticated:
            if not request.user.is_staff and application.applicant != request.user:
                return Response(
                    {'error': 'You do not have permission to view this application.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            # For anonymous users, only allow if email matches
            email = request.query_params.get('email')
            if email and application.email != email:
                return Response(
                    {'error': 'You do not have permission to view this application.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data)

