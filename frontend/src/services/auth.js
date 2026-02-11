import api from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },

  // Login with email/password
  login: async (credentials) => {
    const response = await api.post('/accounts/login/', credentials);
    if (response.data.tokens?.access) {
      localStorage.setItem('access_token', response.data.tokens.access);
      if (response.data.tokens.refresh) localStorage.setItem('refresh_token', response.data.tokens.refresh);
    } else if (response.data.access) {
      // Fallback for flat structure if any
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
    }
    return response.data;
  },

  // Send OTP
  sendOTP: async (mobile, type = 'login') => {
    const response = await api.post('/accounts/otp/send/', { mobile, otp_type: type });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (mobile, otp, type = 'login') => {
    const response = await api.post('/accounts/otp/verify/', { mobile, otp_code: otp, otp_type: type });
    if (response.data.tokens?.access) {
      localStorage.setItem('access_token', response.data.tokens.access);
      if (response.data.tokens.refresh) localStorage.setItem('refresh_token', response.data.tokens.refresh);
    } else if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
    }
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (code) => {
    const response = await api.post('/accounts/google/', { code });
    if (response.data.tokens?.access) {
      localStorage.setItem('access_token', response.data.tokens.access);
      if (response.data.tokens.refresh) localStorage.setItem('refresh_token', response.data.tokens.refresh);
    } else if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
    }
    return response.data;
  },

  // Get Google OAuth URL
  getGoogleAuthUrl: async () => {
    const response = await api.get('/accounts/google/login/url/');
    return response.data;
  },

  // Login with Firebase ID token
  loginWithFirebase: async (idToken, authProvider, userData = {}) => {
    const response = await api.post('/accounts/firebase/login/', {
      id_token: idToken,
      auth_provider: authProvider,
      user_data: userData
    });
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    return response.data;
  },

  // Login with Firebase Phone
  loginWithFirebasePhone: async (idToken, phone) => {
    const response = await api.post('/accounts/firebase/phone/', {
      id_token: idToken,
      phone
    });
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    return response.data;
  },

  // Login with Firebase Google
  loginWithFirebaseGoogle: async (idToken) => {
    const response = await api.post('/accounts/firebase/google/', {
      id_token: idToken
    });
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    }
    return response.data;
  },

  // Verify Firebase ID token with backend
  verifyFirebaseToken: async (idToken) => {
    const response = await api.post('/accounts/firebase/verify-token/', {
      id_token: idToken
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    await api.post('/accounts/logout/');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/accounts/profile/', userData);
    return response.data;
  },
  // Forgot Password
  forgotPassword: async (emailOrMobile) => {
    // Determine if input is email or mobile
    const isEmail = /\S+@\S+\.\S+/.test(emailOrMobile);
    const payload = isEmail ? { email: emailOrMobile } : { mobile: emailOrMobile };

    const response = await api.post('/accounts/password/reset/', payload);
    return response.data;
  },

  // Reset Password with OTP
  resetPassword: async (mobile, otp, newPassword) => {
    const response = await api.post('/accounts/password/reset/confirm/', {
      mobile,
      otp_code: otp,
      new_password: newPassword
    });
    return response.data;
  },

  // Request Email Verification
  requestEmailVerification: async () => {
    const response = await api.post('/accounts/email/verify/request/');
    return response.data;
  },

  // Verify Email OTP
  verifyEmailOTP: async (otp) => {
    const response = await api.post('/accounts/email/verify/confirm/', {
      otp_code: otp
    });
    return response.data;
  },
};

