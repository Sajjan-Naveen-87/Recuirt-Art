"""
Social Auth Pipeline for Accounts App

This module contains custom pipeline functions for social authentication.
"""

def set_user_fields(backend, user, response, *args, **kwargs):
    """
    Set additional user fields from social auth response.
    
    This function is called during social authentication to set
    user fields like full_name from the Google profile.
    
    Args:
        backend: The social auth backend being used.
        user: The user instance being created/updated.
        response: The OAuth/OAuth2 response from the provider.
        *args: Additional positional arguments.
        **kwargs: Additional keyword arguments.
    """
    if backend.name == 'google-oauth2':
        # Set Google ID
        if 'id' in response:
            user.google_id = response['id']
        
        # Set full name from the profile
        if 'name' in response:
            full_name = response['name']
            if full_name and not user.full_name:
                user.full_name = full_name
        elif 'given_name' in response and 'family_name' in response:
            full_name = f"{response.get('given_name', '')} {response.get('family_name', '')}".strip()
            if full_name and not user.full_name:
                user.full_name = full_name
        
        # Mark email as verified for Google users
        user.email_verified = True
        
        user.save()

