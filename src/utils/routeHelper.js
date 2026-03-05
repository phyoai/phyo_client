/**
 * Extract the user role from the current pathname
 * @param {string} pathname - Current pathname
 * @returns {string} - User role: 'user', 'brand', 'influencer', or 'service-provider'
 */
export const getRoleFromPathname = (pathname) => {
  if (pathname.startsWith('/user/')) {
    return 'user';
  } else if (pathname.startsWith('/brand/')) {
    return 'brand';
  } else if (pathname.startsWith('/influencer/')) {
    return 'influencer';
  } else if (pathname.startsWith('/service-provider/')) {
    return 'service-provider';
  }
  return null;
};

/**
 * Generate a route for the given role and page
 * @param {string} role - User role: 'user', 'brand', 'influencer', or 'service-provider'
 * @param {string} page - Page name: 'dashboard', 'account', 'inbox', etc.
 * @returns {string} - Full route path
 */
export const generateRoute = (role, page) => {
  return `/${role}/${page}`;
};

/**
 * Generate navigation items for sidebar based on the user role
 * @param {string} role - User role
 * @param {object} icons - Object containing icon components
 * @returns {array} - Navigation items
 */
export const generateNavItems = (role, icons = {}) => {
  const baseItems = [
    { name: 'Dashboard', href: `/${role}/dashboard`, icon: icons.Home4Fill },
    { name: 'Inbox', href: `/${role}/inbox`, icon: icons.InboxLine, badge: 3 },
    { name: 'Campaigns', href: `/${role}/campaigns`, icon: icons.CalendarEventLine },
    { name: 'Account', href: `/${role}/account`, icon: icons.AccountCircleLine },
  ];

  return baseItems;
};

/**
 * Get the correct href based on current role and target page
 * This function is useful for dynamic navigation
 * @param {string} pathname - Current pathname
 * @param {string} page - Target page name
 * @returns {string} - Correct route for the current user's role
 */
export const getCorrectRoute = (pathname, page) => {
  const role = getRoleFromPathname(pathname);
  if (!role) {
    console.warn('Could not determine role from pathname:', pathname);
    return `/${page}`; // Fallback
  }
  return generateRoute(role, page);
};
