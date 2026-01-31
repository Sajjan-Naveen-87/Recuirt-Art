import api from './api';

export const profileService = {
  // Get current user's profile
  getProfile: async () => {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },

  // Update current user's profile
  updateProfile: async (profileData) => {
    const config = {};
    if (profileData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await api.put('/accounts/profile/', profileData, config);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async (params = {}) => {
    const response = await api.get('/jobs/applications/', { params });
    return response.data;
  },

  // Get application details
  getApplication: async (id) => {
    const response = await api.get(`/jobs/applications/${id}/`);
    return response.data;
  },
};

export default profileService;

