"""
Firebase Authentication Module

This module handles Firebase Admin SDK initialization and authentication.
"""

import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings
import os
import json


def initialize_firebase():
    """
    Initialize Firebase Admin SDK.
    """
    if not firebase_admin._apps:
        # Try to get credentials from environment variable first
        service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')

        if service_account_json:
            # Load from environment variable
            cred_dict = json.loads(service_account_json)
            cred = credentials.Certificate(cred_dict)
        else:
            # Try to load from file
            service_account_path = os.path.join(settings.BASE_DIR, 'firebase-service-account.json')
            if os.path.exists(service_account_path):
                cred = credentials.Certificate(service_account_path)
            else:
                # Use default credentials (for Google Cloud environments)
                cred = credentials.ApplicationDefault()

        firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token):
    """
    Verify Firebase ID token and return decoded token.

    Args:
        id_token (str): Firebase ID token

    Returns:
        dict: Decoded token data

    Raises:
        firebase_admin.auth.InvalidIdTokenError: If token is invalid
        firebase_admin.auth.ExpiredIdTokenError: If token is expired
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise e


def get_firebase_user(uid):
    """
    Get Firebase user by UID.

    Args:
        uid (str): Firebase user UID

    Returns:
        firebase_admin.auth.UserRecord: Firebase user record
    """
    try:
        user = auth.get_user(uid)
        return user
    except auth.UserNotFoundError:
        return None


def create_firebase_user(email, password=None, phone_number=None, display_name=None):
    """
    Create a new Firebase user.

    Args:
        email (str): User email
        password (str, optional): User password
        phone_number (str, optional): User phone number
        display_name (str, optional): User display name

    Returns:
        firebase_admin.auth.UserRecord: Created Firebase user
    """
    user_data = {
        'email': email,
        'email_verified': False,
        'display_name': display_name,
    }

    if password:
        user_data['password'] = password

    if phone_number:
        user_data['phone_number'] = phone_number

    user = auth.create_user(**user_data)
    return user


def update_firebase_user(uid, **kwargs):
    """
    Update Firebase user.

    Args:
        uid (str): Firebase user UID
        **kwargs: User properties to update

    Returns:
        firebase_admin.auth.UserRecord: Updated Firebase user
    """
    user = auth.update_user(uid, **kwargs)
    return user


def delete_firebase_user(uid):
    """
    Delete Firebase user.

    Args:
        uid (str): Firebase user UID
    """
    auth.delete_user(uid)
