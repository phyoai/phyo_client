'use client'
import { useRouter, usePathname } from 'next/navigation';

function getDashboardForPath(pathname) {
  if (pathname.startsWith('/brand')) return '/brand/dashboard';
  if (pathname.startsWith('/influencer')) return '/influencer/dashboard';
  if (pathname.startsWith('/user')) return '/user/dashboard';
  return '/';
}

/**
 * Returns a goBack(fallback?) function.
 * Uses router.back() only when the referrer is an internal non-login page.
 * Falls back to the provided route, or auto-detects the dashboard for the current role.
 */
export function useGoBack() {
  const router = useRouter();
  const pathname = usePathname();

  return (fallback) => {
    const safeFallback = fallback || getDashboardForPath(pathname);

    if (typeof window === 'undefined') {
      router.push(safeFallback);
      return;
    }

    const referrer = document.referrer;
    const origin = window.location.origin;
    const isInternalReferrer = referrer.startsWith(origin);
    const isLoginReferrer = referrer.includes('/login');

    if (isInternalReferrer && !isLoginReferrer && window.history.length > 1) {
      router.back();
    } else {
      router.push(safeFallback);
    }
  };
}
