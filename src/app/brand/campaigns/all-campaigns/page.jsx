'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, TrendingUp } from 'lucide-react';
import { campaignApi } from '@/api/campaign-api';

const CampaignCard = ({ campaign, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const name = campaign.campaignName || 'Untitled Campaign';
  const initials = name.charAt(0).toUpperCase();
  const date = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '3d ago';
  const image = campaign.productImages?.[0] || null;

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer flex flex-col h-[320px] transition-colors duration-200"
      style={{ backgroundColor: hovered ? '#f8fff7' : '#181818' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Content — 72px top, padding: 12px 4px 12px 16px per Figma */}
      <div className="h-[72px] shrink-0 flex items-center" style={{ padding: '12px 4px 12px 16px' }}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[#16A34A] rounded-full flex items-center justify-center text-white font-medium text-base shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium truncate transition-colors duration-200"
               style={{ color: hovered ? '#1D1B20' : '#ffffff' }}>
              {name}
            </p>
            <p className="text-sm truncate transition-colors duration-200"
               style={{ color: hovered ? '#49454F' : '#9B9B9B' }}>
              {date}
            </p>
          </div>
        </div>
        <button
          className="w-12 h-12 flex items-center justify-center rounded-full transition-colors shrink-0"
          style={{ color: hovered ? '#1D1B20' : '#ffffff' }}
          onClick={e => e.stopPropagation()}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Media — fills rest, bg changes on hover */}
      <div
        className="flex-1 relative overflow-hidden transition-colors duration-200"
        style={{ backgroundColor: hovered ? '#e6f0e6' : '#252525' }}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-12 h-12" style={{ color: hovered ? '#16A34A' : 'rgba(255,255,255,0.1)' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default function AllCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { campaigns: data } = await campaignApi.getBrandCampaigns({}, { page: 1, limit: 50 });
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const getFiltered = () => {
    const active = campaigns.filter(c => ['active', 'published'].includes((c.status || '').toLowerCase()));
    if (activeFilter === 'All') return active;
    return active.filter(c =>
      (c.campaignType || '').toLowerCase() === activeFilter.toLowerCase() ||
      (c.targetInfluencer?.targetNiche || []).some(n => n.toLowerCase() === activeFilter.toLowerCase())
    );
  };

  const filtered = getFiltered();

  return (
    <div className="bg-[#000201] min-h-full px-10 py-6">
      <div className="mb-4">
        <h2
          className="text-2xl font-normal text-white capitalize leading-[120%]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          Recent Campaigns
        </h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-1 rounded-full text-sm font-normal whitespace-nowrap transition-colors ${
              activeFilter === f ? 'bg-[#16A34A] text-white' : 'bg-white/[0.12] text-white hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 2-column grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#181818] rounded-xl h-[320px] animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(campaign => (
            <CampaignCard
              key={campaign._id || campaign.id}
              campaign={campaign}
              onClick={() => router.push(`/brand/campaigns/${campaign._id || campaign.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-[#9B9B9B] text-sm py-8 text-center">No campaigns found.</p>
      )}
    </div>
  );
}
