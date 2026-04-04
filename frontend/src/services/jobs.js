import api from './api';

export const jobsService = {
  // Get all jobs from the Render backend
  getJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/jobs/', { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  // Get job details from the Render backend
  getJob: async (id) => {
    try {
      const response = await api.get(`/jobs/jobs/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },

  // Apply for job (Sending FormData directly to Render backend)
  applyForJob: async (formData) => {
    try {
      // Axios automatically sets current Content-Type for FormData
      const response = await api.post('/jobs/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      // Ensure the error response from the backend is accessible
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  // Get user's applications from the Render backend
  getMyApplications: async () => {
    try {
      const response = await api.get('/jobs/applications/me/');
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }
};
