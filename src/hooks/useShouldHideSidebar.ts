import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useRole } from './useRole';
import { shouldHideSidebarForPath } from '@/config/roleConfig';

/**
 * useShouldHideSidebar Hook
 * Determines if the sidebar should be hidden for the current path
 */
export const useShouldHideSidebar = (): boolean => {
  const pathname = usePathname();
  const { role } = useRole();

  return useMemo(() => shouldHideSidebarForPath(role, pathname), [role, pathname]);
};

export default useShouldHideSidebar;
