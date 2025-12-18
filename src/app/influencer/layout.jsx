"use client";
import React, { useEffect, useState } from 'react';
import InfluencerSidebar from '../../components/InfluencerSidebar';
import { usePathname } from 'next/navigation';


export default function BrandLayout({ children }) {
  // usePathname may be unstable during hydration; wait until mounted to avoid flash
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // While hydrating, render children only (no sidebar) to prevent brief sidebar flash on refresh
  if (!mounted) {
    return <>{children}</>;
  }

  const isSignup = pathname === '/influencer/signup';
  // Hide sidebar for standalone pages (signup) and detail pages
  const isDetailPage =
    /^\/influencer\/[^/]+$/.test(pathname) &&
    !['campaigns', 'dashboard', 'deals', 'earnings', 'help', 'inbox', 'profile-management', 'settings', 'signup'].some((seg) => pathname.includes(`/influencer/${seg}`));

  if (isSignup || isDetailPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <InfluencerSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}