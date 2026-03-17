'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/slices/authSlice';

/**
 * AuthInitializer: Restores authentication state from localStorage on app startup
 * This ensures Redux auth state persists across page reloads and navigation
 */
export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      // Check if we have a saved token in localStorage
      const savedToken = localStorage.getItem('authToken');
      const savedUserData = localStorage.getItem('userData');

      if (savedToken && savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          // Restore the auth state to Redux
          dispatch(setToken(savedToken));
          console.log('[AuthInitializer] Restored auth state from localStorage');
        } catch (e) {
          console.warn('[AuthInitializer] Failed to parse saved user data:', e);
          // Clear corrupted data
          localStorage.removeItem('userData');
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.warn('[AuthInitializer] Failed to restore auth state:', error);
    }
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
