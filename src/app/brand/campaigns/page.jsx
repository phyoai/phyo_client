'use client'
import React, { Suspense } from 'react';
import nextDynamic from 'next/dynamic';

// Dynamically import the AllCampaignsSection with no SSR
const AllCampaignsSection = nextDynamic(() => import('./AllCampaignsSection'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
});

export default function BrandCampaigns() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    }>
      <AllCampaignsSection />
    </Suspense>
  );
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';