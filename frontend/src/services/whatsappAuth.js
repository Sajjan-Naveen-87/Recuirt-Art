/**
 * WhatsApp Authentication Service
 * 
 * This service handles OTP authentication via WhatsApp using the backend API.
 */

import api from './api';

export const whatsappAuthService = {
  /**
   * Send OTP to mobile number via WhatsApp
   * @param {string} mobileNumber - Mobile number in international format (e.g., +1234567890)
   * @returns {Promise<{message: string, expires_in_minutes: number, remaining_attempts: number}>}
   */
  sendOTP: async (mobileNumber) => {
    const response = await api.post('/auth/send-otp/', {
      mobile_number: mobileNumber
    });
    return response.data;
  },

  /**
   * Verify OTP and complete login
   * @param {string} mobileNumber - Mobile number in international format
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<{message: string, user: object, tokens: object}>}
   */
  verifyOTP: async (mobileNumber, otp) => {
    const response = await api.post('/auth/verify-otp/', {
      mobile_number: mobileNumber,
      otp: otp
    });
    
    // Store tokens
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    
    return response.data;
  },

  /**
   * Check WhatsApp auth service health
   * @returns {Promise<{status: string, service: string, whatsapp_configured: boolean}>}
   */
  healthCheck: async () => {
    const response = await api.get('/auth/health/');
    return response.data;
  }
};

export default whatsappAuthService;

