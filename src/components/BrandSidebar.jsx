'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { useSidebar } from '../app/context/SidebarContext';
import {
  Home,
  Mail,
  Calendar,
  User,
  Menu,
  Pencil
} from 'lucide-react';

const BrandSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isExpanded, setIsExpanded, sidebarButtonAction, sidebarButtonLabel } = useSidebar();

  const navItems = [
    { name: 'Home', href: '/brand/dashboard', icon: Home },
    { name: 'Inbox', href: '/brand/inbox', icon: Mail, badge: 3 },
    { name: 'Campaigns', href: '/brand/campaigns', icon: Calendar },
    { name: 'Account', href: '/brand/account', icon: User },
  ];

  const handleButtonClick = () => {
    if (sidebarButtonAction) {
      sidebarButtonAction();
    }
  };

  return (
    <div className={`h-screen bg-[#F0F0F0] fixed left-0 top-0 flex flex-col transition-[width] duration-300 ease-in-out z-50 ${
      isExpanded ? 'w-[280px] px-6 py-8' : 'w-20 px-4 py-6 items-center'
    }`}>
      {/* Menu Icon at top */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`text-gray-600 hover:text-gray-900 transition-colors ${
          isExpanded ? 'self-start mb-6' : 'mb-8'
        }`}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Edit/Create Button */}
      <div className={isExpanded ? 'mb-6' : 'mb-8'}>
        <button 
          onClick={handleButtonClick}
          disabled={!sidebarButtonAction}
          className={`bg-[#63B898] hover:scale-105 text-black transition-transform flex items-center justify-center ${
          isExpanded 
            ? 'w-full rounded-[12px] py-3 px-4 gap-3 justify-start' 
            : 'p-3 rounded-lg'
        } ${!sidebarButtonAction ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}>
          <Pencil className="h-5 w-5 stroke-black flex-shrink-0" strokeWidth={2} />
          {isExpanded && (
            <span className="text-[15px] font-semibold">
              {sidebarButtonLabel}
            </span>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`flex-1 flex flex-col ${isExpanded ? 'space-y-2' : 'items-center space-y-6'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center transition-all duration-300 ${
                isExpanded 
                  ? `gap-3 px-4 py-3 rounded-[20px] w-full ${
                      isActive 
                        ? 'bg-[#63B898] text-white' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }` 
                  : 'flex-col'
              }`}
            >
              {isExpanded ? (
                <>
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`} strokeWidth={2} />
                  <span className={`text-[15px] font-medium flex-1 ${
                    isActive ? 'text-white' : 'text-gray-700'
                  }`}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="bg-[#FF8A3D] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className={`transition-all duration-300 ${
                    isActive
                      ? 'text-[#63B898]'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}>
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${
                    isActive ? 'text-[#63B898]' : 'text-gray-500'
                  }`}>
                    {item.name}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BrandSidebar;