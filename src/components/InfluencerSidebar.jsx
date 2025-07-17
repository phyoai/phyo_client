'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  Handshake,
  Wallet,
  UserCircle
} from 'lucide-react';

const InfluencerSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/influencer/dashboard', icon: LayoutDashboard },
    { name: 'Inbox', href: '/influencer/inbox', icon: Mail },
    { name: 'Campaigns', href: '/influencer/campaigns', icon: Megaphone },
    { name: 'Deals', href: '/influencer/deals', icon: Handshake },
    { name: 'Earnings', href: '/influencer/earnings', icon: Wallet },
    { name: 'Profile Management', href: '/influencer/profile-management', icon: UserCircle },
    { name: 'Settings', href: '/influencer/settings', icon: Settings },
  ];

  const bottomNavItems = [
    { name: 'Help', href: '/influencer/help', icon: HelpCircle },
    { name: 'Logout Account', href: '/logout', icon: LogOut, isLogout: true },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <img 
          src="/logo.png" 
          alt="Ph40" 
          className="h-8 w-auto"
        />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Bottom Navigation Items */}
        <div className="px-3 space-y-1 mt-8">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isLogout) {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    // Add logout logic here
                    console.log('Logout clicked');
                  }}
                  className="flex items-center w-full px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Get PRO Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Get PRO!!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upgrade now to unlock premium features
          </p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerSidebar;



