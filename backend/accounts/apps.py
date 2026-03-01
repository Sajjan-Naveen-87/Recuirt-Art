from django.apps import AppConfig
import firebase_admin
from firebase_admin import credentials
import os
import json
import logging

logger = logging.getLogger(__name__)

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        # Initialize Firebase Admin SDK if not already initialized
        if not firebase_admin._apps:
            service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
            if service_account_json:
                try:
                    cred_dict = json.loads(service_account_json)
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                    logger.info("✅ Firebase Admin SDK initialized successfully.")
                except Exception as e:
                    logger.error(f"❌ Failed to initialize Firebase Admin SDK: {e}")
            else:
                 logger.warning("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON not found in environment.")
