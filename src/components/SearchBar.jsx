'use client'
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search influencer"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;