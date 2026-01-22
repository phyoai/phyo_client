'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import {
  Home,
  Mail,
  Calendar,
  User,
  Menu,
  Edit3,
  Pencil
} from 'lucide-react';

const BrandSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Home', href: '/brand/dashboard', icon: Home },
    { name: 'Inbox', href: '/brand/inbox', icon: Mail, badge: 3 },
    { name: 'Campaigns', href: '/brand/campaigns', icon: Calendar },
    { name: 'Account', href: '/brand/account', icon: User },
  ];

  // Commented out for now - not in current sidebar design
  // const bottomNavItems = [
  //   { name: 'Settings', href: '/brand/settings', icon: Settings },
  //   { name: 'Help', href: '/brand/help', icon: HelpCircle },
  //   { name: 'Logout Account', href: '/logout', icon: LogOut, isLogout: true },
  // ];

  return (
    <div className="h-screen w-20 bg-[#F0F0F0]  fixed left-0 top-0 flex flex-col items-center py-6">
      {/* Menu Icon at top */}
      <button className="mb-8 p-2 text-gray-600 hover:text-gray-900 transition-colors">
        <Menu className="h-6 w-6" />
      </button>

      {/* Edit/Create Button */}
      <button className="mb-8 p-3 bg-[#63B898] hover:scale-105 text-black rounded-lg shadow-md transition-all">
        <Pencil className="h-5 w-5  fill-black" />
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center group"
            >
              <div className={`p-1 rounded-lg transition-all ${
                isActive
                  ? 'text-teal-600 bg-[#ECF6F2]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}>
                <Icon className="h-6 w-6" />
                {/* {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )} */}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-[#379773]' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Commented out sections for future use */}
      {/* Get PRO Section - removed from minimal sidebar */}
      {/* 
      <div className="p-4 m-4 mb-6 bg-teal-50 rounded-2xl text-center border border-teal-100">
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Get PRO!!
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          Upgrade now to unlock<br />premium features
        </p>
        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow-md">
          Upgrade Now
        </button>
      </div>
      */}
    </div>
  );
};

export default BrandSidebar;



