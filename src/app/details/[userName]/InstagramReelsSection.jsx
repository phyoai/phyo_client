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

const InstagramReelsSection = ({ creator }) => {
  const posts = creator.brightDataProfile?.recent_posts || creator.instagramData?.posts || [];
  if (!posts.length) return null;
  return (
    <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center'>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          Instagram Reel
        </h2>
        <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm'>
          View all
        </button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {posts.slice(0, 4).map((post, index) => (
          <div key={index} className='relative group cursor-pointer'>
            <div className='aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative'>
              {/* Post Image/Thumbnail */}
              {post.display_url || post.thumbnail || post.image ? (
                <ProfileImage
                  src={post.display_url || post.thumbnail || post.image}
                  alt={`Post ${index + 1}`}
                  name={`Post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Play Button Overlay for Videos */}
              {(post.is_video || post.type === 'video') && (
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
                  <div className='w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center'>
                    <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              )}
              {/* Engagement Stats */}
              <div className='absolute bottom-3 left-3 right-3'>
                <div className='flex items-center justify-between text-white text-sm'>
                  {post.like_count && (
                    <div className='flex items-center gap-1 bg-black bg-opacity-50 rounded-full px-2 py-1'>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{formatValue(post.like_count)}</span>
                    </div>
                  )}
                  {post.comment_count && (
                    <div className='flex items-center gap-1 bg-black bg-opacity-50 rounded-full px-2 py-1'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{formatValue(post.comment_count)}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Hover Overlay */}
              <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300'></div>
            </div>
            {/* Post Caption/Title */}
            {post.caption && (
              <p className='mt-2 text-sm text-gray-600 line-clamp-2'>
                {post.caption.length > 50 ? `${post.caption.substring(0, 50)}...` : post.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramReelsSection; 