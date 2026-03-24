import React, { Suspense } from 'react';

function BrandSettingsContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Campaign updates
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrandSettings() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen overflow-hidden flex flex-col">
        {/* Header Skeleton */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100">
          <div className="px-4 sm:px-6 lg:px-9 py-4 sm:py-5">
            <div className="h-7 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <BrandSettingsContent />
    </Suspense>
  );
} 