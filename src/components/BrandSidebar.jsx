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

const BrandSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isExpanded, setIsExpanded, sidebarButtonAction, sidebarButtonLabel } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Home', href: '/brand/dashboard', icon: Home4Fill },
    { name: 'Inbox', href: '/brand/inbox', icon: InboxLine, badge: 3 },
    { name: 'Campaigns', href: '/brand/campaigns', icon: CalendarEventLine },
    { name: 'Account', href: '/brand/account', icon: AccountCircleLine },
  ];

  const handleButtonClick = () => {
    if (sidebarButtonAction) {
      sidebarButtonAction();
    }
    // Add future actions for inbox page here if needed
  };

  // Determine which icon to show based on current page
  const getFabIcon = () => {
    if (pathname === '/brand/inbox') {
      return Message3Fill;
    }
    return PencilFill;
  };

  const FabIcon = getFabIcon();
  
  // Check if button should be enabled
  const isButtonEnabled = sidebarButtonAction || pathname === '/brand/inbox';

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-[width] duration-300 ease-in-out z-50 w-[96px] pt-[44px] pb-[56px]`}>
        {/* Placeholder during SSR */}
      </div>
    );
  }

  return (
    <div className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-[width] duration-300 ease-in-out z-50 ${
      isExpanded ? 'w-[220px] pt-[44px] pb-[56px] px-[20px]' : 'w-[96px] pt-[44px] pb-[56px]'
    }`}>
      {/* Menu Icon at top */}
      <div className={`flex flex-col ${isExpanded ? 'gap-[4px]' : 'gap-[4px] items-center'} mb-[36px]`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-14 h-14 rounded-xl hover:bg-gray-200 transition-colors"
        >
          {isExpanded ? (
            <MenuUnfold4Line width={24} height={24} fill="#242527" />
          ) : (
            <MenuFill width={24} height={24} fill="#242527" />
          )}
        </button>

        {/* FAB Button */}
        <button 
          onClick={handleButtonClick}
          disabled={!isButtonEnabled}
          className={`flex items-center rounded-xl transition-colors justify-start ${
            isExpanded 
              ? 'w-[70%] h-14 px-4 gap-[6px] justify-center' 
              : 'w-14 h-14 justify-center'
          } ${
            isButtonEnabled 
              ? 'bg-[#43573B] hover:bg-[#3a4a33] cursor-pointer' 
              : 'bg-[#43573B] opacity-50 cursor-not-allowed'
          }`}
        >
          <FabIcon width={24} height={24} fill="white" color="white" style={{ color: 'white' }} className="flex-shrink-0" />
          {isExpanded && (
            <span className="text-white text-base font-semibold tracking-[0.24px] leading-6">
              {sidebarButtonLabel || 'Button'}
            </span>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`flex flex-col gap-[4px]`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (isExpanded) {
            // Expanded State
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-[4px] px-[12px] py-[6px] transition-colors ${
                  isActive 
                    ? 'bg-[#DAE3D1] rounded-[32px]' 
                    : 'hover:bg-gray-200 rounded-[32px]'
                }`}
              >
                <div className="flex items-center justify-center px-[4px] py-[8px] rounded-lg">
                  <Icon 
                    width={24}
                    height={24}
                    fill={isActive ? '#43573B' : '#808080'}
                  />
                </div>
                <span className={`text-sm font-medium tracking-[0.2px] leading-5 ${
                  isActive ? 'text-[#43573B]' : 'text-[#808080]'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          } else {
            // Collapsed State
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col gap-[4px] items-center py-[6px] w-full"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`p-[4px] rounded-lg h-[32px] flex items-center justify-center ${
                    isActive ? 'bg-[#DAE3D1]' : ''
                  }`}>
                    <Icon 
                      width={24}
                      height={24}
                      fill={isActive ? '#43573B' : '#808080'}
                    />
                  </div>
                  {item.badge && (
                    <div className="absolute -top-0.5 -right-0.5 bg-[#BF3709] rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-white text-[12px] font-medium leading-4 tracking-[0.16px]">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`text-sm font-medium tracking-[0.2px] leading-5 text-center ${
                  isActive ? 'text-[#43573B]' : 'text-[#808080]'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          }
        })}
      </nav>
    </div>
  );
};

export default BrandSidebar;