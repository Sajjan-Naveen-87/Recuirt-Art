import api from './api';

export const enquiriesService = {
  // Submit a corporate enquiry
  submitEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiries/enquiries/', enquiryData);
    return response.data;
  },

  // Submit general contact us message
  submitContactUs: async (contactData) => {
    const response = await api.post('/enquiries/contact-us/', contactData);
    return response.data;
  },

  // Alternative enquiry submission endpoint
  submitCorporateEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiry/submit/', enquiryData);
    return response.data;
  },

  // Get all enquiries (admin only)
  getEnquiries: async (params = {}) => {
    const response = await api.get('/enquiries/enquiries/', { params });
    return response.data;
  },

  // Update enquiry status (admin only)
  updateEnquiryStatus: async (id, status, adminNotes = '') => {
    const response = await api.post(`/enquiries/enquiries/${id}/status/`, {
      status,
      admin_notes: adminNotes
    });
    return response.data;
  },
};

export default enquiriesService;

