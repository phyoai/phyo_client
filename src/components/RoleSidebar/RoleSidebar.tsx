'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole, useSidebarItems } from '@/hooks';
import { useSidebar } from '@/app/context/SidebarContext';
import {
  MenuFill,
  MenuUnfold4Line,
  PencilFill,
  Message3Fill,
  Home4Fill,
  InboxLine,
  CalendarEventLine,
  AccountCircleLine,
} from '@phyoofficial/phyo-icon-library';

const iconMap: Record<string, any> = {
  Home4Fill,
  InboxLine,
  CalendarEventLine,
  AccountCircleLine,
  MenuFill,
  MenuUnfold4Line,
  PencilFill,
  Message3Fill,
};

export const RoleSidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, config } = useRole();
  const navItems = useSidebarItems();
  const { isExpanded, setIsExpanded, sidebarButtonAction, sidebarButtonLabel } = useSidebar();

  const [mounted, setMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 44 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.href === pathname);
    if (activeIndex !== -1 && navRefs.current[activeIndex] && isExpanded) {
      const activeElement = navRefs.current[activeIndex];
      const navContainer = activeElement?.parentElement;

      if (navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();

        setIndicatorStyle({
          top: activeRect.top - containerRect.top,
          height: activeRect.height,
        });
      }
    }
  }, [pathname, isExpanded, navItems]);

  const handleButtonClick = () => {
    if (sidebarButtonAction) {
      sidebarButtonAction();
    }
  };

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
      <div
        className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-[width] duration-300 ease-in-out z-50 w-[96px] pt-[44px] pb-[56px]`}
      />
    );
  }

  return (
    <div
      className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? 'w-[220px] pt-[44px] pb-[56px] px-[20px]' : 'w-[96px] pt-[44px] pb-[56px]'
      }`}
    >
      <div
        className={`flex flex-col gap-[4px] mb-[36px] transition-all duration-300 ease-in-out ${
          isExpanded ? '' : 'items-center'
        }`}
      >
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
            isExpanded ? 'w-full h-14 px-4 gap-[6px] justify-center' : 'w-14 h-14 justify-center'
          } ${
            isButtonEnabled
              ? 'bg-[#43573B] hover:bg-[#3a4a33] cursor-pointer'
              : 'bg-[#43573B] opacity-50 cursor-not-allowed'
          }`}
        >
          <FabIcon
            width={24}
            height={24}
            fill="white"
            color="white"
            style={{ color: 'white' }}
            className="flex-shrink-0 transition-all duration-300"
          />
          <span
            className={`text-white text-base font-semibold tracking-[0.24px] leading-6 whitespace-nowrap transition-all duration-300 ${
              isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 overflow-hidden'
            }`}
          >
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const IconComponent = iconMap[item.icon];

          if (isExpanded) {
            return (
              <Link
                key={item.name}
                href={item.href}
                ref={(el) => {
                  navRefs.current[index] = el;
                }}
                className="relative z-10 flex items-center gap-[12px] px-[16px] py-[12px] rounded-[32px] no-underline transition-colors duration-300"
              >
                {IconComponent && (
                  <IconComponent
                    width={24}
                    height={24}
                    fill={isActive ? '#43573B' : '#A0A0A0'}
                    color={isActive ? '#43573B' : '#A0A0A0'}
                  />
                )}
                <span
                  className={`text-base font-semibold leading-6 transition-colors duration-300 ${
                    isActive ? 'text-[#43573B]' : 'text-[#A0A0A0]'
                  }`}
                >
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
                ref={(el) => {
                  navRefs.current[index] = el;
                }}
                className="relative z-10 flex items-center justify-center w-14 h-14 rounded-[32px] no-underline transition-colors duration-300"
                title={item.name}
              >
                {IconComponent && (
                  <IconComponent
                    width={24}
                    height={24}
                    fill={isActive ? '#43573B' : '#A0A0A0'}
                    color={isActive ? '#43573B' : '#A0A0A0'}
                  />
                )}
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

export default RoleSidebar;
