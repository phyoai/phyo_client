'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';

export default function ServiceProviderLayout({ children }) {
  const pathname = usePathname();
  const isSignupPage = pathname === '/service-provider/signup';

  // For signup page, render without sidebar and dashboard layout
  if (isSignupPage) {
    return <>{children}</>;
  }

  // For other pages, render with sidebar and dashboard layout
  return (
    <div className="flex min-h-screen">
      <ServiceProviderSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 