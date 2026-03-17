'use client'

/**
 * AllCampaignsSection Component - Refactored with Redux
 *
 * This component demonstrates the new Redux-based pattern
 * Replace AllCampaignsSection.jsx with this once fully tested
 *
 * Key changes:
 * - Uses useCampaigns() custom hook instead of direct API calls
 * - Campaign state managed in Redux instead of local state
 * - Cleaner component with separated concerns
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
import { useSidebar } from '../../context/SidebarContext';
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
    fetchMyCampaigns,
    deleteCampaign,
    createNewCampaign,
    updateExistingCampaign,
  } = useCampaigns();

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
      await deleteCampaign(selectedCampaign.id);
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
      await updateExistingCampaign(selectedCampaign.id, formData);
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

  if (loading) {
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
          onClick={() => fetchMyCampaigns()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Campaigns</h2>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Campaign
          </Button>
        </div>

        {/* Campaigns List */}
        <div className="space-y-3">
          {myCampaigns && myCampaigns.length > 0 ? (
            myCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openCampaignDetails(campaign)}
              >
                <div className="flex justify-between items-start">
                  <div>
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No campaigns yet. Create one to get started!</p>
            </div>
          )}
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
    </div>
  );
};

export default AllCampaignsSection;
