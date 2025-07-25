"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import ProfileHeader from './ProfileHeader'
import InstagramReelsSection from './InstagramReelsSection'
import YouTubeVideosSection from './YouTubeVideosSection'
import RawJsonSection from './RawJsonSection'
import PageLoader from './PageLoader'

// Custom Image Component using Next.js Image (same as Hero component)
const ProfileImage = ({ src, alt, name, className }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to process image URL through proxy
  const getCorsProxyUrl = (url) => {
    if (!url) return '';
    
    // Google Translate proxy method
    let p = url?.split("/") || [""];
    let t = '';
    for (let i = 0; i < p.length; i++) {
      if (i == 2) {
        t += p[i].replaceAll('-', '--').replaceAll('.', '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
      } else {
        if (i != p.length - 1) {
          t += p[i] + '/';
        } else {
          t += p[i];
        }
      }
    }
    return encodeURI(t);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback to initials if image fails or no src
  if (imageError || !src) {
    return (
      <div className={`${className} bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-200`}>
        {getInitials(name)}
      </div>
    );
  }

  const imageUrl = getCorsProxyUrl(src);

  return (
    <div className="relative">
      <Image
        src={imageUrl}
        alt={alt}
        width={80}
        height={80}
        className={`${className} border-2 border-gray-200 object-cover`}
        onError={handleImageError}
        unoptimized={true} // Required for external images with proxy
        priority={false}
      />
    </div>
  );
};

const page = () => {
  const { userName } = useParams()
  const [creator, setCreator] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('instagram') // Toggle state

  // Fetch influencer data from API
  useEffect(() => {
    const fetchInfluencerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First try to get data from sessionStorage (from Hero page click)
        const sessionData = sessionStorage.getItem('currentInfluencer');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          setCreator(parsedData);
          setIsLoading(false);
          return;
        }

        // If no session data, fetch from API
        const response = await fetch(`https://api.phyo.ai/api/ask/details?userName=${encodeURIComponent(userName)}`);
        if (!response.ok) throw new Error('Failed to fetch influencer data');
        const data = await response.json();
        console.log('API Response:', data);
        if (data.success && data.data) {
          setCreator(data.data);
        } else {
          setError('Influencer not found');
        }
      } catch (err) {
        setError('Failed to fetch influencer data');
        console.error('Error fetching influencer data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfluencerData();
  }, [userName]);

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
      return value.toLocaleString();
    }
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </a>
      );
    }
    return String(value);
  };

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Demographics Component
  const DemographicsSection = ({ data, platform }) => {
    if (!data || (!data.genderDistribution?.length && !data.ageDistribution?.length && !data.audienceByCountry?.length)) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{platform} Demographics</h2>
          <p className="text-gray-600">No demographic data available for {platform}</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{platform} Demographics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gender Distribution */}
          {data.genderDistribution?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Gender Distribution</h3>
              <div className="space-y-3">
                {data.genderDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{item.gender?.toLowerCase()}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${item.gender?.toLowerCase() === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}
                          style={{ width: `${item.distribution}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{item.distribution}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Age Distribution */}
          {data.ageDistribution?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Age Distribution</h3>
              <div className="space-y-3">
                {data.ageDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{item.age}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audience by Country/Location */}
          {data.audienceByCountry?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Locations</h3>
              <div className="space-y-3">
                {data.audienceByCountry.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{item.name || item.category}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${Math.min(item.value * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-red-50 border border-red-200 rounded-xl p-8 text-center'>
            <div className='text-red-600 text-xl font-semibold mb-2'>Error</div>
            <div className='text-red-700'>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center'>
            <div className='text-yellow-600 text-xl font-semibold mb-2'>No Data</div>
            <div className='text-yellow-700'>Creator data is not available</div>
          </div>
        </div>
      </div>
    );
  }

  // Get current platform data
  const currentData = activeTab === 'instagram' ? creator.instagramData : creator.youtubeData;
  const platformName = activeTab === 'instagram' ? 'Instagram' : 'YouTube';

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8'>
      <div className='max-w-6xl mx-auto'>
        <ProfileHeader creator={creator} />
        
        {/* Platform Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setActiveTab('instagram')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'instagram'
                    ? 'bg-white text-pink-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Instagram
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'youtube'
                    ? 'bg-white text-red-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                YouTube
              </button>
            </div>
          </div>
        </div>

        {/* Platform Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Followers */}
          {currentData?.followers > 0 && (
            <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
              <div className={`text-3xl font-bold mb-2 ${activeTab === 'instagram' ? 'text-pink-600' : 'text-red-600'}`}>
                {formatValue(currentData?.followers)}
              </div>
              <div className='text-gray-600 font-medium'>
                {activeTab === 'instagram' ? 'Followers' : 'Subscribers'}
              </div>
            </div>
          )}

          {/* Collaboration Charges - Reel/Video */}
          {currentData?.collaborationCharges?.reel > 0 && (
            <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>
                ₹{formatValue(currentData?.collaborationCharges?.reel)}
              </div>
              <div className='text-gray-600 font-medium'>
                {activeTab === 'instagram' ? 'Reel Rate' : 'Video Rate'}
              </div>
            </div>
          )}

          {/* Post Rate */}
          {currentData?.collaborationCharges?.post > 0 && (
            <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>
                ₹{formatValue(currentData?.collaborationCharges?.post)}
              </div>
              <div className='text-gray-600 font-medium'>Post Rate</div>
            </div>
          )}

          {/* Story Rate */}
          {currentData?.collaborationCharges?.story > 0 && (
            <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>
                ₹{formatValue(currentData?.collaborationCharges?.story)}
              </div>
              <div className='text-gray-600 font-medium'>Story Rate</div>
            </div>
          )}
        </div>

        {/* Demographics Section */}
        <DemographicsSection data={currentData} platform={platformName} />

        {/* BrightData Profile Information */}
        {creator.brightDataProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Analytics</h2>
            
            {/* Key Metrics Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {creator.brightDataProfile.followers > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatValue(creator.brightDataProfile.followers)}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Total Followers</div>
                </div>
              )}
              {creator.brightDataProfile.following > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatValue(creator.brightDataProfile.following)}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Following</div>
                </div>
              )}
              {creator.brightDataProfile.posts_count > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {formatValue(creator.brightDataProfile.posts_count)}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">Total Posts</div>
                </div>
              )}
              {creator.brightDataProfile.avg_engagement && creator.brightDataProfile.avg_engagement > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {(creator.brightDataProfile.avg_engagement * 100).toFixed(2) + '%'}
                  </div>
                  <div className="text-sm text-orange-700 font-medium">Avg Engagement</div>
                </div>
              )}
            </div> */}

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium text-gray-800">@{creator.brightDataProfile.account}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium text-gray-800">{creator.brightDataProfile.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-800">{creator.brightDataProfile.category_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Category:</span>
                    <span className="font-medium text-gray-800">{creator.brightDataProfile.business_category_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified:</span>
                    <span className={`font-medium ${creator.brightDataProfile.is_verified ? 'text-green-600' : 'text-gray-600'}`}>
                      {creator.brightDataProfile.is_verified ? '✓ Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Account:</span>
                    <span className={`font-medium ${creator.brightDataProfile.is_business_account ? 'text-blue-600' : 'text-gray-600'}`}>
                      {creator.brightDataProfile.is_business_account ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Professional Account:</span>
                    <span className={`font-medium ${creator.brightDataProfile.is_professional_account ? 'text-purple-600' : 'text-gray-600'}`}>
                      {creator.brightDataProfile.is_professional_account ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Private Account:</span>
                    <span className={`font-medium ${creator.brightDataProfile.is_private ? 'text-red-600' : 'text-green-600'}`}>
                      {creator.brightDataProfile.is_private ? 'Private' : 'Public'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Biography and External Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Biography & Links</h3>
                
                {creator.brightDataProfile.biography && (
                  <div className="mb-4">
                    <span className="text-gray-600 block mb-2">Bio:</span>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 leading-relaxed">
                      {creator.brightDataProfile.biography}
                    </div>
                  </div>
                )}

                {creator.brightDataProfile.external_url && creator.brightDataProfile.external_url.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-600 block mb-2">External Links:</span>
                    <div className="space-y-2">
                      {creator.brightDataProfile.external_url.map((url, index) => (
                        <a 
                          key={index}
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 underline text-sm break-all bg-blue-50 p-2 rounded"
                        >
                          {url.length > 60 ? `${url.substring(0, 60)}...` : url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {creator.brightDataProfile.business_address && (
                  <div className="mb-4">
                    <span className="text-gray-600 block mb-2">Business Address:</span>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                      {creator.brightDataProfile.business_address}
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highlights:</span>
                    <span className="font-medium text-gray-800">{creator.brightDataProfile.highlights_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Has Channel:</span>
                    <span className="font-medium text-gray-800">{creator.brightDataProfile.has_channel ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recently Joined:</span>
                    <span className="font-medium text-gray-800">{creator.brightDataProfile.is_joined_recently ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Accounts */}
            {/* {creator.brightDataProfile.related_accounts && creator.brightDataProfile.related_accounts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Accounts</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {creator.brightDataProfile.related_accounts.slice(0, 8).map((account, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
                        {account.profile_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="text-sm font-medium text-gray-800 truncate">{account.profile_name}</div>
                      <div className="text-xs text-gray-600 truncate">@{account.user_name}</div>
                      {account.is_verified && <div className="text-xs text-green-600">✓ Verified</div>}
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        )}

        {/* Platform Link */}
        {/* {currentData?.link && currentData.link !== '-' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{platformName} Profile</h2>
            <a 
              href={currentData.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                activeTab === 'instagram' 
                  ? 'bg-pink-500 hover:bg-pink-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Visit {platformName} Profile
            </a>
          </div>
        )} */}

        {/* Conditional Content Based on Platform */}
        {activeTab === 'instagram' && <InstagramReelsSection creator={creator} />}
        {activeTab === 'youtube' && <YouTubeVideosSection creator={creator} />}
        
        {/* <RawJsonSection creator={creator} /> */}
      </div>
    </div>
  )
}

export default page