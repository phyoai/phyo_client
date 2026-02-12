import React from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import CampaignCard from '@/components/cards/CampaignCard';

/**
 * Campaign Section Component
 * Reusable component for displaying campaign grids with custom titles
 */
export default function CampaignSection({ 
  title, 
  eyebrow,
  campaignsCount = 3,
  showViewAll = true 
}) {
  const router = useRouter();

  // Mock data - will be replaced with API
  const campaigns = Array(campaignsCount).fill(null).map((_, i) => ({
    id: i + 1,
    brandName: ['Lenskart', 'OptiVision', 'Visionary', 'StyleSpot', 'TrendSetters', 'SportSphere', 'AthletiCore'][i % 7],
    brandInitials: ['AB', 'AC', 'V', 'AC', 'TS', 'BD', 'AC'][i % 7],
    timeAgo: `${i + 1}d ago`,
    campaignImage: '/dummyAvatar.jpg',
    initialsColor: ['bg-blue-600', 'bg-teal-600', 'bg-blue-500', 'bg-teal-500', 'bg-blue-600', 'bg-blue-600', 'bg-blue-500'][i % 7]
  }));

  return (
    <div className="mb-8">
      <SectionHeading 
        title={title}
        eyebrow={eyebrow}
        showViewAll={showViewAll}
        onViewAll={() => router.push('/brand/campaigns')}
      />

      {/* Campaigns Grid - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            brandName={campaign.brandName}
            brandInitials={campaign.brandInitials}
            timeAgo={campaign.timeAgo}
            campaignImage={campaign.campaignImage}
            initialsColor={campaign.initialsColor}
            onClick={() => router.push(`/brand/campaign/${campaign.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
