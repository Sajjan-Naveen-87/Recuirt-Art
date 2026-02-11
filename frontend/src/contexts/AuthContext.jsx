import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Check if it's a demo token
        if (token === 'demo_token') {
          // Set demo user for development
          setUser({
            id: 1,
            email: 'demo@recruirtart.com',
            first_name: 'Demo',
            last_name: 'User',
            role: 'admin',
            is_demo: true
          });
          setLoading(false);
          return;
        }
        
        try {
          const userData = await authService.getProfile();
          // Extract user object if wrapped (ProfileView returns { user: {...}, applications: [...] })
          setUser(userData.user || userData);
        } catch (err) {
          // Token invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);
      // Handle different response structures from backend
      const userData = data.user || data.data?.user || data;
      setUser(userData);
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      // Automatically login or return data depending on backend response
      // If backend returns token, we can setUser
      if (data.tokens || data.access) {
         // Assuming register might return tokens same as login
         const user = data.user || data.data?.user || data;
         setUser(user);
         if (data.tokens?.access) localStorage.setItem('access_token', data.tokens.access);
         if (data.tokens?.refresh) localStorage.setItem('refresh_token', data.tokens.refresh);
      }
      return data;
    } catch (err) {

      let message = err.response?.data?.error || err.message || 'Registration failed.';
      // Handle DRF field errors
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.error) {
         const values = Object.values(err.response.data).flat();
         if (values.length > 0) message = values.join(' ');
      }
      setError(message);
      throw new Error(message);
    }
  };

  const sendOTP = async (mobile, type = 'login') => {
    try {
      setError(null);
      return await authService.sendOTP(mobile, type);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to send OTP.';
      setError(message);
      throw new Error(message);
    }
  };

  const verifyOTP = async (mobile, otp, type = 'login') => {
    try {
      setError(null);
      const data = await authService.verifyOTP(mobile, otp, type);
       if (data.tokens || data.access) {
         const user = data.user || data.data?.user || data;
         setUser(user);
         if (data.tokens?.access) localStorage.setItem('access_token', data.tokens.access);
         if (data.tokens?.refresh) localStorage.setItem('refresh_token', data.tokens.refresh);
      }
      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Invalid OTP.';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    sendOTP,
    verifyOTP,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

