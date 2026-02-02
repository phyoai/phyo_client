'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, Mic, MoreVertical, MessageSquare, UserPlus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InfluencerSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const searchInputRef = useRef(null);

  // Start searching animation on mount
  useEffect(() => {
    setTimeout(() => {
      setIsSearching(true);
      // Show results after 2 seconds of "searching"
      setTimeout(() => {
        setShowResults(true);
      }, 2000);
    }, 300);
  }, []);

  // Handle back button
  const handleBackClick = () => {
    setIsSearching(false);
    setShowResults(false);
    setSelectedInfluencer(null);
    setTimeout(() => {
      router.push('/brand/dashboard');
    }, 300);
  };

  // Handle search action
  const handleSearch = () => {
    setShowResults(false);
    setIsSearching(true);
    setSelectedInfluencer(null);
    setTimeout(() => {
      setShowResults(true);
    }, 2000);
  };

  // Handle influencer card click
  const handleInfluencerClick = (influencer) => {
    setSelectedInfluencer(influencer);
  };

  return (
    <>
      {/* Custom CSS for smooth search bar animation */}
      <style jsx global>{`
        @keyframes searchFadeIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .search-fade-in {
          animation: searchFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Top Bar with centered search */}
        <div className="bg-white px-6 py-3 flex items-center gap-4 search-fade-in">
          {/* Back Button - Fixed width */}
          <button 
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Search Bar - Centered, grows to fill space */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[720px]">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Find a lifestyle influencers for my business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-6 pr-12 py-3 bg-[#F0F0F0] rounded-full border-none focus:outline-none text-base text-gray-600"
                autoFocus
              />
              <button 
                onClick={handleSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-[#808080]" />
              </button>
            </div>
          </div>

          {/* Right Actions - Fixed width */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Mic className="h-5 w-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search Results Container or Loading State */}
        {!showResults ? (
          <div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)]">
            <div 
              className={`flex flex-col items-center justify-center transition-all duration-700 ${
                isSearching ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              {/* Mascot Image */}
              <div className="mb-6">
                <img 
                  src="http://localhost:3845/assets/82b9f2b6ee13b45763ef3c3a3ffc5b2b30b247c4.png" 
                  alt="Searching"
                  className="w-[187px] h-[279px] object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback mascot */}
                <div className="w-[187px] h-[279px] hidden items-center justify-center">
                  <Search className="w-24 h-24 text-teal-600 animate-pulse" />
                </div>
              </div>
              
              {/* Finding Results Text */}
              <p className="text-[#808080] text-sm font-medium">
                finding results...
              </p>
            </div>
          </div>
        ) : (
          /* Search Results Container */
          <div className="flex gap-4 px-9 h-[calc(100vh-96px)]">
            {/* Left Column - Results List */}
            <div className="flex flex-col gap-2 overflow-y-auto w-[604px] shrink-0 pr-2">
              {/* Influencer Card 1 */}
              <InfluencerCard 
                name="Campaign Chacha"
                followers="22.4k followers"
                avatarColor="#016fff"
                onClick={() => handleInfluencerClick({
                  id: 1,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                })}
              />
              
              {/* Influencer Card 2 */}
              <InfluencerCard 
                name="Campaign Chacha"
                followers="22.4k followers"
                avatarColor="#016fff"
                onClick={() => handleInfluencerClick({
                  id: 2,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                })}
              />
              
              {/* Influencer Card 3 */}
              <InfluencerCard 
                name="Campaign Chacha"
                followers="22.4k followers"
                avatarColor="#016fff"
                onClick={() => handleInfluencerClick({
                  id: 3,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                })}
              />
              
              {/* Upgrade Banner */}
              <div className="flex items-center bg-[#e7edfb] rounded-xl px-3 py-2 gap-3">
                <Info className="h-6 w-6 text-[#0b4fd9] shrink-0" />
                <div className="flex items-center flex-1 gap-3">
                  <p className="text-sm text-[#242527] flex-1">
                    You have reached your limit. Upgrade plan for more.
                  </p>
                  <button className="bg-[#0b4fd9] text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-[#0a45c2] transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Influencer Profile or Empty State */}
            {selectedInfluencer ? (
              <InfluencerProfile influencer={selectedInfluencer} />
            ) : (
              <div className="flex-1 bg-[#F0F0F0] rounded-lg flex flex-col items-center justify-center p-8">
                <div className="w-[286px] h-[74px] mb-1">
                  <img 
                    src="http://localhost:3845/assets/21f2875f97397a571ea0cdcaa97c825cf38c072a.svg"
                    alt="Phyo Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[#808080] text-lg font-semibold">
                  A PyroMedia Product
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Influencer Card Component
function InfluencerCard({ name, followers, avatarColor, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#F0F0F0] border-2 border-white rounded-xl py-4 flex flex-col gap-2 max-w-[500px] cursor-pointer hover:border-[#43573b] transition-colors"
    >
      {/* Profile Section */}
      <div className="flex items-start px-4 gap-4">
        {/* Avatar */}
        <div 
          className="w-16 h-16 rounded-full shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {/* Avatar placeholder - you can add actual avatar images here */}
        </div>
        
        {/* Name and Followers */}
        <div className="flex-1 flex flex-col gap-2 pb-2">
          <h3 className="text-xl font-semibold text-[#242527] leading-7">
            {name}
          </h3>
          <p className="text-base text-[#333]">
            {followers}
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 px-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle send message
          }}
          className="flex items-center gap-1 px-4 py-2 border border-[#43573b] rounded-full text-[#43573b] text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          send message
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle invite
          }}
          className="flex items-center gap-1 px-4 py-2 border border-[#43573b] rounded-full text-[#43573b] text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          invite
        </button>
      </div>
    </div>
  );
}

// Influencer Profile Component (Right Side Panel)
function InfluencerProfile({ influencer }) {
  return (
    <div className="flex-1 relative rounded-lg overflow-y-auto">
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
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md">
              <Search className="h-5 w-5" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content - White card that scrolls over yellow background */}
      <div className="relative bg-white rounded-t-3xl -mt-8 z-10 shadow-lg">
        <div className="px-4 py-6 pb-28">
        {/* Username and Name */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">{influencer.username}</p>
          <h2 className="text-3xl font-bold text-[#242527]">{influencer.name}</h2>
        </div>

          {/* Stats Badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded">
              {influencer.followers}
            </span>
            <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded">
              {influencer.following}
            </span>
            <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded">
              {influencer.posts}
            </span>
          </div>

          {/* Location and Age */}
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Location</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span className="text-red-500">📍</span> {influencer.location}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Age</p>
              <p className="text-sm text-gray-600">{influencer.age}</p>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {influencer.about}
            </p>
          </div>

          {/* Interactions Section */}
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Interactions</h3>
            
            {/* Likes and Views */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-lg font-bold text-gray-800">{influencer.likes} Likes</p>
                <p className="text-xs text-green-600">↑ 9.5% vs last month</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{influencer.views} views</p>
                <p className="text-xs text-green-600">↑ 9.5% vs last month</p>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">ER</span>
                <span className="font-semibold">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RK</span>
                <span className="font-semibold">86</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UK</span>
                <span className="font-semibold">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">dK</span>
                <span className="font-semibold">4K</span>
              </div>
            </div>

            {/* Chart Placeholders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-around p-2">
                {/* Simple bar chart placeholder */}
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '80%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '50%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '90%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '70%' }}></div>
              </div>
              <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-around p-2">
                {/* Simple line chart placeholder */}
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '70%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '50%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '85%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-6 bg-gray-400 rounded-t" style={{ height: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Audience insights</h3>
            
            {/* Age Group */}
            <div className="mb-6">
              <p className="text-xs text-gray-600 mb-2">Age Group</p>
              <div className="flex items-end gap-1 h-32">
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="w-full bg-[#43573b] rounded-t" style={{ height: '80%' }}></div>
                  <p className="text-xs text-center mt-1">12-18</p>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="w-full bg-[#43573b] rounded-t" style={{ height: '60%' }}></div>
                  <p className="text-xs text-center mt-1">18-24</p>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="w-full bg-[#43573b] rounded-t" style={{ height: '70%' }}></div>
                  <p className="text-xs text-center mt-1">24-34</p>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="w-full bg-[#43573b] rounded-t" style={{ height: '30%' }}></div>
                  <p className="text-xs text-center mt-1">35-50</p>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="w-full bg-[#43573b] rounded-t" style={{ height: '65%' }}></div>
                  <p className="text-xs text-center mt-1">50-65</p>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="w-full bg-[#43573b] rounded-t" style={{ height: '55%' }}></div>
                  <p className="text-xs text-center mt-1">65+</p>
                </div>
              </div>
            </div>

            {/* Gender Chart */}
            <div className="mb-6">
              <p className="text-xs text-gray-600 mb-3">Gender</p>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#43573b" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#d1d5db" strokeWidth="12" 
                      strokeDasharray="125 251" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#43573b]"></div>
                    <span className="text-sm">Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm">Female</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Top Locations</p>
              <div className="flex items-end gap-1 h-28">
                {['IN', 'PK', 'USA', 'NY', 'UK', 'Iran', 'UAE', 'DXB'].map((location, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end items-center">
                    <div 
                      className={`w-full ${idx % 2 === 0 ? 'bg-[#43573b]' : 'bg-gray-400'} rounded-t`}
                      style={{ height: `${Math.random() * 50 + 30}%` }}
                    ></div>
                    <p className="text-[10px] text-center mt-1 truncate w-full">{location}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#43573b]"></div>
                  <span>Top Countries</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-400"></div>
                  <span>Top Cities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Influencers */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Similar Influencers</h3>
            <p className="text-xs text-gray-500 mb-3">Health & Lifestyle</p>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* Similar Influencer Card 1 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden min-w-[170px]">
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-pink-200"></div>
                <div className="p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Emily Johnson</p>
                    <p className="text-xs text-gray-500">22.4k followers</p>
                  </div>
                </div>
              </div>
              
              {/* Similar Influencer Card 2 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden min-w-[170px]">
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200"></div>
                <div className="p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Emily Johnson</p>
                    <p className="text-xs text-gray-500">22.4k followers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#43573b] bg-[#e8ede5] rounded-full text-[#43573b] font-semibold hover:bg-[#43573b] hover:text-white transition-colors">
            <UserPlus className="h-5 w-5" />
            Invite
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#43573b] rounded-full text-white font-semibold hover:bg-[#374829] transition-colors">
            <MessageSquare className="h-5 w-5" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
