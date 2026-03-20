'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import InfluencersDetail from '@/components/campaigns/influencer-counter-offer/page';

export default function InfluencersDetails() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const influencerId = searchParams.get('influencerId');

  return (
    <InfluencersDetail
      campaignId={campaignId}
      influencerId={influencerId}
    />
  );
}