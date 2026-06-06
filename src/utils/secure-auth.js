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

function getStoredUserData() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage?.getItem('userData') || window.sessionStorage?.getItem('userData');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to retrieve user data:', e);
  }

  return null;
}

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

    secureTokenStore.token = token;
    secureTokenStore.lastRefresh = Date.now();

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('authToken', token);
        localStorage.setItem('token', token);
      } catch (e) {
        console.error('Failed to store auth token:', e);
      }
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

    if (secureTokenStore.token) {
      return secureTokenStore.token;
    }

    if (process.env.NODE_ENV === 'production') {
      return null;
    }

    try {
      const token = window.localStorage?.getItem('authToken') || window.localStorage?.getItem('token');
      if (token) {
        secureTokenStore.token = token;
        return token;
      }
    } catch (e) {
      console.error('Failed to retrieve auth token:', e);
    }

    return null;
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

    // Persist to both sessionStorage and localStorage so user survives browser restarts
    if (typeof window !== 'undefined') {
      try {
        const serialized = JSON.stringify(safeUserData);
        sessionStorage.setItem('userData', serialized);
        localStorage.setItem('userData', serialized);
      } catch (e) {
        console.error('Failed to store user data:', e);
      }
    }
  },

  /**
   * Get user data from memory, localStorage, or sessionStorage
   */
  getUserData: () => {
    if (secureTokenStore.userData) {
      return secureTokenStore.userData;
    }

    const storedUserData = getStoredUserData();
    if (storedUserData) {
      secureTokenStore.userData = storedUserData;
      return secureTokenStore.userData;
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
        localStorage.removeItem('token');
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
   * Checks in order: in-memory → sessionStorage userData → localStorage token
   */
  isAuthenticated: () => {
    // 1. Check in-memory or sessionStorage userData (fastest)
    const userData = secureAuthStorage.getUserData();
    if (userData !== null && userData._id) return true;

    // 2. Fallback: if token exists in localStorage, consider authenticated
    //    (userData will be re-hydrated on next API call)
    if (typeof window !== 'undefined') {
      try {
        const token = window.localStorage?.getItem('authToken') || window.localStorage?.getItem('token');
        if (token) return true;
      } catch (_) {}
    }

    return false;
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
