'use client'
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UserAddLine } from '@phyoofficial/phyo-icon-library';
import { influencerApi } from '@/api/influencer-api';
import InfluencerProfilePanel from '@/components/InfluencerProfilePanel';


const COVER_COLORS = [
  'from-yellow-400 to-yellow-500', 'from-blue-400 to-blue-600',
  'from-green-400 to-green-600', 'from-orange-400 to-red-500',
  'from-pink-400 to-purple-500', 'from-teal-400 to-teal-600',
];

const formatCount = (n = 0) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const normalizeInfluencer = (inf, index) => ({
  id: inf._id || inf.id,
  name: inf.profile?.name || inf.name || 'Influencer',
  username: `@${inf.profile?.username || inf.username || 'unknown'}`,
  followers: `${formatCount(inf.stats?.followers || 0)} followers`,
  avatar: inf.profile?.profileImage || inf.profileImage || '/dummyAvatar.jpg',
  coverImage: '/world-bg.png',
  coverColor: COVER_COLORS[index % COVER_COLORS.length],
  bio: inf.profile?.bio || inf.about || '',
  tags: inf.profile?.niche ? [inf.profile.niche] : inf.tags || [],
  stats: {
    followers: formatCount(inf.stats?.followers || 0),
    following: formatCount(inf.stats?.following || 0),
    posts: String(inf.stats?.totalPosts || inf.stats?.posts || 0),
    engagement: `${(inf.stats?.avgEngagementRate || 0).toFixed(1)}%`,
  },
  platforms: {
    instagram: formatCount(inf.socialMedia?.instagram?.followers || 0),
    youtube: formatCount(inf.socialMedia?.youtube?.followers || 0),
    twitter: formatCount(inf.socialMedia?.twitter?.followers || 0),
  },
});

const categories = ['All', 'Fitness', 'Comedy', 'Lifestyle', 'Infra', 'Real Estate', 'Travel'];

const TopInfluencersPage = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [influencers, setInfluencers] = useState([]);
  const [loadingInfluencers, setLoadingInfluencers] = useState(true);
  const categoriesScrollRef = useRef(null);

  // Fetch influencers from GET /api/influencers
  useEffect(() => {
    influencerApi.getAllInfluencers({}, { page: 1, limit: 20 })
      .then(({ influencers: data }) => setInfluencers(data.map(normalizeInfluencer)))
      .catch((err) => console.error('Failed to load influencers:', err))
      .finally(() => setLoadingInfluencers(false));
  }, []);

  const handleInfluencerClick = (influencer) => {
    setSelectedInfluencer({
      inf: { id: influencer.id, name: influencer.name, avatarColor: influencer.coverColor?.split(' ')[0]?.replace('from-', '') || '#067635' },
      profileData: {
        name: influencer.name,
        username: influencer.username,
        location: 'Delhi, India',
        followers: influencer.stats.followers,
        engagement: influencer.stats.engagement || '—',
        campaigns: influencer.stats.posts,
        about: influencer.bio,
        categories: influencer.tags?.length ? influencer.tags : ['Influencer'],
      },
    });
  };

  const handleInvite = () => {
    console.log('Invite:', selectedInfluencer?.username);
  };

  const scrollCategories = (direction) => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 150;
      categoriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#000201' }}>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="fade-up flex h-full pr-5 items-stretch" style={{ gap: 16, paddingTop: 20, paddingBottom: 20, paddingLeft: 0 }}>
          {/* Left: Influencers List Container */}
          <div
            className="flex-shrink-0 overflow-y-auto flex flex-col"
            style={{
              width: 450,
              gap: 12,
              background: '#181818',
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
              borderRadius: 28,
              padding: '16px',
            }}
          >
          {/* Categories - Sticky Dark Theme */}
          <div className="px-4 py-4 border-b border-white/10 sticky top-0 z-10">
            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className="flex-shrink-0 rounded-full px-4 py-1.5 font-medium transition-all"
                  style={{
                    background: activeCategory === category ? '#16A34A' : 'rgba(255,255,255,0.1)',
                    color: activeCategory === category ? '#000' : '#FFFFFF',
                    border: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Upgrade Banner - Dark Theme */}
            <div className="mx-4 mt-3 mb-3 px-4 py-3 bg-[#432004] rounded-lg border border-[#F89617]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#F89617] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xs text-white/80">You have reached your limit. Upgrade plan for more.</span>
              </div>
              <button className="px-3 py-1.5 bg-[#73400B] text-white rounded-full text-xs font-medium hover:bg-[#8B4B0D] transition-colors flex-shrink-0">
                Upgrade
              </button>
            </div>

            {/* Influencers List */}
            <div className="px-4 space-y-2">
              {loadingInfluencers ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="bg-[#262626] rounded-xl p-4 animate-pulse" style={{ height: 80 }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#3a3a3a]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#3a3a3a] rounded w-32" />
                        <div className="h-3 bg-[#333] rounded w-48" />
                      </div>
                    </div>
                  </div>
                ))
              ) : null}
              {!loadingInfluencers && influencers
                .filter(
                  (influencer) =>
                    activeCategory === 'All' ||
                    influencer.tags.includes(activeCategory)
                )
                .map((influencer) => (
                  <div
                    key={influencer.id}
                    onClick={() => handleInfluencerClick(influencer)}
                    className="flex items-center justify-between flex-shrink-0 cursor-pointer transition-all"
                    style={{
                      height: 80,
                      background: '#262626',
                      borderRadius: 16,
                      padding: '12px 16px',
                      border: selectedInfluencer?.id === influencer.id ? '1px solid #16A34A' : '1px solid rgba(255,255,255,0.08)',
                      gap: 16,
                    }}
                    onMouseEnter={(e) => { if (selectedInfluencer?.id !== influencer.id) e.currentTarget.style.borderColor = 'rgba(22,163,74,0.3)'; }}
                    onMouseLeave={(e) => { if (selectedInfluencer?.id !== influencer.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <div className="flex items-center" style={{ gap: 16, flex: 1, minWidth: 0 }}>
                      <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 56, height: 56, background: '#555' }}>
                        <Image
                          src={influencer.avatar}
                          alt={influencer.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 overflow-hidden" style={{ gap: 2 }}>
                        <span className="truncate" style={{ color: '#FFFFFF', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 400, lineHeight: '120%' }}>{influencer.name}</span>
                        <span style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '120%' }}>{influencer.stats.followers} Followers</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvite();
                      }}
                      className="flex-shrink-0 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                      style={{
                        background: '#16A34A',
                        borderRadius: 40,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#FFFFFF',
                        padding: '6px 16px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <UserAddLine style={{ width: 18, height: 18 }} />
                      Invitations
                    </button>
                  </div>
                ))}
            </div>
          </div>
          </div>

          {/* Right: Profile Panel */}
          <div
            className="flex-shrink-0 overflow-hidden flex flex-col"
            style={{
              flex: 1,
              background: '#181818',
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
              borderRadius: 28,
            }}
          >
          {selectedInfluencer ? (
            <InfluencerProfilePanel
              inf={selectedInfluencer.inf}
              profileData={selectedInfluencer.profileData}
              isInvited={false}
              onInvite={() => {}}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <Image
                  src="/logo.png"
                  alt="Phyo Logo"
                  width={286}
                  height={74}
                  className="mb-4 opacity-30"
                />
                <p className="text-lg font-semibold text-[#444]">
                  Select an influencer to view profile
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInfluencersPage;
