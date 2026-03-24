import React, { Suspense } from 'react';
import InfluencersDetail from '@/components/campaigns/influencer-counter-offer/page';

export default function InfluencersDetails() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen" />}>
      <InfluencersDetail />
    </Suspense>
  );
}