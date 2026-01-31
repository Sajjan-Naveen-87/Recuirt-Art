"""
Serializers for Requirements App

This module contains serializers for requirement templates and fields.
"""

from rest_framework import serializers
from requirements.models import RequirementTemplate, RequirementField


class RequirementFieldSerializer(serializers.ModelSerializer):
    """Serializer for RequirementField model."""
    
    options_list = serializers.SerializerMethodField()
    
    class Meta:
        model = RequirementField
        fields = [
            'id', 'question_text', 'field_type', 'field_name',
            'is_required', 'options', 'options_list', 'help_text', 'display_order'
        ]
    
    def get_options_list(self, obj):
        """Return options as a list."""
        return obj.get_options_list()


class RequirementFieldCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating requirement fields."""
    
    class Meta:
        model = RequirementField
        fields = [
            'question_text', 'field_type', 'field_name',
            'is_required', 'options', 'help_text', 'display_order'
        ]
    
    def validate_field_name(self, value):
        """Ensure field_name is unique per template."""
        template = self.context.get('template')
        if template and self.instance:
            if RequirementField.objects.filter(
                template=template,
                field_name=value
            ).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError(
                    'Field name must be unique for this template.'
                )
        elif template:
            if RequirementField.objects.filter(
                template=template,
                field_name=value
            ).exists():
                raise serializers.ValidationError(
                    'Field name must be unique for this template.'
                )
        return value


class RequirementTemplateSerializer(serializers.ModelSerializer):
    """Serializer for RequirementTemplate model."""
    
    fields = RequirementFieldSerializer(many=True, read_only=True)
    fields_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RequirementTemplate
        fields = [
            'id', 'name', 'description', 'is_active',
            'created_at', 'updated_at', 'fields', 'fields_count'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_fields_count(self, obj):
        """Return the count of fields in the template."""
        return obj.fields.count()


class RequirementTemplateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing requirement templates."""
    
    fields_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RequirementTemplate
        fields = [
            'id', 'name', 'description', 'is_active',
            'fields_count', 'created_at'
        ]
    
    def get_fields_count(self, obj):
        """Return the count of fields in the template."""
        return obj.fields.count()


class RequirementTemplateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating requirement templates."""
    
    fields = RequirementFieldCreateSerializer(many=True, required=False)
    
    class Meta:
        model = RequirementTemplate
        fields = ['name', 'description', 'is_active', 'fields']
    
    def create(self, validated_data):
        """Create template with nested fields."""
        fields_data = validated_data.pop('fields', [])
        template = RequirementTemplate.objects.create(**validated_data)
        
        for field_data in fields_data:
            RequirementField.objects.create(template=template, **field_data)
        
        return template
    
    def update(self, instance, validated_data):
        """Update template with nested fields."""
        fields_data = validated_data.pop('fields', [])
        
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        
        # Update existing fields and add new ones
        for field_data in fields_data:
            field_id = field_data.pop('id', None)
            if field_id:
                # Update existing field
                RequirementField.objects.filter(
                    pk=field_id, template=instance
                ).update(**field_data)
            else:
                # Create new field
                RequirementField.objects.create(template=instance, **field_data)
        
        return instance


class ApplyTemplateSerializer(serializers.Serializer):
    """Serializer for applying a template to a job."""
    
    template_id = serializers.IntegerField()
    job_id = serializers.IntegerField()
    
    def validate_template_id(self, value):
        """Validate template exists and is active."""
        try:
            template = RequirementTemplate.objects.get(pk=value, is_active=True)
        except RequirementTemplate.DoesNotExist:
            raise serializers.ValidationError(
                'Template not found or is inactive.'
            )
        return value
    
    def validate_job_id(self, value):
        """Validate job exists."""
        from jobs.models import Job
        try:
            Job.objects.get(pk=value)
        except Job.DoesNotExist:
            raise serializers.ValidationError('Job not found.')
        return value
    
    def apply(self):
        """Apply template fields to a job as requirements."""
        from jobs.models import Job, JobRequirement
        
        template = RequirementTemplate.objects.get(pk=self.validated_data['template_id'])
        job = Job.objects.get(pk=self.validated_data['job_id'])
        
        created_fields = []
        for field in template.fields.all().order_by('display_order'):
            requirement, created = JobRequirement.objects.get_or_create(
                job=job,
                field_name=field.field_name,
                defaults={
                    'question_text': field.question_text,
                    'field_type': field.field_type,
                    'is_required': field.is_required,
                    'options': field.options,
                    'help_text': field.help_text,
                    'display_order': field.display_order,
                }
            )
            created_fields.append(requirement)
        
        return created_fields

