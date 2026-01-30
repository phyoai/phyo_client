'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, Upload, Calendar, Check, Users } from 'lucide-react';
import { campaignAPI } from '../../../../utils/api';

const CreateCampaignPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    router.push('/brand/campaigns');
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
      const transformedData = {
        productImages: formData.productImages,
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
      router.push('/brand/campaigns');
      
    } catch (error) {
      console.error('Error submitting campaign:', error);
      alert(`Failed to create campaign: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Create Campaign</h1>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <StepIndicator stepNumber={1} title="Campaign Details" status={getStepStatus(1)} />
          <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
          <StepIndicator stepNumber={2} title="Target Influencer" status={getStepStatus(2)} />
          <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
          <StepIndicator stepNumber={3} title="Review" status={getStepStatus(3)} />
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={currentStep === 1 ? handleClose : handlePrevStep}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
