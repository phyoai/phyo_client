import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import CampaignCard from '@/components/cards/CampaignCard';
import { campaignApi } from '@/api/campaign-api';

const CATEGORIES = ['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling'];

export default function CampaignSection({
  title,
  eyebrow,
  campaignsCount = 3,
  showViewAll = true,
  showFilters = false,
}) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const getTimeAgo = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'just now';
  };

  const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const getInitialsColor = (id = '') => {
    const colors = ['bg-blue-600', 'bg-teal-600', 'bg-blue-500', 'bg-teal-500', 'bg-pink-600', 'bg-purple-600', 'bg-green-600'];
    return colors[(id.charCodeAt(0) || 0) % colors.length];
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const result = await campaignApi.getAllCampaigns(
          { status: 'Active' },
          { page: 1, limit: campaignsCount }
        );
        setCampaigns(result.campaigns || []);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [campaignsCount]);

  return (
    <div>
      <SectionHeading
        title={title}
        eyebrow={eyebrow}
        showViewAll={showViewAll}
        onViewAll={() => router.push('/brand/campaigns')}
      />

      {/* Category Filter Tabs */}
      {showFilters && (
        <div className="flex gap-3 items-center mb-5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-1 rounded-full text-sm capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-[#16a34a] text-white'
                  : 'bg-white/12 text-white hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(campaignsCount)].map((_, i) => (
            <div key={i} className="bg-[#181818] rounded-2xl h-52 animate-pulse" />
          ))
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign, index) => {
            const id = campaign.campaignId || campaign._id || campaign.id;
            const name = campaign.campaignName || campaign.brandId?.companyName || 'Campaign';
            return (
              <CampaignCard
                key={id || index}
                brandName={name}
                brandInitials={getInitials(name)}
                timeAgo={getTimeAgo(campaign.createdAt)}
                campaignImage={campaign.productImages?.[0] || null}
                initialsColor={getInitialsColor(id || String(index))}
                onClick={() => router.push(`/brand/campaigns/${id}`)}
              />
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-[#9b9b9b] text-sm">
            No campaigns available
          </div>
        )}
      </div>
    </div>
  );
}
