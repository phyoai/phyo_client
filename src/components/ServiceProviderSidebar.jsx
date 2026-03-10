'use client'
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/app/context/SidebarContext';
import { colors } from '@/config/colors';
import {
  Dashboard3Line,
  Dashboard3Fill,
  Inbox2Line,
  Inbox2Fill,
  BriefcaseLine,
  BriefcaseFill,
  UserLine,
  UserFill,
  Image2Line,
  Image2Fill,
  FileSettingsLine,
  FileSettingsFill,
  Information2Line,
  Information2Fill,
  LogoutBoxLine,
} from '@phyoofficial/phyo-icon-library';
import NavRail from './NavRail';
import NavItem from './NavItem';

const ServiceProviderSidebar = () => {
  const pathname = usePathname();
  const { isExpanded, setIsExpanded } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItemsConfig = [
    { name: 'Dashboard', href: '/service-provider/dashboard', activeIcon: Dashboard3Fill, inactiveIcon: Dashboard3Line },
    { name: 'Inbox', href: '/service-provider/inbox', activeIcon: Inbox2Fill, inactiveIcon: Inbox2Line },
    { name: 'Projects', href: '/service-provider/projects', activeIcon: BriefcaseFill, inactiveIcon: BriefcaseLine },
    { name: 'Clients', href: '/service-provider/clients', activeIcon: UserFill, inactiveIcon: UserLine },
    { name: 'Portfolio', href: '/service-provider/portfolio', activeIcon: Image2Fill, inactiveIcon: Image2Line },
    { name: 'Settings', href: '/service-provider/settings', activeIcon: FileSettingsFill, inactiveIcon: FileSettingsLine },
  ];

  const bottomNavItemsConfig = [
    { name: 'Help', href: '/service-provider/help', activeIcon: Information2Fill, inactiveIcon: Information2Line },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      ['authToken', 'userData', 'userEmail', 'userInfo', 'landing_search_results', 'landing_search_prompt'].forEach((key) => localStorage.removeItem(key));
      ['authToken', 'userType', 'token'].forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      });
    }
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  const navItems = [
    ...navItemsConfig.map((item) => ({
      ...item,
      component: (
        <NavItem
          key={item.name}
          href={item.href}
          icon={pathname === item.href ? item.activeIcon : item.inactiveIcon}
          label={item.name}
          isActive={pathname === item.href}
          isExpanded={isExpanded}
        />
      ),
    })),
    ...bottomNavItemsConfig.map((item) => ({
      ...item,
      isBottom: true,
      component: (
        <NavItem
          key={item.name}
          href={item.href}
          icon={pathname === item.href ? item.activeIcon : item.inactiveIcon}
          label={item.name}
          isActive={pathname === item.href}
          isExpanded={isExpanded}
        />
      ),
    })),
    {
      name: 'Logout',
      isBottom: true,
      component: (
        <button
          key="logout"
          onClick={() => setShowLogoutModal(true)}
          className={`flex gap-[4px] items-center py-[6px] relative shrink-0 w-full transition-colors duration-300 bg-transparent border-none cursor-pointer ${
            isExpanded ? 'rounded-[32px] px-[12px]' : 'flex-col justify-center h-[64px]'
          }`}
        >
          <div className="flex items-center justify-center relative rounded-[8px] shrink-0">
            <div className={`flex gap-[10px] items-center justify-center relative rounded-[8px] shrink-0 transition-all duration-300 ${
              isExpanded ? 'px-[4px] py-[8px]' : 'h-[32px] p-[4px]'
            }`}>
              <LogoutBoxLine width={24} height={24} fill={colors.semantic.error.bold} />
            </div>
          </div>
          <div
            className={`flex flex-col font-medium justify-center leading-none relative shrink-0 text-center transition-colors duration-300 text-[14px] tracking-[0.2px] ${
              isExpanded ? 'whitespace-nowrap' : 'w-full'
            }`}
            style={{ color: colors.semantic.error.bold }}
          >
            <p className="leading-[20px]">Logout</p>
          </div>
        </button>
      ),
    },
  ];

  return (
    <>
      <NavRail
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        navItems={navItems}
        activeHref={pathname}
        navRefs={React.useRef([])}
        mounted={mounted}
      />

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div
            className="rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl"
            style={{ backgroundColor: colors.ui.white }}
          >
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FEE2E2' }}
              >
                <LogoutBoxLine width={32} height={32} fill={colors.semantic.error.bold} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: colors.text.neutral.base }}>Logout</h2>
            <p className="text-center mb-6" style={{ color: colors.neutral.inverse.muted }}>Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 rounded-lg transition-colors font-medium border"
                style={{
                  borderColor: colors.neutral.muted,
                  color: colors.text.neutral.base,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.neutral.muted)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-lg transition-colors font-medium"
                style={{
                  backgroundColor: colors.semantic.error.bold,
                  color: colors.ui.white,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceProviderSidebar;



