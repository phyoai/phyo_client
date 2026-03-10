/**
 * Account Pages Configuration
 * Defines which account pages should be visible for each user role
 */

import type { UserRole } from './roleConfig';

export interface AccountPageConfig {
  id: string;
  path: string;
  name: string;
  label: string;
  icon: string;
  description?: string;
  requiredRoles: UserRole[];
  requiresSubscription?: boolean;
}

export const ACCOUNT_PAGES: AccountPageConfig[] = [
  {
    id: 'update-profile',
    path: 'update-profile',
    name: 'Update Profile',
    label: 'update_profile',
    icon: 'AccountCircleFill',
    description: 'Update your profile information',
    requiredRoles: ['user', 'brand', 'influencer'],
  },
  {
    id: 'my-lists',
    path: 'my-lists',
    name: 'My Lists',
    label: 'my_lists',
    icon: 'ListUnordered',
    description: 'Manage your creator lists and collections',
    requiredRoles: ['user', 'brand', 'influencer'],
  },
  {
    id: 'transactions',
    path: 'transactions',
    name: 'Transactions',
    label: 'transactions',
    icon: 'FileList3Line',
    description: 'View your transaction history',
    requiredRoles: ['brand'],
  },
  {
    id: 'upgrade-plan',
    path: 'upgrade-plan',
    name: 'Upgrade Plan',
    label: 'upgrade_plan',
    icon: 'RocketLine',
    description: 'Upgrade your subscription plan',
    requiredRoles: ['admin', 'brand'],
  },
  {
    id: 'pause-subscription',
    path: 'pause-subscription',
    name: 'Pause Subscription',
    label: 'pause_subscription',
    icon: 'PauseCircleLine',
    description: 'Pause your active subscription',
    requiredRoles: ['brand'],
  },
  {
    id: 'cancel-subscription',
    path: 'cancel-subscription',
    name: 'Cancel Subscription',
    label: 'cancel_subscription',
    icon: 'DeleteBin2Line',
    description: 'Cancel your subscription',
    requiredRoles: ['brand'],
  },
  {
    id: 'billing-history',
    path: 'billing-history',
    name: 'Billing History',
    label: 'billing_history',
    icon: 'WalletLine',
    description: 'View your billing and transaction history',
    requiredRoles: ['admin', 'brand'],
    requiresSubscription: true,
  },
  {
    id: 'notifications-preferences',
    path: 'notifications-preferences',
    name: 'Notification Preferences',
    label: 'notifications_preferences',
    icon: 'Notification2Line',
    description: 'Manage your notification settings',
    requiredRoles: ['influencer', 'service-provider', 'admin', 'user'],
  },
  {
    id: 'help-support',
    path: 'help-support',
    name: 'Help & Support',
    label: 'help_support',
    icon: 'QuestionLine',
    description: 'Get help and contact support',
    requiredRoles: ['influencer', 'service-provider', 'admin', 'user'],
  },
];

/**
 * Get visible account pages for a specific role
 * @param role - The user role
 * @returns Array of visible account pages for that role
 */
export const getVisibleAccountPages = (role: UserRole): AccountPageConfig[] => {
  return ACCOUNT_PAGES.filter((page) => page.requiredRoles.includes(role));
};

/**
 * Get a specific account page by ID
 * @param pageId - The page ID
 * @returns The account page config or undefined
 */
export const getAccountPageById = (pageId: string): AccountPageConfig | undefined => {
  return ACCOUNT_PAGES.find((page) => page.id === pageId);
};

/**
 * Check if a role has access to a specific account page
 * @param role - The user role
 * @param pageId - The page ID to check
 * @returns true if the role has access to the page
 */
export const hasAccessToAccountPage = (role: UserRole, pageId: string): boolean => {
  const page = getAccountPageById(pageId);
  if (!page) return false;
  return page.requiredRoles.includes(role);
};
