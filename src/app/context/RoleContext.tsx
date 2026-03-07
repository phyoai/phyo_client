'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { UserRole, getRoleConfig, extractRoleFromPathname, RoleConfig } from '@/config/roleConfig';
import { usePathname } from 'next/navigation';

interface RoleContextType {
  role: UserRole;
  config: RoleConfig;
  isUser: boolean;
  isBrand: boolean;
  isInfluencer: boolean;
  isServiceProvider: boolean;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const role = useMemo(() => extractRoleFromPathname(pathname), [pathname]);
  const config = useMemo(() => getRoleConfig(role), [role]);

  const isUser = useMemo(() => role === 'user', [role]);
  const isBrand = useMemo(() => role === 'brand', [role]);
  const isInfluencer = useMemo(() => role === 'influencer', [role]);
  const isServiceProvider = useMemo(() => role === 'service-provider', [role]);
  const isAdmin = useMemo(() => role === 'admin', [role]);

  const value: RoleContextType = useMemo(
    () => ({
      role,
      config,
      isUser,
      isBrand,
      isInfluencer,
      isServiceProvider,
      isAdmin,
    }),
    [role, config, isUser, isBrand, isInfluencer, isServiceProvider, isAdmin]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRoleContext = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};

export default RoleContext;
