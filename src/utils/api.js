import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api',
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
      try {
        // Use adminToken for admin routes, else use authToken
        if (window.location.pathname.startsWith('/admin')) {
          if (isLocalStorageAvailable()) {
            token = localStorage.getItem('adminToken');
          }
        } else {
          if (isLocalStorageAvailable()) {
            token = localStorage.getItem('authToken');
          }
          // Fallback to cookie if localStorage failed
          if (!token) {
            token = getCookie('authToken');
          }
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Token retrieval failed:', e);
        // Try to get from cookie as fallback
        const cookieToken = getCookie('authToken');
        if (cookieToken) {
          config.headers.Authorization = `Bearer ${cookieToken}`;
        }
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
      ['authToken', 'token', 'adminToken', 'adminInfo', 'userData', 'userEmail', 'userInfo', 'landing_search_results', 'landing_search_prompt'].forEach((key) => localStorage.removeItem(key));

      if (typeof window !== 'undefined') {
        // Clear cookies
        ['authToken', 'userType', 'token'].forEach((name) => {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        });

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

// Helper function to detect if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Helper function to get cookie value
function getCookie(name) {
  if (typeof document === 'undefined') return null;

  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch (e) {
    console.warn('Cookie access failed:', e);
  }
  return null;
}

// Helper function to set cookie value
function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return;

  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie set failed:', e);
  }
}

// Auth API functions - Complete
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

  // Signup user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
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

  // Forgot password
  forgotPassword: async (data) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify reset code
  verifyResetCode: async (data) => {
    try {
      const response = await api.post('/auth/verify-reset-code', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password
  resetPassword: async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify email OTP
  verifyEmailOTP: async (data) => {
    try {
      const response = await api.post('/auth/verify-email-otp', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend email OTP
  resendEmailOTP: async (data) => {
    try {
      const response = await api.post('/auth/resend-email-otp', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get influencers list
  getInfluencers: async (params = {}) => {
    try {
      const response = await api.get('/auth/influencers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get influencer by ID
  getInfluencerById: async (id) => {
    try {
      const response = await api.get(`/auth/influencers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Google OAuth login
  googleLogin: async (data) => {
    try {
      const response = await api.post('/auth/google', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check registration status
  checkRegistrationStatus: async () => {
    try {
      const response = await api.get('/auth/check-registration-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get registration status (legacy)
  getRegistrationStatus: async () => {
    try {
      const response = await api.get('/auth/check-registration-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// User API functions - Complete
export const userAPI = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      const response = await api.patch('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await api.get('/users/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Campaign API functions - Complete
export const campaignAPI = {
  // Create a new campaign (with file upload support)
  createCampaign: async (campaignData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Handle product images (files)
      if (campaignData.productImages && campaignData.productImages.length > 0) {
        campaignData.productImages.forEach((img) => {
          if (img.file) {
            formData.append('productImages', img.file);
          }
        });
      }

      // Append all other fields as JSON strings (for nested objects)
      Object.keys(campaignData).forEach(key => {
        if (key !== 'productImages') {
          const value = campaignData[key];
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await api.post('/campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      const response = await api.get('/campaigns/mine', { params });
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
  },

  // Apply to campaign
  applyCampaign: async (campaignId, data = {}) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/apply`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Select influencer for campaign
  selectInfluencer: async (campaignId, influencerId) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/select`, { influencerId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Conversation API functions
export const conversationAPI = {
  // Get all conversations
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/conversations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get conversation by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create conversation
  create: async (data) => {
    try {
      const response = await api.post('/conversations', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete conversation
  delete: async (id) => {
    try {
      const response = await api.delete(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Message API functions
export const messageAPI = {
  // Send message
  send: async (data) => {
    try {
      const response = await api.post('/messages', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get messages by conversation
  getByConversation: async (conversationId, params = {}) => {
    try {
      const response = await api.get(`/messages/${conversationId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark message as read
  markRead: async (messageId) => {
    try {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete message
  delete: async (messageId) => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// File API functions
export const fileAPI = {
  // Upload file
  upload: async (formData) => {
    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete file
  delete: async (key) => {
    try {
      const response = await api.delete('/files', { params: { key } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Influencer Data API functions
export const influencerDataAPI = {
  // Create influencer data
  create: async (data) => {
    try {
      const response = await api.post('/influencer-data', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all influencer data
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/influencer-data', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/influencer-data/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get by username
  getByUsername: async (username) => {
    try {
      const response = await api.get(`/influencer-data/username/${username}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update by ID
  update: async (id, data) => {
    try {
      const response = await api.patch(`/influencer-data/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update by username
  updateByUsername: async (username, data) => {
    try {
      const response = await api.patch(`/influencer-data/username/${username}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete by ID
  delete: async (id) => {
    try {
      const response = await api.delete(`/influencer-data/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete by username
  deleteByUsername: async (username) => {
    try {
      const response = await api.delete(`/influencer-data/username/${username}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search
  search: async (query) => {
    try {
      const response = await api.get('/influencer-data/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search by name
  searchByName: async (name) => {
    try {
      const response = await api.get('/influencer-data/search/name', { params: { name } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search by username
  searchByUsername: async (username) => {
    try {
      const response = await api.get('/influencer-data/search/username', { params: { username } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Advanced search
  advancedSearch: async (params = {}) => {
    try {
      const response = await api.get('/influencer-data/search/advanced', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stats
  getStats: async () => {
    try {
      const response = await api.get('/influencer-data/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Project API functions (Service Provider)
export const projectAPI = {
  // Get all projects
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create project
  create: async (data) => {
    try {
      const response = await api.post('/projects', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update project
  update: async (id, data) => {
    try {
      const response = await api.put(`/projects/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stats
  getStats: async () => {
    try {
      const response = await api.get('/projects/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Portfolio API functions (Service Provider)
export const portfolioAPI = {
  // Get all portfolios
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/portfolios', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get portfolio by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/portfolios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create portfolio
  create: async (data) => {
    try {
      const response = await api.post('/portfolios', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update portfolio
  update: async (id, data) => {
    try {
      const response = await api.put(`/portfolios/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete portfolio
  delete: async (id) => {
    try {
      const response = await api.delete(`/portfolios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stats
  getStats: async (id) => {
    try {
      const response = await api.get(`/portfolios/stats/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add client
  addClient: async (portfolioId, data) => {
    try {
      const response = await api.post(`/portfolios/${portfolioId}/clients`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update client
  updateClient: async (portfolioId, clientId, data) => {
    try {
      const response = await api.put(`/portfolios/${portfolioId}/clients/${clientId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove client
  removeClient: async (portfolioId, clientId) => {
    try {
      const response = await api.delete(`/portfolios/${portfolioId}/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Payment API functions
export const paymentAPI = {
  // Get plans
  getPlans: async () => {
    try {
      const response = await api.get('/payments/plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current plan
  getCurrentPlan: async () => {
    try {
      const response = await api.get('/payments/current-plan');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get credits
  getCredits: async () => {
    try {
      const response = await api.get('/payments/credits');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create Silver order
  createSilverOrder: async (data = {}) => {
    try {
      const response = await api.post('/payments/order/silver', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create Gold order
  createGoldOrder: async (data = {}) => {
    try {
      const response = await api.post('/payments/order/gold', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create Premium order
  createPremiumOrder: async (data = {}) => {
    try {
      const response = await api.post('/payments/order/premium', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify payment
  verifyPayment: async (data) => {
    try {
      const response = await api.post('/payments/verify', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment history
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/payments/history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const response = await api.post('/payments/cancel');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Test webhook
  testWebhook: async () => {
    try {
      const response = await api.post('/payments/webhook-test');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Brand API functions - Fixed endpoints
export const brandAPI = {
  // Signup
  signup: async (brandData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.post('/brand/signup', brandData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/brand/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get list of brands
  getBrands: async (params = {}) => {
    try {
      const response = await api.get('/brands', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update profile
  updateProfile: async (updateData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.put('/brand/profile', updateData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (data) => {
    try {
      const response = await api.put('/brand/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Legacy: submitRegistration
  submitRegistration: async (brandData, isFormData = false) => {
    return brandAPI.signup(brandData, isFormData);
  }
};

// Influencer API functions - Fixed endpoints
export const influencerAPI = {
  // Get list of influencers
  getInfluencers: async (params = {}) => {
    try {
      const response = await api.get('/influencers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get influencer by ID
  getInfluencerById: async (id) => {
    try {
      const response = await api.get(`/influencers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Signup
  signup: async (influencerData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.post('/influencer/signup', influencerData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/influencer/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update profile
  updateProfile: async (updateData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};

      const response = await api.put('/influencer/profile', updateData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (data) => {
    try {
      const response = await api.put('/influencer/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Legacy: submitRegistration
  submitRegistration: async (influencerData, isFormData = false) => {
    return influencerAPI.signup(influencerData, isFormData);
  }
};

// Admin API functions - Complete
export const adminAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (data) => {
    try {
      const response = await api.put('/admin/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get requests
  getRequests: async (params = {}) => {
    try {
      const response = await api.get('/brand-requests/admin/requests', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get request by ID
  getRequestById: async (id) => {
    try {
      const response = await api.get(`/brand-requests/admin/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve brand request
  approveBrand: async (id, data = {}) => {
    try {
      const response = await api.put(`/brand-requests/admin/requests/${id}/approve`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject request
  rejectRequest: async (id, data = {}) => {
    try {
      const response = await api.put(`/brand-requests/admin/requests/${id}/reject`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stats
  getStats: async () => {
    try {
      const response = await api.get('/brand-requests/admin/requests/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create admin
  createAdmin: async (data) => {
    try {
      const response = await api.post('/admin/create', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // List admins
  listAdmins: async (params = {}) => {
    try {
      const response = await api.get('/admin/list', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get influencer requests
  getInfluencerRequests: async (params = {}) => {
    try {
      const response = await api.get('/influencer-requests/admin/requests', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve influencer
  approveInfluencer: async (id, data = {}) => {
    try {
      const response = await api.put(`/influencer-requests/admin/requests/${id}/approve`, data);
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
  // Set authentication token in both localStorage and cookies
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem('authToken', token);
      }
    } catch (e) {
      console.warn('Failed to set token in localStorage:', e);
    }
    // Always set in cookie as fallback
    setCookie('authToken', token, 7);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    try {
      let token = null;
      if (isLocalStorageAvailable()) {
        token = localStorage.getItem('authToken');
      }
      if (!token) {
        token = getCookie('authToken');
      }
      return !!token;
    } catch (e) {
      console.warn('Auth check failed:', e);
      return false;
    }
  },

  // Get current user token
  getToken: () => {
    if (typeof window === 'undefined') return null;
    try {
      let token = null;
      if (isLocalStorageAvailable()) {
        token = localStorage.getItem('authToken');
      }
      if (!token) {
        token = getCookie('authToken');
      }
      return token;
    } catch (e) {
      console.warn('Token retrieval failed:', e);
      return getCookie('authToken');
    }
  },

  // Validate token by making a lightweight API call
  validateToken: async () => {
    if (typeof window === 'undefined') return false;

    try {
      let token = null;
      if (isLocalStorageAvailable()) {
        token = localStorage.getItem('authToken');
      }
      if (!token) {
        token = getCookie('authToken');
      }
      if (!token) return false;

      // Make a lightweight API call to verify token
      const response = await api.get('/auth/check-registration-status');
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

    // Try to clear localStorage if available
    try {
      if (isLocalStorageAvailable()) {
        ['authToken', 'token', 'adminToken', 'adminInfo', 'userData', 'userEmail', 'userInfo', 'landing_search_results', 'landing_search_prompt'].forEach((key) => localStorage.removeItem(key));
      }
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }

    // Always clear cookies
    ['authToken', 'userType', 'token'].forEach((name) => {
      try {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      } catch (e) {
        console.warn('Failed to clear cookie:', e);
      }
    });
  }
};

export default api;
