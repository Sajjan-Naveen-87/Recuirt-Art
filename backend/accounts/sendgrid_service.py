import os
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

def send_otp_via_sendgrid(to_email, otp_code):
    """
    Send OTP using SendGrid Web API v3.
    This bypasses SMTP ports which might be blocked on Render/Cloud Run.
    """
    sendgrid_api_key = getattr(settings, 'SENDGRID_API_KEY', None)
    from_email = getattr(settings, 'SENDGRID_FROM_EMAIL', None)

    if not sendgrid_api_key or not from_email:
        logger.warning("SendGrid API Key or From Email not configured. Skipping email.")
        return False

    url = "https://api.sendgrid.com/v3/mail/send"
    
    headers = {
        "Authorization": f"Bearer {sendgrid_api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "personalizations": [
            {
                "to": [{"email": to_email}],
                "subject": "Verify your email address - Recruit Art"
            }
        ],
        "from": {"email": from_email},
        "content": [
            {
                "type": "text/html",
                "value": f"<p>Your verification code is: <strong>{otp_code}</strong></p>"
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        
        if response.status_code >= 200 and response.status_code < 300:
            logger.info(f"OTP sent via SendGrid to {to_email}")
            return True
        else:
            logger.error(f"SendGrid Error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Failed to call SendGrid API: {str(e)}")
        return False
