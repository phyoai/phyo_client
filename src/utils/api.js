import axios from 'axios';
import secureAuthStorage from './secure-auth';

// ─── Auth Debugger ────────────────────────────────────────────────────────────
// Only active in development. Set localStorage.debug_auth = '1' in the browser
// console to enable at runtime: localStorage.setItem('debug_auth','1')
const isDev = process.env.NODE_ENV === 'development';

const authDebug = {
  _enabled: () => isDev && (typeof window !== 'undefined') && window.localStorage?.getItem('debug_auth') === '1',
  log:  (...args) => authDebug._enabled() && console.log  ('%c[AUTH]', 'color:#16a34a;font-weight:bold', ...args),
  warn: (...args) => authDebug._enabled() && console.warn ('%c[AUTH]', 'color:#f59e0b;font-weight:bold', ...args),
  error:(...args) => authDebug._enabled() && console.error('%c[AUTH]', 'color:#ef4444;font-weight:bold', ...args),
  group:(label, fn) => {
    if (!authDebug._enabled()) return;
    console.groupCollapsed(`%c[AUTH] ${label}`, 'color:#16a34a;font-weight:bold');
    fn();
    console.groupEnd();
  },
};

// Expose on window so devs can call window.authDebug.log() from console too
if (typeof window !== 'undefined' && isDev) window.__authDebug = authDebug;
// ─────────────────────────────────────────────────────────────────────────────

function getClientToken() {
  if (typeof window === 'undefined') return null;

  try {
    const fromLocalStorage = window.localStorage?.getItem('authToken');
    if (fromLocalStorage) {
      authDebug.log('Token source: localStorage');
      return fromLocalStorage;
    }
  } catch {
    // ignore
  }

  const fromCookie = getCookie('authToken');
  if (fromCookie) {
    authDebug.log('Token source: cookie');
    return fromCookie;
  }

  const fromMemory = secureAuthStorage.getToken();
  if (fromMemory) authDebug.log('Token source: in-memory (dev only)');
  return fromMemory;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getClientToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      authDebug.log(`→ ${config.method?.toUpperCase()} ${config.url}  [token attached]`);
    } else {
      authDebug.warn(`→ ${config.method?.toUpperCase()} ${config.url}  [NO token — request is unauthenticated]`);
    }
    return config;
  },
  (error) => {
    authDebug.error('Request setup failed:', error.message);
    return Promise.reject(error);
  }
);

// ── Logout state guard ────────────────────────────────────────────────────────
let _isLoggingOut = false;

function handleAuthFailure(reason) {
  if (_isLoggingOut) {
    authDebug.warn('handleAuthFailure called but logout already in progress — skipping');
    return;
  }
  if (typeof window === 'undefined') return;

  const publicPaths = ['/login', '/signup', '/brand/login', '/influencer/login', '/forgot-password', '/verify-phone'];
  if (publicPaths.some(p => window.location.pathname.startsWith(p))) {
    authDebug.warn(`handleAuthFailure skipped — already on public page: ${window.location.pathname}`);
    return;
  }

  authDebug.group(`AUTH FAILURE → logging out (reason: ${reason})`, () => {
    console.log('Current path :', window.location.pathname);
    console.log('Token in LS  :', !!localStorage.getItem('authToken'));
    console.log('Token in mem :', !!secureAuthStorage.getToken());
    console.log('UserData     :', secureAuthStorage.getUserData());
  });

  _isLoggingOut = true;

  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    // Only remove auth keys — do NOT sessionStorage.clear() as it wipes userData
    // needed for isAuthenticated() check on the login page redirect
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('auth_expired');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch (_) { /* ignore */ }

  secureAuthStorage.clearAuth();

  const isAdmin = window.location.pathname.startsWith('/admin');
  // Use sessionStorage instead of query param so the URL stays clean
  // and a refresh on /login won't re-trigger the "session expired" toast
  try { sessionStorage.setItem('auth_expired', '1'); } catch (_) {}
  window.location.href = isAdmin ? '/admin/login' : '/login';
}

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    _isLoggingOut = false;
    authDebug.log(`← ${response.status} ${response.config?.method?.toUpperCase()} ${response.config?.url}`);
    return response;
  },
  (error) => {
    const status    = error.response?.status;
    const url       = error.config?.url || '(unknown)';
    const method    = error.config?.method?.toUpperCase() || '?';
    const errorMsg  = error.response?.data?.message || error.message || '';

    if (!status) {
      // Network error / timeout — server unreachable
      authDebug.warn(`← NETWORK ERROR  ${method} ${url}  — server unreachable, NOT logging out`);
      return Promise.reject(error);
    }

    authDebug.warn(`← ${status} ${method} ${url}  message="${errorMsg}"`);

    if (status === 401) {
      authDebug.error(`401 on ${url} → triggering logout`);
      handleAuthFailure(`401 from ${url}`);
      return Promise.reject(error);
    }

    const isExpiredToken =
      status === 403 &&
      (errorMsg === 'Invalid or expired token' ||
        errorMsg === 'expired token' ||
        errorMsg === 'invalid token' ||
        errorMsg === 'jwt expired' ||
        errorMsg === 'jwt malformed');

    if (isExpiredToken) {
      authDebug.error(`403 with JWT error on ${url} → triggering logout`);
      handleAuthFailure(`403 jwt-error from ${url}`);
    } else if (status === 403) {
      authDebug.warn(`403 on ${url} — permission denied, NOT logging out (message: "${errorMsg}")`);
    }

    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const raw = parts.pop().split(';').shift();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

// Helper function to set cookie value
function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return;
  
  const maxAge = Math.max(1, Math.floor(days * 24 * 60 * 60));
  const isHttps = typeof window !== 'undefined' && window.location?.protocol === 'https:';

  // Keep it broadly compatible with middleware (cookie is read on the server).
  // On http://localhost we cannot set `Secure` or the browser will ignore it.
  const secureFlag = isHttps ? ';Secure' : '';

  // `Max-Age` tends to be more reliable than `expires` across environments.
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;Max-Age=${maxAge};SameSite=Lax${secureFlag}`;
}

// User API functions
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
  }
};

// Campaign API functions
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
      // API handoff doc: brand-owned campaigns endpoint is /campaigns/mine
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
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token); // also write 'token' key used by api-client.ts
    setCookie('authToken', token, 7);
  },
  
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
    if (!token) {
      authDebug.warn('validateToken: no token found — skipping validation');
      return false;
    }

    authDebug.log('validateToken: checking /auth/check-registration-status …');
    try {
      const response = await api.get('/auth/check-registration-status');
      authDebug.log('validateToken: token is valid ✓');
      return response.status === 200;
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        authDebug.error(`validateToken: 401 → token invalid, logging out`);
        authUtils.logout();
        return false;
      }
      // Network error, 500, ngrok down — do NOT logout
      authDebug.warn(`validateToken: status=${status ?? 'NO_RESPONSE'} — server may be down, keeping session alive`);
      return true;
    }
  },
  
  // Logout user — clears ALL auth stores (localStorage, cookie, in-memory)
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('token'); // also remove api-client.ts key
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('landing_search_results');
    localStorage.removeItem('landing_search_prompt');
    try {
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('auth_expired');
    } catch (_) {}
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    secureAuthStorage.clearAuth();
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
      const response = await api.get('/auth/check-registration-status');
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
  // Get list of influencers
  getInfluencers: async (params = {}) => {
    try {
      const response = await api.get('/influencers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

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
