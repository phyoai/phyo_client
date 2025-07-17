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
        className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-900 font-medium">
            {user?.name || user?.email || 'User'}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Brand
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          <a href="/brand/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Profile Settings
          </a>
          <a href="/brand/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Account
          </a>
          <hr className="my-1" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;