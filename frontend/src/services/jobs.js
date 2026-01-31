import api from './api';

export const jobsService = {
  // Get all jobs
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs/jobs/', { params });
    return response.data;
  },

  // Get job details
  getJob: async (id) => {
    const response = await api.get(`/jobs/jobs/${id}/`);
    return response.data;
  },

  // Create job (admin only)
  createJob: async (jobData) => {
    const response = await api.post('/jobs/jobs/', jobData);
    return response.data;
  },

  // Update job (admin only)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/jobs/${id}/`, jobData);
    return response.data;
  },

  // Delete job (admin only)
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/jobs/${id}/`);
    return response.data;
  },

  // Get job requirements
  getJobRequirements: async (jobId) => {
    const response = await api.get(`/jobs/jobs/${jobId}/requirements/`);
    return response.data;
  },

  // Get job applications (admin only)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/jobs/jobs/${jobId}/applications/`);
    return response.data;
  },

  // Apply for job
  applyForJob: async (applicationData) => {
    const config = {};
    if (applicationData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await api.post('/jobs/applications/', applicationData, config);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await api.get('/jobs/applications/');
    return response.data;
  },

  // Get application details
  getApplication: async (id) => {
    const response = await api.get(`/jobs/applications/${id}/`);
    return response.data;
  },
};
