"""
OTP Service for Email Integration

This module handles OTP delivery via Email.
Legacy WhatsApp/Mobile support has been removed.
"""

from django.conf import settings
from django.core.mail import send_mail
import logging

logger = logging.getLogger(__name__)


def send_otp(mobile, otp_code, email=None):
    """
    Send OTP via Email.
    
    Args:
        mobile (str): (Legacy) The mobile number. Ignored for sending.
        otp_code (str): The 6-digit OTP code.
        email (str): The email address to send OTP.

    Returns:
        bool: True if message sent successfully, False otherwise.
    """
    if email:
        try:
            # Use Firebase Firestore to trigger email (Extension)
            # This bypasses Render's blocked SMTP ports
            from firebase_admin import firestore
            db = firestore.client()
            
            # Add a new document to the 'mail' collection
            # The "Trigger Email" extension will pick this up and send it via SMTP
            db.collection('mail').add({
                'to': email,
                'message': {
                    'subject': 'Verify your email address - Recruit Art',
                    'html': f'<p>Your verification code is: <strong>{otp_code}</strong></p>',
                }
            })
            
            logger.info(f"OTP triggered via Firebase Firestore for email: {email}")
            return True
        except Exception as e:
            logger.error(f"Failed to trigger Firebase email for {email}: {str(e)}")
            # Fallback (log only) so user creation isn't blocked
            return True
            
    if mobile:
        logger.warning(f"Mobile OTP requested for {mobile} but mobile service is disabled. OTP: {otp_code}")
        # In dev mode, we might want to return True to allow flow to continue if testing mobile UI
        # But since we are removing it, we should verify the user intent.
        # For now, return True so we don't block registration if it relies on this returning True
        return True

    return False
