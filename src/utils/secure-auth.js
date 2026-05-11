/**
 * Secure Authentication Storage
 * Uses memory storage + httpOnly cookies (set by backend)
 * Prevents XSS attacks from stealing tokens
 */

let secureTokenStore = {
  token: null,
  userData: null,
  lastRefresh: null,
};

/**
 * Get auth token - NEVER expose in client-side JS in production
 * Tokens should only exist in httpOnly cookies set by backend
 */
export const secureAuthStorage = {
  /**
   * Set token in memory (backend should use httpOnly cookies)
   */
  setToken: (token) => {
    if (!token) {
      console.warn('⚠️ Attempted to set empty token');
      return false;
    }

    // Only store in memory during development
    if (process.env.NODE_ENV === 'development') {
      secureTokenStore.token = token;
      secureTokenStore.lastRefresh = Date.now();
    }

    // In production, rely only on httpOnly cookies from backend
    return true;
  },

  /**
   * Get token from httpOnly cookie (cannot access from JS in production)
   * Returns null - cookies are sent automatically by browser
   */
  getToken: () => {
    if (typeof document === 'undefined') return null;

    // In production, DO NOT try to access token from JS
    // It should only be in httpOnly cookies
    if (process.env.NODE_ENV === 'production') {
      return null;
    }

    // Development only
    return secureTokenStore.token;
  },

  /**
   * Store user data in memory (not sensitive)
   */
  setUserData: (userData) => {
    if (!userData) {
      secureTokenStore.userData = null;
      return;
    }

    // Only store non-sensitive user info in memory
    const safeUserData = {
      _id: userData._id,
      email: userData.email,
      type: userData.type,
      name: userData.name,
      brandRegistrationStatus: userData.brandRegistrationStatus,
      influencerRegistrationStatus: userData.influencerRegistrationStatus,
    };

    secureTokenStore.userData = safeUserData;

    // Also store in sessionStorage for page refresh (cleared on browser close)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('userData', JSON.stringify(safeUserData));
      } catch (e) {
        console.error('Failed to store user data:', e);
      }
    }
  },

  /**
   * Get user data from memory or sessionStorage
   */
  getUserData: () => {
    if (secureTokenStore.userData) {
      return secureTokenStore.userData;
    }

    if (typeof window !== 'undefined') {
      try {
        const data = sessionStorage.getItem('userData');
        if (data) {
          secureTokenStore.userData = JSON.parse(data);
          return secureTokenStore.userData;
        }
      } catch (e) {
        console.error('Failed to retrieve user data:', e);
      }
    }

    return null;
  },

  /**
   * Clear all auth data
   */
  clearAuth: () => {
    secureTokenStore = {
      token: null,
      userData: null,
      lastRefresh: null,
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        // Clear auth cookie via document.cookie flag
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict;';
      } catch (e) {
        console.error('Error clearing auth:', e);
      }
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const userData = secureAuthStorage.getUserData();
    return userData !== null && userData._id !== null;
  },

  /**
   * Get user email (non-sensitive)
   */
  getUserEmail: () => {
    const userData = secureAuthStorage.getUserData();
    return userData?.email || null;
  },

  /**
   * Get user type for role-based access
   */
  getUserType: () => {
    const userData = secureAuthStorage.getUserData();
    return userData?.type || null;
  },

  /**
   * Check if token needs refresh (older than 1 hour)
   */
  shouldRefreshToken: () => {
    const lastRefresh = secureTokenStore.lastRefresh;
    if (!lastRefresh) return true;

    const ONE_HOUR = 60 * 60 * 1000;
    return Date.now() - lastRefresh > ONE_HOUR;
  },
};

export default secureAuthStorage;
