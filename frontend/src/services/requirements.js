import api from './api';

export const requirementsService = {
  // Get all requirement templates
  getTemplates: async (params = {}) => {
    const response = await api.get('/requirements/templates/', { params });
    return response.data;
  },

  // Create requirement template (admin only)
  createTemplate: async (templateData) => {
    const response = await api.post('/requirements/templates/', templateData);
    return response.data;
  },

  // Get template details
  getTemplate: async (id) => {
    const response = await api.get(`/requirements/templates/${id}/`);
    return response.data;
  },

  // Apply template to job (admin only)
  applyTemplateToJob: async (templateId, jobId) => {
    const response = await api.post(`/requirements/templates/${templateId}/apply_to_job/`, { job_id: jobId });
    return response.data;
  },

  // Duplicate template (admin only)
  duplicateTemplate: async (id) => {
    const response = await api.post(`/requirements/templates/${id}/duplicate/`);
    return response.data;
  },
};
