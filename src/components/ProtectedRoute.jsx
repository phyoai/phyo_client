'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';

const ProtectedRoute = ({ children, userType, fallback }) => {
  const { isAuthenticated, getUserType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Starting auth check');
      try {
        const authenticated = isAuthenticated();
        console.log('ProtectedRoute: isAuthenticated =', authenticated);
        
        if (!authenticated) {
          // Only redirect if we're not already on the signup page
          const currentPath = window.location.pathname;
          console.log('ProtectedRoute: Not authenticated, current path =', currentPath);
          if (currentPath !== '/brand/signup') {
            const signupUrl = `/brand/signup?redirect=${encodeURIComponent(currentPath)}`;
            console.log('ProtectedRoute: Redirecting to', signupUrl);
            router.push(signupUrl);
            return;
          }
        }

        // If user type is specified, check if user has the required type
        if (userType && authenticated) {
          const currentUserType = getUserType();
          console.log('ProtectedRoute: Checking user type, required =', userType, 'current =', currentUserType);
          if (currentUserType !== userType) {
            // Redirect to brand signup if user type doesn't match
            const currentPath = window.location.pathname;
            const signupUrl = `/brand/signup?redirect=${encodeURIComponent(currentPath)}`;
            console.log('ProtectedRoute: User type mismatch, redirecting to', signupUrl);
            router.push(signupUrl);
            return;
          }
        }

        console.log('ProtectedRoute: Auth check passed, setting authorized = true');
        setAuthorized(true);
      } catch (error) {
        console.error('ProtectedRoute: Auth check failed:', error);
        // Only redirect on error if not already on signup page
        const currentPath = window.location.pathname;
        if (currentPath !== '/brand/signup') {
          const signupUrl = `/brand/signup?redirect=${encodeURIComponent(currentPath)}`;
          console.log('ProtectedRoute: Error occurred, redirecting to', signupUrl);
          router.push(signupUrl);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, getUserType, userType, router]);

  console.log('ProtectedRoute: Render state - loading =', loading, 'authorized =', authorized);

  if (loading) {
    console.log('ProtectedRoute: Showing loading state');
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!authorized) {
    console.log('ProtectedRoute: Not authorized, returning null');
    return null; // Will redirect, so don't render anything
  }

  console.log('ProtectedRoute: Authorized, rendering children');
  return children;
};

export default ProtectedRoute; 