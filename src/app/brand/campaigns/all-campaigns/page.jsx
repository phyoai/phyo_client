import React, { Suspense } from 'react';
import AllCampaign from '@/components/campaigns/all-campaigns/page';

export default function AllCampaigns() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllCampaign />
    </Suspense>
  );
}
