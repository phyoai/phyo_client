/**
 * Custom hook for managing role-based account pages visibility
 */

import { useRoleContext } from '@/app/context/RoleContext';
import { getVisibleAccountPages, hasAccessToAccountPage, getAccountPageById } from '@/config/accountPagesConfig';
import type { AccountPageConfig } from '@/config/accountPagesConfig';

export interface UseAccountPagesReturn {
  visiblePages: AccountPageConfig[];
  hasAccess: (pageId: string) => boolean;
  getPage: (pageId: string) => AccountPageConfig | undefined;
  isLoading: boolean;
}

/**
 * Hook to get visible account pages for the current user role
 */
export const useAccountPages = (): UseAccountPagesReturn => {
  try {
    const { role } = useRoleContext();
    const visiblePages = getVisibleAccountPages(role);

    return {
      visiblePages,
      hasAccess: (pageId: string) => hasAccessToAccountPage(role, pageId),
      getPage: (pageId: string) => getAccountPageById(pageId),
      isLoading: false,
    };
  } catch (error) {
    // If RoleContext is not available, return empty pages
    console.warn('RoleContext not available in useAccountPages:', error);
    return {
      visiblePages: [],
      hasAccess: () => false,
      getPage: () => undefined,
      isLoading: false,
    };
  }
};
