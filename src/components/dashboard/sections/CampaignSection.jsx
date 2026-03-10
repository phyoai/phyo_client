import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import CampaignCard from '@/components/cards/CampaignCard';
import { campaignAPI } from '@/utils/api';

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
  const [campaignsAll, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffMs = now - createdDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'just now';
  };

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get consistent color for initials
  const getInitialsColor = (id) => {
    const colors = ['bg-blue-600', 'bg-teal-600', 'bg-blue-500', 'bg-teal-500', 'bg-pink-600', 'bg-purple-600', 'bg-green-600'];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Transform API data to card format
  const campaigns = campaignsAll.slice(0, campaignsCount).map((campaign) => ({
    id: campaign._id,
    brandName: campaign.brandId?.companyName || 'Unknown Brand',
    brandInitials: getInitials(campaign.brandId?.companyName || 'UB'),
    timeAgo: getTimeAgo(campaign.createdAt),
    campaignImage: campaign.productImages?.[0] || '/dummyAvatar.jpg',
    initialsColor: getInitialsColor(campaign._id)
  }));
   const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);
   const fetchCampaigns = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await campaignAPI.getCampaigns({ page, limit });
      const allCampaigns = response.data || [];
      // Filter only active campaigns (non-draft)
      const activeCampaigns = allCampaigns.filter(campaign => campaign.status === 'Active');
      setCampaigns(activeCampaigns);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNext: false,
        hasPrev: false
      });
      // console.log('Fetched campaigns:', activeCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="text-gray-500">Loading campaigns...</div>
          </div>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              brandName={campaign.brandName}
              brandInitials={campaign.brandInitials}
              timeAgo={campaign.timeAgo}
              campaignImage={campaign.campaignImage}
              initialsColor={campaign.initialsColor}
              onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center py-8">
            <div className="text-gray-500">No campaigns available</div>
          </div>
        )}
      </div>
    </div>
  );
}
