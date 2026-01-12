'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white rounded-xl px-4 py-2.5 border border-gray-200 hover:shadow-md transition-all"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'G'}
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          <span className="text-gray-900 font-semibold text-sm">
            {user?.name || 'Garima Tewari'}
          </span>
          <span className="bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            Brand
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
          <a href="/brand/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Profile Settings
          </a>
          <a href="/brand/account" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Account
          </a>
          <hr className="my-1.5 border-gray-100" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;