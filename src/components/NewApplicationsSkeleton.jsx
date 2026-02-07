import React from 'react';

const NewApplicationsSkeleton = () => {
  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* App Bar Skeleton */}
      <div className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-100 shrink-0">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded flex-1 mx-4 max-w-[200px] animate-pulse" />
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-8 overflow-hidden px-9 py-4">
        {/* Applications List Skeleton */}
        <div className="flex flex-col w-full max-w-[450px] overflow-y-auto">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="bg-white flex items-center py-3 border-b border-gray-100"
            >
              {/* Avatar Skeleton */}
              <div className="flex items-center px-4 py-1.5 shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              </div>

              {/* Content Skeleton */}
              <div className="flex-1 pr-4 py-3 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>

              {/* Button Skeleton */}
              <div className="flex items-center px-4 py-3.5 shrink-0">
                <div className="w-[90px] h-[36px] bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 shrink-0" />

        {/* Portfolio Panel Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Scrollable Top Section */}
            <div className="flex-1 overflow-y-auto">
              {/* Cover Image Skeleton */}
              <div className="relative h-[271px] w-full bg-gray-200 animate-pulse" />

              {/* Profile Section Skeleton */}
              <div className="relative -mt-24 mb-6">
                <div className="flex flex-col items-center">
                  {/* Avatar Skeleton */}
                  <div className="w-[200px] h-[200px] rounded-full bg-gray-200 border-4 border-white shadow-lg animate-pulse" />
                  
                  {/* Name and Username Skeleton */}
                  <div className="mt-4 text-center space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded-full w-36 mx-auto mt-3 animate-pulse" />
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex items-center gap-8 mt-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-14 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Skeleton */}
              <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex-1 pb-4 flex justify-center">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab Content Skeleton */}
              <div className="px-4 py-4 pb-32 space-y-6">
                {/* Stats Section Skeleton */}
                <div className="py-4 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Section Skeleton */}
                <div className="py-4 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Platform Header */}
                        <div className="flex items-center px-6 py-3 bg-white">
                          <div className="w-6 h-6 bg-gray-200 rounded mr-4 animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                        </div>
                        {/* Platform Items */}
                        <div className="border-t border-gray-200">
                          {[1, 2, 3].map((itemIndex) => (
                            <div 
                              key={itemIndex} 
                              className={`flex justify-between items-center px-4 py-3 ${
                                itemIndex < 3 ? 'border-b border-gray-200' : ''
                              }`}
                            >
                              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Socials Section Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg"
                      >
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Info Skeleton */}
                <div className="pt-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sticky Action Buttons Skeleton */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-white shrink-0">
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplicationsSkeleton;
