'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, MoreVertical, Heart } from 'lucide-react';
import { campaignAPI } from '../../../../utils/api';

export default function AllCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await campaignAPI.getCampaigns({ page, limit });
      const allCampaigns = response.data || [];
      // Filter only active campaigns (non-draft)
      const activeCampaigns = allCampaigns.filter(campaign => campaign.status === 'Active');
      setCampaigns(activeCampaigns);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNext: false,
        hasPrev: false
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignClick = (campaign) => {
    console.log('Campaign clicked:', campaign);
    // Navigate to campaign details or handle as needed
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Fixed App Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-9 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2 mr-1"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                All Campaigns
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {loading ? (
              // Campaign Cards Skeleton
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden flex-1 min-w-[300px] max-w-[400px]">
                    {/* Card Header Skeleton */}
                    <div className="flex gap-2 items-start p-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    {/* Card Image Skeleton */}
                    <div className="h-[216px] bg-gray-200 animate-pulse"></div>
                  </div>
                ))}
              </>
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div 
                  key={campaign._id} 
                  className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex-1 min-w-[300px] max-w-[400px] cursor-pointer"
                  onClick={() => handleCampaignClick(campaign)}
                >
                  {/* Eyebrow label at top */}
                  <div className="px-4 pt-4">
                    <span className="text-xs text-gray-500">
                      {campaign.campaignType || 'Campaign'}
                    </span>
                  </div>

                  {/* Content Frame with Avatar and Info */}
                  <div className="flex gap-2 items-start px-4 py-3">
                    {/* Leading Avatar */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                        {campaign.campaignName?.substring(0, 2).toUpperCase() || 'AB'}
                      </div>
                    </div>

                    {/* Content Leading */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {campaign.campaignName || 'Campaign'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {campaign.createdAt 
                          ? new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Recently'
                        }
                      </p>
                    </div>

                    {/* Trailing Icon Button */}
                    <div className="flex items-center justify-center px-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle favorite toggle
                        }}
                        className="p-3 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Heart className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Image */}
                  <div className="h-[216px] bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                    {campaign.productImages && campaign.productImages.length > 0 ? (
                      <img 
                        src={campaign.productImages[0]} 
                        alt={campaign.campaignName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center p-6">
                          <div className="text-2xl font-bold mb-2">{campaign.campaignName?.substring(0, 2).toUpperCase()}</div>
                          <div className="text-sm">Campaign</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-600">No campaigns found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
