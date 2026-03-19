'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authUtils } from '@/utils/api';

/**
 * This component monitors Redux auth state and ensures tokens/user info
 * are properly synced to cookies whenever authentication changes.
 * This handles all auth flows: login, signup, OTP verification, Google login, etc.
 */
export default function AuthCookieSyncer() {
  const { isAuthenticated, token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || loading) {
      return;
    }

    // Set authToken cookie when user is authenticated
    if (token) {
      authUtils.setToken(token);
    }

    // Set userType cookie for middleware role-based routing
    if (user?.type) {
      const userType = user.type;
      try {
        // Use the same setCookie approach as login page for consistency
        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.cookie = `userType=${userType};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      } catch (e) {
        console.warn('Failed to set userType cookie:', e);
      }
    }
  }, [isAuthenticated, token, user, loading]);

  // This component doesn't render anything
  return null;
}
