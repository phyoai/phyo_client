'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, authUtils } from '../../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      try {
        let storedToken = null;
        let storedUserData = null;

        // Try to get from localStorage first
        try {
          storedToken = localStorage.getItem('authToken');
          storedUserData = localStorage.getItem('userData');
        } catch (e) {
          console.warn('localStorage access failed, using cookie fallback:', e);
        }

        // Fallback to cookie if localStorage failed
        if (!storedToken) {
          storedToken = getCookie('authToken');
        }

        if (storedToken && storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setToken(storedToken);
            setUser(userData);
          } catch (error) {
            // If parsing fails, clear everything
            console.error('Failed to parse user data:', error);
            try {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
            } catch (e) {
              console.warn('Failed to clear localStorage:', e);
            }
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Helper function to get cookie
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Login function
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      console.log('Login API Response:', data); // Debug log

      const authToken = data.token;
      const userData = data.user || data.data || { email, token: authToken };

      setToken(authToken);
      setUser(userData);

      // Store token and user data in localStorage and cookie using authUtils
      authUtils.setToken(authToken);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (e) {
          console.warn('Failed to store userData in localStorage:', e);
        }
        // Store userType in cookie so middleware can enforce role-based routing
        const userType = userData.type || 'USER';
        try {
          document.cookie = `userType=${userType}; path=/; max-age=${7 * 24 * 60 * 60}`;
        } catch (e) {
          console.warn('Failed to set userType cookie:', e);
        }
      }

      // Determine redirect path based on user type and registration status
      let redirectPath = '/';

      if (userData.type === 'USER') {
        // Regular user - check if they need to complete registration
        if (userData.brandRegistrationStatus === 'COMPLETED') {
          redirectPath = '/brand/dashboard';
        } else if (userData.influencerRegistrationStatus === 'COMPLETED') {
          redirectPath = '/influencer/dashboard';
        } else {
          // UserLine hasn't completed any registration
          redirectPath = '/user/dashboard';
        }
      } else if (userData.type === 'BRAND') {
        redirectPath = '/brand/dashboard';
      } else if (userData.type === 'INFLUENCER') {
        redirectPath = '/influencer/dashboard';
      }

      return { success: true, data, redirectPath };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = typeof error === 'object' && error.message ? error.message : 'Network error';
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const data = await authAPI.signup(userData);

      const authToken = data.token;
      setToken(authToken);
      setUser(data.data || data.user || { email: userData.email, token: authToken });

      // Store token in localStorage and cookie using authUtils
      authUtils.setToken(authToken);

      return { success: true, data };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = typeof error === 'object' && error.message ? error.message : 'Network error';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      // Clear all localStorage keys
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('landing_search_results');
      localStorage.removeItem('landing_search_prompt');

      // Clear all auth-related cookies
      const cookiesToClear = ['authToken', 'userType', 'token'];
      cookiesToClear.forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      });
    }

    setUser(null);
    setToken(null);
    router.push('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Get user type
  const getUserType = () => {
    return user?.type || user?.userType || null;
  };

  // Check if user is a brand
  const isBrand = () => {
    return getUserType() === 'BRAND';
  };

  // Check if user is an influencer
  const isInfluencer = () => {
    return getUserType() === 'INFLUENCER';
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    getUserType,
    isBrand,
    isInfluencer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;