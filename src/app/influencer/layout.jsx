"use client";
import React from 'react';
import InfluencerSidebar from '../../components/InfluencerSidebar';


export default function BrandLayout({ children }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  // Hide sidebar if path matches /influencer/[something] and not a known subpage
  const isDetailPage =
    /^\/influencer\/[^/]+$/.test(pathname) &&
    !['campaigns', 'dashboard', 'deals', 'earnings', 'help', 'inbox', 'profile-management', 'settings', 'signup'].some((seg) => pathname.includes(`/influencer/${seg}`));

  if (isDetailPage) {
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