'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    { name: 'Logout Account', href: '#', icon: LogOut, isLogout: true },
  ];

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Close modal and redirect to main login page
    setShowLogoutModal(false);
    router.push('/login');
  };

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
                  onClick={() => setShowLogoutModal(true)}
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Logout
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerSidebar;



