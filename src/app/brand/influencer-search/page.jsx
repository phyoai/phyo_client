'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, Mic, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function InfluencerSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [influencers, setInfluencers] = useState([]);
  const [loadingInfluencers, setLoadingInfluencers] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('followers');
  const [sortOrder, setSortOrder] = useState('desc');
  const [invitedInfluencers, setInvitedInfluencers] = useState(new Set());
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);

  // Platform filters
  const [platforms, setPlatforms] = useState({
    instagram: true,
    tiktok: false,
    youtube: false,
    twitter: false,
    facebook: false
  });

  // Filter states
  const [filters, setFilters] = useState({
    minFollowers: 0,
    maxFollowers: 10000000,
    minEngagement: 0,
    maxEngagement: 100,
    location: '',
    gender: '',
    language: '',
    creatorType: '',
    pricePerCreator: 10000000000
  });

  // Voice modal states
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Format follower count
  const formatFollowers = (followers) => {
    if (typeof followers === 'string') return followers;
    if (!followers) return '0';
    const num = parseInt(followers);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Get auth token from multiple possible locations
  const getAuthToken = () => {
    // Try multiple storage locations
    let token = localStorage.getItem('authToken');
    if (token) return token;

    token = localStorage.getItem('access_token');
    if (token) return token;

    token = localStorage.getItem('token');
    if (token) return token;

    // Try sessionStorage as backup
    token = sessionStorage.getItem('authToken');
    if (token) return token;

    token = sessionStorage.getItem('access_token');
    if (token) return token;

    return null;
  };

  // Fetch influencers using backend scraper (BrightScraper + RapidAPI)
  const fetchInfluencers = async (page = 1, searchTerm = searchQuery) => {
    setLoadingInfluencers(true);
    setError(null);
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('Please login to use this feature');
      }

      let endpoint = '';
      let payload = {};
      let method = 'GET';

      // If searching with natural language query
      if (searchTerm && searchTerm.trim()) {
        endpoint = `${API_BASE_URL}/ask`;
        payload = {
          prompt: searchTerm
        };
        method = 'POST';
      } else {
        // Search by criteria (filters)
        endpoint = `${API_BASE_URL}/scraper/search?`;
        const params = new URLSearchParams();

        params.append('platform', Object.keys(platforms).find(p => platforms[p]) || 'instagram');
        if (filters.location) params.append('location', filters.location);
        if (filters.language) params.append('language', filters.language);
        if (filters.creatorType) params.append('creatorType', filters.creatorType);
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        params.append('page', page);
        params.append('limit', 20);

        endpoint += params.toString();
      }

      console.log('Fetching from:', endpoint);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        ...(method === 'POST' && { body: JSON.stringify(payload) })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`API error: HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        const errorMsg = data.message || 'Failed to fetch influencers';
        const hint = data.hint ? ` - ${data.hint}` : '';
        throw new Error(errorMsg + hint);
      }

      // Handle response format
      let influencerList = [];

      if (searchTerm && searchTerm.trim()) {
        // Natural language search (/ask endpoint) or filter-based search
        // The /ask endpoint returns: { success: true, data: {...}, filters_extracted: {...}, total_results: 0 }
        // The search endpoint returns: { success: true, data: { results: [...] }, ... }

        if (data.data?.results && Array.isArray(data.data.results)) {
          influencerList = data.data.results;
        } else if (data.data?.data && Array.isArray(data.data.data)) {
          influencerList = data.data.data;
        } else if (Array.isArray(data.data)) {
          influencerList = data.data;
        } else if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
          // Single influencer object
          influencerList = [data.data].filter(item => item && item.username);
        }
      } else {
        // Search results
        influencerList = data.data?.results || data.results || [];
      }

      // Filter out undefined/null items
      influencerList = (influencerList || []).filter(item => item && item.username);

      console.log('Processed influencers:', influencerList);

      setInfluencers(influencerList);
      setTotalResults(influencerList.length);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      setError(error.message || 'Failed to fetch influencers. Make sure BrightScraper service is running.');
      setInfluencers([]);
      setTotalResults(0);
    } finally {
      setLoadingInfluencers(false);
    }
  };

  // Handle search action
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowResults(false);
      return;
    }

    setShowResults(false);
    setIsSearching(true);
    setError(null);

    // Show loader for minimum 1000ms
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fetchInfluencers(1, searchQuery);

    setShowResults(true);
    setIsSearching(false);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const fullText = finalTranscript + interimTranscript;
          setVoiceText(fullText);
          finalTranscriptRef.current = fullText;

          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          silenceTimerRef.current = setTimeout(() => {
            if (finalTranscriptRef.current.trim()) {
              recognitionInstance.stop();
            }
          }, 2000);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);

          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }

          const textToFill = finalTranscriptRef.current.trim();
          if (textToFill) {
            setSearchQuery(textToFill);
            setShowVoiceModal(false);
            setVoiceText('');
            finalTranscriptRef.current = '';

            setTimeout(() => {
              setSearchQuery(textToFill);
              handleSearch();
            }, 300);
          }
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  // Handle voice search
  const handleVoiceSearch = () => {
    setShowVoiceModal(true);
    setVoiceText('');
    finalTranscriptRef.current = '';

    if (recognition) {
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      setTimeout(() => {
        const textToFill = finalTranscriptRef.current.trim() || voiceText.trim();
        if (textToFill) {
          setSearchQuery(textToFill);
          setShowVoiceModal(false);
          setVoiceText('');
          finalTranscriptRef.current = '';

          setTimeout(() => {
            handleSearch();
          }, 300);
        }
      }, 200);
    } else {
      setVoiceText('');
      finalTranscriptRef.current = '';
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Close voice modal
  const closeVoiceModal = () => {
    if (recognition && isListening) {
      recognition.stop();
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setShowVoiceModal(false);
    setIsListening(false);
    setVoiceText('');
    finalTranscriptRef.current = '';
  };

  const handleBackClick = () => {
    router.push('/brand/dashboard');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPlatforms({
      instagram: true,
      tiktok: false,
      youtube: false,
      twitter: false,
      facebook: false
    });
    setFilters({
      minFollowers: 0,
      maxFollowers: 10000000,
      minEngagement: 0,
      maxEngagement: 100,
      location: '',
      gender: '',
      language: '',
      creatorType: '',
      pricePerCreator: 10000000000
    });
    setSortBy('followers');
    setSortOrder('desc');
    setShowResults(false);
    setInfluencers([]);
  };

  const handleInviteInfluencer = (influencerId) => {
    setInvitedInfluencers(new Set([...invitedInfluencers, influencerId]));
  };

  return (
    <>
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

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .search-fade-in {
          animation: searchFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        *::-webkit-scrollbar {
          display: none;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          margin: 2px;
        }

        .badge-black {
          background: #1a1a1a;
          color: white;
        }

        .badge-blue {
          background: #e3f2fd;
          color: #1565c0;
        }

        .spinner {
          border: 3px solid #f3f4f6;
          border-top: 3px solid #43573b;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .fade-in {
          animation: searchFadeIn 0.4s ease-in-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Bar - Always Visible */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center gap-4 search-fade-in">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <div className="flex-1 flex justify-center gap-2">
              <div className="relative w-full max-w-[600px]">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search influencers by name, username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-6 pr-12 py-3 bg-gray-100 rounded-full border-2 border-gray-200 focus:border-[#43573b] focus:outline-none text-sm text-gray-700 transition-colors"
                  autoFocus
                  disabled={isSearching}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={handleVoiceSearch}
                disabled={isSearching}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <Mic className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Voice Search Modal */}
        {showVoiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={closeVoiceModal}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-[500px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold text-[#242527] mb-8">Speak</h2>

              <div className="flex justify-center mb-8">
                <button
                  onClick={toggleListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? 'bg-[#43573b] animate-pulse shadow-lg'
                      : 'bg-[#43573b] hover:bg-[#374829] shadow-lg'
                  }`}
                >
                  <Mic className="h-8 w-8 text-white" />
                </button>
              </div>

              <p className="text-base text-[#333] text-center min-h-[60px]">
                {voiceText || (isListening ? 'Listening...' : '')}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isSearching ? (
          // Loading State - Show After Search Clicked
          <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="flex flex-col items-center gap-6">
              <div className="spinner"></div>
              <p className="text-gray-600 font-medium">Finding results...</p>
            </div>
          </div>
        ) : !showResults ? (
          // Initial State - Before Search
          <div className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="text-center">
              <div className="mb-6">
                <img
                  src="/assets/searching_look.svg"
                  alt="Search Influencers"
                  className="w-[200px] h-[280px] mx-auto object-contain opacity-75"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Find Your Perfect Influencers</h2>
              <p className="text-gray-600 max-w-md">Search and discover influencers that match your campaign requirements</p>
            </div>
          </div>
        ) : (
          // Results State
          <div className="p-6">
            {/* Filter and Sort Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 fade-in">
              {/* Platform Filters */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      const newPlatforms = { ...platforms };
                      Object.keys(newPlatforms).forEach(p => newPlatforms[p] = false);
                      newPlatforms[platform] = !platforms[platform];
                      setPlatforms(newPlatforms);
                      fetchInfluencers(1, searchQuery);
                    }}
                    disabled={loadingInfluencers}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-50 ${
                      platforms[platform]
                        ? 'bg-[#43573b] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <select
                  value={filters.location}
                  onChange={(e) => {
                    setFilters({...filters, location: e.target.value});
                    fetchInfluencers(1, searchQuery);
                  }}
                  disabled={loadingInfluencers}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#43573b] disabled:opacity-50"
                >
                  <option value="">Select Country</option>
                  <option value="india">India</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="canada">Canada</option>
                  <option value="australia">Australia</option>
                </select>

                <select
                  value={filters.language}
                  onChange={(e) => {
                    setFilters({...filters, language: e.target.value});
                    fetchInfluencers(1, searchQuery);
                  }}
                  disabled={loadingInfluencers}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#43573b] disabled:opacity-50"
                >
                  <option value="">Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>

                <select
                  value={filters.creatorType}
                  onChange={(e) => {
                    setFilters({...filters, creatorType: e.target.value});
                    fetchInfluencers(1, searchQuery);
                  }}
                  disabled={loadingInfluencers}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#43573b] disabled:opacity-50"
                >
                  <option value="">Creator Type</option>
                  <option value="mega">Mega (1M+)</option>
                  <option value="macro">Macro (100K-1M)</option>
                  <option value="micro">Micro (10K-100K)</option>
                  <option value="nano">Nano (1K-10K)</option>
                </select>

                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      fetchInfluencers(1, searchQuery);
                    }}
                    disabled={loadingInfluencers}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#43573b] disabled:opacity-50"
                  >
                    <option value="followers">Followers</option>
                    <option value="engagement_rate">Engagement</option>
                    <option value="avg_views">Views</option>
                  </select>

                  <button
                    onClick={() => {
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                      fetchInfluencers(1, searchQuery);
                    }}
                    disabled={loadingInfluencers}
                    className="p-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {sortOrder === 'desc' ? (
                      <ChevronDown className="h-5 w-5 text-gray-700" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearFilters}
                  disabled={loadingInfluencers}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Clear All
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 fade-in">
                <p className="text-red-700 text-sm font-medium mb-2">Error: {error}</p>
                {error.includes('token') && (
                  <details className="text-xs text-red-600 mt-2">
                    <summary className="cursor-pointer font-medium">Help: How to fix authentication</summary>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Make sure you're logged in to the application</li>
                      <li>Try refreshing the page (Ctrl+R or Cmd+R)</li>
                      <li>Clear browser cache and login again</li>
                      <li>Check browser console for more details</li>
                      <li>Contact support if issue persists</li>
                    </ul>
                  </details>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-right mb-4">
              <p className="text-sm font-medium text-gray-600">
                {loadingInfluencers ? 'Loading...' : `${totalResults} results`}
              </p>
            </div>

            {/* Results Table */}
            {loadingInfluencers ? (
              <div className="flex items-center justify-center h-48">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-lg">Failed to load influencers. Please try again.</p>
                <button
                  onClick={() => fetchInfluencers(1, searchQuery)}
                  className="mt-4 px-6 py-2 bg-[#43573b] text-white rounded-lg hover:bg-[#374829] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : influencers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-lg">No influencers found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Country</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Followers</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Views/Vid</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Engagement</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Creator Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {influencers.map((influencer, index) => {
                        // Handle different response formats
                        const name = influencer.profile_name || influencer.name || 'N/A';
                        const username = influencer.username || influencer.user_name || 'unknown';
                        const followers = influencer.followers || 0;
                        const profileImage = influencer.profile_image || influencer.profile_image_link || influencer.picture;
                        const avgLikes = influencer.avg_likes || 0;
                        const avgEngagement = influencer.avg_engagement || 0;
                        const verified = influencer.is_verified || false;
                        const influencerId = influencer.id || influencer.influencer_id || index;

                        return (
                          <tr
                            key={influencerId}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={profileImage}
                                  alt={name}
                                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover bg-gray-200"
                                  onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm truncate">
                                    {name}
                                    {verified && ' ✓'}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">@{username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                                {influencer.location || influencer.city || 'Global'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge badge-black">
                                💰 {formatFollowers(followers)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                👁 {formatFollowers(avgLikes) || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-gray-900">
                                {typeof avgEngagement === 'number' ? `${(avgEngagement * 100).toFixed(2)}%` : 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                                {influencer.primary_category?.name || influencer.category || 'Uncategorized'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-semibold px-2 py-1 rounded inline-block whitespace-nowrap bg-gray-100 text-gray-800">
                                Creator
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleInviteInfluencer(influencerId)}
                                  className={`p-2 rounded-full transition-all ${
                                    invitedInfluencers.has(influencerId)
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  title={invitedInfluencers.has(influencerId) ? 'Invited' : 'Invite'}
                                >
                                  {invitedInfluencers.has(influencerId) ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  onClick={() => router.push(`/brand/chat/${influencerId}?name=${encodeURIComponent(name)}`)}
                                  className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                                  title="Message"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
