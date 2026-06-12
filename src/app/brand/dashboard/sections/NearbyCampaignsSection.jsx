import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import CampaignCard from '@/components/cards/CampaignCard';
import { getNearbyCampaigns } from '@/api/trending-nearby.api';
import secureAuthStorage from '@/utils/secure-auth';

const CATEGORIES = ['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling'];

const DUMMY_CAMPAIGNS = [
  { id: 'nc1', name: 'Local Beats Campaign', timeAgo: '1d ago', color: 'bg-orange-600' },
  { id: 'nc2', name: 'City Style Launch', timeAgo: '3d ago', color: 'bg-pink-600' },
  { id: 'nc3', name: 'Urban Creators Hub', timeAgo: '6d ago', color: 'bg-green-600' },
];

export default function NearbyCampaignsSection({
  title = 'Nearby Campaigns',
  campaignsCount = 3,
  showViewAll = true,
  showFilters = true,
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
    const fetchNearbyCampaigns = async () => {
      setLoading(true);
      try {
        // Get user location from stored profile
        const userData = secureAuthStorage.getUserData();
        const location = userData?.location || userData?.profile?.location || {};

        const response = await getNearbyCampaigns({
          city: location.city,
          state: location.state,
          country: location.country || 'India',
          limit: campaignsCount,
          page: 1,
          category: activeCategory !== 'All' ? activeCategory : undefined,
        });

        // API response: { success, data: [...campaigns], pagination }
        const data =
          response?.data?.campaigns ||
          response?.data?.data ||
          (Array.isArray(response?.data) ? response.data : null) ||
          response?.campaigns ||
          [];
        setCampaigns(Array.isArray(data) ? data.slice(0, campaignsCount) : []);
      } catch (err) {
        console.error('Error fetching nearby campaigns:', err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNearbyCampaigns();
  }, [campaignsCount, activeCategory]);

  return (
    <div>
      <SectionHeading
        title={title}
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
              style={{
                padding: '4px 24px',
                borderRadius: 40,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '120%',
                color: '#FFFFFF',
                background: activeCategory === cat ? '#16A34A' : 'rgba(255,255,255,0.12)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (activeCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.20)'; }}
              onMouseLeave={(e) => { if (activeCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
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
        ) : (campaigns.length > 0 ? campaigns : DUMMY_CAMPAIGNS).map((campaign, index) => {
            const id = campaign.campaignId || campaign._id || campaign.id;
            const name = campaign.campaignName || campaign.brandId?.companyName || campaign.name || 'Campaign';
            return (
              <CampaignCard
                key={id || index}
                brandName={name}
                brandInitials={getInitials(name)}
                timeAgo={campaign.timeAgo || getTimeAgo(campaign.createdAt)}
                campaignImage={campaign.productImages?.[0] || null}
                initialsColor={campaign.color || getInitialsColor(id || String(index))}
                onClick={() => id && !id.startsWith('nc') ? router.push(`/brand/campaigns/${id}`) : null}
              />
            );
          })}
      </div>
    </div>
  );
}
