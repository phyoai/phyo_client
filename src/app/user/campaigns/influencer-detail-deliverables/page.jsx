import React, { Suspense } from 'react';
import InfluencersDetailsWithDeliverable from '@/components/campaigns/influencer-detail-deliverables/page';

export default function InfluencersDetailsWithDeliverables() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen" />}>
      <InfluencersDetailsWithDeliverable />
    </Suspense>
  );
}