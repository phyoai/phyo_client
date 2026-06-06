'use client'
import { Suspense } from 'react';
import nextDynamic from 'next/dynamic';

const AllCampaignsSection = nextDynamic(() => import('@/components/campaigns/AllCampaignsSection'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#000201] min-h-screen py-8">
      <div className="w-full px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-[#262626] rounded w-48 animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#262626] rounded-full animate-pulse"></div>
            <div className="h-10 w-10 bg-[#262626] rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-[#262626] rounded w-40 animate-pulse"></div>
            <div className="h-4 bg-[#262626] rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex gap-2 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#181818] border border-white/5 rounded-xl overflow-hidden flex-1 min-w-[300px] max-w-[400px]">
                <div className="p-4 flex gap-2">
                  <div className="w-12 h-12 bg-[#262626] rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-[#262626] rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-[#262626] rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-[216px] bg-[#262626] animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#181818] rounded-lg border border-white/5 p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-[#262626] rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#262626] rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-[#262626] rounded w-2/3 animate-pulse"></div>
              </div>
              <div className="h-9 w-24 bg-[#262626] rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
});

export default function UserCampaigns() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#000201] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto mb-4"></div>
          <p className="text-[#9A9A9A]">Loading campaigns...</p>
        </div>
      </div>
    }>
      <AllCampaignsSection />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
