'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import InfluencersDetailsWithDeliverable from '@/components/campaigns/influencer-detail-deliverables/page';

export default function InfluencersDetailsWithDeliverables() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const influencerId = searchParams.get('influencerId');

  return (
    <InfluencersDetailsWithDeliverable
      campaignId={campaignId}
      influencerId={influencerId}
    />
  );
}