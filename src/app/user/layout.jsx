'use client'
import React, { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from '../../components/UserSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function UserLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();
  
  // Debug logging
  useEffect(() => {
    console.log('UserLayout: pathname =', pathname);
  }, [pathname]);
  
  // Don't show sidebar for specific pages
  const isAuthPage = pathname === '/user/signup' || pathname === '/user/login';
  const isCreateCampaignPage = pathname === '/user/campaigns/create-campaign';
  const isNewApplicationsPage = pathname === '/user/campaigns/new-applications';
  const isAllCampaignsPage = pathname === '/user/campaigns/all-campaigns';
  const isAllDraftsPage = pathname === '/user/campaigns/all-drafts';
  const isInfluencerSearchPage = pathname === '/user/influencer-search';
  const isInfluencersPage = pathname === '/user/influencers';
  const isNotificationsPage = pathname === '/user/notifications';
  // Hide sidebar for all account sub-pages (but not the main account page)
  const isAccountSubPage = pathname.startsWith('/user/account/');
  // Hide sidebar for dynamic campaign details page only
  const isCampaignDetailsPage =
    pathname.startsWith('/user/campaigns/') &&
    !pathname.includes('/create-campaign') &&
    !pathname.includes('/new-applications') &&
    !pathname.includes('/all-campaigns') &&
    !pathname.includes('/all-drafts');
  // Hide sidebar for inbox page
  const isInboxPage = pathname === '/user/inbox';

  if (
    isAuthPage ||
    isCreateCampaignPage ||
    isNewApplicationsPage ||
    isAllCampaignsPage ||
    isAllDraftsPage ||
    isInfluencerSearchPage ||
    isInfluencersPage ||
    isNotificationsPage ||
    isAccountSubPage ||
    isCampaignDetailsPage ||
    isInboxPage
  ) {
    // console.log('UserLayout: Rendering page without sidebar');
    return <>{children}</>;
  }
  
  // console.log('UserLayout: Rendering layout with sidebar');
  
  return (
    <div className="flex min-h-screen bg-neutral-base">
      <UserSidebar />
      <main className={`flex-1 bg-neutral-base text-text-base border-l border-primary transition-all duration-300 ease-in-out ${
        isExpanded ? 'ml-[240px]' : 'ml-[80px]'
      } h-screen overflow-y-auto p-8`}>
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






