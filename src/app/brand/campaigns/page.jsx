import React, { Suspense } from 'react';
import AllCampaignsSection from './AllCampaignsSection'

export default function BrandCampaigns() {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
            <AllCampaignsSection/>
        </Suspense>
    </div>
  );
} 