"""
Custom permissions for Recruit Art application.

This module contains role-based permissions for controlling access
to different features based on user roles (SUPERUSER, ADMIN, USER).
"""

from rest_framework.permissions import BasePermission


class IsSuperuser(BasePermission):
    """
    Allows access only to superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsAdmin(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'ADMIN'


class IsUser(BasePermission):
    """
    Allows access only to regular users.
    """
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'USER'


class IsAdminOrUser(BasePermission):
    """
    Allows access to both admin and regular users.
    """
    def has_permission(self, request, view):
        if not request.user:
            return False
        if not hasattr(request.user, 'role'):
            return False
        return request.user.role in ['ADMIN', 'USER']


class IsAdminOrSuperuser(BasePermission):
    """
    Allows access to both admin users and superusers.
    """
    def has_permission(self, request, view):
        if not request.user:
            return False
        return request.user.is_superuser or (hasattr(request.user, 'role') and request.user.role == 'ADMIN')


class CanViewResume(BasePermission):
    """
    Allows viewing resumes - admins and superusers only.
    """
    def has_permission(self, request, view):
        if not request.user:
            return False
        return request.user.is_superuser or (hasattr(request.user, 'role') and request.user.role == 'ADMIN')


class CanViewOwnProfile(BasePermission):
    """
    Allows users to view their own profile.
    """
    def has_object_permission(self, request, view, obj):
        return request.user and obj == request.user


class CanApplyForJobs(BasePermission):
    """
    Allows authenticated users to apply for jobs.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
