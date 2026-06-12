import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import CampaignCard from '@/components/cards/CampaignCard';
import { campaignApi } from '@/api/campaign-api';

const CATEGORIES = ['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling'];

const DUMMY_CAMPAIGNS = [
  { id: 'dc1', name: 'Glow Beyond Filters', timeAgo: '2d ago', color: 'bg-purple-600' },
  { id: 'dc2', name: 'Fuel Your Finish', timeAgo: '5d ago', color: 'bg-blue-600' },
  { id: 'dc3', name: 'Pack Light, Go Far', timeAgo: '1w ago', color: 'bg-teal-600' },
];

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
        onViewAll={() => router.push('/brand/campaigns/all-campaigns')}
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
                onClick={() => id && !id.startsWith('dc') ? router.push(`/brand/campaigns/${id}`) : null}
              />
            );
          })}
      </div>
    </div>
  );
}
