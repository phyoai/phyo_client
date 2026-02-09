'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '../../utils/api';

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
      
      const storedToken = localStorage.getItem('authToken') || getCookie('authToken');
      const storedUserData = localStorage.getItem('userData');
      
      if (storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          // If parsing fails, clear everything
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
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
      const response = await fetch('https://api.phyo.ai/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API Response:', data); // Debug log

      if (response.ok) {
        const authToken = data.token;
        const userData = data.user || data.data || { email, token: authToken };
        
        setToken(authToken);
        setUser(userData);
        
        // Store token and user data in localStorage and cookie using authUtils
        authUtils.setToken(authToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(userData));
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
            // User hasn't completed any registration
            redirectPath = '/user/dashboard';
          }
        } else if (userData.type === 'BRAND') {
          redirectPath = '/brand/dashboard';
        } else if (userData.type === 'INFLUENCER') {
          redirectPath = '/influencer/dashboard';
        }
        
        return { success: true, data, redirectPath };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await fetch('https://api.phyo.ai/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const authToken = data.token;
        setToken(authToken);
        setUser(data.data || data.user || { email: userData.email, token: authToken });
        
        // Store token in localStorage and cookie using authUtils
        authUtils.setToken(authToken);
        
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage first
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userEmail');
      
      // Clear cookies
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    // Clear all auth state after clearing storage
    setUser(null);
    setToken(null);
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