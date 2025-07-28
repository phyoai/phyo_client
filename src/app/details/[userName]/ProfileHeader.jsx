import React from 'react';
import ProfileImage from './ProfileImage';

const ProfileHeader = ({ creator }) => {
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

  return (
    <div className='bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 border border-green-200'>
      {/* Main Profile Section */}
      <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6'>
        {/* Profile Image */}
        <div className='flex-shrink-0 self-center sm:self-start'>
          <ProfileImage
            src={creator.brightDataProfile?.profile_image_link}
            alt={creator.brightDataProfile?.full_name || creator.name || creator.user_name || 'Profile'}
            name={creator.brightDataProfile?.full_name || creator.name || creator.user_name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl"
          />
        </div>
        
        <div className='flex-1 min-w-0 w-full'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
            {/* Name and Category */}
            <div className='text-center sm:text-left'>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-1'>
                {creator.brightDataProfile?.full_name || creator.name || creator.user_name || 'Unknown'}
              </h1>
              <p className='text-gray-600 text-sm mb-4'>
                {creator.brightDataProfile?.category_name || creator.categoryInstagram || 'Content Creator'}
                {creator.brightDataProfile?.business_category_name && creator.brightDataProfile.business_category_name !== 'None' &&
                  ` | ${creator.brightDataProfile.business_category_name}`
                }
              </p>
            </div>
            
            {/* Stats - Responsive Grid */}
            <div className='grid grid-cols-2 sm:flex sm:gap-4 lg:gap-8 gap-4 text-center'>
              {creator.brightDataProfile?.followers > 0 && (
                <div>
                  <div className='text-lg sm:text-xl font-bold text-gray-900'>
                    {formatValue(creator.brightDataProfile.followers)}
                  </div>
                  <div className='text-xs text-gray-600'>Followers</div>
                </div>
              )}
              {creator.brightDataProfile?.following > 0 && (
                <div>
                  <div className='text-lg sm:text-xl font-bold text-gray-900'>
                    {formatValue(creator.brightDataProfile.following)}
                  </div>
                  <div className='text-xs text-gray-600'>Following</div>
                </div>
              )}
              {creator.brightDataProfile?.posts_count > 0 && (
                <div>
                  <div className='text-lg sm:text-xl font-bold text-gray-900'>
                    {formatValue(creator.brightDataProfile.posts_count)}
                  </div>
                  <div className='text-xs text-gray-600'>Total Posts</div>
                </div>
              )}
              {creator.brightDataProfile?.avg_engagement && creator.brightDataProfile.avg_engagement > 0 && (
                <div>
                  <div className='text-lg sm:text-xl font-bold text-gray-900'>
                    {(creator.brightDataProfile.avg_engagement * 100).toFixed(2)}%
                  </div>
                  <div className='text-xs text-gray-600'>Avg Engagement</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-3'>About</h2>
        <p className='text-gray-700 leading-relaxed mb-6 text-sm sm:text-base'>
          {creator.brightDataProfile?.biography || creator.bio ||
            `${creator.brightDataProfile?.full_name || creator.name || creator.user_name} is a content creator specializing in ${creator.categoryInstagram || 'various topics'}.`}
        </p>
        
        {/* Location and Social Media - Responsive Layout */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6'>
          {/* Location */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-gray-900'>Location</h3>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className='text-sm sm:text-base'>{creator.city || 'Location not specified'}</span>
            </div>
          </div>
          
          {/* Social Media and Message Button */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-gray-900'>Social Media</h3>
              </div>
              <div className='flex gap-2 flex-wrap'>
                {/* Instagram */}
                {(creator.brightDataProfile?.profile_url || creator.instagramData?.link) && (
                  <a
                    href={creator.brightDataProfile?.profile_url || creator.instagramData?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow'
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {/* LinkedIn */}
                {creator.brightDataProfile?.linkedin_url && (
                  <a
                    href={creator.brightDataProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow'
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {/* YouTube */}
                {creator.brightDataProfile?.youtube_url && (
                  <a
                    href={creator.brightDataProfile.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow'
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {/* Twitter */}
                {creator.brightDataProfile?.twitter_url && (
                  <a
                    href={creator.brightDataProfile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow'
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {/* Website */}
                {(Array.isArray(creator.brightDataProfile?.external_url) && creator.brightDataProfile.external_url[0]) && (
                  <a
                    href={creator.brightDataProfile.external_url[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow'
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            {/* Send Message Button */}
            <button className='bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto'>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className='text-sm sm:text-base'>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;