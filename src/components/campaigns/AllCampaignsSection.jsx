'use client'

/**
 * AllCampaignsSection Component - Redux Based
 *
 * This component manages campaign display and operations using Redux Toolkit
 * instead of direct API calls, providing centralized state management
 *
 * Key features:
 * - Uses useCampaigns() custom hook for Redux state management
 * - Campaign state managed in Redux store, not local state
 * - Cleaner component with separated concerns
 * - Support for create, read, update, delete operations
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftLine,
  ArrowRightLine,
  CloseLine,
  UploadLine,
  CalendarLine,
  CheckLine,
  UserLine,
  MoreLine,
  DeleteBinLine,
  EditLine,
  SearchLine,
  HeartLine,
  LineChartLine,
  CheckboxLine,
} from '@phyoofficial/phyo-icon-library';
import { useSidebar } from '@/app/context/SidebarContext';
import { AudienceEngagement } from '@/components/AudienceEngagementGraphs';
import { SpendingBudget } from '@/components/SpendingBudgetGraph';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useInfluencers } from '@/hooks/useInfluencers';

const AllCampaignsSection = () => {
  const router = useRouter();
  const { setSidebarButtonAction, setSidebarButtonLabel } = useSidebar();
  const fileInputRef = useRef(null);

  // Redux hooks for campaigns and influencers
  const {
    campaigns,
    myCampaigns,
    loading,
    error,
    pagination,
    fetchCampaigns,
    fetchMyCampaigns,
    deleteCampaign,
    createNewCampaign,
    updateExistingCampaign,
  } = useCampaigns();

  const {
    influencers,
    loading: influencersLoading,
    fetchInfluencers,
  } = useInfluencers();

  // Local UI state (only for modal/UI purposes, not data)
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [showAllDrafts, setShowAllDrafts] = useState(false);

  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: '',
    campaignBrief: '',
    deliverables: '',
    compensation: 'Monetary',
    compensationDetails: '',
    compensationAmount: '',
    compensationCurrency: 'USD',
    applicationDeadline: '',
    campaignStartDate: '',
    campaignEndDate: '',
    productImages: [],
    budget: '',
    numberOfLivePosts: '',
    reels: [],
    influencerCount: '',
    niche: '',
    followerCountMin: '',
    followerCountMax: '',
    countries: '',
    gender: '',
    ageRangeMin: '',
    ageRangeMax: '',
  });

  // Load campaigns and influencers on mount
  useEffect(() => {
    fetchCampaigns();
    fetchInfluencers();
  }, []);

  // Register sidebar button action
  useEffect(() => {
    setSidebarButtonAction(() => () => {
      router.push('/brand/campaigns/create-campaign');
    });
    setSidebarButtonLabel('Create Campaign');

    return () => {
      setSidebarButtonAction(null);
      setSidebarButtonLabel('Button');
    };
  }, [setSidebarButtonAction, setSidebarButtonLabel, router]);

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    try {
      setIsSubmitting(true);
      await createNewCampaign(formData);
      setShowModal(false);
      setFormData({
        campaignName: '',
        campaignType: '',
        campaignBrief: '',
        deliverables: '',
        compensation: 'Monetary',
        compensationDetails: '',
        compensationAmount: '',
        compensationCurrency: 'USD',
        applicationDeadline: '',
        campaignStartDate: '',
        campaignEndDate: '',
        productImages: [],
        budget: '',
        numberOfLivePosts: '',
        reels: [],
        influencerCount: '',
        niche: '',
        followerCountMin: '',
        followerCountMax: '',
        countries: '',
        gender: '',
        ageRangeMin: '',
        ageRangeMax: '',
      });
      setCurrentStep(1);
    } catch (err) {
      console.error('Failed to create campaign:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;
    try {
      setIsSubmitting(true);
      await deleteCampaign(selectedCampaign.id || selectedCampaign._id);
      setShowDeleteModal(false);
      setSelectedCampaign(null);
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle campaign update
  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;
    try {
      setIsSubmitting(true);
      await updateExistingCampaign(selectedCampaign.id || selectedCampaign._id, formData);
      setIsEditMode(false);
      setShowDetailModal(false);
    } catch (err) {
      console.error('Failed to update campaign:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open campaign details
  const openCampaignDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      campaignName: campaign.campaignName || '',
      campaignType: campaign.campaignType || '',
      campaignBrief: campaign.campaignBrief || '',
      deliverables: campaign.deliverables || '',
      compensation: campaign.compensation || 'Monetary',
      compensationDetails: campaign.compensationDetails || '',
      compensationAmount: campaign.compensationAmount || '',
      compensationCurrency: campaign.compensationCurrency || 'USD',
      applicationDeadline: campaign.applicationDeadline || '',
      campaignStartDate: campaign.campaignStartDate || '',
      campaignEndDate: campaign.campaignEndDate || '',
      productImages: campaign.productImages || [],
      budget: campaign.budget || '',
      numberOfLivePosts: campaign.numberOfLivePosts || '',
      reels: campaign.reels || [],
      influencerCount: campaign.influencerCount || '',
      niche: campaign.niche || '',
      followerCountMin: campaign.followerCountMin || '',
      followerCountMax: campaign.followerCountMax || '',
      countries: campaign.countries || '',
      gender: campaign.gender || '',
      ageRangeMin: campaign.ageRangeMin || '',
      ageRangeMax: campaign.ageRangeMax || '',
    });
    setShowDetailModal(true);
  };

  // Helper functions
  const getActiveCampaigns = () => {
    return (campaigns || []).filter(campaign => campaign.status === 'Active');
  };

  const getDraftCampaigns = () => {
    return (campaigns || []).filter(campaign => campaign.status === 'Draft');
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Loading state
  if (loading && !campaigns.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
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

  const activeCampaigns = getActiveCampaigns();
  const draftCampaigns = getDraftCampaigns();

  return (
    <div className="w-full space-y-6">
      {/* Active Campaigns Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Active Campaigns</h2>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Campaign
          </Button>
        </div>

        {activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {activeCampaigns.slice(0, showAllCampaigns ? activeCampaigns.length : 5).map((campaign) => (
              <Card
                key={campaign.id || campaign._id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/brand/campaigns/${campaign._id || campaign.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{campaign.campaignName}</h3>
                    <p className="text-gray-600 text-sm">{campaign.campaignBrief}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Budget: ${campaign.budget}</span>
                      <span>Status: {campaign.status || 'Draft'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openCampaignDetails(campaign);
                      }}
                    >
                      <EditLine size={20} />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCampaign(campaign);
                        setShowDeleteModal(true);
                      }}
                    >
                      <DeleteBinLine size={20} />
                    </IconButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No active campaigns yet.</p>
          </div>
        )}

        {activeCampaigns.length > 5 && !showAllCampaigns && (
          <button
            onClick={() => setShowAllCampaigns(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All ({activeCampaigns.length})
          </button>
        )}
      </div>

      {/* Draft Campaigns Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Draft Campaigns</h2>

        {draftCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {draftCampaigns.slice(0, showAllDrafts ? draftCampaigns.length : 5).map((campaign) => (
              <Card
                key={campaign.id || campaign._id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer opacity-75"
                onClick={() => openCampaignDetails(campaign)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{campaign.campaignName}</h3>
                    <p className="text-gray-600 text-sm">{campaign.campaignBrief}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Budget: ${campaign.budget}</span>
                      <span>Status: Draft</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openCampaignDetails(campaign);
                      }}
                    >
                      <EditLine size={20} />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCampaign(campaign);
                        setShowDeleteModal(true);
                      }}
                    >
                      <DeleteBinLine size={20} />
                    </IconButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No draft campaigns.</p>
          </div>
        )}

        {draftCampaigns.length > 5 && !showAllDrafts && (
          <button
            onClick={() => setShowAllDrafts(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All ({draftCampaigns.length})
          </button>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Delete Campaign?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedCampaign.campaignName}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Campaign Details</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setIsEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={formData.campaignName}
                  onChange={(e) => handleFormChange('campaignName', e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brief</label>
                <textarea
                  value={formData.campaignBrief}
                  onChange={(e) => handleFormChange('campaignBrief', e.target.value)}
                  disabled={!isEditMode}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleFormChange('budget', e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Campaign Type</label>
                <select
                  value={formData.campaignType}
                  onChange={(e) => handleFormChange('campaignType', e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                >
                  <option>Select Type</option>
                  <option>Product Launch</option>
                  <option>Awareness</option>
                  <option>Engagement</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {!isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdateCampaign}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCampaignsSection;
