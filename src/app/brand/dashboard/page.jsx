import React, { Suspense } from 'react';
import CampaignReport from './CampaignReport';
import TopInfluencer from './TopInfluencer';
import PostTimeLine from './PostTimeLine'
import InfluencersTable from './InfluencersTable'
import EngagementSection from './EngagementSection'
import PostLiveAndTotalViewsSection from './PostLiveAndTotalViewsSection'
import BudgetAndAudienceSection from './BudgetAndAudienceSection'

function DashboardContent() {
  return (
    <div className='text-black'>
      <CampaignReport/>
      <TopInfluencer/>
      <PostTimeLine/>
      <InfluencersTable/>
      <EngagementSection/>
      <PostLiveAndTotalViewsSection/>
      <BudgetAndAudienceSection/>
      hi vishnu
    </div>
  );
}

export default function BrandDashboard() {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
    // </Suspense>
      <DashboardContent />
  );
}




