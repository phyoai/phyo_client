'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import secureAuthStorage from '../../utils/secure-auth';

const AuthContext = createContext(null);

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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Initialize auth on mount - MEMOIZED
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      setMounted(true);
      return;
    }

    try {
      const userData = secureAuthStorage.getUserData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AUTH] Failed to initialize auth:', error);
      }
    } finally {
      setLoading(false);
      setMounted(true);
    }
  }, []);

  // Memoized login function
  const login = useCallback(async (email, password) => {
    try {
      // Input validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include httpOnly cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const userData = data.user || data.data || { email };

        // Store securely
        secureAuthStorage.setToken(data.token);
        secureAuthStorage.setUserData(userData);
        setUser(userData);

        // Determine redirect path
        let redirectPath = '/';
        if (userData.type === 'USER') {
          redirectPath = userData.brandRegistrationStatus === 'COMPLETED'
            ? '/brand/dashboard'
            : userData.influencerRegistrationStatus === 'COMPLETED'
            ? '/influencer/dashboard'
            : '/user/dashboard';
        } else if (userData.type === 'BRAND') {
          redirectPath = '/brand/dashboard';
        } else if (userData.type === 'INFLUENCER') {
          redirectPath = '/influencer/dashboard';
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('[AUTH] Login successful');
        }

        return { success: true, redirectPath };
      } else {
        const errorMsg = data.message || 'Login failed';
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AUTH] Login failed:', errorMsg);
        }
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('[AUTH] Login error:', error.message);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  // Memoized signup function
  const signup = useCallback(async (formData) => {
    try {
      if (!formData.email || !formData.password) {
        return { success: false, error: 'Email and password are required' };
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const userData = data.user || data.data || { email: formData.email };

        secureAuthStorage.setToken(data.token);
        secureAuthStorage.setUserData(userData);
        setUser(userData);

        if (process.env.NODE_ENV === 'development') {
          console.log('[AUTH] Signup successful');
        }

        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('[AUTH] Signup error:', error.message);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  // Memoized logout function
  const logout = useCallback(() => {
    secureAuthStorage.clearAuth();
    setUser(null);

    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] User logged out');
    }
  }, []);

  // Memoized check functions
  const isAuthenticated = useCallback(() => {
    return secureAuthStorage.isAuthenticated();
  }, []);

  const getUserType = useCallback(() => {
    return user?.type || user?.userType || null;
  }, [user]);

  const isBrand = useCallback(() => {
    return getUserType() === 'BRAND';
  }, [getUserType]);

  const isInfluencer = useCallback(() => {
    return getUserType() === 'INFLUENCER';
  }, [getUserType]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    mounted,
    login,
    signup,
    logout,
    isAuthenticated,
    getUserType,
    isBrand,
    isInfluencer,
  }), [user, loading, mounted, login, signup, logout, isAuthenticated, getUserType, isBrand, isInfluencer]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
