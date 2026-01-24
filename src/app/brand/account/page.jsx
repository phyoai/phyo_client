'use client';

import React, { useState, useEffect } from 'react';
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
    if (!name) return 'JZ';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const MenuItem = ({ icon: Icon, label, onClick, rightElement, textColor = "text-gray-900" }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${textColor}`} />
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      </div>
      {rightElement || <ChevronRight className="w-5 h-5 text-gray-400" />}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Account</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-xl font-bold text-white">
                {getInitials(user?.brandName || user?.username || 'Jazzleen')}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.brandName || user?.username || 'Jazzleen'}
              </h2>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-300">
                Free
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full">
            <span className="text-yellow-400 text-sm">⚡</span>
            <span className="text-sm font-semibold">3/3</span>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Profile</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MenuItem 
            icon={User} 
            label="Update Profile" 
            onClick={() => console.log('Update Profile')}
          />
          <MenuItem 
            icon={List} 
            label="My Lists" 
            onClick={() => console.log('My Lists')}
          />
        </div>
      </div>

      {/* Billings & Subscriptions Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Billings & Subscriptions</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MenuItem 
            icon={FileText} 
            label="billing history" 
            onClick={() => console.log('Billing History')}
          />
          <MenuItem 
            icon={CreditCard} 
            label="upgrade plan" 
            onClick={() => console.log('Upgrade Plan')}
          />
          <MenuItem 
            icon={PauseCircle} 
            label="pause subscription" 
            onClick={() => console.log('Pause Subscription')}
          />
          <MenuItem 
            icon={XCircle} 
            label="cancel subscription" 
            onClick={() => console.log('Cancel Subscription')}
            textColor="text-red-600"
          />
        </div>
      </div>

      {/* Support Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Support</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MenuItem 
            icon={HelpCircle} 
            label="Help & Support" 
            onClick={() => console.log('Help & Support')}
          />
          <MenuItem 
            icon={LogOut} 
            label="Log out" 
            onClick={handleLogout}
            textColor="text-red-600"
            rightElement={null}
          />
        </div>
      </div>

      {/* App Settings Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">App Settings</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MenuItem 
            icon={Moon} 
            label="Dark theme" 
            onClick={() => setDarkMode(!darkMode)}
            rightElement={
              <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-green-600' : 'bg-gray-300'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            }
          />
          <MenuItem 
            icon={Bell} 
            label="Notifications" 
            onClick={() => console.log('Notifications')}
          />
          <button
            onClick={() => console.log('App Language')}
            className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-900" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">App Language</div>
                <div className="text-xs text-gray-500">English (device's language)</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <MenuItem 
            icon={File} 
            label="Terms and Privacy Policy" 
            onClick={() => console.log('Terms and Privacy')}
          />
          <button
            className="w-full flex items-center  justify-between px-4 py-4 bg-white cursor-default"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">App Version 0.0.1</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 