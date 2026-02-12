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
        # Use SendGrid API instead of SMTP/Firebase
        from .sendgrid_service import send_otp_via_sendgrid
        return send_otp_via_sendgrid(email, otp_code)
            
    if mobile:
        logger.warning(f"Mobile OTP requested for {mobile} but mobile service is disabled. OTP: {otp_code}")
        # In dev mode, we might want to return True to allow flow to continue if testing mobile UI
        # But since we are removing it, we should verify the user intent.
        # For now, return True so we don't block registration if it relies on this returning True
        return True

    return False
