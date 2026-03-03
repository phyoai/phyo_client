'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, MessageSquare, UserPlus, Bookmark, ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { BookmarkLine, YoutubeFill, InstagramFill, TwitterXLine, UserAddLine, Message3Line, FacebookCircleFill } from '@phyoofficial/phyo-icon-library';

const influencersData = [
  {
    id: 1,
    name: 'Campaign Chacha',
    username: '@campaignchacha',
    followers: '22.4k followers',
    avatar: '/dummyAvatar.jpg',
    coverImage: '/world-bg.png',
    coverColor: 'from-yellow-400 to-yellow-500',
    bio: 'Content creator specializing in campaign management and brand collaborations. Passionate about helping brands tell their story.',
    tags: ['Marketing', 'Branding', 'Content Strategy'],
    stats: {
      followers: '22.4k',
      following: '1.2k',
      posts: '856',
      engagement: '5.8%'
    },
    platforms: {
      instagram: '22.4k',
      youtube: '15.3k',
      twitter: '8.9k'
    }
  },
  {
    id: 2,
    name: 'Dadi Cool',
    username: '@dadi_cool',
    followers: '22.4k followers',
    avatar: '/dummyAvatar1.jpg',
    coverImage: '/world-bg.png',
    coverColor: 'from-yellow-400 to-yellow-500',
    bio: 'Lifestyle influencer sharing daily adventures and authentic moments. Love connecting with brands that value creativity.',
    tags: ['Lifestyle', 'Fashion', 'Travel'],
    stats: {
      followers: '22.4k',
      following: '980',
      posts: '642',
      engagement: '6.2%'
    },
    platforms: {
      instagram: '22.4k',
      youtube: '12.1k',
      twitter: '7.5k'
    }
  },
  {
    id: 3,
    name: 'Tech Guru',
    username: '@techguru',
    followers: '35.7k followers',
    avatar: '/dummyAvatar1 2.jpg',
    coverImage: '/world-bg.png',
    coverColor: 'from-blue-400 to-blue-600',
    bio: 'Technology enthusiast and reviewer. Helping people make informed decisions about tech products.',
    tags: ['Technology', 'Reviews', 'Gadgets'],
    stats: {
      followers: '35.7k',
      following: '450',
      posts: '1024',
      engagement: '7.1%'
    },
    platforms: {
      instagram: '35.7k',
      youtube: '42.3k',
      twitter: '18.2k'
    }
  },
  {
    id: 4,
    name: 'Fitness Pro',
    username: '@fitnesspro',
    followers: '28.9k followers',
    avatar: '/dummyAvatar.jpg',
    coverImage: '/world-bg.png',
    coverColor: 'from-green-400 to-green-600',
    bio: 'Personal trainer and fitness coach. On a mission to help people achieve their health goals.',
    tags: ['Fitness', 'Health', 'Wellness'],
    stats: {
      followers: '28.9k',
      following: '720',
      posts: '892',
      engagement: '6.9%'
    },
    platforms: {
      instagram: '28.9k',
      youtube: '31.5k',
      twitter: '11.8k'
    }
  },
  {
    id: 5,
    name: 'Foodie Delight',
    username: '@foodiedelight',
    followers: '41.2k followers',
    avatar: '/dummyAvatar1.jpg',
    coverImage: '/world-bg.png',
    coverColor: 'from-orange-400 to-red-500',
    bio: 'Food blogger exploring culinary adventures around the world. Sharing recipes and restaurant reviews.',
    tags: ['Food', 'Cooking', 'Travel'],
    stats: {
      followers: '41.2k',
      following: '1.5k',
      posts: '1247',
      engagement: '8.3%'
    },
    platforms: {
      instagram: '41.2k',
      youtube: '25.8k',
      twitter: '9.4k'
    }
  },
  {
    id: 6,
    name: 'Fashion Icon',
    username: '@fashionicon',
    followers: '52.6k followers',
    avatar: '/dummyAvatar1 2.jpg',
    coverImage: '/world-bg.png',
    coverColor: 'from-pink-400 to-purple-500',
    bio: 'Fashion designer and style consultant. Helping people discover their unique style.',
    tags: ['Fashion', 'Style', 'Design'],
    stats: {
      followers: '52.6k',
      following: '890',
      posts: '1583',
      engagement: '9.1%'
    },
    platforms: {
      instagram: '52.6k',
      youtube: '18.9k',
      twitter: '14.3k'
    }
  }
];

