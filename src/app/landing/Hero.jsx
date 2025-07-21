"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Custom Image Component using Next.js Image
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

  const imageUrl = getCorsProxyUrl(src || "https://instagram.fmad19-2.fna.fbcdn.net/v/t51.2885-19/350624574_796732218766635_3766412963048210668_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_ht=instagram.fmad19-2.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2QFLIS5hs2NQ7ce0bZnzUdc9qfgCXcIVP_k-K1UIW8PFPTXmN6Dn9eX15F0PtHT6vRw&_nc_ohc=7XZ9iUF4f-sQ7kNvwEmlFEC&_nc_gid=LkyQUJkfM5nc2ICE5e4SKQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfTuCn4EvoRgsyZkjFReEyqgSmZHwyCt_Z18aX2SefgeZA&oe=687E3F1B&_nc_sid=8b3546");

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

const Hero = () => {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch('https://api.phyo.ai/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setResults(data.data);
      } else {
        setResults([]);
        setError("No influencers found for your query.");
      }
    } catch (err) {
      setError("Failed to fetch influencers.");
      setResults([]);
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    setPrompt(e.target.value);
    if (e.key === 'Enter') handleSearch();
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count?.toString() || '0';
  };

  const handleCardClick = (influencer) => {
    // Store the influencer data in sessionStorage for the detail page
    sessionStorage.setItem('currentInfluencer', JSON.stringify(influencer));
    router.push(`/details/${encodeURIComponent(influencer.user_name || influencer._id)}`);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center px-6"
      style={{
        backgroundImage: "url('/landing/hero_bg1.jpg')"
      }}
    >
      {/* White fade overlay for entire bottom section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-20"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-[95px] text-center">
        {/* Star rating badge */}
        <div className="inline-flex items-center bg-gray-500 bg-opacity-50 rounded-full px-4 py-2 mb-8">
          <span className="text-yellow-400 px-2 py-1 bg-black rounded-full">★</span>
          <span className="text-white text-sm font-medium ml-2">5 star by</span>
          <div className="flex ml-2 -space-x-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
          World's First AI Powered<br />
          Influencer Search Engine
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Search Influencers in Seconds with Phyo and Reach<br />
          the Right Audience Faster.
        </p>

        {/* Search bar */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
            <input
              type="text"
              placeholder="Describe the influencers you need (e.g. I need influencers in mumbai with 10k to 100k followers in the fashion category, primarily female audience aged 18-35)"
              className="flex-1 px-8 py-2 text-lg text-gray-700 placeholder-gray-400 outline-none"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleInput}
            />
            <button
              className="bg-green-500 hover:bg-green-600 transition-colors duration-200 p-6 m-2 rounded-full"
              onClick={handleSearch}
              disabled={loading}
              aria-label="Search"
            >
              {loading ? (
                <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg 
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && <div className="text-center text-white mb-4 font-medium">Searching for influencers...</div>}
        {error && <div className="text-center text-red-400 mb-4 bg-red-100 rounded-lg px-4 py-2 inline-block">{error}</div>}

        {/* Influencer search results */}
        {results.length > 0 && (
          <div className="max-w-5xl mx-auto mb-10 flex flex-col gap-6">
            <div className="text-white mb-4 font-medium">
              Found {results.length} influencer{results.length > 1 ? 's' : ''}
            </div>
            {results.map((influencer, index) => (
              <div
                key={influencer.user_name || influencer._id || index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:border-green-200 border-2 border-transparent"
                onClick={() => handleCardClick(influencer)}
              >
                <div className="flex items-start gap-6">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <ProfileImage
                      src={influencer.brightDataProfile?.profile_image_link || influencer.image}
                      alt={influencer.name || influencer.user_name}
                      name={influencer.name || influencer.user_name}
                      className="w-20 h-20 rounded-2xl"
                    />
                    {/* Verified Badge */}
                    {influencer.brightDataProfile?.is_verified && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name and Basic Info */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {influencer.brightDataProfile?.full_name || 
                           influencer.name || 
                           influencer.user_name}
                        </h3>
                        <p className="text-sm text-gray-500">@{influencer.user_name}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-xs font-medium text-green-700">Top Pick</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {influencer.brightDataProfile?.biography || 
                       influencer.bio || 
                       `${influencer.name || influencer.user_name} is a content creator specializing in ${influencer.categoryInstagram || 'various topics'}.`}
                    </p>

                    {/* Location and Details */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{influencer.city || 'Location not specified'}</span>
                      </div>
                      {influencer.language && (
                        <>
                          <span>•</span>
                          <span>{influencer.language}</span>
                        </>
                      )}
                      {influencer.gender && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{influencer.gender}</span>
                        </>
                      )}
                    </div>

                    {/* Social Media Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      {/* Instagram */}
                      {(influencer.instagramData?.followers || influencer.brightDataProfile?.followers) && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">
                              {formatFollowers(influencer.brightDataProfile?.followers || influencer.instagramData?.followers)}
                            </div>
                            <div className="text-xs text-gray-500">followers</div>
                          </div>
                        </div>
                      )}

                      {/* Posts Count */}
                      {influencer.brightDataProfile?.posts_count && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">{influencer.brightDataProfile.posts_count}</div>
                            <div className="text-xs text-gray-500">posts</div>
                          </div>
                        </div>
                      )}

                      {/* Engagement Rate */}
                      {influencer.brightDataProfile?.avg_engagement && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">
                              {(influencer.brightDataProfile.avg_engagement * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">engagement</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {influencer.categoryInstagram && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                          #{influencer.categoryInstagram}
                        </span>
                      )}
                      {influencer.brightDataProfile?.category_name && 
                       influencer.brightDataProfile.category_name !== influencer.categoryInstagram && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                          #{influencer.brightDataProfile.category_name}
                        </span>
                      )}
                      {influencer.brightDataProfile?.business_category_name && 
                       influencer.brightDataProfile.business_category_name !== 'None' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                          #{influencer.brightDataProfile.business_category_name}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button 
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(influencer);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Full Profile
                      </button>
                      {(influencer.instagramData?.link || influencer.brightDataProfile?.profile_url) && (
                        <a 
                          href={influencer.instagramData?.link || influencer.brightDataProfile?.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Visit Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature Image */}
        {results.length === 0 && !loading && (
          <div className="max-w-5xl mx-auto">
            <Image
              src="/landing/hero_feature.png"
              alt="Phyo AI Influencer Search Platform Preview"
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg shadow-2xl"
              priority={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;


