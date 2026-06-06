import React, { Suspense } from 'react';
import InboxPage from '@/components/inbox/InboxPage'

export default function BrandInbox() {
  return (
    <Suspense fallback={
      <div className="flex overflow-hidden bg-[#000201] text-white" style={{ height: 'calc(100vh - 72px)' }}>
        <section className="hidden xl:flex h-full w-[360px] min-w-[360px] flex-col overflow-hidden rounded-[24px] bg-[#181818] p-5">
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse border-b border-white/5 pb-3">
                <div className="h-12 w-12 rounded-full bg-[#262626]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-[#262626]" />
                  <div className="h-3 w-44 rounded bg-[#262626]" />
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-32 bg-[#262626] rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-[#262626] rounded w-40 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <InboxPage />
    </Suspense>
  );
} 