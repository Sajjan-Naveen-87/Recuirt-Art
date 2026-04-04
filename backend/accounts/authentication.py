from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _

class VersionedJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that checks 'token_version' to enforce single-session.
    If the version in the JWT doesn't match the current database version, the token is invalid.
    """
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        
        # Get token_version from token payload
        token_version = validated_token.get('token_version')
        
        # Check if version exists and matches database
        if token_version is None or token_version != user.token_version:
            raise exceptions.AuthenticationFailed(
                _("Previous session invalidated. Please login again."),
                code="token_invalidated",
            )
            
        return user
