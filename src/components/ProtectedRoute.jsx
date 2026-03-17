'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks';

const ProtectedRoute = ({ children, userType, fallback }) => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Starting auth check, isAuthenticated =', isAuthenticated);
      try {
        if (!isAuthenticated) {
          // Not authenticated, redirect to login
          const currentPath = window.location.pathname;
          console.log('ProtectedRoute: Not authenticated, current path =', currentPath);
          if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
            const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
            console.log('ProtectedRoute: Redirecting to', loginUrl);
            router.push(loginUrl);
            return;
          }
        }

        // If user type is specified, check if user has the required type
        if (userType && isAuthenticated && user) {
          const currentUserType = user.type;
          console.log('ProtectedRoute: Checking user type, required =', userType, 'current =', currentUserType);
          if (currentUserType !== userType) {
            // Redirect to appropriate dashboard based on actual user type
            const currentPath = window.location.pathname;
            let redirectUrl = '/login';
            if (currentUserType === 'BRAND') {
              redirectUrl = '/brand/dashboard';
            } else if (currentUserType === 'INFLUENCER') {
              redirectUrl = '/influencer/dashboard';
            } else if (currentUserType === 'USER') {
              redirectUrl = '/user/dashboard';
            }
            console.log('ProtectedRoute: User type mismatch, redirecting to', redirectUrl);
            router.push(redirectUrl);
            return;
          }
        }

        console.log('ProtectedRoute: Auth check passed, setting authorized = true');
        setAuthorized(true);
      } catch (error) {
        console.error('ProtectedRoute: Auth check failed:', error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, userType, router]);

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