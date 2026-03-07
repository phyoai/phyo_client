import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from './useRole';

/**
 * useRoleNavigation Hook
 * Provides navigation helpers specific to the current role
 */
export const useRoleNavigation = () => {
  const router = useRouter();
  const { role } = useRole();

  return {
    goToDashboard: useCallback(() => {
      router.push(`/${role}/dashboard`);
    }, [role, router]),

    goToInbox: useCallback(() => {
      router.push(`/${role}/inbox`);
    }, [role, router]),

    goToCampaigns: useCallback(() => {
      router.push(`/${role}/campaigns`);
    }, [role, router]),

    goToAccount: useCallback(() => {
      router.push(`/${role}/account`);
    }, [role, router]),

    navigateTo: useCallback(
      (path: string) => {
        router.push(`/${role}/${path}`);
      },
      [role, router]
    ),
  };
};

export default useRoleNavigation;
