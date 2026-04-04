import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://recruit-art-backend.onrender.com';

export const contentService = {
    /**
     * Fetch active news items
     */
    getNews: async () => {
        const response = await axios.get(`${API_URL}/api/content/news/`);
        return response.data;
    },

    /**
     * Get current visitor count
     */
    getVisitorCount: async () => {
        const response = await axios.get(`${API_URL}/api/content/visitors/`);
        return response.data.count;
    },

    /**
     * Increment visitor count (should be called once per session)
     */
    incrementVisitors: async () => {
        const response = await axios.post(`${API_URL}/api/content/visitors/`);
        return response.data.count;
    }
};
