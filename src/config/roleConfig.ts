/**
 * Role Configuration System
 * Centralized configuration for all user roles to eliminate duplication
 */

export type UserRole = 'user' | 'brand' | 'influencer' | 'service-provider' | 'admin';

export interface RoleConfig {
  name: string;
  displayName: string;
  defaultPath: string;
  navItems: NavItem[];
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  hideSidebarPaths: (string | PathPattern)[];
}

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface PathPattern {
  pattern: string;
  prefix: boolean;
  exclude?: string[];
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  user: {
    name: 'user',
    displayName: 'User',
    defaultPath: '/user/dashboard',
    navItems: [
      { name: 'Home', href: '/user/dashboard', icon: 'Home4Fill' },
      { name: 'Inbox', href: '/user/inbox', icon: 'InboxLine', badge: 0 },
      { name: 'Campaigns', href: '/user/campaigns', icon: 'CalendarEventLine' },
      { name: 'Account', href: '/user/account', icon: 'AccountCircleLine' },
    ],
    colors: {
      primary: '#43573B',
      accent: '#DAE3D1',
      background: '#F0F0F0',
    },
    hideSidebarPaths: [
      '/user/campaigns/create-campaign',
      '/user/campaigns/new-applications',
      '/user/campaigns/all-campaigns',
      '/user/campaigns/all-drafts',
      '/user/influencer-search',
      '/user/influencers',
      '/user/notifications',
      { pattern: '/user/account/', prefix: true },
      {
        pattern: '/user/campaigns/',
        prefix: true,
        exclude: ['create-campaign', 'new-applications', 'all-campaigns', 'all-drafts'],
      },
    ],
  },

  brand: {
    name: 'brand',
    displayName: 'Brand',
    defaultPath: '/brand/dashboard',
    navItems: [
      { name: 'Home', href: '/brand/dashboard', icon: 'Home4Fill' },
      { name: 'Inbox', href: '/brand/inbox', icon: 'InboxLine', badge: 0 },
      { name: 'Campaigns', href: '/brand/campaigns', icon: 'CalendarEventLine' },
      { name: 'Account', href: '/brand/account', icon: 'AccountCircleLine' },
    ],
    colors: {
      primary: '#43573B',
      accent: '#DAE3D1',
      background: '#F0F0F0',
    },
    hideSidebarPaths: [
      '/brand/signup',
      '/brand/login',
      '/brand/campaigns/create-campaign',
      '/brand/campaigns/new-applications',
      '/brand/campaigns/all-campaigns',
      '/brand/campaigns/all-drafts',
      '/brand/influencer-search',
      '/brand/influencers',
      '/brand/notifications',
      { pattern: '/brand/account/', prefix: true },
      {
        pattern: '/brand/campaigns/',
        prefix: true,
        exclude: ['create-campaign', 'new-applications', 'all-campaigns', 'all-drafts'],
      },
    ],
  },

  influencer: {
    name: 'influencer',
    displayName: 'Influencer',
    defaultPath: '/influencer/dashboard',
    navItems: [
      { name: 'Home', href: '/influencer/dashboard', icon: 'Home4Fill' },
      { name: 'Inbox', href: '/influencer/inbox', icon: 'InboxLine', badge: 0 },
      { name: 'Campaigns', href: '/influencer/campaigns', icon: 'CalendarEventLine' },
      { name: 'Account', href: '/influencer/account', icon: 'AccountCircleLine' },
    ],
    colors: {
      primary: '#43573B',
      accent: '#DAE3D1',
      background: '#F0F0F0',
    },
    hideSidebarPaths: [
      '/influencer/campaigns/create-campaign',
      '/influencer/campaigns/new-applications',
      '/influencer/campaigns/all-campaigns',
      '/influencer/campaigns/all-drafts',
      '/influencer/influencer-search',
      '/influencer/influencers',
      '/influencer/notifications',
      { pattern: '/influencer/account/', prefix: true },
      {
        pattern: '/influencer/campaigns/',
        prefix: true,
        exclude: ['create-campaign', 'new-applications', 'all-campaigns', 'all-drafts'],
      },
    ],
  },

  'service-provider': {
    name: 'service-provider',
    displayName: 'Service Provider',
    defaultPath: '/service-provider/dashboard',
    navItems: [
      { name: 'Home', href: '/service-provider/dashboard', icon: 'Home4Fill' },
      { name: 'Inbox', href: '/service-provider/inbox', icon: 'InboxLine', badge: 0 },
      { name: 'Projects', href: '/service-provider/projects', icon: 'CalendarEventLine' },
      { name: 'Account', href: '/service-provider/account', icon: 'AccountCircleLine' },
    ],
    colors: {
      primary: '#43573B',
      accent: '#DAE3D1',
      background: '#F0F0F0',
    },
    hideSidebarPaths: [
      '/service-provider/signup',
      '/service-provider/login',
      { pattern: '/service-provider/account/', prefix: true },
    ],
  },

  admin: {
    name: 'admin',
    displayName: 'Admin',
    defaultPath: '/admin/dashboard',
    navItems: [
      { name: 'Home', href: '/admin/dashboard', icon: 'Home4Fill' },
      { name: 'Users', href: '/admin/users', icon: 'InboxLine' },
      { name: 'Campaigns', href: '/admin/campaigns', icon: 'CalendarEventLine' },
      { name: 'Settings', href: '/admin/settings', icon: 'AccountCircleLine' },
    ],
    colors: {
      primary: '#43573B',
      accent: '#DAE3D1',
      background: '#F0F0F0',
    },
    hideSidebarPaths: [
      '/admin/login',
      { pattern: '/admin/settings/', prefix: true },
    ],
  },
};

/**
 * Get role configuration
 */
export const getRoleConfig = (role: UserRole): RoleConfig => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.user;
};

/**
 * Extract role from pathname
 */
export const extractRoleFromPathname = (pathname: string): UserRole => {
  const segments = pathname.split('/').filter(Boolean);
  const potentialRole = segments[0];

  if (
    potentialRole === 'user' ||
    potentialRole === 'brand' ||
    potentialRole === 'influencer' ||
    potentialRole === 'service-provider' ||
    potentialRole === 'admin'
  ) {
    return potentialRole as UserRole;
  }

  return 'user';
};

/**
 * Check if sidebar should be hidden for a given path
 */
export const shouldHideSidebarForPath = (role: UserRole, pathname: string): boolean => {
  const config = getRoleConfig(role);

  for (const pathItem of config.hideSidebarPaths) {
    if (typeof pathItem === 'string') {
      if (pathname === pathItem) return true;
    } else {
      // PathPattern object
      if (pathItem.prefix) {
        if (!pathname.startsWith(pathItem.pattern)) continue;

        if (pathItem.exclude) {
          const shouldExclude = pathItem.exclude.some((exc) =>
            pathname.includes(exc)
          );
          if (shouldExclude) continue;
        }

        return true;
      } else if (pathname === pathItem.pattern) {
        return true;
      }
    }
  }

  return false;
};
