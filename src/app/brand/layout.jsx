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
  
  // Don't protect the signup page
  const isSignupPage = pathname === '/brand/signup';
  
  if (isSignupPage) {
    console.log('BrandLayout: Rendering signup page without protection');
    return <>{children}</>;
  }
  
  console.log('BrandLayout: Rendering protected layout');
  
  // Disabled ProtectedRoute for development
  // return (
  //   <Suspense fallback={<div>Loading...</div>}>
  //     <ProtectedRoute userType="BRAND">
  //       <div className="flex min-h-screen">
  //         <BrandSidebar />
  //         <main className="flex-1 ml-64 p-8">
  //           {children}
  //         </main>
  //       </div>
  //     </ProtectedRoute>
  //   </Suspense>
  // );

  // Development: No auth protection
  return (
    <div className="flex min-h-screen">
      <BrandSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 