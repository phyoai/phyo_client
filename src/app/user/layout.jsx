'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import AppSidebar from '../../components/AppSidebar';
import BrandTopbar from '../../components/BrandTopbar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function UserLayoutContent({ children, pathname }) {
  const { isExpanded } = useSidebar();

  const noSidebarRoutes = [
    '/user/signup',
    '/user/login',
  ];

  const isNoSidebarRoute = noSidebarRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));

  if (isNoSidebarRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#000201] overflow-hidden">
      <AppSidebar />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'ml-[280px]' : 'ml-[72px]'
      } pl-3`}>
        <BrandTopbar />
        <main className="flex-1 overflow-y-auto bg-[#000201]">
          {children}
        </main>
      </div>
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
