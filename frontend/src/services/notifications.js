import api from './api';

export const notificationsService = {
  // Get all notifications for current user
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications/notifications/', { params });
    return response.data;
  },

  // Get only unread notifications
  getUnreadNotifications: async () => {
    const response = await api.get('/notifications/notifications/unread/');
    return response.data;
  },

  // Get notification count
  getNotificationCount: async () => {
    const response = await api.get('/notifications/notifications/count/');
    return response.data;
  },

  // Mark specific notifications as read
  markAsRead: async (notificationIds = []) => {
    const response = await api.post('/notifications/notifications/mark_as_read/', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.post('/notifications/notifications/mark_as_read/', {});
    return response.data;
  },

  // Mark a single notification as read
  markSingleAsRead: async (id) => {
    const response = await api.post(`/notifications/notifications/${id}/read/`);
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/notifications/${id}/`);
    return response.data;
  },

  // Clear all read notifications
  clearAllRead: async () => {
    const response = await api.delete('/notifications/notifications/clear_all/');
    return response.data;
  },
};

export default notificationsService;

