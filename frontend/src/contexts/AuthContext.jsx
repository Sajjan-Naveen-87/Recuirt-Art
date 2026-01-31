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
          setUser(userData);
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

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

