'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { campaignApi } from '@/api/campaign-api';
import CampaignCard from '@/components/cards/CampaignCard';
import Button from '@/components/ui/Button';

const FILTERS = ['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling', 'Tech', 'Food'];

const DUMMY_CAMPAIGNS = [
  { _id: 'dummy-1', campaignName: 'Summer Vibes', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), _avatarColor: '#16A34A' },
  { _id: 'dummy-2', campaignName: 'Fit & Fresh', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), _avatarColor: '#2563EB' },
  { _id: 'dummy-3', campaignName: 'Tech Wave', createdAt: new Date(Date.now() - 86400000).toISOString(), _avatarColor: '#7C3AED' },
  { _id: 'dummy-4', campaignName: 'Glow Up', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), _avatarColor: '#DB2777' },
];

const DUMMY_APPLICATIONS = [
  { id: 'app-1', name: 'Alice Chen', bio: 'An innovative lifestyle creator with 250K followers across platforms. Specializes in wellness and beauty content.' },
  { id: 'app-2', name: 'Marcus Jay', bio: 'Sports and fitness influencer with 180K followers. Known for high-energy training and nutrition content.' },
  { id: 'app-3', name: 'Sofia Park', bio: 'Fashion and travel blogger with a focus on sustainable living and ethical fashion choices.' },
  { id: 'app-4', name: 'Daniel Reeves', bio: 'Tech reviewer and gadget enthusiast with an audience of 320K across YouTube and Instagram.' },
];

const INITIALS_COLORS = ['#16A34A', '#2563EB', '#7C3AED', '#DB2777', '#0D9488', '#EA580C'];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function getAvatarColor(id = '') {
  return INITIALS_COLORS[(id.charCodeAt(0) || 0) % INITIALS_COLORS.length];
}

function getTimeAgo(date) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'just now';
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-[#181818] h-[260px] w-[280px] shrink-0 animate-pulse border border-white/5" />
  );
}

function ApplicationRow({ name, bio }) {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#262626]">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[15px] font-medium shrink-0"
        style={{ backgroundColor: color, fontFamily: 'Inter, sans-serif' }}
      >
        {initials}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-white text-[15px] font-normal truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
          {name}
        </p>
        <p className="text-[#9b9b9b] text-[12px] font-normal truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
          {bio}
        </p>
      </div>
      <button
        className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#16A34A] text-white text-[12px] font-normal"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
          <path d="M1 9L8 5L1 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        View profile
      </button>
    </div>
  );
}

export default function AllCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { campaigns: data } = await campaignApi.getBrandCampaigns({}, { page: 1, limit: 100 });
        setCampaigns(data || []);
      } catch {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = campaigns.filter(c => {
    const matchesFilter =
      activeFilter === 'All' ||
      (c.campaignType || '').toLowerCase() === activeFilter.toLowerCase() ||
      (c.targetInfluencer?.targetNiche || []).some(n => n.toLowerCase() === activeFilter.toLowerCase());
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (c.campaignName || '').toLowerCase().includes(q) ||
      (c.brandId?.companyName || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const displayCampaigns = !loading && filtered.length === 0 ? DUMMY_CAMPAIGNS : filtered;

  return (
    <div className="bg-[#000201] min-h-full pr-5 py-6 pl-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <p className="text-[#9b9b9b] text-[11px] uppercase tracking-widest mb-1 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Campaigns
          </p>
          <h1 className="text-[24px] font-normal text-white leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
            All Campaigns
            {!loading && (
              <span className="ml-2 text-[16px] text-[#9b9b9b] font-normal">({filtered.length})</span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search bar — landing page style with glow + gradient stroke */}
          <div className="relative" style={{ width: 294 }}>
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-[50px] pointer-events-none" style={{
              background: 'linear-gradient(90deg, #16A34A 0%, #06FF62 100%)',
              filter: 'blur(16px)',
              opacity: 0.55,
              zIndex: 0,
            }} />
            {/* Gradient border wrapper */}
            <div className="relative z-10 rounded-[50px]" style={{
              padding: '1.5px',
              background: 'linear-gradient(90deg, #16A34A 0%, #ffffff 51%, #16A34A 100%)',
            }}>
              <div className="flex items-center rounded-[50px] px-4 h-[40px] gap-2" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
              }}>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search Campaigns..."
                  className="flex-1 bg-transparent text-[16px] text-white placeholder:text-[#9b9b9b] outline-none min-w-0"
                  style={{ fontFamily: 'Inter, sans-serif', lineHeight: '160%' }}
                />
                <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <Button size="sm" onClick={() => router.push('/brand/campaigns/create-campaign')}>
            + New Campaign
          </Button>
        </div>
      </div>

      {/* Filter chips — single horizontal scroller */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <Button
            key={f}
            variant="chip"
            size="sm"
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Recent Campaigns section */}
      {(loading || displayCampaigns.length > 0) && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Recent Campaigns
            </h2>
            <button
              className="flex items-center gap-2 text-[#16A34A] text-[16px] font-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
              onClick={() => {}}
            >
              View All
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 1L5 5L1 9" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              displayCampaigns.map(campaign => {
                const id = campaign._id || campaign.id;
                const name = campaign.campaignName || campaign.brandId?.companyName || 'Campaign';
                const avatarColor = campaign._avatarColor || getAvatarColor(id || name);
                return (
                  <div key={id} className="shrink-0 w-[280px]">
                    <CampaignCard
                      brandName={name}
                      brandInitials={getInitials(name)}
                      timeAgo={getTimeAgo(campaign.createdAt)}
                      campaignImage={campaign.productImages?.[0] || null}
                      avatarColor={avatarColor}
                      onClick={campaign._avatarColor ? undefined : () => router.push(`/brand/campaigns/${id}`)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* New Applications section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            New Applications
          </h2>
          <button
            className="flex items-center gap-2 text-[#16A34A] text-[16px] font-normal"
            style={{ fontFamily: 'Inter, sans-serif' }}
            onClick={() => {}}
          >
            View All
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M1 1L5 5L1 9" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {DUMMY_APPLICATIONS.map(app => (
            <ApplicationRow key={app.id} name={app.name} bio={app.bio} />
          ))}
        </div>
      </div>

    </div>
  );
}
