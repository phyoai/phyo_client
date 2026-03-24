import React, { Suspense } from 'react';
import CampaignSummarys from '@/components/campaigns/campaign-summary/page';

export default function CampaignSummary() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen" />}>
      <CampaignSummarys />
    </Suspense>
  );
}