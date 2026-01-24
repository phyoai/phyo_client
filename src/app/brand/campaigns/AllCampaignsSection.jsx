'use client'
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Upload, Calendar, Check, Users, MoreVertical, Trash2, Edit, Search, Heart, TrendingUp } from 'lucide-react';
import { campaignAPI } from '../../../utils/api';
import { useSidebar } from '../../context/SidebarContext';

const AllCampaignsSection = () => {
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
    // Set the button action to open the create campaign modal
    setSidebarButtonAction(() => () => setShowModal(true));
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
    try {
      // Fetch full campaign details
      const response = await campaignAPI.getCampaignById(campaign._id);
      setSelectedCampaign(response.data);
      setShowDetailModal(true);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      alert('Failed to load campaign details');
    }
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
        {status === 'completed' ? <Check className="w-4 h-4" /> : stepNumber}
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
        className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer ${campaign.isGrayed ? 'opacity-50' : ''}`}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === campaign._id ? null : campaign._id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
                
                {openMenuId === campaign._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailClick();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      View/Edit Campaign
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
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
                        <Check className="w-4 h-4" />
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
                    console.error('Image failed to load:', productImage);
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
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-lg flex items-center justify-center">
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-600" />
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
                <button
                  type="button"
                  onClick={handleAddReel}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1">
                {formData.reels.map((url, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="truncate flex-1 text-xs text-gray-700">{url}</span>
                    <button type="button" onClick={() => handleRemoveReel(idx)} className="text-red-500 text-xs">Remove</button>
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
                placeholder="Instagram/YouTube"
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
    <div className="bg-[#FFFFFF] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {(showAllCampaigns || showAllDrafts) && (
              <button 
                onClick={() => {
                  setShowAllCampaigns(false);
                  setShowAllDrafts(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-2xl font-semibold text-gray-900">
              {showAllCampaigns ? 'All Campaigns' : showAllDrafts ? 'All Draft Campaigns' : 'Campaigns'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {showAllCampaigns ? (
          // All Campaigns Grid View
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {campaigns.length} campaigns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading campaigns...</p>
                </div>
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <div key={campaign._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      {/* Eyebrow label */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs text-gray-600">Eyebrow</span>
                      </div>
                      
                      {/* Campaign image */}
                      <div className="aspect-video bg-gradient-to-br from-green-700 to-green-900 relative overflow-hidden">
                        {campaign.productImages && campaign.productImages.length > 0 ? (
                          <img src={campaign.productImages[0]} alt={campaign.campaignName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center p-6">
                              <div className="text-2xl font-bold mb-2">WE CREATE</div>
                              <div className="text-xl">SMILES, NOT ADS</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Header with avatar and badge */}
                      <div className="absolute top-16 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {campaign.campaignName?.substring(0, 2).toUpperCase() || 'AB'}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{campaign.campaignName || 'Lenskart'}</h3>
                            <p className="text-xs text-gray-500">3d ago</p>
                          </div>
                        </div>
                        <div className="bg-yellow-400 p-2 rounded-full">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="p-3 flex justify-end">
                      <button 
                        onClick={() => handleCampaignClick(campaign)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">No campaigns found. Create your first campaign!</p>
                </div>
              )}
            </div>
          </div>
        ) : showAllDrafts ? (
          // All Draft Campaigns Grid View
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {getDraftCampaigns().length} draft campaigns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading draft campaigns...</p>
                </div>
              ) : getDraftCampaigns().length > 0 ? (
                getDraftCampaigns().map((draft) => (
                  <div key={draft._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      {/* Eyebrow label */}
                      <div className="absolute top-3 left-3 bg-gray-400/90 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                        <span className="text-xs text-white font-medium">Draft</span>
                      </div>
                      
                      {/* Image Section */}
                      <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                        {draft.productImages && draft.productImages.length > 0 ? (
                          <img src={draft.productImages[0]} alt={draft.campaignName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center p-6">
                              <div className="text-2xl font-bold mb-2">DRAFT</div>
                              <div className="text-xl">CAMPAIGN</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Campaign Info Overlay */}
                      <div className="absolute top-16 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {draft.campaignName?.substring(0, 2).toUpperCase() || 'DR'}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{draft.campaignName || 'Draft Campaign'}</h3>
                            <p className="text-xs text-gray-500">Draft</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-3 flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignClick(draft);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={(e) => handleCompleteCampaign(e, draft._id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Complete Campaign
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">No draft campaigns found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Recent Campaigns Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
                <button 
                  onClick={() => setShowAllCampaigns(true)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  view all &gt;
                </button>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading campaigns...</p>
              </div>
            ) : getActiveCampaigns().length > 0 ? (
              getActiveCampaigns().slice(0, 3).map((campaign) => (
                <div key={campaign._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCampaignClick(campaign)}>
                  <div className="p-4 flex items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {campaign.campaignName?.substring(0, 2).toUpperCase() || 'AB'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{campaign.campaignName || 'Lenskart'}</h3>
                        <p className="text-xs text-gray-500">3d ago</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-green-700 to-green-900 relative overflow-hidden">
                    {campaign.productImages && campaign.productImages.length > 0 ? (
                      <img src={campaign.productImages[0]} alt={campaign.campaignName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center p-6">
                          <div className="text-2xl font-bold mb-2">WE CREATE</div>
                          <div className="text-xl">SMILES, NOT ADS</div>
                          <div className="mt-4 text-sm opacity-80">Campaign Preview</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No active campaigns found. Create your first campaign!</p>
              </div>
            )}
          </div>
        </div>

        {/* New Applications Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">New Applications</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              view all &gt;
            </button>
          </div>

          <div className="space-y-3">
            {mockInfluencers.slice(0, 5).map((influencer) => (
              <div key={influencer.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{influencer.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {influencer.tags ? influencer.tags.slice(0, 3).join(' • ') : 'Influencer description'}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 whitespace-nowrap">
                  portfolio
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Engagement Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Audience Engagement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Likes Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">9.2K Likes</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    24% vs last month
                  </div>
                </div>
              </div>
              <div className="h-48 relative">
                {/* Simple area chart visualization */}
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  <defs>
                    <linearGradient id="likesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,80 L 50,60 L 100,75 L 150,50 L 200,70 L 250,45 L 300,55 L 350,35 L 400,40 L 400,150 L 0,150 Z" fill="url(#likesGradient)" />
                  <path d="M 0,80 L 50,60 L 100,75 L 150,50 L 200,70 L 250,45 L 300,55 L 350,35 L 400,40" stroke="#10b981" strokeWidth="2" fill="none" />
                  <circle cx="250" cy="45" r="4" fill="#10b981" />
                  <circle cx="150" cy="50" r="4" fill="white" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>July</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

            {/* Saves Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">3.2K saves</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    24% vs last month
                  </div>
                </div>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[5200, 3800, 4500, 2800, 4200, 3500].map((value, idx) => (
                  <div key={idx} className="flex-1 bg-green-600 rounded-t" style={{ height: `${(value / 8000) * 100}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>July</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

            {/* Views Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">14K Views</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    24% vs last month
                  </div>
                </div>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[6500, 3800, 4200, 2500, 3800, 3200].map((value, idx) => (
                  <div key={idx} className="flex-1 bg-green-700 rounded-t" style={{ height: `${(value / 8000) * 100}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>July</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>            {/* Comments Chart */}
    <span>Dec</span>
  </div>
</div>
{/* Comments Chart */}
<div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                </div>
              </div>
              <div className="h-48 relative">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  <defs>
                    <linearGradient id="commentsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6b7280" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#6b7280" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,90 L 50,70 L 100,85 L 150,65 L 200,75 L 250,55 L 300,70 L 350,50 L 400,45 L 400,150 L 0,150 Z" fill="url(#commentsGradient)" />
                  <path d="M 0,90 L 50,70 L 100,85 L 150,65 L 200,75 L 250,55 L 300,70 L 350,50 L 400,45" stroke="#6b7280" strokeWidth="2" fill="none" />
                  <circle cx="250" cy="55" r="4" fill="white" stroke="#6b7280" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>July</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Budget Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending Budget</h2>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">₹124,657.80</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  24% vs last month
                </div>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[5500, 5200, 3800, 5400, 3600, 2800, 3700, 3900].map((value, idx) => (
                <div key={idx} className={`flex-1 ${idx % 2 === 0 ? 'bg-green-700' : 'bg-green-500'} rounded-t`} style={{ height: `${(value / 8000) * 100}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>July</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Draft Campaigns Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Draft Campaigns</h2>
            <button 
              onClick={() => setShowAllDrafts(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              view all &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading draft campaigns...</p>
              </div>
            ) : getDraftCampaigns().length > 0 ? (
              getDraftCampaigns().slice(0, 3).map((draft) => (
                <div key={draft._id} className="bg-amber-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
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
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{draft.campaignName}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {draft.campaignBrief || 'No description available'}
                    </p>
                    <button 
                      onClick={(e) => handleCompleteCampaign(e, draft._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 w-full"
                    >
                      Complete Campaign
                    </button>
                  </div>
                </div>
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
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
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isSubmitting 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isSubmitting 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                )}
                
                <button
                  onClick={currentStep === 3 ? handleSubmit : handleNextStep}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : currentStep === 3 ? 'Launch Campaign' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the campaign "<span className="font-medium">{campaignToDelete.campaignName}</span>"?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                disabled={isDeletingCampaign}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDeletingCampaign 
                    ? 'bg-red-400 text-white cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isDeletingCampaign ? 'Deleting...' : 'Delete Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail/Edit Modal */}
      {showDetailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Campaign Details</h2>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  selectedCampaign.status === 'Active' ? 'text-green-600 bg-green-50' :
                  selectedCampaign.status === 'Draft' ? 'text-gray-600 bg-gray-50' :
                  selectedCampaign.status === 'Completed' ? 'text-blue-600 bg-blue-50' :
                  'text-orange-600 bg-orange-50'
                }`}>
                  {selectedCampaign.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isEditMode && (
                  <button
                    onClick={handleEnableEdit}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit Campaign"
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    setIsEditMode(false);
                    setSelectedCampaign(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedCampaign.productImages?.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Name - EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name {isEditMode && <span className="text-green-600">✎ Editable</span>}
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={selectedCampaign.campaignName}
                      onChange={(e) => handleUpdateField('campaignName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{selectedCampaign.campaignName}</p>
                  )}
                </div>

                {/* Campaign Type - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <p className="text-gray-900 capitalize">{selectedCampaign.campaignType}</p>
                </div>

                {/* Campaign Brief - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Brief</label>
                  <p className="text-gray-900">{selectedCampaign.campaignBrief}</p>
                </div>

                {/* Status - EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status {isEditMode && <span className="text-green-600">✎ Editable</span>}
                  </label>
                  {isEditMode ? (
                    <select
                      value={selectedCampaign.status}
                      onChange={(e) => handleUpdateField('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{selectedCampaign.status}</p>
                  )}
                </div>

                {/* Compensation - EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compensation {isEditMode && <span className="text-green-600">✎ Editable</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                      {isEditMode ? (
                        <select
                          value={selectedCampaign.compensation.type}
                          onChange={(e) => handleUpdateNestedField('compensation', 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Monetary">Monetary</option>
                          <option value="Barter/Gifting">Barter/Gifting</option>
                          <option value="Affiliate/Commission">Affiliate/Commission</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{selectedCampaign.compensation.type}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Amount</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={selectedCampaign.compensation.amount}
                          onChange={(e) => handleUpdateNestedField('compensation', 'amount', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCampaign.compensation.currency} {selectedCampaign.compensation.amount}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      {isEditMode ? (
                        <textarea
                          value={selectedCampaign.compensation.description}
                          onChange={(e) => handleUpdateNestedField('compensation', 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={2}
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCampaign.compensation.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Budget - EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget {isEditMode && <span className="text-green-600">✎ Editable</span>}
                  </label>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={selectedCampaign.budget}
                      onChange={(e) => handleUpdateField('budget', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{selectedCampaign.compensation?.currency || 'INR'} {selectedCampaign.budget}</p>
                  )}
                </div>

                {/* Deliverables - EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deliverables {isEditMode && <span className="text-green-600">✎ Editable</span>}
                  </label>
                  {isEditMode ? (
                    <textarea
                      value={Array.isArray(selectedCampaign.deliverables) ? selectedCampaign.deliverables.join(', ') : selectedCampaign.deliverables}
                      onChange={(e) => handleUpdateField('deliverables', e.target.value.split(',').map(d => d.trim()))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Separate deliverables with commas"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-gray-900">
                      {Array.isArray(selectedCampaign.deliverables) 
                        ? selectedCampaign.deliverables.map((d, idx) => <li key={idx}>{d}</li>)
                        : <li>{selectedCampaign.deliverables}</li>
                      }
                    </ul>
                  )}
                </div>

                {/* Timelines - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Application Deadline</p>
                      <p className="text-gray-900">{new Date(selectedCampaign.timelines.applicationDeadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Campaign Start</p>
                      <p className="text-gray-900">{new Date(selectedCampaign.timelines.campaignStartDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Campaign End</p>
                      <p className="text-gray-900">{new Date(selectedCampaign.timelines.campaignEndDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Target Influencer - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Influencer Criteria</label>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p><span className="font-medium">Number of Influencers:</span> {selectedCampaign.targetInfluencer.numberOfInfluencers}</p>
                    <p><span className="font-medium">Niche:</span> {selectedCampaign.targetInfluencer.targetNiche.join(', ')}</p>
                    <p><span className="font-medium">Follower Range:</span> {selectedCampaign.targetInfluencer.followerCount.min.toLocaleString()} - {selectedCampaign.targetInfluencer.followerCount.max.toLocaleString()}</p>
                    <p><span className="font-medium">Countries:</span> {selectedCampaign.targetInfluencer.countries.join(', ')}</p>
                    <p><span className="font-medium">Gender:</span> {selectedCampaign.targetInfluencer.gender.join(', ')}</p>
                    <p><span className="font-medium">Age Range:</span> {selectedCampaign.targetInfluencer.ageRange.min} - {selectedCampaign.targetInfluencer.ageRange.max}</p>
                  </div>
                </div>

                {/* Number of Live Posts - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Live Posts</label>
                  <p className="text-gray-900">{selectedCampaign.numberOfLivePosts}</p>
                </div>

                {/* Applicants & Selected Influencers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Applicants</label>
                    <p className="text-2xl font-bold text-blue-600">{selectedCampaign.applicants.length}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected Influencers</label>
                    <p className="text-2xl font-bold text-green-600">{selectedCampaign.selectedInfluencers.length}</p>
                  </div>
                </div>

                {/* Suggested Influencers */}
                {selectedCampaign.suggestedInfluencers && selectedCampaign.suggestedInfluencers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Suggested Influencers</label>
                    <div className="space-y-2">
                      {selectedCampaign.suggestedInfluencers.map((influencer, idx) => (
                        <div key={idx} className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900">@{influencer.username}</p>
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              {influencer.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{influencer.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUpdates}
                    disabled={isUpdating}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      isUpdating 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCampaign(null);
                  }}
                  className="ml-auto px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
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