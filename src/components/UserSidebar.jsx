'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { useSidebar } from '../app/context/SidebarContext';
import {  
  CalendarEventLine,
  AccountCircleLine,
  MenuFill, 
  MenuUnfold4Line,
  PencilFill, 
  Home4Fill,
  InboxLine,
  Message3Fill
} from '@phyoofficial/phyo-icon-library';

// Helper function to extract role from pathname
const getRoleFromPathname = (pathname) => {
  if (pathname.startsWith('/user/')) return 'user';
  if (pathname.startsWith('/brand/')) return 'brand';
  if (pathname.startsWith('/influencer/')) return 'influencer';
  return 'user'; // Default
};

const UserSidebar = () => {
  const pathname = usePathname();
  const role = getRoleFromPathname(pathname);
  
  const { logout } = useAuth();
  const { isExpanded, setIsExpanded, sidebarButtonAction, sidebarButtonLabel } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ top: 0, height: 44 });
  const navRefs = React.useRef([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Generate nav items dynamically based on role
  const navItems = [
    { name: 'Home', href: `/${role}/dashboard`, icon: Home4Fill },
    { name: 'Inbox', href: `/${role}/inbox`, icon: InboxLine, badge: 3 },
    { name: 'Campaigns', href: `/${role}/campaigns`, icon: CalendarEventLine },
    { name: 'Account', href: `/${role}/account`, icon: AccountCircleLine },
  ];

  // Update indicator position when pathname or expansion state changes
  React.useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.href === pathname);
    if (activeIndex !== -1 && navRefs.current[activeIndex] && isExpanded) {
      const activeElement = navRefs.current[activeIndex];
      const navContainer = activeElement.parentElement;
      
      if (navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        
        setIndicatorStyle({
          top: activeRect.top - containerRect.top,
          height: activeRect.height
        });
      }
    }
  }, [pathname, isExpanded]);

  const handleButtonClick = () => {
    if (sidebarButtonAction) {
      sidebarButtonAction();
    }
  };

  // Determine which icon to show based on current page
  const getFabIcon = () => {
    if (pathname === `/${role}/inbox`) {
      return Message3Fill;
    }
    return PencilFill;
  };

  const FabIcon = getFabIcon();
  const isButtonEnabled = sidebarButtonAction || pathname === `/${role}/inbox`;

  if (!mounted) {
    return (
      <div className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-[width] duration-300 ease-in-out z-50 w-[96px] pt-[44px] pb-[56px]`}>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out z-50 ${
      isExpanded ? 'w-[220px] pt-[44px] pb-[56px] px-[20px]' : 'w-[96px] pt-[44px] pb-[56px]'
    }`}>
      <div className={`flex flex-col gap-[4px] mb-[36px] transition-all duration-300 ease-in-out ${isExpanded ? '' : 'items-center'}`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-14 h-14 rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          <div className="transition-transform duration-300">
            {isExpanded ? (
              <MenuUnfold4Line width={24} height={24} fill="#242527" />
            ) : (
              <MenuFill width={24} height={24} fill="#242527" />
            )}
          </div>
        </button>

        <button 
          onClick={handleButtonClick}
          disabled={!isButtonEnabled}
          className={`flex items-center rounded-xl transition-all duration-300 ease-in-out justify-start ${
            isExpanded 
              ? 'w-full h-14 px-4 gap-[6px] justify-center' 
              : 'w-14 h-14 justify-center'
          } ${
            isButtonEnabled 
              ? 'bg-[#43573B] hover:bg-[#3a4a33] cursor-pointer' 
              : 'bg-[#43573B] opacity-50 cursor-not-allowed'
          }`}
        >
          <FabIcon width={24} height={24} fill="white" color="white" style={{ color: 'white' }} className="flex-shrink-0 transition-all duration-300" />
          <span className={`text-white text-base font-semibold tracking-[0.24px] leading-6 whitespace-nowrap transition-all duration-300 ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 overflow-hidden'
          }`}>
            {sidebarButtonLabel || 'Button'}
          </span>
        </button>
      </div>

      <nav className={`flex flex-col gap-[4px] relative`}>
        {isExpanded && (
          <div 
            className="absolute left-0 w-full bg-[#DAE3D1] rounded-[32px] transition-all duration-[350ms] ease-out pointer-events-none"
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
            }}
          />
        )}
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          if (isExpanded) {
            return (
              <Link
                key={item.name}
                href={item.href}
                ref={(el) => (navRefs.current[index] = el)}
                className="relative z-10 flex items-center gap-[12px] px-[16px] py-[12px] rounded-[32px] no-underline transition-colors duration-300"
              >
                <Icon width={24} height={24} fill={isActive ? '#43573B' : '#A0A0A0'} color={isActive ? '#43573B' : '#A0A0A0'} />
                <span className={`text-base font-semibold leading-6 transition-colors duration-300 ${isActive ? 'text-[#43573B]' : 'text-[#A0A0A0]'}`}>
                  {item.name}
                </span>
                {item.badge && isActive && (
                  <span className="ml-auto bg-[#43573B] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          } else {
            return (
              <Link
                key={item.name}
                href={item.href}
                ref={(el) => (navRefs.current[index] = el)}
                className="relative z-10 flex items-center justify-center w-14 h-14 rounded-[32px] no-underline transition-colors duration-300"
                title={item.name}
              >
                <Icon width={24} height={24} fill={isActive ? '#43573B' : '#A0A0A0'} color={isActive ? '#43573B' : '#A0A0A0'} />
                {item.badge && isActive && (
                  <span className="absolute top-0 right-0 bg-[#43573B] text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          }
        })}
      </nav>
    </div>
  );
};

export default UserSidebar;
