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
import { useRoleContext } from '@/app/context/RoleContext';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { useCampaigns } from '@/hooks/useCampaigns';

const AllCampaignsSection = () => {
  const router = useRouter();
  const { role } = useRoleContext();

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
    <div className="flex flex-col items-start w-full max-w-[1280px] min-w-[1024px] pt-4 bg-white dark:bg-[#121212] space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-6">
        <h2 className="text-2xl font-bold">Discover Campaigns</h2>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </Button>
      </div>

      {/* Campaigns Grid */}
      {campaigns && campaigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-6">
            {campaigns.slice(0, showAllCampaigns ? campaigns.length : 12).map((campaign) => {
              const isApplied = appliedCampaigns.includes(campaign.id || campaign._id);
              const brandInitials = campaign.campaignName?.substring(0, 1).toUpperCase() || 'C';

              return (
                <div
                  key={campaign.id || campaign._id}
                  className="bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openCampaignDetails(campaign)}
                >
                  {/* Card Header with Brand Info */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Brand Avatar */}
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{brandInitials}</span>
                      </div>
                      {/* Brand Name and Time */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {campaign.campaignName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3d ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Image/Visual */}
                  <div className="bg-gradient-to-br from-green-700 to-green-900 h-48 flex items-center justify-center relative overflow-hidden">
                    {campaign.campaignImage || campaign.productImages?.[0] ? (
                      <img
                        src={campaign.campaignImage || campaign.productImages?.[0]}
                        alt={campaign.campaignName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="text-white text-center px-4 absolute inset-0 flex items-center justify-center"
                      style={{ display: campaign.campaignImage || campaign.productImages?.[0] ? 'none' : 'flex' }}
                    >
                      <div>
                        <p className="font-bold text-2xl mb-2 line-clamp-3">{campaign.campaignBrief || campaign.campaignName}</p>
                        <p className="text-sm opacity-90">Budget: ${campaign.budget || '0'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Actions */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="inline-block bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {campaign.campaignType || 'General'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <IconButton
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-red-500"
                      >
                        <HeartLine size={18} />
                      </IconButton>
                      {!isApplied && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyToCampaign(campaign);
                          }}
                          disabled={isSubmitting}
                          className="bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Apply
                        </Button>
                      )}
                      {isApplied && (
                        <span className="text-green-600 text-xs font-medium">✓ Applied</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {campaigns.length > 12 && !showAllCampaigns && (
            <div className="w-full px-6">
              <button
                onClick={() => setShowAllCampaigns(true)}
                className="mt-6 text-green-600 hover:text-green-700 font-medium w-full py-3 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                View All ({campaigns.length}) Campaigns
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 w-full">
          <p className="text-lg">No campaigns available at the moment.</p>
        </div>
      )}

      {/* New Applications Section */}
      <div className="w-full px-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">New Applications</h3>
          <button
            onClick={() => router.push(`/${role}/campaigns/new-applications`)}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            view all &gt;
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {[
            {
              id: 1,
              name: 'Michael Smith',
              description: 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex problems and bringing ideas t...',
              avatar: 'MS',
              avatarColor: 'bg-green-500',
            },
            {
              id: 2,
              name: 'Sarah Lee',
              description: 'A UX researcher dedicated to understanding user behavior and needs. She utilizes qualitative and quantitative methods to infor...',
              avatar: 'SL',
              avatarColor: 'bg-red-500',
            },
            {
              id: 3,
              name: 'David Chen',
              description: 'A digital marketer with a focus on brand strategy and social media engagement. He enjoys crafting compelling narratives that r...',
              avatar: 'DC',
              avatarColor: 'bg-teal-500',
            },
            {
              id: 4,
              name: 'Emma Garcia',
              description: 'A product manager with a strong background in agile methodologies. She excels at aligning cross-functional teams to deliver e...',
              avatar: 'EG',
              avatarColor: 'bg-red-400',
            },
          ].map((applicant) => (
            <div
              key={applicant.id}
              onClick={() => {
                const applicantData = JSON.stringify(applicant);
                router.push(`/${role}/campaigns/new-applications?applicant=${encodeURIComponent(applicantData)}`);
              }}
              className="flex items-center justify-between p-4 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:cursor-pointer transition-shadow"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full ${applicant.avatarColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{applicant.avatar}</span>
                </div>

                {/* Applicant Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {applicant.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                    {applicant.description}
                  </p>
                </div>
              </div>

              {/* Portfolio Button */}
              <button onClick={(e) => e.stopPropagation()} className="ml-4 px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                portfolio
              </button>
            </div>
          ))}
        </div>
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
