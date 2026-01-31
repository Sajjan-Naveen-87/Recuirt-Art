"""
OTP Service for WhatsApp Integration

This module handles OTP generation and delivery via WhatsApp Cloud API.
"""

from django.conf import settings
from accounts.whatsapp_service import send_otp_via_whatsapp, WhatsAppCloudAPIError
import logging

logger = logging.getLogger(__name__)


class OTPService:
    """Service for sending and verifying OTPs via WhatsApp."""

    def __init__(self):
        """Initialize WhatsApp OTP service."""
        self.whatsapp_configured = all([
            getattr(settings, 'WHATSAPP_ACCESS_TOKEN', None),
            getattr(settings, 'WHATSAPP_PHONE_NUMBER_ID', None)
        ])

    def send_otp(self, mobile, otp_code):
        """
        Send OTP via WhatsApp message.

        Args:
            mobile (str): The mobile number to send OTP.
            otp_code (str): The 6-digit OTP code.

        Returns:
            bool: True if WhatsApp message sent successfully, False otherwise.
        """
        if not self.whatsapp_configured:
            logger.warning("WhatsApp not configured. OTP will not be sent.")
            # For development, log the OTP
            logger.info(f"DEV MODE - OTP for {mobile}: {otp_code}")
            return True

        try:
            # Send OTP via WhatsApp
            result = send_otp_via_whatsapp(mobile, otp_code, "Recuirt Art")

            if result.get('success'):
                logger.info(f"OTP sent successfully to {mobile} via WhatsApp. Message ID: {result.get('message_id')}")
                return True
            else:
                logger.error(f"Failed to send OTP to {mobile} via WhatsApp")
                return False

        except WhatsAppCloudAPIError as e:
            logger.error(f"WhatsApp API error sending OTP to {mobile}: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending OTP to {mobile}: {str(e)}")
            return False


# Singleton instance
otp_service = OTPService()


def send_otp(mobile, otp_code):
    """
    Convenience function to send OTP via WhatsApp.

    Args:
        mobile (str): The mobile number to send OTP.
        otp_code (str): The 6-digit OTP code.

    Returns:
        bool: True if WhatsApp message sent successfully, False otherwise.
    """
    return otp_service.send_otp(mobile, otp_code)

