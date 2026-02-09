'use client'
import React, { Suspense } from 'react';
import nextDynamic from 'next/dynamic';

// Dynamically import the AllCampaignsSection with no SSR
const AllCampaignsSection = nextDynamic(() => import('./AllCampaignsSection'), {
  ssr: false,
  loading: () => (
    <div className="bg-white min-h-screen py-8">
      <div className="w-full px-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Section Heading Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          
          {/* Campaign Cards Skeleton */}
          <div className="flex gap-2 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden flex-1 min-w-[300px] max-w-[400px]">
                {/* Card Header */}
                <div className="p-4 flex gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                {/* Card Image */}
                <div className="h-[216px] bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Section Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
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