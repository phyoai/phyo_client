'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, X, Upload, Calendar, Check, Users } from 'lucide-react';
import { campaignAPI } from '../../../../utils/api';

const CreateCampaignPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState(['Brand Awareness']);
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
    budget: '',
    numberOfLivePosts: '',
    reels: [],
    // Deliverables counts
    instagramReels: 0,
    instagramStories: 0,
    instagramPosts: 0,
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
  const [reelInput, setReelInput] = useState('');

  const handleDeliverableChange = (type, delta) => {
    setFormData(prev => {
      const currentValue = prev[type] || 0;
      const newValue = Math.max(0, currentValue + delta);
      return {
        ...prev,
        [type]: newValue
      };
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      productImages: images
    }));
  };

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

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    router.push('/user/campaigns');
  };

  const handleBack = () => {
    router.push('/user/campaigns');
  };

  const handleToggleCampaignType = (type) => {
    setSelectedCampaignTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Details Step
        return (
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => handleInputChange('campaignName', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                placeholder="Enter campaign name"
              />
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Product Images
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
                className="bg-[#f0f0f0] rounded-xl h-[250px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#e8e8e8] transition-colors"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <p className="text-base text-[#242527] mb-2">
                  Drag files here to upload..
                </p>
                <button
                  type="button"
                  className="px-4 py-2 border border-[#43573b] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current && fileInputRef.current.click();
                  }}
                >
                  Browse Files
                </button>
              </div>
              {formData.productImages && formData.productImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {formData.productImages.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img src={img.url || img} alt={`Product ${idx + 1}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Type */}
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Campaign Type
              </label>
              <div className="flex flex-wrap gap-2 py-2 overflow-x-auto">
                {campaignTypeOptions.map((type, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleCampaignType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                      selectedCampaignTypes.includes(type)
                        ? 'bg-[#43573b] text-white'
                        : 'bg-[#fbfcfa] border border-[#f4f6f1] text-[#242527] hover:bg-[#f4f6f1]'
                    }`}
                  >
                    {type}
                    {selectedCampaignTypes.includes(type) && (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Campaign Brief Step
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Campaign Brief
              </label>
              <textarea
                value={formData.campaignBrief}
                onChange={(e) => handleInputChange('campaignBrief', e.target.value)}
                rows={12}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                placeholder="Describe your campaign objectives, messaging, target audience, and key requirements..."
              />
            </div>
          </div>
        );

      case 3: // Deliverables Step
        return (
          <div className="space-y-4">
            {/* Instagram Reels */}
            <div className="bg-white flex items-center pl-4">
              <div className="flex-1 flex items-center justify-center pr-4 py-3">
                <p className="text-base font-semibold text-[#242527]">Instagram Reels</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center px-2 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeliverableChange('instagramReels', -1)}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.16667 10H15.8333" stroke="#242527" strokeWidth="1.66667" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span className="text-xl font-semibold text-[#242527] w-6 text-center">
                      {formData.instagramReels}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeliverableChange('instagramReels', 1)}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="#242527" strokeWidth="1.66667" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Stories */}
            <div className="bg-white flex items-center pl-4">
              <div className="flex-1 flex items-center justify-center pr-4 py-3">
                <p className="text-base font-semibold text-[#242527]">Instagram Stories</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center px-2 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeliverableChange('instagramStories', -1)}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.16667 10H15.8333" stroke="#242527" strokeWidth="1.66667" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span className="text-xl font-semibold text-[#242527] w-6 text-center">
                      {formData.instagramStories}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeliverableChange('instagramStories', 1)}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="#242527" strokeWidth="1.66667" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Post */}
            <div className="bg-white flex items-center pl-4">
              <div className="flex-1 flex items-center justify-center pr-4 py-3">
                <p className="text-base font-semibold text-[#242527]">Instagram Post</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center px-2 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeliverableChange('instagramPosts', -1)}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.16667 10H15.8333" stroke="#242527" strokeWidth="1.66667" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span className="text-xl font-semibold text-[#242527] w-6 text-center">
                      {formData.instagramPosts}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeliverableChange('instagramPosts', 1)}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="#242527" strokeWidth="1.66667" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex items-center gap-2 px-4 py-6 text-base font-semibold text-[#333]">
              <span>Total:</span>
              <div className="flex items-center gap-1">
                <span>{formData.instagramPosts}</span>
                <span>Post,</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{formData.instagramStories}</span>
                <span>Stories,</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{formData.instagramReels}</span>
                <span>Reels</span>
              </div>
            </div>
          </div>
        );

      case 4: // Budget Step
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Campaign Budget (USD)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                placeholder="500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-4">
                Compensation Type
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
                  <span className="text-sm">Monetary</span>
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
                  <span className="text-sm">Barter/Gifting</span>
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
                  <span className="text-sm">Affiliate/Commission</span>
                </label>
              </div>
              
              {formData.compensation === 'Monetary' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.compensationAmount}
                      onChange={(e) => handleInputChange('compensationAmount', e.target.value)}
                      className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                      placeholder="500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Currency</label>
                    <select
                      value={formData.compensationCurrency}
                      onChange={(e) => handleInputChange('compensationCurrency', e.target.value)}
                      className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
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
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] mt-3"
                placeholder="Enter compensation details..."
              />
            </div>
          </div>
        );

      case 5: // Timeline Step
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Campaign Start Date
              </label>
              <input
                type="date"
                value={formData.campaignStartDate}
                onChange={(e) => handleInputChange('campaignStartDate', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Campaign End Date
              </label>
              <input
                type="date"
                value={formData.campaignEndDate}
                onChange={(e) => handleInputChange('campaignEndDate', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
              />
            </div>
          </div>
        );

      case 6: // Influencer Target Step
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                How many influencers you want to hire
              </label>
              <input
                type="number"
                value={formData.influencerCount}
                onChange={(e) => handleInputChange('influencerCount', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                placeholder="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Target Niche
              </label>
              <select
                value={formData.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
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
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Follower Count Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={formData.followerCountMin}
                    onChange={(e) => handleInputChange('followerCountMin', e.target.value)}
                    className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={formData.followerCountMax}
                    onChange={(e) => handleInputChange('followerCountMax', e.target.value)}
                    className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Countries
              </label>
              <input
                type="text"
                value={formData.countries}
                onChange={(e) => handleInputChange('countries', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                placeholder="India"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#242527] mb-2">
                Age Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={formData.ageRangeMin}
                    onChange={(e) => handleInputChange('ageRangeMin', e.target.value)}
                    className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
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
                    className="w-full px-4 py-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b]"
                    placeholder="35"
                    min="13"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Review & Publish Step
        return (
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <h2 className="text-3xl font-bold text-[#242527] mb-2">
                {formData.campaignName || 'Campaign Name'}
              </h2>
              
              {/* Campaign Brief */}
              <p className="text-base text-[#6b7280] leading-relaxed">
                {formData.campaignBrief || 'No campaign brief provided'}
              </p>
            </div>

            {/* Product Images Carousel */}
            {formData.productImages && formData.productImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {formData.productImages.slice(0, 3).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="flex-shrink-0 w-[240px] h-[200px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <img 
                      src={img.url || img} 
                      alt={`Product ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Campaign Details Grid */}
            <div className="grid grid-cols-1 gap-5">
              {/* Campaign Goal */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-[#242527] mb-2 uppercase tracking-wide">Campaign Goal</h3>
                <p className="text-base text-[#6b7280]">
                  {formData.campaignBrief 
                    ? formData.campaignBrief.split('.')[0] + '.' 
                    : 'Get creators to drive trial for our new product.'}
                </p>
              </div>

              {/* Campaign Type */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-[#242527] mb-3 uppercase tracking-wide">Campaign Type</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCampaignTypes.map((type, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-[#242527] mb-3 uppercase tracking-wide">Age Group</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#6b7280]">Min:</span>
                    <span className="text-base font-semibold text-[#242527]">{formData.ageRangeMin || '18'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#6b7280]">Max:</span>
                    <span className="text-base font-semibold text-[#242527]">{formData.ageRangeMax || '35'}</span>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-[#242527] mb-3 uppercase tracking-wide">Deliverables</h3>
                <div className="flex items-center gap-6">
                  {formData.instagramStories > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#6b7280]">Stories:</span>
                      <span className="text-base font-semibold text-[#242527]">{formData.instagramStories}</span>
                    </div>
                  )}
                  {formData.instagramPosts > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#6b7280]">Posts:</span>
                      <span className="text-base font-semibold text-[#242527]">{formData.instagramPosts}</span>
                    </div>
                  )}
                  {formData.instagramReels > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#6b7280]">Reels:</span>
                      <span className="text-base font-semibold text-[#242527]">{formData.instagramReels}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compensation */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-[#242527] mb-3 uppercase tracking-wide">Compensation</h3>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#6b7280]">Amount:</span>
                    <span className="text-base font-semibold text-[#242527]">
                      {formData.compensationAmount 
                        ? `₹${Number(formData.compensationAmount).toLocaleString('en-IN')}` 
                        : '₹10,000'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#6b7280]">Type:</span>
                    <span className="text-base font-semibold text-[#242527]">{formData.compensation || 'Paid'}</span>
                  </div>
                </div>
              </div>

              {/* Countries */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-semibold text-[#242527] mb-2 uppercase tracking-wide">Countries</h3>
                <p className="text-base text-[#6b7280]">
                  {formData.countries || 'India, USA, UK, France and 10 others.'}
                </p>
              </div>

              {/* Interests/Niche */}
              <div>
                <h3 className="text-sm font-semibold text-[#242527] mb-3 uppercase tracking-wide">Interests/Niche</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.niche ? (
                    <span className="inline-flex items-center px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151]">
                      {formData.niche}
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151]">
                        Life Style
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151]">
                        Fitness
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151]">
                        Health
                      </span>
                    </>
                  )}
                </div>
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
    if (!formData.campaignName || !formData.campaignBrief) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build deliverables array
      const deliverables = [];
      if (formData.instagramReels > 0) {
        deliverables.push(`${formData.instagramReels} Instagram Reels`);
      }
      if (formData.instagramStories > 0) {
        deliverables.push(`${formData.instagramStories} Instagram Stories`);
      }
      if (formData.instagramPosts > 0) {
        deliverables.push(`${formData.instagramPosts} Instagram Posts`);
      }

      const transformedData = {
        productImages: formData.productImages,
        campaignName: formData.campaignName,
        campaignType: selectedCampaignTypes.join(', '),
        campaignBrief: formData.campaignBrief,
        deliverables: deliverables.length > 0 ? deliverables : ['No deliverables specified'],
        compensation: {
          type: formData.compensation,
          amount: formData.compensationAmount ? parseInt(formData.compensationAmount) : 0,
          currency: formData.compensationCurrency,
          description: formData.compensationDetails
        },
        budget: formData.budget ? parseInt(formData.budget) : 0,
        timelines: {
          applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : new Date().toISOString(),
          campaignStartDate: formData.campaignStartDate ? new Date(formData.campaignStartDate).toISOString() : new Date().toISOString(),
          campaignEndDate: formData.campaignEndDate ? new Date(formData.campaignEndDate).toISOString() : new Date().toISOString()
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
      router.push('/user/campaigns');
      
    } catch (error) {
      console.error('Error submitting campaign:', error);
      alert(`Failed to create campaign: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define the 7 steps based on Figma design
  const steps = [
    { number: 1, title: 'Details' },
    { number: 2, title: 'Campaign Brief' },
    { number: 3, title: 'Deliverables' },
    { number: 4, title: 'Budget' },
    { number: 5, title: 'Timeline' },
    { number: 6, title: 'Influencer Target' },
    { number: 7, title: 'Review & Publish' }
  ];

  const campaignTypeOptions = [
    'Brand Awareness',
    'Product Launch',
    'Content Creation',
    'Sales & Promotion',
    'Event Coverage',
    'UGC Generation',
    'App Install',
    'Other'
  ];

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* Fixed App Bar */}
      <div className="bg-white flex items-center justify-between px-4 py-2 shrink-0 border-b border-gray-100 sticky top-0 z-20">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-[#242527] flex-1 px-2">
          New Campaign
        </h1>

        {/* Menu Button */}
        <button
          type="button"
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Fixed Progress Steps */}
      <div className="bg-white px-9 py-4 shrink-0 sticky top-[60px] z-10 border-b border-gray-50">
        <div className="max-w-5xl mx-auto px-10">
          <div className="flex items-start justify-between relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 relative">
                {/* Connecting Line to Previous Step */}
                {index > 0 && (
                  <div 
                    className="absolute top-[18px] right-1/2 w-full h-[2px]"
                    style={{
                      backgroundColor: index <= currentStep - 1 ? '#43573b' : '#eceeeb',
                      zIndex: 0
                    }}
                  />
                )}
                
                {/* Connecting Line to Next Step */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute top-[18px] left-1/2 w-full h-[2px]"
                    style={{
                      backgroundColor: index < currentStep - 1 ? '#43573b' : '#eceeeb',
                      zIndex: 0
                    }}
                  />
                )}
                
                {/* Step Circle */}
                <div 
                  className="flex items-center justify-center w-9 h-9 rounded-full text-base font-semibold shrink-0 relative"
                  style={{
                    backgroundColor: index < currentStep - 1 || index === currentStep - 1 ? '#43573b' : '#eceeeb',
                    color: index < currentStep - 1 || index === currentStep - 1 ? 'white' : '#242527',
                    zIndex: 10
                  }}
                >
                  {step.number}
                </div>
                
                {/* Step Label */}
                <div className="text-sm font-medium text-[#242527] text-center max-w-[130px]">
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-9 py-6">
        <div className="max-w-4xl mx-auto px-40">
          {renderStepContent()}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="bg-white px-9 py-4 shrink-0 border-t border-gray-200 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto px-40">
          <div className="flex gap-2">
            {currentStep < 7 ? (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 rounded-full font-semibold text-[#43573b] border border-[#43573b] hover:bg-[#43573b] hover:text-white transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 px-6 py-3 rounded-full font-semibold bg-[#43573b] text-white hover:bg-[#3a4a32] transition-colors"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 rounded-full font-semibold text-[#43573b] border border-[#43573b] hover:bg-[#43573b] hover:text-white transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-full font-semibold bg-[#43573b] text-white hover:bg-[#3a4a32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14M16 8L12 4M12 4L8 8M12 4V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;

