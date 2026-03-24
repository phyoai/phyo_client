'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import BrandSidebar from '../../components/BrandSidebar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function BrandLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();

  const noSidebarRoutes = [
    '/brand/signup',
    '/brand/login',
    '/brand/campaigns/create-campaign',
    '/brand/campaigns/new-applications',
    '/brand/campaigns/all-campaigns',
    '/brand/campaigns/all-drafts',
    '/brand/influencer-search',
    '/brand/influencers',
    '/brand/notifications',
  ];

  const isNoSidebarRoute =
    noSidebarRoutes.some(r => pathname === r) ||
    pathname.startsWith('/brand/account/') ||
    (pathname.startsWith('/brand/campaigns/') &&
      !pathname.includes('/create-campaign') &&
      !pathname.includes('/new-applications') &&
      !pathname.includes('/all-campaigns') &&
      !pathname.includes('/all-drafts'));

  if (isNoSidebarRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] dark:bg-[#121212]">
      <BrandSidebar />
      <main className={`flex-1 bg-[#FFFFFF] dark:bg-[#121212] transition-all duration-300 ease-in-out ${
        isExpanded ? 'ml-[220px]' : 'ml-[96px]'
      } h-screen overflow-y-auto`}>
        {children}
      </main>
    </div>
  );
}

export default function BrandLayout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <BrandLayoutContent pathname={pathname}>
        {children}
      </BrandLayoutContent>
    </SidebarProvider>
  );
}
