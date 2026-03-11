'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftLine, SearchLine, CloseLine, HeartLine } from '@phyoofficial/phyo-icon-library';
import { campaignAPI } from '@/utils/api';
import { useGoBack } from '@/hooks/useGoBack';
import { useAuth } from '@/app/context/AuthContext';

export default function AllCampaign() {
  const router = useRouter();
  const goBack = useGoBack();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { user, isBrand, isInfluencer, loading: authLoading } = useAuth();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [showSearch, setShowSearch] = useState(!!initialQuery);

  useEffect(() => {
    if (!authLoading) {
      fetchCampaigns(searchQuery);
    }
  }, [searchQuery, authLoading]);

  const fetchCampaigns = async (query = '') => {
    if (authLoading) return;

    setLoading(true);
    try {
      const params = { page: 1, limit: 20 };
      if (query) params.search = query;

      let response;

      // Role-based campaign fetching
      if (isBrand()) {
        // Brands see only their own campaigns
        response = await campaignAPI.getBrandCampaigns(params);
      } else if (isInfluencer()) {
        // Influencers see all active campaigns to apply to
        response = await campaignAPI.getCampaigns(params);
      } else {
        // Other users see all campaigns
        response = await campaignAPI.getCampaigns(params);
      }

      const allCampaigns = response.data || [];
      const activeCampaigns = allCampaigns.filter(c => c.status === 'Active');
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="bg-neutral-base min-h-screen flex flex-col">
      {/* App Bar */}
      <div className="flex-shrink-0 bg-neutral-base border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-9 py-3 sm:py-4">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setShowSearch(false); handleClear(); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
              >
                <ArrowLeftLine className="w-5 h-5 text-gray-700" />
              </button>
              <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search campaigns..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              {inputValue && (
                <button type="button" onClick={handleClear} className="p-1">
                  <CloseLine className="w-4 h-4 text-gray-500" />
                </button>
              )}
              <button type="submit" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <SearchLine className="w-5 h-5 text-gray-700" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2 mr-1"
                >
                  <ArrowLeftLine className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {searchQuery ? `Results for "${searchQuery}"` : isBrand() ? 'My Campaigns' : 'All Campaigns'}
                </h1>
              </div>
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SearchLine className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {loading ? 'Searching...' : `Showing ${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden flex-1 min-w-[300px] max-w-[400px]">
                <div className="flex gap-2 items-start p-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-[216px] bg-gray-200 animate-pulse" />
              </div>
            ))
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex-1 min-w-[300px] max-w-[400px] cursor-pointer"
                onClick={() => {
                  const baseRoute = isBrand() ? '/brand' : '/influencer';
                  router.push(`${baseRoute}/campaigns/${campaign._id}`);
                }}
              >
                <div className="px-4 pt-4">
                  <span className="text-xs text-gray-500">{campaign.campaignType || 'Campaign'}</span>
                </div>
                <div className="flex gap-2 items-start px-4 py-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    {campaign.campaignName?.substring(0, 2).toUpperCase() || 'AB'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{campaign.campaignName || 'Campaign'}</h3>
                    <p className="text-sm text-gray-600">
                      {campaign.createdAt
                        ? new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'Recently'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <HeartLine className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                <div className="h-[216px] bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                  {campaign.productImages?.length > 0 ? (
                    <img src={campaign.productImages[0]} alt={campaign.campaignName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
                      <div>
                        <div className="text-2xl font-bold mb-2">{campaign.campaignName?.substring(0, 2).toUpperCase()}</div>
                        <div className="text-sm">Campaign</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-16">
              <SearchLine className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {isBrand() ? 'No campaigns created yet' : 'No campaigns found'}
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              )}
              {!searchQuery && isBrand() && (
                <p className="text-sm text-gray-400 mt-1">Create your first campaign to get started</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
