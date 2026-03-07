'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../app/context/SidebarContext';
import {
  CalendarEventLine,
  CalendarEventFill,
  AccountCircleLine,
  AccountCircleFill,
  Home4Fill,
  Home4Line,
  InboxLine,
  InboxFill,
  Message3Fill,
  PencilFill,
} from '@phyoofficial/phyo-icon-library';
import NavRail from './NavRail';
import NavItem from './NavItem';

const getRoleFromPathname = (pathname) => {
  if (pathname.startsWith('/brand/')) return 'brand';
  if (pathname.startsWith('/user/')) return 'brand';
  if (pathname.startsWith('/influencer/')) return 'influencer';
  return 'brand';
};

const BrandSidebar = () => {
  const pathname = usePathname();
  const role = getRoleFromPathname(pathname);
  const { isExpanded, setIsExpanded, sidebarButtonAction, sidebarButtonLabel } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ top: 0, height: 44 });
  const navRefs = React.useRef([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItemsConfig = [
    { name: 'Home', href: `/${role}/dashboard`, activeIcon: Home4Fill, inactiveIcon: Home4Line },
    { name: 'Inbox', href: `/${role}/inbox`, activeIcon: InboxFill, inactiveIcon: InboxLine, badge: 3 },
    { name: 'Campaigns', href: `/${role}/campaigns`, activeIcon: CalendarEventFill, inactiveIcon: CalendarEventLine },
    { name: 'Account', href: `/${role}/account`, activeIcon: AccountCircleFill, inactiveIcon: AccountCircleLine },
  ];

  React.useEffect(() => {
    const activeIndex = navItemsConfig.findIndex(item => item.href === pathname);
    if (activeIndex !== -1 && navRefs.current[activeIndex] && isExpanded) {
      const activeElement = navRefs.current[activeIndex];
      const navContainer = activeElement.parentElement;
      if (navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        setIndicatorStyle({
          top: activeRect.top - containerRect.top,
          height: activeRect.height,
        });
      }
    }
  }, [pathname, isExpanded]);

  const getFabIcon = () => {
    return pathname === `/${role}/inbox` ? Message3Fill : PencilFill;
  };

  const isButtonEnabled = sidebarButtonAction || pathname === `/${role}/inbox`;

  const navItems = navItemsConfig.map((item) => ({
    ...item,
    component: (
      <NavItem
        key={item.name}
        href={item.href}
        icon={pathname === item.href || pathname.startsWith(item.href + '/') ? item.activeIcon : item.inactiveIcon}
        label={item.name}
        badge={item.badge}
        isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
        isExpanded={isExpanded}
      />
    ),
  }));

  return (
    <NavRail
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      fabIcon={getFabIcon()}
      fabLabel={sidebarButtonLabel || 'Button'}
      fabAction={sidebarButtonAction}
      isFabEnabled={isButtonEnabled}
      navItems={navItems}
      activeHref={pathname}
      indicatorStyle={indicatorStyle}
      navRefs={navRefs}
      mounted={mounted}
    />
  );
};

export default BrandSidebar;
