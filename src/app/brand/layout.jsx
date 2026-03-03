'use client'
import React, { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import BrandSidebar from '../../components/BrandSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function BrandLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();
  
  // Debug logging
  useEffect(() => {
    console.log('BrandLayout: pathname =', pathname);
  }, [pathname]);
  
  // Don't show sidebar for specific pages
  const isAuthPage = pathname === '/brand/signup' || pathname === '/brand/login';
  const isCreateCampaignPage = pathname === '/brand/campaigns/create-campaign';
  const isNewApplicationsPage = pathname === '/brand/campaigns/new-applications';
  const isAllCampaignsPage = pathname === '/brand/campaigns/all-campaigns';
  const isAllDraftsPage = pathname === '/brand/campaigns/all-drafts';
  const isInfluencerSearchPage = pathname === '/brand/influencer-search';
  const isInfluencersPage = pathname === '/brand/influencers';
  const isNotificationsPage = pathname === '/brand/notifications';
  // Hide sidebar for all account sub-pages (but not the main account page)
  const isAccountSubPage = pathname.startsWith('/brand/account/');
  // Hide sidebar for dynamic campaign details page only
const isCampaignDetailsPage =
  pathname.startsWith('/brand/campaigns/') &&
  !pathname.includes('/create-campaign') &&
  !pathname.includes('/new-applications') &&
  !pathname.includes('/all-campaigns') &&
  !pathname.includes('/all-drafts');
  
  if (isAuthPage || isCreateCampaignPage || isNewApplicationsPage || isAllCampaignsPage || isAllDraftsPage || isInfluencerSearchPage || isInfluencersPage || isNotificationsPage || isAccountSubPage || isCampaignDetailsPage) {
    console.log('BrandLayout: Rendering page without sidebar');
    return <>{children}</>;
  }
  
  console.log('BrandLayout: Rendering layout with sidebar');
  
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





