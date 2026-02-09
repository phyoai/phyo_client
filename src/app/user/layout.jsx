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
  const isCreateCampaignPage = pathname === '/user/campaigns/create-campaign';
  const isNewApplicationsPage = pathname === '/user/campaigns/new-applications';
  const isAllCampaignsPage = pathname === '/user/campaigns/all-campaigns';
  const isAllDraftsPage = pathname === '/user/campaigns/all-drafts';
  const isInfluencerSearchPage = pathname === '/user/influencer-search';
  const isInfluencersPage = pathname === '/user/influencers';
  const isNotificationsPage = pathname === '/user/notifications';
  // Hide sidebar for all account sub-pages (but not the main account page)
  const isAccountSubPage = pathname.startsWith('/user/account/');
  
  if (isCreateCampaignPage || isNewApplicationsPage || isAllCampaignsPage || isAllDraftsPage || isInfluencerSearchPage || isInfluencersPage || isNotificationsPage || isAccountSubPage) {
    console.log('UserLayout: Rendering page without sidebar');
    return <>{children}</>;
  }
  
  console.log('UserLayout: Rendering layout with sidebar');
  
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






