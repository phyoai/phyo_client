'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';

function ServiceProviderLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();
  const isSignupPage = pathname === '/service-provider/signup';

  // For signup page, render without sidebar and dashboard layout
  if (isSignupPage) {
    return <>{children}</>;
  }

  // For other pages, render with sidebar and dashboard layout
  return (
    <div className="flex min-h-screen bg-neutral-base">
      <ServiceProviderSidebar />
      <main className={`flex-1 bg-neutral-base text-text-base transition-all duration-300 ease-in-out ${
        isExpanded ? 'ml-[240px]' : 'ml-[80px]'
      } p-8`}>
        {children}
      </main>
    </div>
  );
}

export default function ServiceProviderLayout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <ServiceProviderLayoutContent pathname={pathname}>
        {children}
      </ServiceProviderLayoutContent>
    </SidebarProvider>
  );
} 