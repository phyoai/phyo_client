'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, MessageSquare, UserPlus, Bookmark, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookmarkLine, YoutubeFill, InstagramFill, TwitterXLine, UserAddLine, Message3Line, FacebookCircleFill } from '@phyoofficial/phyo-icon-library';
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

const influencersData = [];

const categories = ['All', 'Fitness', 'Comedy', 'Lifestyle', 'Infra', 'Real Estate', 'Travel'];

const TopInfluencersPage = () => {
  const router = useRouter();
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [influencers, setInfluencers] = useState([]);
  const [loadingInfluencers, setLoadingInfluencers] = useState(true);
  const categoriesScrollRef = useRef(null);

  useEffect(() => {
    influencerApi.getAllInfluencers({}, { page: 1, limit: 20 })
      .then(({ influencers: data }) => setInfluencers(data.map(normalizeInfluencer)))
      .catch((err) => console.error('Failed to load influencers:', err))
      .finally(() => setLoadingInfluencers(false));
  }, []);

  const handleBack = () => {
    router.push('/user/dashboard');
  };

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

  const handleCloseProfile = () => {
    setSelectedInfluencer(null);
  };

  const handleSendMessage = () => {
    console.log('Send message to:', selectedInfluencer?.username);
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
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* App Bar */}
      <div className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-100 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-xl font-semibold text-[#242527] flex-1 px-2">
          Influencers
        </h1>

        <button
          type="button"
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Influencers List */}
        <div className={`flex flex-col ${selectedInfluencer ? 'w-[604px]' : 'flex-1'} border-r border-gray-200 transition-all duration-300 shrink-0 overflow-hidden`}>
          {/* Categories - Sticky */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {/* Left Arrow */}
              <button
                onClick={() => scrollCategories('left')}
                className="flex-shrink-0 p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5 text-[#242527]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${activeCategory === category
                        ? 'bg-[#43573b] text-white'
                        : 'bg-[#f0f0f0] text-[#242527] hover:bg-[#e0e0e0]'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scrollCategories('right')}
                className="flex-shrink-0 p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5 text-[#242527]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Upgrade Banner */}
            <div className="mx-6 mt-4 mb-4 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm text-[#242527]">You have reached your limit. Upgrade plan for more</span>
              </div>
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                Upgrade
              </button>
            </div>

            {/* Influencers List */}
            <div className="px-6 space-y-3">
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
                    className={`bg-[#f5f5f5] rounded-xl p-4 cursor-pointer hover:bg-[#e8e8e8] transition-colors ${selectedInfluencer?.id === influencer.id ? 'ring-2 ring-[#43573b]' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500">
                        <Image
                          src={influencer.avatar}
                          alt={influencer.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-[#242527]">
                          {influencer.name}
                        </h3>
                        <p className="text-sm text-[#808080]">
                          {influencer.bio.split(' ').slice(0, 2).join(' ')}
                        </p>
                        {/* Social Stats */}
                        <div className="flex gap-3 mb-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-black text-xs font-bold">
                              <YoutubeFill size={14} />
                            </div>
                            <span className="text-xs font-medium text-[#242527]">22.5k</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-black text-xs font-bold">
                              <InstagramFill size={14} />
                            </div>
                            <span className="text-xs font-medium text-[#242527]">22.5k</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-black text-xs font-bold">
                              <TwitterXLine size={14} />
                            </div>
                            <span className="text-xs font-medium text-[#242527]">22.5k</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendMessage();
                        }}
                        className="px-5 py-2 border border-[#43573b] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Message3Line className="w-4 h-4" />
                        message
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInvite();
                        }}
                        className="px-5 py-2 border border-[#43573b] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <UserAddLine className="w-4 h-4" />
                        invite
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Profile Panel */}
        <div className="flex-1 overflow-y-auto bg-white m-1 shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-lg">
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
  );
};

function InfluencerProfile({ influencer }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const moreMenuRef = useRef(null);

  const [savedLists, setSavedLists] = useState([
    { id: 1, name: 'Favorties', initials: 'AB', color: '#0066ff' },
    { id: 2, name: 'Campaign 1', initials: 'AB', color: '#0066ff' }
  ]);

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
    <div className="w-full h-full relative rounded-lg overflow-y-auto">
      {/* Yellow Background - Sticky at top */}
      <div className="sticky top-0 bg-yellow-400 h-[400px] z-0">
        {/* Profile Image - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
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

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Report
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Not interested
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
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
            <div className="px-4 pt-4 pb-3">
              <h3 className="text-lg font-semibold text-[#242527]">Save to...</h3>
            </div>

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

      {/* Profile Content - White card that scrolls over yellow background */}
      <div className="relative bg-white rounded-t-3xl -mt-8 z-10 shadow-lg">
        <div className="px-4 py-6 pb-28">
          <div className="mb-6">
            <p className="text-[#808080] text-base font-semibold leading-6 tracking-[0.24px] mb-1">{influencer.username}</p>
            <h2 className="text-[#242527] text-4xl font-bold leading-[48px] tracking-[-0.32px]">{influencer.name}</h2>
          </div>

          <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <FacebookCircleFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.followers}</span>
            </div>
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <InstagramFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.following}</span>
            </div>
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <YoutubeFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.posts}</span>
            </div>
          </div>

          <div className="flex gap-5 mb-6">
            <div className="flex-1">
              <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">Location</p>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8.66667C8.73638 8.66667 9.33333 8.06971 9.33333 7.33333C9.33333 6.59695 8.73638 6 8 6C7.26362 6 6.66667 6.59695 6.66667 7.33333C6.66667 8.06971 7.26362 8.66667 8 8.66667Z" fill="#ff4f4f" />
                  <path d="M8 1.33333C6.23189 1.33333 4.66667 2.89856 4.66667 4.66667C4.66667 7.33333 8 12 8 12C8 12 11.3333 7.33333 11.3333 4.66667C11.3333 2.89856 9.76811 1.33333 8 1.33333Z" stroke="#ff4f4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[#808080] text-base leading-6">{influencer.location}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">Age</p>
              <span className="text-[#808080] text-base leading-6">{influencer.age}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">About</h3>
            <p className="text-[#808080] text-base leading-6 text-justify">
              {influencer.about}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#dae3d1] rounded-full text-[#43573b] text-base font-semibold hover:bg-[#c9d9ba] transition-colors tracking-[0.24px]">
            <UserPlus className="h-6 w-6" />
            Invite
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#43573b] rounded-full text-white text-base font-semibold hover:bg-[#374829] transition-colors tracking-[0.24px]">
            <MessageSquare className="h-6 w-6" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopInfluencersPage;
