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
      let token = null;
      // Use adminToken for admin routes, else use authToken
      if (window.location.pathname.startsWith('/admin')) {
        token = localStorage.getItem('adminToken');
      } else {
        token = localStorage.getItem('authToken') || getCookie('authToken');
      }
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
    // Handle 401 (Unauthorized) and 403 (Forbidden - Invalid/Expired Token)
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || '';
    
    // Check for authentication errors (401) or token expiry/invalid (403)
    if (status === 401 || (status === 403 && (errorMessage.includes('Invalid or expired token') || errorMessage.includes('token')))) {
      // Clear all auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('landing_search_results');
      localStorage.removeItem('landing_search_prompt');
      
      if (typeof window !== 'undefined') {
        // Clear cookies
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Redirect based on current path
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          // Only redirect if not already on login/register page
          window.location.href = '/login?expired=true';
        }
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
  
  // Validate token by making a lightweight API call
  validateToken: async () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken') || getCookie('authToken');
    if (!token) return false;
    
    try {
      // Make a lightweight API call to verify token
      const response = await api.get('/auth/registration-status');
      return response.status === 200;
    } catch (error) {
      // Token is invalid or expired
      authUtils.logout();
      return false;
    }
  },
  
  // Logout user
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('landing_search_results');
    localStorage.removeItem('landing_search_prompt');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get registration status
  getRegistrationStatus: async () => {
    try {
      const response = await api.get('/auth/registration-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Brand API functions
export const brandAPI = {
  // Submit brand registration
  submitRegistration: async (brandData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};
      
      const response = await api.post('/brand-requests/submit', brandData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get brand profile
  getProfile: async () => {
    try {
      const response = await api.get('/brand-requests/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update brand profile
  updateProfile: async (updateData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.put('/brand-requests/profile', updateData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin functions
  admin: {
    // Get all brand requests
    getRequests: async (params = {}) => {
      try {
        const response = await api.get('/brand-requests/admin/requests', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Approve brand request
    approveRequest: async (id, adminNotes = '') => {
      try {
        const response = await api.put(`/brand-requests/admin/requests/${id}/approve`, {
          admin_notes: adminNotes
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Reject brand request
    rejectRequest: async (id, adminNotes = '') => {
      try {
        const response = await api.put(`/brand-requests/admin/requests/${id}/reject`, {
          admin_notes: adminNotes
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  }
};

// Influencer API functions
export const influencerAPI = {
  // Submit influencer registration
 submitRegistration: async (influencerData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};
      
      const response = await api.post('/influencer-requests/submit', influencerData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get influencer profile
  getProfile: async () => {
    try {
      const response = await api.get('/influencer-requests/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update influencer profile
  updateProfile: async (updateData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.put('/influencer-requests/profile', updateData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin functions
  admin: {
    // Get all influencer requests
    getRequests: async (params = {}) => {
      try {
        const response = await api.get('/influencer-requests/admin/requests', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get single influencer request
    getRequest: async (id) => {
      try {
        const response = await api.get(`/influencer-requests/admin/requests/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Approve influencer request
    approveRequest: async (id, adminNotes = '') => {
      try {
        const response = await api.put(`/influencer-requests/admin/requests/${id}/approve`, {
          admin_notes: adminNotes
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Reject influencer request
    rejectRequest: async (id, adminNotes = '') => {
      try {
        const response = await api.put(`/influencer-requests/admin/requests/${id}/reject`, {
          admin_notes: adminNotes
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get influencer request stats
    getStats: async () => {
      try {
        const response = await api.get('/influencer-requests/admin/requests/stats');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  }
};

// Admin API functions
export const adminAPI = {
  // Admin login
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;