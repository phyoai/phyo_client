'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, MessageSquare, UserPlus, Bookmark, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookmarkLine } from '@phyoofficial/phyo-icon-library';

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

const categories = ['All', 'Fitness', 'Comedy', 'Lifestyle', 'Infra', 'Real Estate', 'Travel', 'L'];

const TopInfluencersPage = () => {
  const router = useRouter();
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleBack = () => {
    router.push('/brand/dashboard');
  };

  const handleInfluencerClick = (influencer) => {
    // Transform the data to match the profile component's expected format
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
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-[#43573b] text-white'
                      : 'bg-[#f0f0f0] text-[#242527] hover:bg-[#e0e0e0]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Upgrade Banner */}
            <div className="mx-6 mt-4 mb-4 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V8M8 8V14M8 8H14M8 8H2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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
            {influencersData.map((influencer) => (
              <div
                key={influencer.id}
                onClick={() => handleInfluencerClick(influencer)}
                className={`bg-[#f5f5f5] rounded-xl p-4 cursor-pointer hover:bg-[#e8e8e8] transition-colors ${
                  selectedInfluencer?.id === influencer.id ? 'ring-2 ring-[#43573b]' : ''
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
                      {influencer.followers}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage();
                    }}
                    className="flex-1 px-4 py-2 border border-[#43573b] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    send message
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvite();
                    }}
                    className="flex-1 px-4 py-2 border border-[#43573b] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
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

// Influencer Profile Component (Right Side Panel)
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
    <div className="w-full h-full relative rounded-lg overflow-y-auto">
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

      {/* Profile Content - White card that scrolls over yellow background */}
      <div className="relative bg-white rounded-t-3xl -mt-8 z-10 shadow-lg">
        <div className="px-4 py-6 pb-28">
          {/* Username and Name */}
          <div className="mb-6">
            <p className="text-[#808080] text-base font-semibold leading-6 tracking-[0.24px] mb-1">{influencer.username}</p>
            <h2 className="text-[#242527] text-4xl font-bold leading-[48px] tracking-[-0.32px]">{influencer.name}</h2>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2 mb-6">
            <div className="bg-[#0b4fd9] border border-[#0a48c5] px-1.5 py-1 rounded flex items-center gap-1">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M10 2.5C10 2.5 3.75 5 3.75 10V15C3.75 15.663 4.01339 16.2989 4.48223 16.7678C4.95107 17.2366 5.58696 17.5 6.25 17.5H10M10 2.5V17.5M10 2.5C10 2.5 16.25 5 16.25 10V15C16.25 15.663 15.9866 16.2989 15.5178 16.7678C15.0489 17.2366 14.413 17.5 13.75 17.5H10M10 17.5V2.5" stroke="#b3c8f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#b3c8f3] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.followers}</span>
            </div>
            <div className="bg-[#0b4fd9] border border-[#0a48c5] px-1.5 py-1 rounded flex items-center gap-1">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10ZM10 10C7.5 10 5 11.25 5 13.75V15H15V13.75C15 11.25 12.5 10 10 10Z" stroke="#b3c8f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#b3c8f3] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.following}</span>
            </div>
            <div className="bg-[#0b4fd9] border border-[#0a48c5] px-1.5 py-1 rounded flex items-center gap-1">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <rect x="3.75" y="5" width="12.5" height="10" rx="1" stroke="#b3c8f3" strokeWidth="1.5"/>
                <path d="M3.75 8.75H16.25" stroke="#b3c8f3" strokeWidth="1.5"/>
              </svg>
              <span className="text-[#b3c8f3] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.posts}</span>
            </div>
          </div>

          {/* Location and Age */}
          <div className="flex gap-5 mb-6">
            <div className="flex-1">
              <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">Location</p>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8.66667C8.73638 8.66667 9.33333 8.06971 9.33333 7.33333C9.33333 6.59695 8.73638 6 8 6C7.26362 6 6.66667 6.59695 6.66667 7.33333C6.66667 8.06971 7.26362 8.66667 8 8.66667Z" fill="#ff4f4f"/>
                  <path d="M8 1.33333C6.23189 1.33333 4.66667 2.89856 4.66667 4.66667C4.66667 7.33333 8 12 8 12C8 12 11.3333 7.33333 11.3333 4.66667C11.3333 2.89856 9.76811 1.33333 8 1.33333Z" stroke="#ff4f4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[#808080] text-base leading-6">{influencer.location}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">Age</p>
              <span className="text-[#808080] text-base leading-6">{influencer.age}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">About</h3>
            <p className="text-[#808080] text-base leading-6 text-justify">
              {influencer.about}
            </p>
          </div>

          {/* Interactions Section */}
          <div className="mb-6">
            <h3 className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] mb-3">Interactions</h3>
            
            {/* Likes and Views Graphs */}
            <div className="flex gap-3 overflow-x-auto mb-6">
              {/* Likes Graph */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 min-w-[380px] flex-shrink-0">
                <div className="mb-2">
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.likes} Likes</p>
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11 8L8 5L5 8" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 11L8 8L5 11" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                      <path d="M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955" stroke="#43573b" strokeWidth="2" fill="none"/>
                      <path d="M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955V217H0V126.089Z" fill="#43573b" fillOpacity="0.2"/>
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
                      <path d="M11 8L8 5L5 8" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 11L8 8L5 11" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                      <path d="M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8" stroke="#43573b" strokeWidth="2" fill="none"/>
                      <path d="M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8V217H0V134Z" fill="#43573b" fillOpacity="0.2"/>
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
          <div className="mb-6">
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
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#9ba194" strokeWidth="20"/>
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#43573b" strokeWidth="20" 
                    strokeDasharray="245 408" strokeDashoffset="0" transform="rotate(-90 75 75)"/>
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
