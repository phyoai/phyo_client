import React from 'react';
import CampaignReport from './CampaignReport';
import TopInfluencer from './TopInfluencer';
import PostTimeLine from './PostTimeLine'
import InfluencersTable from './InfluencersTable'
import EngagementSection from './EngagementSection'
import PostLiveAndTotalViewsSection from './PostLiveAndTotalViewsSection'
import BudgetAndAudienceSection from './BudgetAndAudienceSection'

export default function BrandDashboard() {
  return (
    <div>
      <CampaignReport/>
      <TopInfluencer/>
      <PostTimeLine/>
      <InfluencersTable/>
      <EngagementSection/>
      <PostLiveAndTotalViewsSection/>
      <BudgetAndAudienceSection/>
    </div>
  );
}