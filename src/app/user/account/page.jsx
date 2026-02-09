'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { brandAPI, userAPI } from '@/utils/api';
import { 
  User, 
  List, 
  FileText, 
  CreditCard, 
  PauseCircle, 
  XCircle, 
  HelpCircle, 
  LogOut,
  Moon,
  Bell,
  Globe,
  File,
  Info,
  ChevronRight
} from 'lucide-react';

export default function BrandAccount() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.user || response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'J';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col">
        {/* Fixed App Bar Skeleton */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100">
          <div className="px-4 sm:px-6 lg:px-9 py-4 sm:py-5">
            <div className="h-7 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Scrollable Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
          {/* Profile Header Skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Profile Section Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
            <div className="bg-[#f0f0f0] rounded-2xl p-2">
              <div className="bg-white rounded-lg overflow-hidden">
                {[1, 2].map((i, idx) => (
                  <React.Fragment key={i}>
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    {idx < 1 && <div className="border-t border-gray-200 mx-6 my-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Billings Section Skeleton */}
          <div className="mb-6 pt-4">
            <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="bg-[#f0f0f0] rounded-2xl p-2">
              <div className="bg-white rounded-lg overflow-hidden">
                {[1, 2, 3, 4].map((i, idx) => (
                  <React.Fragment key={i}>
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    {idx < 3 && <div className="border-t border-gray-200 mx-6 my-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Support Section Skeleton */}
          <div className="mb-6 pt-4">
            <div className="h-5 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="bg-[#f0f0f0] rounded-2xl p-2">
              <div className="bg-white rounded-lg overflow-hidden">
                {[1, 2].map((i, idx) => (
                  <React.Fragment key={i}>
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    {idx < 1 && <div className="border-t border-gray-200 mx-6 my-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* App Settings Section Skeleton */}
          <div className="mb-6 pt-4 pb-4">
            <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="bg-[#f0f0f0] rounded-2xl p-2">
              <div className="bg-white rounded-lg overflow-hidden">
                {[1, 2, 3, 4, 5].map((i, idx) => (
                  <React.Fragment key={i}>
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                      </div>
                      <div className="w-11 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    {idx < 4 && <div className="border-t border-gray-200 mx-6 my-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const MenuItem = ({ icon: Icon, label, onClick, rightElement, textColor = "text-[#43573b]", showChevron = true }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-6 py-5 bg-white"
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${textColor}`} strokeWidth={1.5} />
        <span className={`text-base font-semibold ${textColor}`}>{label}</span>
      </div>
      {rightElement !== undefined ? rightElement : (showChevron && <ChevronRight className="w-6 h-6 text-gray-400" strokeWidth={1.5} />)}
    </button>
  );

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      {/* Fixed App Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-9 py-4 sm:py-5">
          <h1 className="text-lg sm:text-xl font-semibold text-[#242527]">Account</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-white">
            {getInitials(user?.brandName || user?.username || 'Jazzleen')}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-[#242527]">
            {user?.brandName || user?.username || 'Jazzleen'}
          </h2>
          <span className="inline-block mt-1 px-1.5 py-0.5 text-xs font-medium text-[#242527] bg-[#e6e6e6] rounded border border-[#4d4d4d]">
            Free
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#242527] text-white px-3 py-1 rounded-full border border-[#fab70c]">
          <span className="text-yellow-400 text-sm">⚡</span>
          <span className="text-base font-semibold">3/3</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#242527] mb-2">Profile</h3>
        <div className="bg-[#f0f0f0] rounded-2xl p-2">
          <div className="rounded-lg overflow-hidden space-y-2 bg-[#f0f0f0]">
            <div className="bg-white">
              <MenuItem 
                icon={User} 
                label="Update Profile" 
                onClick={() => console.log('Update Profile')}
              />
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={List} 
                label="My Lists" 
                onClick={() => router.push('/user/account/my-lists')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Billings & Subscriptions Section */}
      <div className="mb-6 pt-4">
        <h3 className="text-base font-semibold text-[#242527] mb-2">Billings & Subscriptions</h3>
        <div className="bg-[#f0f0f0] rounded-2xl p-2">
          <div className="rounded-lg overflow-hidden   space-y-2 bg-[#f0f0f0]">
            <div className="bg-white">
              <MenuItem 
                icon={FileText} 
                label="billing history" 
                onClick={() => router.push('/user/account/billing-history')}
              />
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={CreditCard} 
                label="upgrade plan" 
                onClick={() => router.push('/user/account/upgrade-plan')}
              />
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={PauseCircle} 
                label="pause subscription" 
                onClick={() => console.log('Pause Subscription')}
              />
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={XCircle} 
                label="cancel subscription" 
                onClick={() => console.log('Cancel Subscription')}
                textColor="text-[#bf3709]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="mb-6 pt-4">
        <h3 className="text-base font-semibold text-[#242527] mb-2">Support</h3>
        <div className="bg-[#f0f0f0] rounded-2xl p-2">
          <div className="rounded-lg overflow-hidden space-y-2 bg-[#f0f0f0]">
            <div className="bg-white">
              <MenuItem 
                icon={HelpCircle} 
                label="Help & Support" 
                onClick={() => router.push('/user/account/help-support')}
              />
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={LogOut} 
                label="Log out" 
                onClick={handleLogout}
                textColor="text-[#bf3709]"
                showChevron={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* App Settings Section */}
      <div className="mb-6 pt-4 pb-4">
        <h3 className="text-base font-semibold text-[#242527] mb-2">App Settings</h3>
        <div className="bg-[#f0f0f0] rounded-2xl p-2">
          <div className="rounded-lg overflow-hidden space-y-2 bg-[#f0f0f0]">
            <div className="bg-white">
              <MenuItem 
                icon={Moon} 
                label="Dark theme" 
                onClick={() => setDarkMode(!darkMode)}
                rightElement={
                  <div className={`w-11 h-8 rounded-full transition-colors flex items-center px-1 ${darkMode ? 'bg-[#3d4f36]' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-3' : 'translate-x-0'}`}></div>
                  </div>
                }
              />
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={Bell} 
                label="Notifications & preferences" 
                onClick={() => router.push('/user/account/notifications-preferences')}
              />
            </div>
            <div className="bg-white">
              <button
                onClick={() => console.log('App Language')}
                className="w-full flex items-center justify-between px-6 py-5 bg-white"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                  <div className="text-left">
                    <div className="text-base font-semibold text-[#242527]">App Language</div>
                    <div className="text-sm text-[#808080]">English (device's language)</div>
                  </div>
                </div>
              </button>
            </div>
            <div className="bg-white">
              <MenuItem 
                icon={File} 
                label="Terms and Privacy Policy" 
                onClick={() => console.log('Terms and Privacy')}
                showChevron={false}
              />
            </div>
            <div className="bg-white">
              <button
                className="w-full flex items-center justify-between px-6 py-5 bg-white cursor-default"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                  <span className="text-base font-semibold text-[#242527]">App Version 0.0.1</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
} 
