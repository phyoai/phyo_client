import React, { Suspense } from 'react';
import BoostCampaigns from '@/components/campaigns/boost-campaign/page';

export default function BoostCampaign() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen" />}>
      <BoostCampaigns />
    </Suspense>
  );
}
