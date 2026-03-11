'use client'
import React, { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import InfluencerSidebar from '../../components/InfluencerSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { RoleProvider } from '../context/RoleContext';

function InfluencerLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();

  // Debug logging
  useEffect(() => {
    console.log('InfluencerLayout: pathname =', pathname);
  }, [pathname]);

  // Don't show sidebar for specific pages
  const isAuthPage = pathname === '/influencer/signup' || pathname === '/influencer/login';
  const isCreateCampaignPage = pathname === '/influencer/campaigns/create-campaign';
  const isNewApplicationsPage = pathname === '/influencer/campaigns/new-applications';
  const isAllCampaignsPage = pathname === '/influencer/campaigns/all-campaigns';
  const isAllDraftsPage = pathname === '/influencer/campaigns/all-drafts';
  const isInfluencerSearchPage = pathname === '/influencer/influencer-search';
  const isInfluencersPage = pathname === '/influencer/influencers';
  const isNotificationsPage = pathname === '/influencer/notifications';
  // Hide sidebar for all account sub-pages (but not the main account page)
  const isAccountSubPage = pathname.startsWith('/influencer/account/');
  // Hide sidebar for dynamic campaign details page only
  const isCampaignDetailsPage =
    pathname.startsWith('/influencer/campaigns/') &&
    !pathname.includes('/create-campaign') &&
    !pathname.includes('/new-applications') &&
    !pathname.includes('/all-campaigns') &&
    !pathname.includes('/all-drafts');
  // Hide sidebar for inbox page
  const isInboxPage = pathname === '/influencer/inbox';

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
    // console.log('InfluencerLayout: Rendering page without sidebar');
    return <>{children}</>;
  }

  // console.log('InfluencerLayout: Rendering layout with sidebar');

  return (
    <div className="flex min-h-screen bg-neutral-base">
      <InfluencerSidebar />
       <main
        className="bg-neutral-base text-text-base border-l border-primary transition-all duration-300 ease-in-out min-h-screen w-full"
        style={{
          marginLeft: isExpanded ? 240 : 80,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function InfluencerLayout({ children }) {
  const pathname = usePathname();

  return (
    <RoleProvider>
      <SidebarProvider>
        <InfluencerLayoutContent pathname={pathname}>
          {children}
        </InfluencerLayoutContent>
      </SidebarProvider>
    </RoleProvider>
  );
} 





