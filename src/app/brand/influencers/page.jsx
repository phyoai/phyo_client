'use client'
import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, MessageSquare, UserPlus, Bookmark, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    setSelectedInfluencer(influencer);
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
        <div className={`flex flex-col ${selectedInfluencer ? 'w-[450px]' : 'flex-1'} overflow-y-auto border-r border-gray-200 transition-all duration-300`}>
          {/* Categories */}
          <div className="px-6 py-4 border-b border-gray-100">
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

        {/* Profile Panel */}
        <div className="flex-1 overflow-y-auto bg-white">
          {selectedInfluencer ? (
            <div className="flex flex-col h-full">
              {/* Profile Header with Cover */}
              <div className="relative">
                {/* Back Button, Bookmark, More Options */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <button
                    onClick={handleCloseProfile}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Cover Image */}
                <div className={`relative h-[400px] w-full overflow-hidden bg-gradient-to-br ${selectedInfluencer.coverColor}`}>
                  <Image
                    src={selectedInfluencer.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover opacity-30"
                  />
                  {/* Large Avatar */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-[280px] h-[280px] rounded-full overflow-hidden border-8 border-white bg-white shadow-xl">
                      <Image
                        src={selectedInfluencer.avatar}
                        alt={selectedInfluencer.name}
                        width={280}
                        height={280}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="mt-36 px-8 pb-8">
                <div className="text-center mb-6">
                  <p className="text-base text-[#808080] mb-1">{selectedInfluencer.username}</p>
                  <h2 className="text-4xl font-bold text-[#242527] mb-4">
                    {selectedInfluencer.name}
                  </h2>

                  {/* Platform Stats */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="px-4 py-2 bg-blue-100 rounded-full flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" rx="4" fill="#1877F2"/>
                        <path d="M10 5C7.23858 5 5 7.23858 5 10C5 12.4193 6.73193 14.4444 9.03125 14.8906V11.7969H7.85938V10H9.03125V8.75C9.03125 7.59375 9.84375 6.875 10.9062 6.875C11.4062 6.875 11.9531 6.96875 11.9531 6.96875V8.125H11.3594C10.7656 8.125 10.5781 8.5 10.5781 8.875V10H11.9062L11.6719 11.7969H10.5781V14.8906C12.8768 14.4444 14.6094 12.4193 14.6094 10C14.6094 7.23858 12.7614 5 10 5Z" fill="white"/>
                      </svg>
                      <span className="text-sm font-semibold text-blue-700">{selectedInfluencer.platforms.instagram}</span>
                    </div>
                    <div className="px-4 py-2 bg-red-100 rounded-full flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" rx="4" fill="#FF0000"/>
                        <path d="M16 7.5C16 7.5 15.85 6.5 15.45 6.1C14.95 5.55 14.4 5.55 14.15 5.52C12.25 5.38 10 5.38 10 5.38C10 5.38 7.75 5.38 5.85 5.52C5.6 5.55 5.05 5.55 4.55 6.1C4.15 6.5 4 7.5 4 7.5C4 7.5 3.88 8.65 3.88 9.8V10.95C3.88 12.1 4 13.25 4 13.25C4 13.25 4.15 14.25 4.55 14.65C5.05 15.2 5.7 15.18 6 15.25C7.15 15.35 10 15.38 10 15.38C10 15.38 12.25 15.38 14.15 15.23C14.4 15.2 14.95 15.2 15.45 14.65C15.85 14.25 16 13.25 16 13.25C16 13.25 16.12 12.1 16.12 10.95V9.8C16.12 8.65 16 7.5 16 7.5ZM8.5 11.88V8.38L12 10.13L8.5 11.88Z" fill="white"/>
                      </svg>
                      <span className="text-sm font-semibold text-red-700">{selectedInfluencer.platforms.youtube}</span>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 rounded-full flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" rx="4" fill="#1DA1F2"/>
                        <path d="M15.5 7.2C15 7.4 14.5 7.5 14 7.6C14.5 7.3 14.9 6.8 15.1 6.2C14.6 6.5 14 6.7 13.4 6.8C12.9 6.3 12.2 6 11.5 6C10.1 6 9 7.1 9 8.5C9 8.7 9 8.9 9.1 9.1C7.1 9 5.4 8 4.2 6.5C4 6.9 3.9 7.3 3.9 7.8C3.9 8.6 4.3 9.3 4.9 9.7C4.5 9.7 4.1 9.6 3.8 9.4V9.5C3.8 10.7 4.7 11.7 5.8 11.9C5.6 12 5.4 12 5.1 12C5 12 4.8 12 4.7 12C5 12.9 5.9 13.6 7 13.6C6.1 14.3 5 14.7 3.8 14.7H3.3C4.4 15.4 5.7 15.8 7.1 15.8C11.5 15.8 13.9 12.1 13.9 8.9V8.6C14.4 8.3 14.9 7.8 15.5 7.2Z" fill="white"/>
                      </svg>
                      <span className="text-sm font-semibold text-blue-600">{selectedInfluencer.platforms.twitter}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleInvite}
                    className="flex-1 px-6 py-3 bg-[#f0f0f0] text-[#242527] rounded-full font-semibold hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Invite
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 px-6 py-3 bg-[#43573b] text-white rounded-full font-semibold hover:bg-[#3a4a32] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Send Message
                  </button>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <p className="text-base text-[#6b7280] leading-relaxed text-center">
                    {selectedInfluencer.bio}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {selectedInfluencer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl">
                    <p className="text-2xl font-bold text-[#242527] mb-1">{selectedInfluencer.stats.followers}</p>
                    <p className="text-sm text-[#6b7280]">Followers</p>
                  </div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl">
                    <p className="text-2xl font-bold text-[#242527] mb-1">{selectedInfluencer.stats.following}</p>
                    <p className="text-sm text-[#6b7280]">Following</p>
                  </div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl">
                    <p className="text-2xl font-bold text-[#242527] mb-1">{selectedInfluencer.stats.posts}</p>
                    <p className="text-sm text-[#6b7280]">Posts</p>
                  </div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl">
                    <p className="text-2xl font-bold text-[#242527] mb-1">{selectedInfluencer.stats.engagement}</p>
                    <p className="text-sm text-[#6b7280]">Engagement</p>
                  </div>
                </div>
              </div>
            </div>
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

export default TopInfluencersPage;
