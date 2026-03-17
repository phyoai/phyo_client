'use client'

/**
 * AllCampaignsSection Component - Redux Based (User View)
 *
 * Manages campaign discovery and applications using Redux Toolkit
 * General user view of available campaigns
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DeleteBinLine,
  EditLine,
  HeartLine,
  LineChartLine,
} from '@phyoofficial/phyo-icon-library';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { useCampaigns } from '@/hooks/useCampaigns';

const AllCampaignsSection = () => {
  const router = useRouter();

  // Redux campaigns hook
  const {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    applyToNewCampaign,
  } = useCampaigns();

  // Local UI state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);

  // Load campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle campaign application
  const handleApplyToCampaign = async (campaign) => {
    try {
      setIsSubmitting(true);
      await applyToNewCampaign(campaign.id || campaign._id);
      setAppliedCampaigns(prev => [...prev, campaign.id || campaign._id]);
      alert('Applied to campaign successfully!');
    } catch (err) {
      console.error('Failed to apply to campaign:', err);
      alert('Failed to apply to campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open campaign details
  const openCampaignDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };

  if (loading && !campaigns.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error loading campaigns: {error}</p>
        <button
          onClick={() => fetchCampaigns()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discover Campaigns</h2>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {campaigns && campaigns.length > 0 ? (
          <>
            {campaigns.slice(0, showAllCampaigns ? campaigns.length : 10).map((campaign) => {
              const isApplied = appliedCampaigns.includes(campaign.id || campaign._id);
              return (
                <Card
                  key={campaign.id || campaign._id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openCampaignDetails(campaign)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{campaign.campaignName}</h3>
                      <p className="text-gray-600 text-sm">{campaign.campaignBrief}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Budget: ${campaign.budget}</span>
                        <span>Type: {campaign.campaignType || 'General'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <IconButton onClick={(e) => e.stopPropagation()}>
                        <HeartLine size={20} />
                      </IconButton>
                      {!isApplied && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyToCampaign(campaign);
                          }}
                          disabled={isSubmitting}
                          className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Apply
                        </Button>
                      )}
                      {isApplied && (
                        <span className="text-green-600 text-sm font-medium px-3 py-1">
                          Applied
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {campaigns.length > 10 && !showAllCampaigns && (
              <button
                onClick={() => setShowAllCampaigns(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium w-full py-2"
              >
                View All ({campaigns.length})
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No campaigns available at the moment.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Campaign Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <p className="text-gray-700">{selectedCampaign.campaignName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brief</label>
                <p className="text-gray-700">{selectedCampaign.campaignBrief}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deliverables</label>
                <p className="text-gray-700">{selectedCampaign.deliverables || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <p className="text-gray-700">${selectedCampaign.budget}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Timeline</label>
                <p className="text-gray-700">
                  {selectedCampaign.campaignStartDate} - {selectedCampaign.campaignEndDate}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {!appliedCampaigns.includes(selectedCampaign.id || selectedCampaign._id) ? (
                <>
                  <button
                    onClick={() => {
                      handleApplyToCampaign(selectedCampaign);
                      setShowDetailModal(false);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Applying...' : 'Apply Now'}
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCampaignsSection;
