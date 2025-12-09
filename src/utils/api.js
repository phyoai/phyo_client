import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://api.phyo.ai/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies (only in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || getCookie('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to brand signup if needed
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const signupUrl = `/brand/signup?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = signupUrl;
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Campaign API functions
export const campaignAPI = {
  // Create a new campaign
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all campaigns
  getCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/campaigns', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get brand campaigns
  getBrandCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/campaigns/brand/my-campaigns', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get campaign by ID
  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update campaign
  updateCampaign: async (id, updateData) => {
    try {
      const response = await api.patch(`/campaigns/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// AI Search API functions
export const searchAPI = {
  // AI-powered influencer search
  askSearch: async (prompt) => {
    try {
      const response = await api.post('/ask', { prompt });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Auth utility functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken') || getCookie('authToken');
    return !!token;
  },
  
  // Get current user token
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || getCookie('authToken');
  },
  
  // Logout user
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

export default api; 