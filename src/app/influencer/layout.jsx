'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import BrandSidebar from '../../components/BrandSidebar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function InfluencerLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();

  const noSidebarRoutes = [
    '/influencer/signup',
    '/influencer/login',
    '/influencer/campaigns/create-campaign',
    '/influencer/campaigns/new-applications',
    '/influencer/campaigns/all-campaigns',
    '/influencer/campaigns/all-drafts',
    '/influencer/influencer-search',
    '/influencer/influencers',
    '/influencer/notifications',
  ];

  const isNoSidebarRoute =
    noSidebarRoutes.some(r => pathname === r) ||
    pathname.startsWith('/influencer/account/') ||
    (pathname.startsWith('/influencer/campaigns/') &&
      !pathname.includes('/create-campaign') &&
      !pathname.includes('/new-applications') &&
      !pathname.includes('/all-campaigns') &&
      !pathname.includes('/all-drafts'));

  if (isNoSidebarRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      <BrandSidebar />
      <main className={`flex-1 bg-[#FFFFFF] transition-all duration-300 ease-in-out ${
        isExpanded ? 'ml-[220px]' : 'ml-[96px]'
      } h-screen overflow-y-auto`}>
        {children}
      </main>
    </div>
  );
}

export default function InfluencerLayout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <InfluencerLayoutContent pathname={pathname}>
        {children}
      </InfluencerLayoutContent>
    </SidebarProvider>
  );
}
