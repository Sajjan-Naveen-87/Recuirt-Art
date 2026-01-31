"""
Views for Requirements App

This module contains API views for requirement templates and fields.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.shortcuts import get_object_or_404
from requirements.models import RequirementTemplate, RequirementField
from requirements.serializers import (
    RequirementTemplateSerializer,
    RequirementTemplateListSerializer,
    RequirementTemplateCreateSerializer,
    RequirementFieldSerializer,
    RequirementFieldCreateSerializer,
    ApplyTemplateSerializer,
)


class RequirementTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing requirement templates.
    
    GET: List templates (admin sees all, public sees active only)
    POST: Create new template (admin only)
    PUT/PATCH: Update template (admin only)
    DELETE: Delete template (admin only)
    """
    
    queryset = RequirementTemplate.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return RequirementTemplateListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return RequirementTemplateCreateSerializer
        return RequirementTemplateSerializer
    
    def get_queryset(self):
        """Filter templates based on user role and query params."""
        queryset = RequirementTemplate.objects.prefetch_related('fields')
        
        # Non-admin users only see active templates
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('-created_at')
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def create(self, request, *args, **kwargs):
        """Create a new requirement template."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        template = serializer.save()
        
        return Response(
            {
                'message': 'Template created successfully.',
                'template': RequirementTemplateSerializer(template).data
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update a requirement template."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(
            {
                'message': 'Template updated successfully.',
                'template': RequirementTemplateSerializer(instance).data
            }
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete a requirement template."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Template deleted successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'])
    def fields(self, request, pk=None):
        """Get all fields for a specific template."""
        template = self.get_object()
        fields = template.fields.all().order_by('display_order')
        serializer = RequirementFieldSerializer(fields, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def apply_to_job(self, request, pk=None):
        """
        Apply template fields to a job as requirements.
        
        POST: Apply template to a job
        """
        template = self.get_object()
        
        serializer = ApplyTemplateSerializer(data={
            'template_id': template.id,
            'job_id': request.data.get('job_id')
        })
        
        if serializer.is_valid():
            requirements = serializer.apply()
            
            return Response(
                {
                    'message': f'Template applied successfully. {len(requirements)} requirements created.',
                    'requirements_count': len(requirements)
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """
        Duplicate a template with all its fields.
        
        POST: Duplicate template
        """
        template = self.get_object()
        
        # Create a copy of the template
        new_template = RequirementTemplate.objects.create(
            name=f"{template.name} (Copy)",
            description=template.description,
            is_active=False
        )
        
        # Copy all fields
        for field in template.fields.all():
            RequirementField.objects.create(
                template=new_template,
                question_text=field.question_text,
                field_type=field.field_type,
                field_name=field.field_name,
                is_required=field.is_required,
                options=field.options,
                help_text=field.help_text,
                display_order=field.display_order
            )
        
        return Response(
            {
                'message': 'Template duplicated successfully.',
                'template': RequirementTemplateSerializer(new_template).data
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a template."""
        template = self.get_object()
        template.is_active = False
        template.save()
        
        return Response(
            {
                'message': 'Template deactivated.',
                'is_active': template.is_active
            }
        )
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a template."""
        template = self.get_object()
        template.is_active = True
        template.save()
        
        return Response(
            {
                'message': 'Template activated.',
                'is_active': template.is_active
            }
        )
