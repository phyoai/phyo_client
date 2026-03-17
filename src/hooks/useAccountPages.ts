/**
 * Custom hook for managing role-based account pages visibility
 */

import { useRoleContext } from '@/app/context/RoleContext';
import { useUser } from '@/hooks';
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
    const { profile } = useUser();

    // Check if user has an active subscription/plan
    const hasSubscription = !!(profile?.currentPlan || profile?.plan);

    const visiblePages = getVisibleAccountPages(role, hasSubscription);

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
