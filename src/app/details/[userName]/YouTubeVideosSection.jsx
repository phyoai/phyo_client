import React from 'react';
import ProfileImage from './ProfileImage';

const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toLocaleString();
  }
  return String(value);
};

const YouTubeVideosSection = ({ creator }) => {
  const videos = creator.youtubeData?.videos || [];
  if (!videos.length) return null;
  return (
    <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
          <div className='w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center'>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          Youtube Video
        </h2>
        <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm'>
          View all
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {videos.slice(0, 3).map((video, index) => (
          <div key={index} className='group cursor-pointer'>
            <div className='aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative'>
              {/* Video Thumbnail */}
              {video.thumbnail ? (
                <ProfileImage
                  src={video.thumbnail}
                  alt={video.title || `Video ${index + 1}`}
                  name={video.title || `Video ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              )}
              {/* Play Button */}
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
                <div className='w-16 h-16 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              {/* Video Duration */}
              {video.duration && (
                <div className='absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded'>
                  {video.duration}
                </div>
              )}
              {/* Views */}
              {video.views && (
                <div className='absolute bottom-3 left-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded'>
                  {formatValue(video.views)} views
                </div>
              )}
            </div>
            {/* Video Title */}
            <h3 className='mt-3 font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors'>
              {video.title || `Video ${index + 1}`}
            </h3>
            {/* Video Description */}
            {video.description && (
              <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
                {video.description.length > 100 ? `${video.description.substring(0, 100)}...` : video.description}
              </p>
            )}
            {/* Video Stats */}
            <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
              {video.published_date && (
                <span>{new Date(video.published_date).toLocaleDateString()}</span>
              )}
              {video.likes && (
                <span className='flex items-center gap-1'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {formatValue(video.likes)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeVideosSection; 