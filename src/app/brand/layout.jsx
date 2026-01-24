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
  
  // Don't show sidebar for signup and login pages
  const isAuthPage = pathname === '/brand/signup' || pathname === '/brand/login';
  
  if (isAuthPage) {
    console.log('BrandLayout: Rendering auth page without sidebar');
    return <>{children}</>;
  }
  
  console.log('BrandLayout: Rendering layout with sidebar');
  
  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      <BrandSidebar />
      <main className={`flex-1 bg-[#FFFFFF] transition-all duration-300 ease-in-out ${
        isExpanded ? 'ml-80' : 'ml-20'
      }`}>
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