const categories = ['All', 'Fitness', 'Comedy', 'Lifestyle', 'Infra', 'Real Estate', 'Travel'];


const TopInfluencersPage = () => {
  const router = useRouter();
  const params = useParams();
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

  // Get influencer from URL param
  const influencerId = parseInt(params?.id);
  const influencer = influencersData.find(inf => inf.id === influencerId);

  // Transform influencer data to match InfluencerProfile expected format
  const displayInfluencer = influencer ? {
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
  } : null;

  const handleBack = () => {
    router.push('/brand/dashboard');
  };

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

  const handleSendMessage = () => {
    console.log('Send message to:', displayInfluencer?.username);
  };

  const handleInvite = () => {
    console.log('Invite:', displayInfluencer?.username);
  };

  if (!displayInfluencer) {
    return (
      <div className="bg-white h-screen flex flex-col overflow-hidden">
        <div className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-100 shrink-0">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-[#242527] flex-1 px-2">Influencer Not Found</h1>
          <div className="w-12"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">The influencer you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

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
        {/* Influencer Profile - Full Width */}
        <div className="flex-1 w-full overflow-y-auto bg-white">
          {/* Yellow Background - Sticky at top */}
          <div className="sticky top-0 bg-yellow-400 h-[400px] z-0">
            {/* Profile Image - Centered */}
            <div className="absolute inset-0 flex items-center justify-center pt-8">
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
                {/* Placeholder for profile image */}
                <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400"></div>
              </div>
            </div>

            {/* Top Action Buttons - Overlaid */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <button
                onClick={handleBack}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              >
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
                    className="px-6 py-2 bg-[#dae3d1] text-[#43573b] rounded-lg font-medium hover:bg-[#c9d9ba] transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Content - Showing after yellow bg */}
          <div className="relative z-1 bg-white pt-8 px-6 pb-32">
            {/* Profile Info */}
            <div className="mb-6">
              <p className="text-[#808080] text-base font-semibold leading-6 tracking-[0.24px] mb-1">{displayInfluencer.username}</p>
              <h2 className="text-[#242527] text-4xl font-bold leading-[48px] tracking-[-0.32px]">{displayInfluencer.name}</h2>
            </div>

            {/* Stats Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                <FacebookCircleFill className="w-5 h-5" style={{ color: '#1877f2' }} />
                <span className="text-[#808080] text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{displayInfluencer.followers}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                <InstagramFill className="w-5 h-5" style={{ color: '#e1306c' }} />
                <span className="text-[#808080] text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{displayInfluencer.following}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                <YoutubeFill className="w-5 h-5" style={{ color: '#ff0000' }} />
                <span className="text-[#808080] text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{displayInfluencer.posts}</span>
              </div>
            </div>

            {/* Location and Age */}
            <div className="flex gap-6 mb-8">
              <div>
                <p className="text-[#808080] text-sm leading-5 mb-1">Location</p>
                <span className="text-[#808080] text-base leading-6">Delhi, India</span>
              </div>
              <div>
                <p className="text-[#808080] text-sm leading-5 mb-1">Age</p>
                <span className="text-[#808080] text-base leading-6">34</span>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-2">About</h3>
              <p className="text-[#808080] text-base leading-6">{displayInfluencer.about}</p>
            </div>

            {/* Interactions Section */}
            <div className="mb-8">
              <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-4">Interactions</h3>

              {/* Likes Graph */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 min-w-[380px] flex-shrink-0 mb-3">
                <div className="mb-2">
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{displayInfluencer.likes} likes</p>
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
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{displayInfluencer.views} views</p>
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

            {/* Audience Insights */}
            <div className="mb-8">
              <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-3">Audience Insights</h3>

              {/* Age Group */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 mb-3">
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
                      <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '65px' }}></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                      <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '42px' }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-[#333] text-xs text-center mt-2 pl-6">
                  <span className="w-[60px]">13-17</span>
                  <span className="w-[60px]">18-24</span>
                  <span className="w-[60px]">25-34</span>
                  <span className="w-[60px]">35-44</span>
                  <span className="w-[60px]">45+</span>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-4 mb-3">
                <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-4">Gender</p>
                <div className="flex items-center gap-8">
                  <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90" viewBox="0 0 100 100" width="100%" height="100%">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#43573b"
                        strokeWidth="15"
                        strokeDasharray="62.8 131.6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#dae3d1"
                        strokeWidth="15"
                        strokeDasharray="68.8 131.6"
                        strokeDashoffset="-62.8"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#242527]">48%</p>
                        <p className="text-xs text-[#808080]">Female</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-[#43573b] rounded-full"></div>
                        <span className="text-sm text-[#242527]">Female: 48%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#dae3d1] rounded-full"></div>
                        <span className="text-sm text-[#242527]">Male: 52%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Locations */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-4">
                <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-4">Top Locations</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#242527]">United States</span>
                      <span className="text-sm text-[#808080]">34%</span>
                    </div>
                    <div className="w-full bg-[#e6e6e6] rounded-full h-2">
                      <div className="bg-[#43573b] h-full rounded-full" style={{ width: '34%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#242527]">United Kingdom</span>
                      <span className="text-sm text-[#808080]">22%</span>
                    </div>
                    <div className="w-full bg-[#e6e6e6] rounded-full h-2">
                      <div className="bg-[#43573b] h-full rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#242527]">Canada</span>
                      <span className="text-sm text-[#808080]">18%</span>
                    </div>
                    <div className="w-full bg-[#e6e6e6] rounded-full h-2">
                      <div className="bg-[#43573b] h-full rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#242527]">Australia</span>
                      <span className="text-sm text-[#808080]">12%</span>
                    </div>
                    <div className="w-full bg-[#e6e6e6] rounded-full h-2">
                      <div className="bg-[#43573b] h-full rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#242527]">India</span>
                      <span className="text-sm text-[#808080]">14%</span>
                    </div>
                    <div className="w-full bg-[#e6e6e6] rounded-full h-2">
                      <div className="bg-[#43573b] h-full rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Influencers */}
            <div className="mb-20">
              <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-4">Similar Influencers</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 w-[220px]">
                    <div className="w-full h-32 bg-gradient-to-br from-orange-300 to-red-400 rounded-lg mb-3"></div>
                    <p className="text-[#242527] font-semibold text-sm mb-1">Influencer {item}</p>
                    <p className="text-[#808080] text-xs mb-3">@influencer{item}</p>
                    <button className="w-full bg-[#dae3d1] text-[#43573b] py-2 rounded-lg text-sm font-semibold hover:bg-[#c9d9ba] transition-colors">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 z-40">
            <button
              onClick={handleInvite}
              className="flex-1 bg-[#dae3d1] text-[#43573b] py-3 rounded-lg font-semibold hover:bg-[#c9d9ba] transition-colors flex items-center justify-center gap-2"
            >
              <UserAddLine className="w-5 h-5" />
              Invite
            </button>
            <button
              onClick={handleSendMessage}
              className="flex-1 bg-[#43573b] text-white py-3 rounded-lg font-semibold hover:bg-[#35453d] transition-colors flex items-center justify-center gap-2"
            >
              <Message3Line className="w-5 h-5" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopInfluencersPage;
