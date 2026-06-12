'use client'
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, X, Upload, Check, MoreVertical, Trash2, Edit, Search, TrendingUp, UserRound } from 'lucide-react';
import { campaignApi } from '@/api/campaign-api';
import { uploadAPI } from '@/utils/api';
import { useSidebar } from '../../context/SidebarContext';

const DUMMY_CAMPAIGNS = [
  { _id: 'dummy-1', campaignName: 'Summer Vibes', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), _avatarColor: '#16A34A' },
  { _id: 'dummy-2', campaignName: 'Fit & Fresh', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), _avatarColor: '#2563EB' },
  { _id: 'dummy-3', campaignName: 'Tech Wave', createdAt: new Date(Date.now() - 86400000).toISOString(), _avatarColor: '#7C3AED' },
];

const DUMMY_APPLICATIONS = [
  { _id: 'dapp-1', name: 'Alice Chen', niche: 'Lifestyle • Beauty • Wellness' },
  { _id: 'dapp-2', name: 'Marcus Jay', niche: 'Sports • Fitness • Nutrition' },
  { _id: 'dapp-3', name: 'Sofia Park', niche: 'Fashion • Travel • Sustainability' },
];

const AllCampaignsSection = () => {
  const router = useRouter();
  const { setSidebarButtonAction, setSidebarButtonLabel } = useSidebar();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [isDeletingCampaign, setIsDeletingCampaign] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [draftCampaigns, setDraftCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
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

  // Fetch active, draft, and completed campaigns in parallel
  const fetchCampaigns = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const [activeResult, draftResult, completedResult] = await Promise.allSettled([
        campaignApi.getBrandCampaigns({}, { page, limit }),
        campaignApi.getCampaignHistory('DRAFT', { page: 1, limit: 20 }),
        campaignApi.getCampaignHistory('COMPLETED', { page: 1, limit: 20 }),
      ]);

      // Active / Published
      if (activeResult.status === 'fulfilled') {
        const { campaigns: data, pagination: pag } = activeResult.value;
        setCampaigns(data);
        setPagination({
          currentPage: pag.currentPage ?? pag.page ?? 1,
          totalPages: pag.totalPages ?? 1,
          totalItems: pag.totalItems ?? pag.total ?? 0,
          itemsPerPage: pag.itemsPerPage ?? pag.limit ?? 20,
          hasNext: pag.hasNext ?? pag.hasNextPage ?? false,
          hasPrev: pag.hasPrev ?? pag.hasPreviousPage ?? false,
        });
        // Applicants embedded in each campaign — deduplicated by user _id
        const seen = new Set();
        const embedded = data.flatMap(c =>
          (c.applicants || []).map(a => ({ ...a, campaignName: c.campaignName, campaignId: c._id }))
        ).filter(a => {
          if (seen.has(a._id)) return false;
          seen.add(a._id);
          return true;
        });
        setApplications(embedded);
      }

      // Drafts
      if (draftResult.status === 'fulfilled') {
        setDraftCampaigns(draftResult.value.campaigns);
      }

      // Completed
      if (completedResult.status === 'fulfilled') {
        setCompletedCampaigns(completedResult.value.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
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
    return campaigns.filter(c => ['active', 'published'].includes((c.status || '').toLowerCase()));
  };


  const getFilteredActiveCampaigns = () => {
    const active = getActiveCampaigns();
    if (activeFilter === 'All') return active;
    return active.filter(c =>
      (c.campaignType || '').toLowerCase() === activeFilter.toLowerCase() ||
      (c.targetInfluencer?.targetNiche || []).some(n => n.toLowerCase() === activeFilter.toLowerCase())
    );
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

  // Delete campaign handler
  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    setIsDeletingCampaign(true);
    try {
      await campaignApi.deleteCampaign(campaignToDelete._id || campaignToDelete.id);
      
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
      await campaignApi.updateCampaign(campaignId, { status: 'Active' });
      fetchCampaigns();
    } catch (error) {
      console.error('Error activating campaign:', error);
      alert(`Failed to activate campaign: ${error.message || 'Unknown error'}`);
    }
  };

  // Open campaign detail page
  const handleCampaignClick = (campaign) => {
    router.push(`/brand/campaigns/${campaign._id || campaign.id}`);
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

  const CampaignCard = ({ campaign }) => {
    const [hovered, setHovered] = useState(false);
    const campaignName = campaign.campaignName || 'Untitled Campaign';
    const initials = campaignName.substring(0, 1).toUpperCase();
    const date = campaign.createdAt
      ? new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '3d ago';
    const productImage = campaign.productImages?.[0] || null;
    const avatarBg = campaign._avatarColor || '#16A34A';
    const menuRef = useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setOpenMenuId(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div
        onClick={() => handleCampaignClick(campaign)}
        className="rounded-xl overflow-hidden cursor-pointer shrink-0 w-[300px] sm:w-[360px] transition-colors duration-200"
        style={{ backgroundColor: hovered ? '#f8fff7' : '#181818' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Content — 72px TOP, padding: 12px 4px 12px 16px per Figma */}
        <div className="h-[72px] flex items-center" style={{ padding: '12px 4px 12px 16px' }}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-medium shrink-0" style={{ backgroundColor: avatarBg }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium truncate transition-colors duration-200"
                 style={{ color: hovered ? '#1D1B20' : '#ffffff' }}>
                {campaignName}
              </p>
              <p className="text-sm truncate transition-colors duration-200"
                 style={{ color: hovered ? '#49454F' : '#9B9B9B' }}>
                {date}
              </p>
            </div>
          </div>
          {/* Three-dot menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const campaignKey = campaign._id || campaign.id;
                setOpenMenuId(openMenuId === campaignKey ? null : campaignKey);
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
              style={{ color: hovered ? '#1D1B20' : '#ffffff' }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {openMenuId === (campaign._id || campaign.id) && (
              <div className="absolute right-0 mt-1 w-44 bg-[#262626] rounded-lg shadow-lg border border-white/10 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); handleCampaignClick(campaign); setOpenMenuId(null); }}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> View/Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCampaignToDelete(campaign); setShowDeleteModal(true); setOpenMenuId(null); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                {!['active','published'].includes((campaign.status||'').toLowerCase()) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleActivateCampaign(campaign._id || campaign.id); setOpenMenuId(null); }}
                    className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-white/10 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Activate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Media — 188px BOTTOM */}
        <div
          className="h-[188px] relative overflow-hidden transition-colors duration-200"
          style={{ backgroundColor: hovered ? '#e6f0e6' : '#252525' }}
        >
          {productImage ? (
            <img src={productImage} alt={campaignName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TrendingUp className="w-12 h-12" style={{ color: hovered ? '#16A34A' : 'rgba(255,255,255,0.1)' }} />
            </div>
          )}
        </div>
      </div>
    );
  };


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
      // Upload product images first
      let uploadedImageUrls = [];
      if (formData.productImages && formData.productImages.length > 0) {
        // Filter file objects from the productImages array
        const imageFiles = formData.productImages.filter(img => img instanceof File);
        if (imageFiles.length > 0) {
          const uploadResponse = await uploadAPI.uploadMultipleCampaignImages(imageFiles, 'campaign-assets');
          uploadedImageUrls = uploadResponse.urls || uploadResponse.imageUrls || [];
        }
        // Keep URLs that were already uploaded
        const existingUrls = formData.productImages.filter(img => typeof img === 'string');
        uploadedImageUrls = [...uploadedImageUrls, ...existingUrls];
      }

      // Transform formData to match the API structure
      const transformedData = {
        productImages: uploadedImageUrls, // Use uploaded URLs
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

      await campaignApi.createCampaign(transformedData);
      
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

  const cardSkeleton = [1, 2, 3].map(i => (
    <div key={i} className="bg-[#181818] rounded-xl overflow-hidden shrink-0 w-[300px] sm:w-[360px]">
      <div className="h-[188px] bg-[#252525] animate-pulse"></div>
      <div className="h-[72px] flex items-center px-3 gap-3">
        <div className="w-10 h-10 bg-[#252525] rounded-full animate-pulse shrink-0"></div>
        <div className="flex-1">
          <div className="h-4 bg-[#252525] rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-3 bg-[#252525] rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="bg-[#000201] min-h-full pr-5 py-6 pl-0" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Page Header: title + search + new campaign */}
      <div className="pr-0 pb-4 flex items-center justify-between gap-4 bg-[#000201]" style={{ paddingLeft: 0 }}>
        <h2
          className="shrink-0 capitalize"
          style={{
            color: '#FFF',
            fontFamily: 'var(--font-bricolage-grotesque)',
            fontSize: 24,
            fontWeight: 400,
            lineHeight: '120%',
          }}
        >
          Campaigns
        </h2>
        <div className="flex items-center gap-3">
          {/* Search bar — same as dashboard */}
          <div
            className="relative cursor-pointer rounded-full bg-[linear-gradient(270deg,#16A34A_0%,#FFFFFF_52.88%,#16A34A_100%)] p-[1px]"
            style={{ width: 294, boxShadow: '0 0 28px rgba(22, 163, 74, 0.45)' }}
          >
            <div className="flex h-[45px] items-center rounded-full bg-[#010a04]/90 pl-6 pr-1 py-2 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 20px rgba(22, 163, 74, 0.1)' }}>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="flex-1 min-w-0 bg-transparent text-left text-[15px] leading-[1.6] text-[#9B9B9B] placeholder:text-[#9B9B9B] outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button className="flex-shrink-0 w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center hover:bg-[#12803A] transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          {/* Start New Campaign pill button */}
          <button
            onClick={() => router.push('/brand/campaigns/create-campaign')}
            className="bg-[#16A34A] text-white px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap hover:bg-green-700 transition-colors h-[45px] flex items-center"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Start New Campaign
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pr-0 pb-8" style={{ paddingLeft: 0 }}>

        {/* Recent Campaigns */}
        <div className="mb-8 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-normal text-white capitalize leading-[120%]" style={{ fontFamily: 'Inter, sans-serif' }}>Recent Campaigns</h3>
            <button onClick={() => router.push('/brand/campaigns/all-campaigns')} className="flex items-center gap-1.5">
              <span className="text-[#16A34A] text-sm font-medium">View All</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
              </svg>
            </button>
          </div>

          {/* Filter tabs — px-6 py-1 gap-3 per Figma, inactive = bg-white/[0.12] */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
            {['All', 'Sports', 'Lifestyle', 'Fashion', 'Travelling'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-1 rounded-full text-sm font-normal whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-white/[0.12] text-white hover:bg-white/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {loading ? cardSkeleton : getFilteredActiveCampaigns().length > 0 ? (
              getFilteredActiveCampaigns().slice(0, 5).map((campaign) => (
                <CampaignCard key={campaign._id || campaign.id} campaign={campaign} />
              ))
            ) : (
              DUMMY_CAMPAIGNS.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))
            )}
          </div>
        </div>

        {/* New Applications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-normal text-white capitalize leading-[120%]" style={{ fontFamily: 'Inter, sans-serif' }}>New Applications</h3>
            <button onClick={() => router.push('/brand/campaigns/new-applications')} className="flex items-center gap-0.5">
              <span className="text-[#16A34A] text-sm font-medium">View All</span>
              <ChevronRight className="w-4 h-4 text-[#16A34A]" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="bg-[#262626] rounded-xl h-[68px] animate-pulse" />
              ))
            ) : applications.length > 0 ? (
              applications.slice(0, 4).map((app, idx) => {
                // Embedded applicants: { _id, name, username, email, profilePicture?, niche? }
                const name = app.name || app.username || 'Influencer';
                const niche = Array.isArray(app.niche)
                  ? app.niche.slice(0, 3).join(' • ')
                  : (app.niche || app.campaignName || '');
                const initials = name.charAt(0).toUpperCase();
                return (
                  <div key={`${app._id || app.id}-${idx}`} className="bg-[#262626] rounded-xl h-[68px] flex items-center px-4 justify-between">
                    {/* Avatar + text — gap-2 per Figma */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {app.profilePicture ? (
                        <img src={app.profilePicture} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center text-white text-base font-medium shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white text-base font-normal truncate">{name}</p>
                        <p className="text-[#9B9B9B] text-xs truncate">{niche}</p>
                      </div>
                    </div>
                    {/* View profile button — w-[100px] h-7 rounded-full per Figma */}
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/brand/influencers/${app._id || app.id}`); }}
                      className="bg-[#16A34A] text-white text-xs w-[100px] h-7 rounded-full flex items-center justify-center gap-1 shrink-0 hover:bg-green-700 transition-colors ml-3"
                    >
                      <UserRound className="w-3 h-3" />
                      <span>View profile</span>
                    </button>
                  </div>
                );
              })
            ) : (
              DUMMY_APPLICATIONS.map((app, idx) => {
                const initials = app.name.charAt(0).toUpperCase();
                return (
                  <div key={app._id || idx} className="bg-[#262626] rounded-xl h-[68px] flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center text-white text-base font-medium shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-base font-normal truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{app.name}</p>
                        <p className="text-[#9B9B9B] text-xs truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{app.niche}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="bg-[#16A34A] text-white text-xs w-[100px] h-7 rounded-full flex items-center justify-center gap-1 shrink-0 hover:bg-green-700 transition-colors ml-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <UserRound className="w-3 h-3" />
                      <span>View profile</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Previous Campaigns */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-normal text-white capitalize leading-[120%]" style={{ fontFamily: 'Inter, sans-serif' }}>Previous Campaigns</h3>
            <button onClick={() => router.push('/brand/campaigns/previous-campaigns')} className="flex items-center gap-0.5">
              <span className="text-[#16A34A] text-sm font-medium">View All</span>
              <ChevronRight className="w-4 h-4 text-[#16A34A]" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {loading ? cardSkeleton : completedCampaigns.length > 0 ? (
              completedCampaigns.slice(0, 5).map((campaign) => (
                <CampaignCard key={campaign._id || campaign.id} campaign={campaign} />
              ))
            ) : (
              <p className="text-[#9B9B9B] text-sm py-4">No previous campaigns yet.</p>
            )}
          </div>
        </div>

        {/* Draft Campaigns */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-normal text-white capitalize leading-[120%]" style={{ fontFamily: 'Inter, sans-serif' }}>Draft Campaigns</h3>
            <button onClick={() => router.push('/brand/campaigns/all-drafts')} className="flex items-center gap-0.5">
              <span className="text-[#16A34A] text-sm font-medium">View All</span>
              <ChevronRight className="w-4 h-4 text-[#16A34A]" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {loading ? cardSkeleton : draftCampaigns.length > 0 ? (
              draftCampaigns.slice(0, 5).map((campaign) => (
                <CampaignCard key={campaign._id || campaign.id} campaign={campaign} />
              ))
            ) : (
              <p className="text-[#9B9B9B] text-sm py-4">No draft campaigns found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Create Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <StepIndicator stepNumber={1} title="Campaign Details" status={getStepStatus(1)} />
                <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                <StepIndicator stepNumber={2} title="Target Influencer" status={getStepStatus(2)} />
                <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                <StepIndicator stepNumber={3} title="Preview" status={getStepStatus(3)} />
              </div>
            </div>
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              {renderStepContent()}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg font-medium ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={currentStep === 3 ? handleSubmit : handleNextStep}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
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
          <div className="bg-[#1E1E1E] rounded-lg max-w-md w-full p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-[#9B9B9B] mb-6">
              Are you sure you want to delete "<span className="font-medium text-white">{campaignToDelete.campaignName}</span>"?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                disabled={isDeletingCampaign}
                className={`px-4 py-2 rounded-lg font-medium ${isDeletingCampaign ? 'bg-red-400 text-white cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              >
                {isDeletingCampaign ? 'Deleting...' : 'Delete Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCampaignsSection;
