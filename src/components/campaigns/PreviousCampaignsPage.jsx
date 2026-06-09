'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Clock } from 'lucide-react';
import { campaignApi } from '@/api/campaign-api';
import CampaignCard from '@/components/cards/CampaignCard';
import Button from '@/components/ui/Button';

const FILTERS = ['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling', 'Tech', 'Food'];

const INITIALS_COLORS = [
  'bg-blue-600', 'bg-teal-600', 'bg-blue-500',
  'bg-teal-500', 'bg-pink-600', 'bg-purple-600', 'bg-[#16a34a]',
];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function getInitialsColor(id = '') {
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
  return <div className="rounded-3xl bg-[#181818] h-[260px] animate-pulse border border-white/5" />;
}

function EmptyState({ query }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center">
        <Clock className="w-7 h-7 text-[#9b9b9b]" />
      </div>
      <p className="text-white text-[18px] font-normal" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
        {query ? `No results for "${query}"` : 'No previous campaigns'}
      </p>
      <p className="text-[#9b9b9b] text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {query ? 'Try a different search or filter' : 'Completed campaigns will appear here'}
      </p>
    </div>
  );
}

export default function PreviousCampaignsPage({ role }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await campaignApi.getAllCampaigns(
          { status: 'Completed' },
          { page: 1, limit: 100 }
        );
        setCampaigns(result.campaigns || []);
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

  return (
    <div className="bg-[#000201] min-h-full px-5 sm:px-8 lg:px-10 py-6">

      {/* ── Top bar: Title + Search + Filter icon (matches Figma) ── */}
      <div className="flex items-center justify-between gap-4 mb-5">

        {/* Title */}
        <h1
          className="text-[24px] font-normal text-white capitalize leading-[1.2] shrink-0"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          Previous Campaigns
        </h1>

        {/* Right: search + filter icon */}
        <div className="flex items-center gap-2">
          {/* Search bar — dark bg, green glow border, green circle search button */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="bg-[#0d1f12] text-white placeholder:text-[#9b9b9b] pl-4 pr-11 py-[9px] rounded-full text-[14px] w-[200px] sm:w-[240px] outline-none border border-[#16a34a] transition-colors"
              style={{ boxShadow: '0 0 10px rgba(22,163,74,0.25)', fontFamily: 'Inter, sans-serif' }}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Filter icon button */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              showFilters ? 'bg-[#16a34a] text-white' : 'bg-[#1e1e1e] text-[#9b9b9b] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Filter chips — shown when filter icon is active ── */}
      {showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
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
      )}

      {/* ── Campaign grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length > 0 ? (
          filtered.map(campaign => {
            const id = campaign._id || campaign.id;
            const name = campaign.campaignName || campaign.brandId?.companyName || 'Campaign';
            return (
              <CampaignCard
                key={id}
                brandName={name}
                brandInitials={getInitials(name)}
                timeAgo={getTimeAgo(campaign.createdAt)}
                campaignImage={campaign.productImages?.[0] || null}
                initialsColor={getInitialsColor(id || name)}
                onClick={() => router.push(`/${role}/campaigns/${id}`)}
              />
            );
          })
        ) : (
          <EmptyState query={search} />
        )}
      </div>
    </div>
  );
}
