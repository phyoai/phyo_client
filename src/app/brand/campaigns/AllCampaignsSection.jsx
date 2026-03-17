'use client'

/**
 * AllCampaignsSection Component - Redux Based (Brand View)
 *
 * Manages campaign display and operations using Redux Toolkit
 * Filtered for brand-specific campaigns
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
import { useRoleContext } from '@/app/context/RoleContext';
import { AudienceEngagement } from '@/components/AudienceEngagementGraphs';
import { SpendingBudget } from '@/components/SpendingBudgetGraph';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { useCampaigns } from '@/hooks/useCampaigns';

const AllCampaignsSection = () => {
  const router = useRouter();
  const { setSidebarButtonAction, setSidebarButtonLabel } = useSidebar();
  const fileInputRef = useRef(null);

  // Redux campaigns hook
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

  // Local UI state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);

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

  // Load campaigns on mount
  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  // Register sidebar button
  const { role } = useRoleContext();

  useEffect(() => {
    setSidebarButtonAction(() => () => {
      router.push(`/${role}/campaigns/create-campaign`);
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading && !myCampaigns.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start w-full max-w-[1280px] min-w-[1024px] pt-4 bg-white dark:bg-[#121212] px-6">
        <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg w-full">
          <p className="font-semibold mb-2">Error loading campaigns</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchMyCampaigns()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full max-w-[1280px] min-w-[1024px] pt-4 bg-white dark:bg-[#121212] space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-6">
        <h2 className="text-2xl font-bold">My Campaigns</h2>
        <Button
          onClick={() => router.push(`/${role}/campaigns/create-campaign`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      {myCampaigns && myCampaigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-6">
            {myCampaigns.slice(0, showAllCampaigns ? myCampaigns.length : 12).map((campaign) => {
              const brandInitials = campaign.campaignName?.substring(0, 1).toUpperCase() || 'C';
              const statusColors = {
                'Active': 'bg-green-100 text-green-800',
                'Draft': 'bg-gray-100 text-gray-800',
                'Completed': 'bg-blue-100 text-blue-800',
                'Paused': 'bg-yellow-100 text-yellow-800',
              };
              const statusColor = statusColors[campaign.status] || 'bg-gray-100 text-gray-800';

              return (
                <div
                  key={campaign.id || campaign._id}
                  className="bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/brand/campaigns/${campaign._id || campaign.id}`)}
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
                        <p className="text-sm opacity-90">Campaign: {campaign.campaignType || 'General'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Status and Actions */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColor}`}>
                        {campaign.status || 'Draft'}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ${campaign.budget || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {myCampaigns.length > 12 && !showAllCampaigns && (
            <div className="w-full px-6">
              <button
                onClick={() => setShowAllCampaigns(true)}
                className="mt-6 text-green-600 hover:text-green-700 font-medium w-full py-3 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                View All ({myCampaigns.length}) Campaigns
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 w-full">
          <p className="text-lg">No campaigns yet. Create one to get started!</p>
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
                router.push(`/brand/campaigns/new-applications?applicant=${encodeURIComponent(applicantData)}`);
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

      {/* Delete Modal */}
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Delete Campaign?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedCampaign.campaignName}"?
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
