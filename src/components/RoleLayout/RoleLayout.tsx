'use client';

import React from 'react';
import { useRole, useShouldHideSidebar } from '@/hooks';
import { SidebarProvider, useSidebar } from '@/app/context/SidebarContext';
import { RoleProvider } from '@/app/context/RoleContext';
import RoleSidebar from '@/components/RoleSidebar/RoleSidebar';

interface RoleLayoutProps {
  children: React.ReactNode;
}

/**
 * RoleLayoutContent - Inner component that uses the sidebar context
 */
function RoleLayoutContent({ children }: RoleLayoutProps) {
  const { isExpanded } = useSidebar();
  const shouldHideSidebar = useShouldHideSidebar();

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      <RoleSidebar />
      <main
        className={`flex-1 bg-[#FFFFFF] transition-all duration-300 ease-in-out ${
          isExpanded ? 'ml-[220px]' : 'ml-[96px]'
        } h-screen overflow-y-auto`}
      >
        {children}
      </main>
    </div>
  );
}

/**
 * RoleLayout - Main layout wrapper component
 * Combines RoleProvider and SidebarProvider for complete context setup
 */
export const RoleLayout: React.FC<RoleLayoutProps> = ({ children }) => {
  return (
    <RoleProvider>
      <SidebarProvider>
        <RoleLayoutContent>{children}</RoleLayoutContent>
      </SidebarProvider>
    </RoleProvider>
  );
};

export default RoleLayout;
