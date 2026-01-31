import api from './api';

export const feedbackService = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback/feedback/', feedbackData);
    return response.data;
  },

  // Get all feedback (admin/owner only)
  getFeedback: async (params = {}) => {
    const response = await api.get('/feedback/feedback/', { params });
    return response.data;
  },

  // Update feedback (admin only)
  updateFeedback: async (id, feedbackData) => {
    const response = await api.put(`/feedback/feedback/${id}/`, feedbackData);
    return response.data;
  },
};
