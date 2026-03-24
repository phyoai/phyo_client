'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from '../../components/UserSidebar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function UserLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();

  const noSidebarRoutes = [
    '/user/campaigns/create-campaign',
    '/user/campaigns/new-applications',
    '/user/campaigns/all-campaigns',
    '/user/campaigns/all-drafts',
    '/user/influencer-search',
    '/user/influencers',
    '/user/notifications',
  ];

  const isNoSidebarRoute =
    noSidebarRoutes.some(r => pathname === r) ||
    pathname.startsWith('/user/account/') ||
    (pathname.startsWith('/user/campaigns/') &&
      !pathname.includes('/create-campaign') &&
      !pathname.includes('/new-applications') &&
      !pathname.includes('/all-campaigns') &&
      !pathname.includes('/all-drafts'));

  if (isNoSidebarRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      <UserSidebar />
      <main className={`flex-1 bg-[#FFFFFF] transition-all duration-300 ease-in-out ${
        isExpanded ? 'ml-[220px]' : 'ml-[96px]'
      } h-screen overflow-y-auto`}>
        {children}
      </main>
    </div>
  );
}

export default function UserLayout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <UserLayoutContent pathname={pathname}>
        {children}
      </UserLayoutContent>
    </SidebarProvider>
  );
}
