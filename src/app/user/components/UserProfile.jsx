'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = ({ user: propUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user: contextUser, logout } = useAuth();
  
  // Use prop user if provided, otherwise fall back to context user
  const user = propUser || contextUser;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  // Get user name or email
  const displayName = user?.companyName || user?.name || user?.email?.split('@')[0] || 'User';
  const userType = user?.type || 'Brand';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 bg-white rounded-2xl px-5 py-3 hover:shadow-sm transition-all border-0 shadow-sm"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-base font-semibold">
            {displayName.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <span className="text-gray-900 font-semibold text-base">
          {displayName}
        </span>
        <span className="bg-[#E3FFDE33] text-[#00674F] text-sm font-semibold px-3 py-1 rounded-lg">
          {userType}
        </span>
        <ChevronDown className="h-5 w-5 text-gray-700 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
          <a href="/user/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Profile Settings
          </a>
          <a href="/user/account" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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
