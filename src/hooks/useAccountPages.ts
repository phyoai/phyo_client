/**
 * Custom hook for managing role-based account pages visibility
 */

import { useRoleContext } from '@/app/context/RoleContext';
import { useUser } from '@/hooks';
import { getVisibleAccountPages, hasAccessToAccountPage, getAccountPageById } from '@/config/accountPagesConfig';
import type { AccountPageConfig } from '@/config/accountPagesConfig';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

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
    const { userPlan } = useSelector((state: RootState) => state.payment);

    // Check if user has an active subscription/plan
    // First check payment slice (most accurate source)
    let planValue = userPlan?.planName;

    // Fallback to checking user profile for other possible field names
    if (!planValue) {
      planValue = profile?.currentPlan || profile?.plan || profile?.subscription || profile?.planType || profile?.tier;
    }

    // User has subscription if they have a plan value that isn't 'Free' or 'free'
    const hasSubscription = !!(planValue && planValue.toLowerCase && planValue.toLowerCase() !== 'free');

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
