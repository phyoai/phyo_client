'use client'
import React, { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import BrandSidebar from '../../components/BrandSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function BrandLayout({ children }) {
  const pathname = usePathname();
  
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
    <div className="flex min-h-screen bg-[#F5F3EE]">
      <BrandSidebar />
      <main className="flex-1 ml-64 bg-[#F3F2EB]">
        {children}
      </main>
    </div>
  );
} 





