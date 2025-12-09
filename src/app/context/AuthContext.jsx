'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('authToken') || getCookie('authToken');
        if (storedToken) {
          setToken(storedToken);
          // You can also verify the token with your backend here
          // For now, we'll assume the token is valid
          setUser({ token: storedToken }); // You can decode JWT or fetch user data
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

      if (response.ok) {
        const authToken = data.token;
        setToken(authToken);
        setUser(data.user || data.data || { email, token: authToken });
        
        // Store token in localStorage and cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', authToken);
          document.cookie = `authToken=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        }
        
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
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
        
        // Store token in localStorage and cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', authToken);
          document.cookie = `authToken=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        }
        
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
    // Clear all auth state first
    setUser(null);
    setToken(null);
    
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userEmail');
      
      // Clear cookies
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Force a hard redirect to login page to clear any cached state
      window.location.href = '/login';
    }
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