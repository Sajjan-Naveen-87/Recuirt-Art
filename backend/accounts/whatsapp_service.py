"""
WhatsApp Cloud API Service

This module provides integration with Meta's WhatsApp Cloud API
for sending OTP messages via WhatsApp.

Environment Variables Required:
- WHATSAPP_ACCESS_TOKEN: Facebook App access token
- WHATSAPP_PHONE_NUMBER_ID: Phone number ID for sending messages
- WHATSAPP_BUSINESS_ACCOUNT_ID: Business account ID (optional)
- WHATSAPP_VERIFY_ENDPOINT: API endpoint (defaults to Meta's production URL)
"""

import requests
import json
import logging
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


class WhatsAppCloudAPIError(Exception):
    """Custom exception for WhatsApp Cloud API errors."""
    def __init__(self, message, code=None, details=None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)


class WhatsAppService:
    """
    Service for sending WhatsApp messages via Meta's Cloud API.
    """
    
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    def __init__(self):
        self.access_token = getattr(settings, 'WHATSAPP_ACCESS_TOKEN', None)
        self.phone_number_id = getattr(settings, 'WHATSAPP_PHONE_NUMBER_ID', None)
        self.business_account_id = getattr(settings, 'WHATSAPP_BUSINESS_ACCOUNT_ID', None)
        self.verify_endpoint = getattr(
            settings, 
            'WHATSAPP_VERIFY_ENDPOINT',
            f"{self.BASE_URL}/messages"
        )
    
    def _get_headers(self):
        """Get headers for API requests."""
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }
    
    def _format_phone_number(self, mobile_number):
        """
        Format phone number for WhatsApp API.
        
        WhatsApp requires phone numbers to be in format: COUNTRYCODENUMBER
        without any special characters.
        
        Examples:
            +1234567890 -> 1234567890
            +91 9876543210 -> 919876543210
        """
        # Remove all non-digit characters
        cleaned = ''.join(filter(str.isdigit, mobile_number))
        
        # Ensure it starts with country code (minimum 10 digits)
        if len(cleaned) < 10:
            raise ValueError(f"Invalid phone number: {mobile_number}")
        
        return cleaned
    
    def send_otp(self, mobile_number, otp_code, app_name="Recuirt Art"):
        """
        Send OTP via WhatsApp message.
        
        Args:
            mobile_number: Recipient's mobile number (e.g., +1234567890)
            otp_code: 6-digit OTP code
            app_name: Name of the application (for message template)
        
        Returns:
            dict: Response from WhatsApp API
        
        Raises:
            WhatsAppCloudAPIError: If message fails to send
        """
        if not self.access_token:
            raise WhatsAppCloudAPIError(
                "WHATSAPP_ACCESS_TOKEN not configured",
                code="CONFIG_ERROR"
            )
        
        if not self.phone_number_id:
            raise WhatsAppCloudAPIError(
                "WHATSAPP_PHONE_NUMBER_ID not configured",
                code="CONFIG_ERROR"
            )
        
        # Format phone number
        formatted_number = self._format_phone_number(mobile_number)
        
        # Build message payload using WhatsApp template
        payload = {
            "messaging_product": "whatsapp",
            "to": formatted_number,
            "type": "template",
            "template": {
                "name": "otp_verification",  # Must be approved template name
                "language": {
                    "code": "en"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": app_name
                            },
                            {
                                "type": "text",
                                "text": otp_code
                            }
                        ]
                    }
                ]
            }
        }
        
        try:
            response = requests.post(
                self.verify_endpoint,
                headers=self._get_headers(),
                data=json.dumps(payload),
                timeout=30
            )
            
            response_data = response.json()
            
            if response.status_code in [200, 201]:
                logger.info(
                    f"OTP sent successfully to {mobile_number}: "
                    f"Message ID: {response_data.get('messages', [{}])[0].get('id')}"
                )
                return {
                    "success": True,
                    "message_id": response_data.get('messages', [{}])[0].get('id'),
                    "status": response_data.get('messages', [{}])[0].get('message_status')
                }
            else:
                error_msg = response_data.get('error', {}).get('message', 'Unknown error')
                error_code = response_data.get('error', {}).get('code')
                
                logger.error(
                    f"Failed to send OTP to {mobile_number}: "
                    f"{error_msg} (Code: {error_code})"
                )
                
                raise WhatsAppCloudAPIError(
                    f"Failed to send message: {error_msg}",
                    code=error_code,
                    details=response_data
                )
                
        except requests.exceptions.Timeout:
            logger.error(f"Timeout sending OTP to {mobile_number}")
            raise WhatsAppCloudAPIError(
                "Request timed out. Please try again.",
                code="TIMEOUT"
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error sending OTP to {mobile_number}: {str(e)}")
            raise WhatsAppCloudAPIError(
                f"Network error: {str(e)}",
                code="NETWORK_ERROR"
            )
    
    def send_text_message(self, mobile_number, message):
        """
        Send a plain text message via WhatsApp.
        
        Args:
            mobile_number: Recipient's mobile number
            message: Text message to send
        
        Returns:
            dict: Response from WhatsApp API
        """
        if not self.access_token or not self.phone_number_id:
            raise WhatsAppCloudAPIError(
                "WhatsApp credentials not configured",
                code="CONFIG_ERROR"
            )
        
        formatted_number = self._format_phone_number(mobile_number)
        
        payload = {
            "messaging_product": "whatsapp",
            "to": formatted_number,
            "type": "text",
            "text": {
                "body": message
            }
        }
        
        response = requests.post(
            self.verify_endpoint,
            headers=self._get_headers(),
            data=json.dumps(payload),
            timeout=30
        )
        
        if response.status_code not in [200, 201]:
            raise WhatsAppCloudAPIError(
                f"Failed to send message: {response.text}",
                code="SEND_ERROR"
            )
        
        return response.json()
    
    def get_message_status(self, message_id):
        """
        Check the status of a sent message.
        
        Args:
            message_id: ID of the message to check
        
        Returns:
            dict: Message status information
        """
        if not self.access_token:
            raise WhatsAppCloudAPIError(
                "WHATSAPP_ACCESS_TOKEN not configured",
                code="CONFIG_ERROR"
            )
        
        url = f"{self.BASE_URL}/{message_id}"
        
        response = requests.get(
            url,
            headers=self._get_headers(),
            timeout=30
        )
        
        if response.status_code != 200:
            raise WhatsAppCloudAPIError(
                f"Failed to get message status: {response.text}",
                code="STATUS_ERROR"
            )
        
        return response.json()


# Default service instance
whatsapp_service = WhatsAppService()


def send_otp_via_whatsapp(mobile_number, otp_code, app_name="Recuirt Art"):
    """
    Convenience function to send OTP via WhatsApp.
    
    Args:
        mobile_number: Recipient's mobile number
        otp_code: 6-digit OTP code
        app_name: Application name for message template
    
    Returns:
        dict: Response from WhatsApp API
    """
    return whatsapp_service.send_otp(mobile_number, otp_code, app_name)


def log_otp_request(mobile_number, request_type, status, 
                   ip_address=None, user_agent=None, error_message=None):
    """
    Log an OTP request for monitoring and rate limiting.
    
    Args:
        mobile_number: Mobile number
        request_type: 'send' or 'verify'
        status: 'success', 'failed', or 'rate_limited'
        ip_address: Client IP address
        user_agent: Client user agent
        error_message: Error details if failed
    """
    from accounts.whatsapp_models import OTPRequestLog
    
    OTPRequestLog.objects.create(
        mobile_number=mobile_number,
        request_type=request_type,
        status=status,
        ip_address=ip_address,
        user_agent=user_agent,
        error_message=error_message
    )


def check_rate_limit(mobile_number, limit=5, window_minutes=10):
    """
    Check if a mobile number has exceeded the rate limit.
    
    Args:
        mobile_number: Mobile number to check
        limit: Maximum requests allowed in window
        window_minutes: Time window in minutes
    
    Returns:
        bool: True if rate limited, False otherwise
    """
    from accounts.whatsapp_models import OTPRequestLog
    
    window_start = timezone.now() - timezone.timedelta(minutes=window_minutes)
    
    count = OTPRequestLog.objects.filter(
        mobile_number=mobile_number,
        created_at__gte=window_start,
        status='success'
    ).count()
    
    return count >= limit
