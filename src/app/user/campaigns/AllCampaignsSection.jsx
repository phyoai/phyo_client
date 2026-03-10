'use client'
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine, ArrowRightLine, CloseLine, UploadLine, CalendarLine, CheckLine, UserLine, MoreLine, DeleteBinLine, EditLine, SearchLine, HeartLine, LineChartLine, CheckboxLine } from '@phyoofficial/phyo-icon-library';
import { campaignAPI } from '../../../utils/api';
import { useSidebar } from '../../context/SidebarContext';
import { AudienceEngagement } from '@/components/AudienceEngagementGraphs';
import { SpendingBudget } from '@/components/SpendingBudgetGraph';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Card from '@/components/Card';

const AllCampaignsSection = () => {
  const router = useRouter();
  const { setSidebarButtonAction, setSidebarButtonLabel } = useSidebar();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [showAllDrafts, setShowAllDrafts] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });
  const [formData, setFormData] = useState({
    // Campaign Details
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
    budget: '', // NEW
    numberOfLivePosts: '', // NEW
    reels: [], // NEW
    // Target Influencer
    influencerCount: '',
    niche: '',
    followerCountMin: '',
    followerCountMax: '',
    countries: '',
    gender: '',
    ageRangeMin: '',
    ageRangeMax: ''
  });

  const fileInputRef = useRef(null);

  // Campaign data will be fetched from API

  const mockInfluencers = [
    {
      id: 1,
      name: 'Andrew Power',
      followers: '12.5K',
      engagement: '4.2%',
      tags: ['Lifestyle', 'Fitness', 'Food', 'Travel'],
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Andrew Power',
      followers: '8.7K',
      engagement: '3.8%',
      tags: ['Beauty', 'Skincare', 'Wellness'],
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'Andrew Power',
      followers: '15.2K',
      engagement: '5.1%',
      tags: ['Fashion', 'Lifestyle', 'Travel'],
      image: '/api/placeholder/80/80'
    },
    {
      id: 4,
      name: 'Andrew Power',
      followers: '22.1K',
      engagement: '6.3%',
      tags: ['Health', 'Fitness', 'Nutrition'],
      image: '/api/placeholder/80/80'
    },
    {
      id: 5,
      name: 'Andrew Power',
      followers: '9.8K',
      engagement: '4.7%',
      tags: ['Tech', 'Gaming', 'Reviews'],
      image: '/api/placeholder/80/80'
    },
    {
      id: 6,
      name: 'Andrew Power',
      followers: '18.3K',
      engagement: '5.9%',
      tags: ['Food', 'Cooking', 'Recipes'],
      image: '/api/placeholder/80/80'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // For preview, create object URLs
    const images = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      productImages: images
    }));
  };

  // Handler for adding reel URLs
  const [reelInput, setReelInput] = useState('');
  const handleAddReel = () => {
    if (reelInput.trim()) {
      setFormData(prev => ({
        ...prev,
        reels: [...prev.reels, reelInput.trim()]
      }));
      setReelInput('');
    }
  };
  const handleRemoveReel = (idx) => {
    setFormData(prev => ({
      ...prev,
      reels: prev.reels.filter((_, i) => i !== idx)
    }));
  };

  // Fetch campaigns from API
  const fetchCampaigns = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await campaignAPI.getCampaigns({ page, limit });
      setCampaigns(response.data || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
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

  // Load campaigns on component mount
  React.useEffect(() => {
    fetchCampaigns();
  }, []);

  // Helper function to get active campaigns
  const getActiveCampaigns = () => {
    return campaigns.filter(campaign => campaign.status === 'Active');
  };

  // Helper function to get draft campaigns
  const getDraftCampaigns = () => {
    return campaigns.filter(campaign => campaign.status === 'Draft');
  };

  // Register sidebar button action for campaigns tab
  React.useEffect(() => {
    // Set the button action to navigate to create campaign page
    setSidebarButtonAction(() => () => {
      window.location.href = '/brand/campaigns/create-campaign';
    });
    setSidebarButtonLabel('Create Campaign');

    // Cleanup: Remove the action when component unmounts
    return () => {
      setSidebarButtonAction(null);
      setSidebarButtonLabel('Button');
    };
  }, [setSidebarButtonAction, setSidebarButtonLabel]);

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchCampaigns(pagination.currentPage - 1, pagination.itemsPerPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchCampaigns(pagination.currentPage + 1, pagination.itemsPerPage);
    }
  };

  // Delete campaign handler
  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    setIsDeletingCampaign(true);
    try {
      await campaignAPI.deleteCampaign(campaignToDelete._id);
      
      // Show success message
      alert('Campaign deleted successfully!');
      
      // Close modal
      setShowDeleteModal(false);
      setCampaignToDelete(null);
      
      // Refresh campaigns list
      fetchCampaigns(pagination.currentPage, pagination.itemsPerPage);
      
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert(`Failed to delete campaign: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeletingCampaign(false);
    }
  };

  // Activate campaign (change from Draft to Active)
  const handleActivateCampaign = async (campaignId) => {
    try {
      await campaignAPI.updateCampaign(campaignId, { status: 'Active' });
      
      alert('Campaign activated successfully!');
      
      // Refresh campaigns list
      fetchCampaigns(pagination.currentPage, pagination.itemsPerPage);
      
    } catch (error) {
      console.error('Error activating campaign:', error);
      alert(`Failed to activate campaign: ${error.message || 'Unknown error'}`);
    }
  };

  // Complete/Activate campaign from draft (with event handler for button click)
  const handleCompleteCampaign = async (e, campaignId) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    await handleActivateCampaign(campaignId);
  };

  // Open campaign detail modal
  const handleCampaignClick = async (campaign) => {
    // Navigate to campaign detail page instead of showing modal
    router.push(`/brand/campaigns/${campaign._id}`);
  };

  // Enable edit mode
  const handleEnableEdit = () => {
    setIsEditMode(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Refresh campaign data to revert changes
    if (selectedCampaign) {
      handleCampaignClick({ _id: selectedCampaign._id });
    }
  };

  // Update campaign field
  const handleUpdateField = (field, value) => {
    setSelectedCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update nested field (for compensation, timelines, targetInfluencer)
  const handleUpdateNestedField = (parentField, childField, value) => {
    setSelectedCampaign(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  // Save campaign updates
  const handleSaveUpdates = async () => {
    if (!selectedCampaign) return;

    setIsUpdating(true);
    try {
      // Prepare update data (only editable fields)
      const updateData = {
        campaignName: selectedCampaign.campaignName,
        status: selectedCampaign.status,
        compensation: selectedCampaign.compensation,
        budget: selectedCampaign.budget,
        deliverables: selectedCampaign.deliverables,
      };

      await campaignAPI.updateCampaign(selectedCampaign._id, updateData);
      
      alert('Campaign updated successfully!');
      setIsEditMode(false);
      
      // Refresh campaigns list
      fetchCampaigns(pagination.currentPage, pagination.itemsPerPage);
      
      // Refresh detail view
      handleCampaignClick({ _id: selectedCampaign._id });
      
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert(`Failed to update campaign: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep(1);
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
      ageRangeMax: ''
    });
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const StepIndicator = ({ stepNumber, title, status }) => (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
        ${status === 'completed' ? 'bg-green-600 text-white' : 
          status === 'current' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
        {status === 'completed' ? <CheckLine className="w-4 h-4" /> : stepNumber}
      </div>
      <div className="ml-3">
        <div className={`text-sm font-medium ${status === 'current' ? 'text-gray-900' : 'text-gray-500'}`}>
          STEP {stepNumber}
        </div>
        <div className={`text-sm ${status === 'current' ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </div>
        {status === 'current' && (
          <div className="text-xs text-green-600 font-medium">In Progress</div>
        )}
        {status === 'completed' && (
          <div className="text-xs text-green-600 font-medium">Completed</div>
        )}
        {status === 'pending' && (
          <div className="text-xs text-gray-400">Pending</div>
        )}
      </div>
    </div>
  );

  const CampaignCard = ({ campaign, isHistory = false }) => {
    // Handle API data structure
    const campaignName = campaign.campaignName || 'Untitled Campaign';
    const status = campaign.status || 'Draft';
    const brandName = campaign.brandId?.companyName || 'Unknown Brand';
    const budget = campaign.budget 
      ? `${campaign.compensation?.currency || 'INR'} ${campaign.budget}`
      : 'Not specified';
    const influencerCount = campaign.targetInfluencer?.numberOfInfluencers || 0;
    const applicantsCount = campaign.applicants?.length || 0;
    const selectedCount = campaign.selectedInfluencers?.length || 0;
    const productImage = campaign.productImages?.[0] || null;
    
    const [imageError, setImageError] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(true);
    
    const menuRef = useRef(null);

    // Close menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setOpenMenuId(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteClick = () => {
      setCampaignToDelete(campaign);
      setShowDeleteModal(true);
      setOpenMenuId(null);
    };

    const handleActivateClick = () => {
      handleActivateCampaign(campaign._id);
      setOpenMenuId(null);
    };

    const handleDetailClick = () => {
      handleCampaignClick(campaign);
      setOpenMenuId(null);
    };

    return (
      <div 
        onClick={() => handleCampaignClick(campaign)}
        className={`bg-neutral-base rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer ${campaign.isGrayed ? 'opacity-50' : ''}`}
      >
        {/* Header with Status and Menu */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">{brandName}</span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className={`text-xs px-2 py-1 rounded ${
                status === 'Active' ? 'text-green-600 bg-green-50' :
                status === 'Draft' ? 'text-gray-600 bg-gray-50' :
                status === 'Completed' ? 'text-blue-600 bg-blue-50' :
                'text-orange-600 bg-orange-50'
              }`}>
                {status}
              </span>
              
              {/* Three-dot Menu */}
              <div className="relative" ref={menuRef}>
                <IconButton
                  icon={MoreLine}
                  size="sm"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === campaign._id ? null : campaign._id);
                  }}
                />
                
                {openMenuId === campaign._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-neutral-base rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailClick();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <EditLine className="w-4 h-4" />
                      View/EditLine Campaign
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <DeleteBinLine className="w-4 h-4" />
                      Delete
                    </button>
                    {status !== 'Active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivateClick();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                      >
                        <CheckLine className="w-4 h-4" />
                        Activate Campaign
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Visual */}
        <div className="p-4">
          <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
            {productImage && !imageError ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-3 border-green-600 border-t-transparent"></div>
                      <p className="text-sm text-gray-600 font-medium">Loading image...</p>
                    </div>
                  </div>
                )}
                <img 
                  src={productImage} 
                  alt={campaignName}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    console.error('Image2Line failed to load:', productImage);
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </>
            ) : (
              <div className="w-32 h-40 bg-gray-800 rounded-t-lg relative">
                <div className="w-full h-full bg-gray-800 rounded-t-lg relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-blue-500 rounded-t"></div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-neutral-base rounded-lg flex items-center justify-center">
                    <div className="text-xs text-gray-800 font-bold text-center">BRAND<br/>LOGO</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Campaign Info */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{campaignName}</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">Budget: {budget}</span>
              <span className="text-xs text-gray-500 capitalize">{campaign.campaignType}</span>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{influencerCount}</div>
                  <div className="text-xs text-gray-500">Target</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">{applicantsCount}</div>
                  <div className="text-xs text-gray-500">Applicants</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">{selectedCount}</div>
                  <div className="text-xs text-gray-500">Selected</div>
                </div>
              </div>
            </div>

            {campaign.createdAt && (
              <div className="text-xs text-gray-400 pt-2">
                Created: {new Date(campaign.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const InfluencerCard = ({ influencer }) => (
    <div className="bg-neutral-base rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
          <UserLine className="w-8 h-8 text-gray-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-gray-900">{influencer.name}</h4>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {influencer.followers} followers • {influencer.engagement} engagement
          </div>
          <div className="flex flex-wrap gap-1">
            {influencer.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Campaign Details</h2>
            
            {/* Product Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Images of Product for your Campaign
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                  Click here to upload or drop media here
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.productImages && formData.productImages.length > 0 ? (
                  formData.productImages.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={img.url || img} alt={`Product ${idx + 1}`} className="object-cover w-full h-full" />
                    </div>
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (USD)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => handleInputChange('budget', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="500"
                min="0"
              />
            </div>

            {/* Number of Live Posts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Live Posts
              </label>
              <input
                type="number"
                value={formData.numberOfLivePosts}
                onChange={e => handleInputChange('numberOfLivePosts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="2"
                min="0"
              />
            </div>

            {/* Reels URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reels (Add video URLs)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={reelInput}
                  onChange={e => setReelInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/reel.mp4"
                />
                <Button
                  type="button"
                  onClick={handleAddReel}
                  variant="primary"
                  size="md"
                >
                  Add
                </Button>
              </div>
              <ul className="space-y-1">
                {formData.reels.map((url, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="truncate flex-1 text-xs text-gray-700">{url}</span>
                    <Button type="button" onClick={() => handleRemoveReel(idx)} variant="tertiary" size="sm">Remove</Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => handleInputChange('campaignName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Name"
              />
            </div>

            {/* Campaign Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type
              </label>
              <input
                type="text"
                value={formData.campaignType}
                onChange={(e) => handleInputChange('campaignType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="InstagramFill/YouTube"
              />
            </div>

            {/* Campaign Brief */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Brief
              </label>
              <textarea
                value={formData.campaignBrief}
                onChange={(e) => handleInputChange('campaignBrief', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter campaign brief..."
              />
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deliverables
              </label>
              <textarea
                value={formData.deliverables}
                onChange={(e) => handleInputChange('deliverables', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter deliverables..."
              />
            </div>

            {/* Compensation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Compensation
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="compensation"
                    value="Monetary"
                    checked={formData.compensation === 'Monetary'}
                    onChange={(e) => handleInputChange('compensation', e.target.value)}
                    className="mr-3"
                  />
                  <span>Monetary</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="compensation"
                    value="Barter/Gifting"
                    checked={formData.compensation === 'Barter/Gifting'}
                    onChange={(e) => handleInputChange('compensation', e.target.value)}
                    className="mr-3"
                  />
                  <span>Barter/Gifting</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="compensation"
                    value="Affiliate/Commission"
                    checked={formData.compensation === 'Affiliate/Commission'}
                    onChange={(e) => handleInputChange('compensation', e.target.value)}
                    className="mr-3"
                  />
                  <span>Affiliate/Commission</span>
                </label>
              </div>
              
              {formData.compensation === 'Monetary' && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.compensationAmount}
                      onChange={(e) => handleInputChange('compensationAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Currency</label>
                    <select
                      value={formData.compensationCurrency}
                      onChange={(e) => handleInputChange('compensationCurrency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>
              )}
              
              <textarea
                value={formData.compensationDetails}
                onChange={(e) => handleInputChange('compensationDetails', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mt-3"
                placeholder="Enter compensation details..."
              />
            </div>

            {/* Timelines */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Timelines</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Start & End Date
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start</label>
                      <input
                        type="date"
                        value={formData.campaignStartDate}
                        onChange={(e) => handleInputChange('campaignStartDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End</label>
                      <input
                        type="date"
                        value={formData.campaignEndDate}
                        onChange={(e) => handleInputChange('campaignEndDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's set your targeting details</h2>
              <p className="text-gray-600">
                Provide some details on influencers you're looking to target. We'll collect campaign 
                details like content requirements and product descriptions in the next step.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many influencers you want to hire
                </label>
                <input
                  type="number"
                  value={formData.influencerCount}
                  onChange={(e) => handleInputChange('influencerCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What Niche you want to Target
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => handleInputChange('niche', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a niche</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Tech">Tech</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Parenting">Parenting</option>
                  <option value="Pets">Pets</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follower Count Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <input
                      type="number"
                      value={formData.followerCountMin}
                      onChange={(e) => handleInputChange('followerCountMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <input
                      type="number"
                      value={formData.followerCountMax}
                      onChange={(e) => handleInputChange('followerCountMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="100000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Countries
                </label>
                <input
                  type="text"
                  value={formData.countries}
                  onChange={(e) => handleInputChange('countries', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <input
                      type="number"
                      value={formData.ageRangeMin}
                      onChange={(e) => handleInputChange('ageRangeMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="18"
                      min="13"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <input
                      type="number"
                      value={formData.ageRangeMax}
                      onChange={(e) => handleInputChange('ageRangeMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="35"
                      min="13"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COMMENTED OUT: Static mock influencer suggestions 
                AI will generate real suggestions when campaign is created */}
            {/* 
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Influencer Suggestions based on your Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockInfluencers.map((influencer) => (
                  <InfluencerCard key={influencer.id} influencer={influencer} />
                ))}
              </div>
            </div>
            */}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              This is how your Campaign will look to Influencers
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {formData.campaignName || 'Campaign Title'}
                </h3>
                <p className="text-sm text-gray-600">
                  Launched {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  by {formData.brandName || 'Brand Name'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Product Images Preview */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {formData.productImages && formData.productImages.length > 0 ? (
                      formData.productImages.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                          <img src={img.url || img} alt={`Product ${idx + 1}`} className="object-cover w-full h-full" />
                        </div>
                      ))
                    ) : (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="aspect-square bg-gray-200 rounded-lg"></div>
                      ))
                    )}
                  </div>
                  {/* Reels Preview */}
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-900 mb-1">Reels</h4>
                    <ul className="space-y-1">
                      {formData.reels && formData.reels.length > 0 ? (
                        formData.reels.map((url, idx) => (
                          <li key={idx} className="text-xs text-blue-700 truncate">{url}</li>
                        ))
                      ) : (
                        <li className="text-xs text-gray-400">No reels added</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timelines and Qualifications</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Application Deadline: {formData.applicationDeadline || 'Not set'}</p>
                    <p>Campaign Start: {formData.campaignStartDate || 'Not set'}</p>
                    <p>Campaign End: {formData.campaignEndDate || 'Not set'}</p>
                    <p>Budget: {formData.budget || 'Not set'}</p>
                    <p>Number of Live Posts: {formData.numberOfLivePosts || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Compensation</h4>
                <p className="text-sm text-green-700 capitalize">
                  {formData.compensation} campaign
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.compensationDetails || 'No compensation details provided'}
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Campaign Brief</h4>
                <p className="text-sm text-gray-700">
                  {formData.campaignBrief || 'No campaign brief provided'}
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Deliverables</h4>
                <p className="text-sm text-gray-700">
                  {formData.deliverables || 'No deliverables specified'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.campaignName || !formData.campaignType || !formData.campaignBrief || !formData.deliverables) {
      alert('Please fill in all required fields: Campaign Name, Campaign Type, Campaign Brief, and Deliverables');
      return;
    }

    if (!formData.applicationDeadline || !formData.campaignStartDate || !formData.campaignEndDate) {
      alert('Please set all timeline dates');
      return;
    }

    if (!formData.influencerCount || !formData.niche) {
      alert('Please fill in influencer targeting details');
      return;
    }

    if (!formData.productImages || formData.productImages.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform formData to match the API structure (keep file objects for FormData)
      const transformedData = {
        productImages: formData.productImages, // Keep file objects
        campaignName: formData.campaignName,
        campaignType: formData.campaignType,
        campaignBrief: formData.campaignBrief,
        deliverables: formData.deliverables
          ? Array.isArray(formData.deliverables)
            ? formData.deliverables
            : [formData.deliverables]
          : [],
        compensation: {
          type: formData.compensation,
          amount: formData.compensationAmount ? parseInt(formData.compensationAmount) : 0,
          currency: formData.compensationCurrency,
          description: formData.compensationDetails
        },
        budget: formData.budget ? parseInt(formData.budget) : 0,
        timelines: {
          applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
          campaignStartDate: new Date(formData.campaignStartDate).toISOString(),
          campaignEndDate: new Date(formData.campaignEndDate).toISOString()
        },
        targetInfluencer: {
          numberOfInfluencers: parseInt(formData.influencerCount) || 1,
          targetNiche: formData.niche ? [formData.niche] : [],
          followerCount: {
            min: parseInt(formData.followerCountMin) || 0,
            max: parseInt(formData.followerCountMax) || 1000000
          },
          countries: formData.countries ? [formData.countries] : [],
          gender: formData.gender ? [formData.gender] : [],
          ageRange: {
            min: parseInt(formData.ageRangeMin) || 18,
            max: parseInt(formData.ageRangeMax) || 65
          }
        },
        numberOfLivePosts: formData.numberOfLivePosts ? parseInt(formData.numberOfLivePosts) : 0,
        reels: formData.reels,
        status: 'Draft'
      };

      const response = await campaignAPI.createCampaign(transformedData);
      
      alert('Campaign created successfully!');
      handleCloseModal();
      
      // Refresh the campaigns list
      fetchCampaigns();
      
    } catch (error) {
      console.error('Error submitting campaign:', error);
      alert(`Failed to create campaign: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-base h-screen overflow-hidden flex flex-col">
      {/* Fixed App Bar - Only header */}
      <div className="flex-shrink-0 bg-neutral-base border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-9 py-3 sm:py-4">
          {/* App Bar */}
          <div className="flex items-center justify-between">
            {showAllCampaigns || showAllDrafts ? (
              <>
                <div className="flex items-center flex-1 min-w-0">
                  <IconButton
                    icon={ArrowLeftLine}
                    size="md"
                    variant="default"
                    onClick={() => {
                      setShowAllCampaigns(false);
                      setShowAllDrafts(false);
                    }}
                    className="-ml-2 mr-1"
                  />
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                    {showAllCampaigns ? 'Campaigns' : 'Draft Campaigns'}
                  </h1>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <IconButton icon={SearchLine} size="md" variant="default" />
                  <IconButton icon={MoreLine} size="md" variant="default" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Campaigns</h1>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <IconButton icon={SearchLine} size="md" variant="default" />
                  <IconButton icon={MoreLine} size="md" variant="default" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6">
        {showAllCampaigns ? (
          // All Campaigns Grid View - Updated to match Figma design
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {campaigns.length} campaigns
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {loading ? (
                // Campaign Cards Skeleton
                <>
                  {[1, 2, 3].map((i) => (
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
                      {/* Card Image2Line Skeleton */}
                      <div className="h-[216px] bg-gray-200 animate-pulse"></div>
                    </div>
                  ))}
                </>
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <Card
                    key={campaign._id}
                    variant="default"
                    className="flex-1 min-w-[300px] max-w-[400px] cursor-pointer overflow-hidden"
                    onClick={() => handleCampaignClick(campaign)}
                    padding="p-0"
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
                          {campaign.campaignName || 'Lenskart'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {campaign.createdAt
                            ? new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : '3d ago'
                          }
                        </p>
                      </div>

                      {/* Trailing Icon Button */}
                      <div className="flex items-center justify-center px-4">
                        <IconButton
                          icon={HeartLine}
                          size="md"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle favorite toggle
                          }}
                        />
                      </div>
                    </div>

                    {/* Campaign Image */}
                    <div className="h-[216px] bg-gradient-to-br from-green-700 to-green-900 relative overflow-hidden">
                      {campaign.productImages && campaign.productImages.length > 0 ? (
                        <img
                          src={campaign.productImages[0]}
                          alt={campaign.campaignName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <div className="text-center p-6">
                            <div className="text-2xl font-bold mb-2">WE CREATE</div>
                            <div className="text-xl">SMILES, NOT ADS</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <p className="text-gray-600">No campaigns found. Create your first campaign!</p>
                </div>
              )}
            </div>
          </div>
        ) : showAllDrafts ? (
          // All Draft Campaigns Grid View - Updated to match Figma design
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {getDraftCampaigns().length} draft campaigns
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {loading ? (
                // Draft Campaign Cards Skeleton
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden flex-1 min-w-[300px] max-w-[400px]">
                      {/* Card Header Skeleton */}
                      <div className="flex gap-2 items-start p-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      {/* Card Image2Line Skeleton */}
                      <div className="h-[216px] bg-gray-200 animate-pulse"></div>
                      {/* Action Buttons Skeleton */}
                      <div className="p-4 flex gap-2">
                        <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : getDraftCampaigns().length > 0 ? (
                getDraftCampaigns().map((draft) => (
                  <Card
                    key={draft._id}
                    variant="default"
                    className="flex-1 min-w-[300px] max-w-[400px] flex flex-col overflow-hidden"
                    padding="p-0"
                  >
                    {/* Eyebrow label at top */}
                    <div className="px-4 pt-4">
                      <span className="text-xs text-gray-500">
                        Draft • {draft.campaignType || 'Campaign'}
                      </span>
                    </div>

                    {/* Content Frame with Avatar and Info */}
                    <div className="flex gap-2 items-start px-4 py-3">
                      {/* Leading Avatar */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                          {draft.campaignName?.substring(0, 2).toUpperCase() || 'AB'}
                        </div>
                      </div>

                      {/* Content Leading */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {draft.campaignName || 'Draft Campaign'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Draft
                        </p>
                      </div>

                      {/* Trailing Icon Button */}
                      <div className="flex items-center justify-center px-4">
                        <IconButton
                          icon={HeartLine}
                          size="md"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCampaignClick(draft);
                          }}
                        />
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
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignClick(draft);
                        }}
                        variant="outlined"
                        size="md"
                        fullWidth
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={(e) => handleCompleteCampaign(e, draft._id)}
                        variant="primary"
                        size="md"
                        fullWidth
                      >
                        Complete Campaign
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <p className="text-gray-600">No draft campaigns found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Recent Campaigns Section - Matching Figma x=36, gap=58px from header */}
            <div className="mb-10">
              {/* Section Heading - Figma: pt-4 (16px), 18px font, view all link */}
              <div className="flex items-center justify-between pt-4 mb-[14px]">
                <h2 className="text-[18px] font-semibold text-gray-900 leading-[26px] tracking-tight">Recent Campaigns</h2>
                <button 
                  onClick={() => router.push('/brand/campaigns/all-campaigns')}
                  className="flex items-center pr-1"
                >
                  <span className="text-[16px] font-semibold text-blue-700 leading-6 tracking-[0.24px]">view all</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-[-4px]">
                    <path d="M7.75 7.75L16.25 12L7.75 16.25" stroke="#0a48c5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Campaign Cards Grid - gap between cards as per Figma */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {loading ? (
                  // Recent Campaign Cards Skeleton
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden flex-1 min-w-[300px] max-w-[365px]">
                        {/* Card Header Skeleton */}
                        <div className="flex gap-2 items-start p-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <div className="px-4">
                              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                            </div>
                            <div className="px-4">
                              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        {/* Card Image2Line Skeleton */}
                        <div className="h-[216px] bg-gray-200 animate-pulse"></div>
                      </div>
                    ))}
                  </>
                ) : getActiveCampaigns().length > 0 ? (
                  getActiveCampaigns().slice(0, 3).map((campaign) => (
                    <div 
                      key={campaign._id} 
                      className="bg-gray-100 border-2 border-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex-1 min-w-[300px] max-w-[365px] cursor-pointer"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      {/* Content Frame - Figma: gap-4 (16px), py-4 (16px) */}
                      <div className="flex gap-2 items-start p-4">
                        {/* Leading Avatar - Figma: 48x48, pl-4 */}
                        <div className="flex items-center shrink-0">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-[20px] font-semibold leading-7">
                            {campaign.campaignName?.substring(0, 2).toUpperCase() || 'AB'}
                          </div>
                        </div>

                        {/* Content Leading - Figma: flex-1, gap-2 */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <div className="px-4">
                            <h3 className="text-[20px] font-semibold text-gray-900 leading-7 tracking-tight truncate">
                              {campaign.campaignName || 'Lenskart'}
                            </h3>
                          </div>
                          <div className="px-4">
                            <p className="text-[16px] text-gray-600 leading-6 tracking-[0px]">
                              {campaign.createdAt 
                                ? new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : '3d ago'
                              }
                            </p>
                          </div>
                        </div>

                        {/* Trailing Icon Button - Figma: 48x48, px-4 */}
                        <div className="flex flex-col items-center justify-center px-4 h-[67px] w-[88px] shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle favorite toggle
                            }}
                            className="p-3 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <HeartLine className="w-6 h-6 text-gray-700" />
                          </button>
                        </div>
                      </div>

                      {/* Campaign Image2Line - Figma: h-216px */}
                      <div className="h-[216px] bg-gradient-to-br from-green-700 to-green-900 relative overflow-hidden">
                        {campaign.productImages && campaign.productImages.length > 0 ? (
                          <img 
                            src={campaign.productImages[0]} 
                            alt={campaign.campaignName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center p-6">
                              <div className="text-2xl font-bold mb-2">WE CREATE</div>
                              <div className="text-xl">SMILES, NOT ADS</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-600">No active campaigns found. Create your first campaign!</p>
                  </div>
                )}
              </div>
            </div>

        {/* New Applications Section - Matching Figma List Item design */}
        <div className="mb-10">
          {/* Section Heading - Figma: pt-4, 18px font */}
          <div className="flex items-center justify-between pt-4 mb-[14px]">
            <h2 className="text-[18px] font-semibold text-gray-900 leading-[26px] tracking-tight">New Applications</h2>
            <button 
              onClick={() => router.push('/brand/campaigns/new-applications')}
              className="flex items-center pr-1 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-[16px] font-semibold text-blue-700 leading-6 tracking-[0.24px]">view all</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-[-4px]">
                <path d="M7.75 7.75L16.25 12L7.75 16.25" stroke="#0a48c5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* List Items - Figma: white background, full width */}
          <div className="bg-neutral-base">
            {mockInfluencers.slice(0, 5).map((influencer, index) => (
              <div key={influencer.id} className="relative">
                <div className="flex items-center">
                  {/* Leading Avatar - Figma: px-4, py-1.5 (6px), 48x48 */}
                  <div className="px-4 py-1.5">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></div>
                  </div>

                  {/* Content - Figma: flex-1, pr-4, py-3 (12px) */}
                  <div className="flex-1 min-w-0 pr-4 py-3">
                    <h3 className="text-[16px] font-semibold text-gray-900 leading-6 tracking-[0.24px] mb-0.5">
                      {influencer.name}
                    </h3>
                    <p className="text-[14px] text-gray-500 leading-5 tracking-[0px] truncate">
                      {influencer.tags 
                        ? influencer.tags.slice(0, 3).join(' • ') 
                        : 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex problems and bringing ideas to life through code.'
                      }
                    </p>
                  </div>

                  {/* Trailing Button - Figma: px-4, py-3.5 (14px) */}
                  <div className="px-4 py-3.5">
                    <Button variant="outlined" size="sm">
                      portfolio
                    </Button>
                  </div>
                </div>
                
                {/* Divider - Figma: 1px gray line */}
                {index < mockInfluencers.slice(0, 5).length - 1 && (
                  <div className="h-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audience Engagement Section - New Component */}
        <div className="mb-10">
          <AudienceEngagement />
        </div>

        {/* Spending Budget Section - New Component */}
        <div className="mb-10">
          <SpendingBudget />
        </div>

        {/* Draft Campaigns Section  new testing*/}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Draft Campaigns</h2>
            <button 
              onClick={() => router.push('/brand/campaigns/all-drafts')}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              view all &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              // Draft Campaign Cards Skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-amber-50 rounded-lg overflow-hidden border border-gray-200">
                    <div className="aspect-video bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : getDraftCampaigns().length > 0 ? (
              getDraftCampaigns().slice(0, 3).map((draft) => (
                <Card key={draft._id} variant="default" className="overflow-hidden flex flex-col" padding="p-0">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden cursor-pointer" onClick={() => handleCampaignClick(draft)}>
                    {draft.productImages && draft.productImages.length > 0 ? (
                      <img src={draft.productImages[0]} alt={draft.campaignName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 text-white">
                        <div className="text-center p-6">
                          <div className="text-2xl font-bold mb-2">WE CREATE</div>
                          <div className="text-xl">SMILES, NOT ADS</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{draft.campaignName}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {draft.campaignBrief || 'No description available'}
                    </p>
                    <Button
                      onClick={(e) => handleCompleteCampaign(e, draft._id)}
                      variant="primary"
                      size="md"
                      fullWidth
                    >
                      Complete Campaign
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No draft campaigns found.</p>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-base rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CloseLine className="w-6 h-6" />
                </button>
              </div>
              
              {/* Step Indicator */}
              <div className="mt-6 flex items-center justify-between">
                <StepIndicator 
                  stepNumber={1} 
                  title="Campaign Details" 
                  status={getStepStatus(1)} 
                />
                <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                <StepIndicator 
                  stepNumber={2} 
                  title="Target Influencer" 
                  status={getStepStatus(2)} 
                />
                <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                <StepIndicator 
                  stepNumber={3} 
                  title="Preview" 
                  status={getStepStatus(3)} 
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              {renderStepContent()}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <Button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                variant="secondary"
                size="md"
              >
                Cancel
              </Button>

              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    variant="secondary"
                    size="md"
                  >
                    Previous
                  </Button>
                )}

                <Button
                  onClick={currentStep === 3 ? handleSubmit : handleNextStep}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  variant="primary"
                  size="md"
                >
                  {currentStep === 3 ? 'Launch Campaign' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-base rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the campaign "<span className="font-medium">{campaignToDelete.campaignName}</span>"?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                size="md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCampaign}
                disabled={isDeletingCampaign}
                loading={isDeletingCampaign}
                variant="tertiary"
                size="md"
              >
                Delete Campaign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail/EditLine Modal */}
    </div>
  );
};

export default AllCampaignsSection;
