'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, MoreVertical, Heart } from 'lucide-react';
import { campaignAPI } from '../../../../utils/api';

export default function AllDrafts() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
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
    fetchDrafts();
  }, []);

  const fetchDrafts = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await campaignAPI.getCampaigns({ page, limit });
      const allCampaigns = response.data || [];
      // Filter only draft campaigns
      const draftCampaigns = allCampaigns.filter(campaign => campaign.status === 'Draft');
      setDrafts(draftCampaigns);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNext: false,
        hasPrev: false
      });
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftClick = (draft) => {
    console.log('Draft clicked:', draft);
    // Navigate to edit or complete the draft
  };

  const handleCompleteCampaign = async (e, campaignId) => {
    e.stopPropagation();
    try {
      // Navigate to create-campaign page with draft data
      router.push(`/brand/campaigns/create-campaign?draftId=${campaignId}`);
    } catch (error) {
      console.error('Error completing campaign:', error);
    }
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
                Draft Campaigns
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
              Showing {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {loading ? (
              // Draft Cards Skeleton
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
                    {/* Buttons Skeleton */}
                    <div className="p-4 flex gap-2">
                      <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : drafts.length > 0 ? (
              drafts.map((draft) => (
                <div 
                  key={draft._id} 
                  className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex-1 min-w-[300px] max-w-[400px] cursor-pointer"
                  onClick={() => handleDraftClick(draft)}
                >
                  {/* Eyebrow label at top */}
                  <div className="px-4 pt-4">
                    <span className="text-xs text-gray-500">
                      Draft - {draft.campaignType || 'Campaign'}
                    </span>
                  </div>

                  {/* Content Frame with Avatar and Info */}
                  <div className="flex gap-2 items-start px-4 py-3">
                    {/* Leading Avatar */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                        {draft.campaignName?.substring(0, 2).toUpperCase() || 'DR'}
                      </div>
                    </div>

                    {/* Content Leading */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {draft.campaignName || 'Untitled Draft'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {draft.createdAt 
                          ? new Date(draft.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Draft'
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
                  <div className="h-[216px] bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                    {draft.productImages && draft.productImages.length > 0 ? (
                      <img 
                        src={draft.productImages[0]} 
                        alt={draft.campaignName} 
                        className="w-full h-full object-cover opacity-80" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center p-6">
                          <div className="text-2xl font-bold mb-2">DRAFT</div>
                          <div className="text-xl">CAMPAIGN</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDraftClick(draft);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={(e) => handleCompleteCampaign(e, draft._id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Complete Campaign
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-600">No draft campaigns found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
