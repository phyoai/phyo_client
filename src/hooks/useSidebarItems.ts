import { useMemo } from 'react';
import { useRole } from './useRole';
import { NavItem } from '@/config/roleConfig';

/**
 * useSidebarItems Hook
 * Returns navigation items for the current role's sidebar
 */
export const useSidebarItems = (): NavItem[] => {
  const { config } = useRole();

  return useMemo(() => config.navItems, [config.navItems]);
};

export default useSidebarItems;
