'use client'
import React from 'react';
import { SearchLine } from '@phyoofficial/phyo-icon-library';

const SearchBar = () => {
  return (
    <div className="bg-neutral-base  px-2 py-2 rounded-3xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <SearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="SearchLine influencer"
              className="w-full pl-12 pr-4 py-3 border-0 rounded-3xl focus:outline-none focus:ring-0 bg-[#F5F5F5] text-gray-600 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;