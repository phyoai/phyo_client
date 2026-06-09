'use client'
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { BookmarkLine, UserAddLine, Message3Line } from '@phyoofficial/phyo-icon-library';
import { influencerApi } from '@/api/influencer-api';


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
    const transformedInfluencer = {
      id: influencer.id,
      name: influencer.name,
      username: influencer.username,
      followers: influencer.stats.followers,
      following: influencer.stats.following,
      posts: influencer.stats.posts,
      location: 'Delhi, India',
      age: '34',
      about: influencer.bio,
      likes: '9.2K',
      views: '9.2K'
    };
    setSelectedInfluencer(transformedInfluencer);
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
          <div className="px-4 py-3 border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {/* Left Arrow */}
              <button
                onClick={() => scrollCategories('left')}
                className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Categories Container */}
              <div
                ref={categoriesScrollRef}
                className="flex gap-2 overflow-x-hidden pb-2 flex-1 scrollbar-hide"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${activeCategory === category
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/15'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scrollCategories('right')}
                className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
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
                  <div key={i} className="bg-[#f5f5f5] rounded-xl p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-300" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32" />
                        <div className="h-3 bg-gray-200 rounded w-48" />
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
                      <div className="flex flex-col" style={{ gap: 2 }}>
                        <span style={{ color: '#FFFFFF', fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 400, lineHeight: '120%' }}>{influencer.name}</span>
                        <span style={{ color: '#9B9B9B', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '120%' }}>{influencer.followers} Followers</span>
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
            className="flex-shrink-0 overflow-y-auto flex flex-col"
            style={{
              flex: 1,
              gap: 12,
              background: '#181818',
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
              borderRadius: 28,
              padding: '16px',
            }}
          >
          {selectedInfluencer ? (
            <InfluencerProfile influencer={selectedInfluencer} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-[#f0f0f0]">
              <div className="text-center">
                <Image
                  src="/logo.png"
                  alt="Phyo Logo"
                  width={286}
                  height={74}
                  className="mb-4 opacity-50"
                />
                <p className="text-lg font-semibold text-[#808080]">
                  A PyroMedia Product
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

// InfluencerProfile Component (Right Side Panel) - Matches Figma node 45-15931
function InfluencerProfile({ influencer }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const moreMenuRef = useRef(null);

  // Sample lists data
  const [savedLists, setSavedLists] = useState([
    { id: 1, name: 'Favorties', initials: 'AB', color: '#0066ff' },
    { id: 2, name: 'Campaign 1', initials: 'AB', color: '#0066ff' }
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleSaveToList = (listId) => {
    // Handle saving to list
    console.log('Saving to list:', listId);
    setShowSaveModal(false);
  };

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: savedLists.length + 1,
        name: newListName,
        initials: 'AB',
        color: '#0066ff'
      };
      setSavedLists([...savedLists, newList]);
      setNewListName('');
      setShowNewListModal(false);
      setShowSaveModal(true);
    }
  };

  return (
    <div className="w-full h-full relative bg-[#000201] overflow-y-auto">
      {/* PINK/MAGENTA HERO BANNER - Matches Figma */}
      <div className="sticky top-0 h-[280px] z-0 overflow-hidden rounded-b-3xl" style={{ background: 'linear-gradient(135deg, #D946EF 0%, #EC4899 50%, #D946EF 100%)' }}>
        {/* Profile Image - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
            {/* Placeholder for profile image */}
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400"></div>
          </div>
        </div>

        {/* Top Action Buttons - Overlaid */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
            >
              <BookmarkLine className="h-5 w-5" />
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {/* More Menu Dropdown */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Report functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Report
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Not interested functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Not interested
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Share functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save to List Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
          <div className="bg-white rounded-3xl shadow-xl w-[480px]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <h3 className="text-lg font-semibold text-[#242527]">Save to...</h3>
            </div>

            {/* List Items */}
            <div className="flex flex-col">
              {savedLists.map((list) => (
                <div key={list.id} className="flex items-center px-4 py-3 hover:bg-gray-50">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4"
                    style={{ backgroundColor: list.color }}
                  >
                    {list.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#242527]">{list.name}</p>
                  </div>
                  <button
                    onClick={() => handleSaveToList(list.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <BookmarkLine className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* New List Button */}
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setShowNewListModal(true);
                }}
                className="w-full bg-[#dae3d1] text-[#43573b] py-3 rounded-full font-semibold hover:bg-[#c9d9ba] transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                New List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={() => setShowNewListModal(false)}>
          <div className="bg-[#f0f0f0] rounded-lg p-6 w-[400px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#242527] mb-4">New List</h3>

            <input
              type="text"
              placeholder="Placeholder"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNewList()}
              className="w-full bg-[#f0f0f0] border-2 border-[#e6e6e6] rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:border-[#43573b]"
              autoFocus
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNewListModal(false);
                  setNewListName('');
                }}
                className="px-6 py-2 border border-[#43573b] text-[#43573b] rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewList}
                className="px-6 py-2 bg-[#43573b] text-white rounded-lg font-medium hover:bg-[#374829] transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content - Dark cards */}
      <div className="relative bg-[#000201] -mt-12 z-10 flex flex-col">
        <div className="px-6 py-5 pb-28 flex-1">
          {/* Username and Name - Dark Theme */}
          <div className="mb-4 pt-6">
            <p className="text-[#9A9A9A] text-sm font-medium mb-1">{influencer.username}</p>
            <h2 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{influencer.name}</h2>
          </div>

          {/* Stats Grid - Dark Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#181818] rounded-2xl px-3 py-4 text-center border border-[#262626]">
              <p className="text-white text-xl font-bold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{influencer.followers}</p>
              <p className="text-[#9B9B9B] text-xs mt-1">Followers</p>
            </div>
            <div className="bg-[#181818] rounded-2xl px-3 py-4 text-center border border-[#262626]">
              <p className="text-white text-xl font-bold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{influencer.following}</p>
              <p className="text-[#9B9B9B] text-xs mt-1">Following</p>
            </div>
            <div className="bg-[#181818] rounded-2xl px-3 py-4 text-center border border-[#262626]">
              <p className="text-white text-xl font-bold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{influencer.posts}</p>
              <p className="text-[#9B9B9B] text-xs mt-1">Posts</p>
            </div>
          </div>

          {/* Location and Age */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <p className="text-white text-sm font-semibold mb-2">Location</p>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8.66667C8.73638 8.66667 9.33333 8.06971 9.33333 7.33333C9.33333 6.59695 8.73638 6 8 6C7.26362 6 6.66667 6.59695 6.66667 7.33333C6.66667 8.06971 7.26362 8.66667 8 8.66667Z" fill="#ff4f4f" />
                  <path d="M8 1.33333C6.23189 1.33333 4.66667 2.89856 4.66667 4.66667C4.66667 7.33333 8 12 8 12C8 12 11.3333 7.33333 11.3333 4.66667C11.3333 2.89856 9.76811 1.33333 8 1.33333Z" stroke="#ff4f4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[#808080] text-base leading-6">{influencer.location}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold mb-2">Age</p>
              <span className="text-[#9A9A9A] text-sm">{influencer.age}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6 bg-[#181818] rounded-2xl p-5 border border-[#262626]">
            <h3 className="text-white text-base font-semibold mb-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Biography</h3>
            <p className="text-[#9A9A9A] text-sm leading-relaxed">
              {influencer.about}
            </p>
          </div>

          {/* Top Campaigns Section */}
          <div className="mb-6 bg-[#181818] rounded-2xl p-5 border border-[#262626]">
            <h3 className="text-white text-base font-semibold mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Top Campaigns</h3>

            {/* Likes and Views Graphs */}
            <div className="flex gap-3 overflow-x-auto mb-6">
              {/* Likes Graph */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 min-w-[380px] flex-shrink-0">
                <div className="mb-2">
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.likes} Likes</p>
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11 8L8 5L5 8" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11 11L8 8L5 11" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[#067635] font-medium">24%</span>
                    <span className="text-[#808080]">vs</span>
                    <span className="text-[#808080]">last month</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col justify-between text-[#333] text-xs py-2">
                    <span>10K</span>
                    <span>8K</span>
                    <span>4K</span>
                    <span>2K</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 relative h-[217px]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 352 217" preserveAspectRatio="none">
                      <path d="M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955" stroke="#43573b" strokeWidth="2" fill="none" />
                      <path d="M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955V217H0V126.089Z" fill="#43573b" fillOpacity="0.2" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between text-[#333] text-xs text-center mt-2 pl-6">
                  <span className="w-[60px]">July</span>
                  <span className="w-[60px]">Aug</span>
                  <span className="w-[60px]">Sep</span>
                  <span className="w-[60px]">Oct</span>
                  <span className="w-[60px]">Nov</span>
                  <span className="w-[60px]">Dec</span>
                </div>
              </div>

              {/* Views Graph */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 min-w-[380px] flex-shrink-0">
                <div className="mb-2">
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.views} views</p>
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11 8L8 5L5 8" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11 11L8 8L5 11" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[#067635] font-medium">24%</span>
                    <span className="text-[#808080]">vs</span>
                    <span className="text-[#808080]">last month</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col justify-between text-[#333] text-xs py-2">
                    <span>10K</span>
                    <span>8K</span>
                    <span>4K</span>
                    <span>2K</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 relative h-[217px]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 352 217" preserveAspectRatio="none">
                      <path d="M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8" stroke="#43573b" strokeWidth="2" fill="none" />
                      <path d="M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8V217H0V134Z" fill="#43573b" fillOpacity="0.2" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between text-[#333] text-xs text-center mt-2 pl-6">
                  <span className="w-[60px]">July</span>
                  <span className="w-[60px]">Aug</span>
                  <span className="w-[60px]">Sep</span>
                  <span className="w-[60px]">Oct</span>
                  <span className="w-[60px]">Nov</span>
                  <span className="w-[60px]">Dec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div className="mb-6 bg-[#181818] rounded-2xl p-5 border border-[#262626]">
            <h3 className="text-white text-base font-semibold mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Audience Insights</h3>

            {/* Age Group */}
            <div className="bg-[#262626] rounded-xl p-3 mb-4">
              <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-2">Age Group</p>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[#333] text-xs py-2 text-right" style={{ minWidth: '32px' }}>
                  <span>100%</span>
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                  <span>0%</span>
                </div>
                <div className="flex-1 flex items-end justify-around gap-[6px] pb-1" style={{ height: '150px' }}>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '99px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '75px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '84px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '45px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '72px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '60px' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-around text-[#333] text-xs text-center mt-2 pl-8 gap-[6px]">
                <span className="flex-1 min-w-[24px] max-w-[32px]">12-18</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">19-24</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">24-34</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">35-50</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">50-65</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">65+</span>
              </div>
            </div>

            {/* Gender */}
            <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 mb-3">
              <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-2">Gender</p>
              <div className="flex items-center justify-center py-4">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#9ba194" strokeWidth="20" />
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#43573b" strokeWidth="20"
                    strokeDasharray="245 408" strokeDashoffset="0" transform="rotate(-90 75 75)" />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#43573b]"></div>
                  <span className="text-[#333] text-xs">Male</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#9ba194]"></div>
                  <span className="text-[#333] text-xs">Female</span>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2">
              <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-2">Top Locations</p>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[#333] text-xs py-2 text-right" style={{ minWidth: '32px' }}>
                  <span>100%</span>
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                  <span>0%</span>
                </div>
                <div className="flex-1 flex items-end justify-around gap-[6px] pb-1" style={{ height: '150px' }}>
                  {/* In */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '105px' }}></div>
                  </div>
                  {/* DL */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '95px' }}></div>
                  </div>
                  {/* USA */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '78px' }}></div>
                  </div>
                  {/* NY */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '95px' }}></div>
                  </div>
                  {/* UK */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '72px' }}></div>
                  </div>
                  {/* Lon */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '53px' }}></div>
                  </div>
                  {/* UAE */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '68px' }}></div>
                  </div>
                  {/* Dub */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '78px' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-around text-[#333] text-xs text-center mt-2 pl-8 gap-[6px]">
                <span style={{ minWidth: '24px' }}>In</span>
                <span style={{ minWidth: '24px' }}>DL</span>
                <span style={{ minWidth: '24px' }}>USA</span>
                <span style={{ minWidth: '24px' }}>NY</span>
                <span style={{ minWidth: '24px' }}>UK</span>
                <span style={{ minWidth: '24px' }}>Lon</span>
                <span style={{ minWidth: '24px' }}>UAE</span>
                <span style={{ minWidth: '24px' }}>Dub</span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#43573b]"></div>
                  <span className="text-[#333] text-xs">Top Countries</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#9ba194]"></div>
                  <span className="text-[#333] text-xs">Top Cities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Influencers */}
          <div className="mb-6">
            <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-3">Similar Influencers</h3>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* Similar Influencer Card 1 */}
              <div className="bg-[#f0f0f0] border-2 border-white rounded-xl overflow-hidden min-w-[375px] flex-shrink-0">
                <p className="text-[#808080] text-xs px-4 pt-2">Health & Lifestyle</p>
                <div className="aspect-[375/216] bg-gradient-to-br from-orange-200 to-pink-200"></div>
                <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#008490] rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] truncate">Emily Johnson</p>
                    <p className="text-[#333] text-base">22.4K follower</p>
                  </div>
                </div>
              </div>

              {/* Similar Influencer Card 2 */}
              <div className="bg-[#f0f0f0] border-2 border-white rounded-xl overflow-hidden min-w-[375px] flex-shrink-0">
                <p className="text-[#808080] text-xs px-4 pt-2">Health & Lifestyle</p>
                <div className="aspect-[375/216] bg-gradient-to-br from-blue-200 to-purple-200"></div>
                <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#008490] rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] truncate">Emily Johnson</p>
                    <p className="text-[#333] text-base">22.4K follower</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page indicators */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-[#242527]"></div>
              <div className="w-2 h-2 rounded-full bg-[#e6e6e6]"></div>
              <div className="w-2 h-2 rounded-full bg-[#e6e6e6]"></div>
              <div className="w-2 h-2 rounded-full bg-[#e6e6e6]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 bg-[#0d0d0d] border-t border-white/10 px-5 py-3 z-20 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#262626] rounded-full text-white text-sm font-medium hover:bg-[#333] transition-colors">
          <UserAddLine className="w-4 h-4" />
          Invite
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#16A34A] rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Message3Line className="w-4 h-4" />
          Send Message
        </button>
      </div>
    </div>
  );
}

export default TopInfluencersPage;
