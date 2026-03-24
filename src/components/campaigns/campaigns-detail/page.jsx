'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Image2Line as Image2Line, CalendarLine,ArrowLeftLine, LineChartLine, UserLine, BarChartLine, MoneyDollarBoxLine, DownloadLine, FileTextLine, MoreLine, AddLine, SearchLine, VideoLine } from '@phyoofficial/phyo-icon-library';
import { useRoleContext } from '@/app/context/RoleContext';
import { SpendingBudgetGraph } from '@/components/SpendingBudgetGraph';
import { LineChartGraph } from '@/components/AudienceEngagementGraphs';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useGoBack } from '@/hooks/useGoBack';
import apiClient from '@/utils/api';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goBack = useGoBack();
  const { role } = useRoleContext();
  const campaignId = params.id;

  const { selectedCampaign, loading, fetchCampaignById } = useCampaigns();
  const [activeTab, setActiveTab] = useState('overview');
  const [responded, setResponded] = useState(false);
  const [images, setImages] = useState([]); // This will hide the images section

  // State for related data
  const [applications, setApplications] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingInfluencers, setLoadingInfluencers] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId);
      fetchCampaignApplications(campaignId);
      fetchCampaignInfluencers(campaignId);
      fetchCampaignDeliverables(campaignId);
    }
  }, [campaignId, fetchCampaignById]);

  // Fetch campaign applications
  const fetchCampaignApplications = async (id) => {
    setLoadingApplications(true);
    try {
      const response = await apiClient.get(`/campaigns/${id}/applications`);
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Fetch campaign influencers
  const fetchCampaignInfluencers = async (id) => {
    setLoadingInfluencers(true);
    try {
      const response = await apiClient.get(`/campaigns/${id}/influencers`);
      setInfluencers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      setInfluencers([]);
    } finally {
      setLoadingInfluencers(false);
    }
  };

  // Fetch campaign deliverables (if not already in campaign object)
  const fetchCampaignDeliverables = async (id) => {
    setLoadingDeliverables(true);
    try {
      const response = await apiClient.get(`/campaigns/${id}/deliverables`);
      setDeliverables(response.data.data || []);
    } catch (error) {
      // If API endpoint doesn't exist, use campaign object deliverables
      console.log('Using deliverables from campaign object');
      setDeliverables(selectedCampaign?.deliverables || []);
    } finally {
      setLoadingDeliverables(false);
    }
  };

  const campaign = selectedCampaign;

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-neutral-base">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-neutral-base">
        <div className="text-center">
          <p className="text-gray-600">Campaign not found</p>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-neutral-base py-2 px-1 justify-between items-start">
      {/* Fixed Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-base px-4 py-3 flex items-center justify-between border-b">
        <IconButton
          icon={ArrowLeftLine}
          size="md"
          variant="default"
          onClick={() => router.back()}
        />

        <h1 className="text-lg font-semibold text-gray-900 flex-1 ml-4">
          {campaign.campaignName || 'Campaign'}
        </h1>

        <IconButton
          icon={MoreLine}
          size="md"
          variant="default"
        />
      </div>

      <div className="min-h-screen w-full bg-neutral-base flex flex-col items-start gap-4 px-[160px] py-4 flex-1 self-stretch">
        {/* HERO IMAGE */}
        <div className="relative w-full h-[520px]">
          {campaign.productImages?.length > 0 ? (
            <img
              src={campaign.productImages[0]}
              alt={campaign.campaignName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* FLOATING WHITE CARD */}
        <div className="relative w-full -mt-24 bg-neutral-base rounded-t-[32px] shadow-xl z-20">
          <div className="max-w-5xl mx-auto px-6 pt-6 pb-16">
            {/* Brand Header Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {campaign.campaignName?.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {campaign.campaignName || 'Campaign'}
                  </h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 bg-green-500 text-white text-sm px-4 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 bg-neutral-base rounded-full" />
                On going
              </span>
            </div>

            {/* Campaign Brief */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Campaign Brief</p>
              <p className="text-base text-gray-700 leading-relaxed">
                {campaign.campaignBrief ||
                  "Engage influencers to promote our latest beverage and encourage their followers to try it out. Let's create buzz and excitement around this new drink!"}
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Tab headers */}
              <div className="flex border-b border-gray-300">
                <button
                  className={`w-[419px] py-3 px-6 font-semibold ${activeTab === "overview"
                    ? "border-b-4 border-green-700 text-green-700"
                    : "text-gray-600 hover:text-green-700"
                    }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`w-[419px] py-3 px-6 font-semibold ${activeTab === "influencers"
                    ? "border-b-4 border-green-700 text-green-700"
                    : "text-gray-600 hover:text-green-700"
                    }`}
                  onClick={() => setActiveTab("influencers")}
                >
                  Influencers
                </button>
                <button
                  className={`w-[419px] py-3 px-6 font-semibold ${activeTab === "analytics"
                    ? "border-b-4 border-green-700 text-green-700"
                    : "text-gray-600 hover:text-green-700"
                    }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </button>
              </div>

              {/* Tab content */}
              <div className="py-6 text-gray-700">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Action Required Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Required</h3>

                      {/* Negotiation Card */}
                      <div className="h-[208px">
                        <div className="h-[208px">
                          {/* Card Container with gold border */}
                          <div className="mb-4 border-2 border-amber-400 rounded-2xl bg-neutral-base shadow-sm">
                            <div className="flex flex-col items-start gap-4 px-6 py-6 self-stretch">

                              {/* Header */}
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-gray-900">Negotiating</span>
                                <span className="text-sm text-gray-500">• 1 day ago</span>
                              </div>

                              {/* Avatar and Message */}
                              <div className="flex items-start gap-3 w-full">
                                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  AB
                                </div>
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-gray-900">Sarah Lee sent counter offer</p>
                                  <p className="text-sm text-gray-600 mt-1">Proposed budget increased from $3,000 to $3,500</p>

                                  {/* Offer Comparison - now styled to match the text above */}
                                  <div className="w-full bg-gray-100 rounded-lg px-5 py-4 flex items-center justify-between gap-4 mt-3">
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-600 font-medium mb-1">Your offer</p>
                                      <p className="text-lg font-bold text-gray-900">$3,000</p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex justify-center">
                                      <span className="text-gray-400 text-xl">→</span>
                                    </div>

                                    <div className="flex-1 text-right">
                                      <p className="text-xs text-gray-600 font-medium mb-1">Counter offer</p>
                                      <p className="text-lg font-bold text-gray-900">$3,500</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Button */}
                              <Button
                                variant="tertiary"
                                size="sm"
                                onClick={() => {
                                  setResponded(!responded);
                                  const influencerId = influencers[0]?._id || influencers[0]?.id || 'influencer123';
                                  router.push(`/${role}/campaigns/influencer-counter-offer?campaignId=${campaignId}&influencerId=${influencerId}`);
                                }}
                                className="self-center"
                              >
                                → Respond to offer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pending Review Card */}
                      <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-4">
                        <div className="">
                          {/* Card Container with blue border */}
                          <div className="">
                            <div className="flex flex-col items-start gap-4 px-6 py-6 self-stretch h-full">

                              {/* Header */}
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-gray-900">Pending Review</span>
                                <span className="text-sm text-gray-500">• 2 hours ago</span>
                              </div>

                              {/* Avatar and Message */}
                              <div className="flex items-start gap-3 w-full">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  AB
                                </div>
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-gray-900">Michael Smith submitted deliverables</p>
                                  <p className="text-sm text-gray-600 mt-1">InstagramFill Post + Story ready for review</p>

                                  {/* Thumbnail Images - Show images if exist, otherwise show placeholder icon */}
                                  {images && images.length > 0 ? (
                                    <div className="flex gap-2 mt-3">
                                      {images.map((image) => (
                                        <img
                                          key={image.id || image._id || image.url}
                                          src={image.url}
                                          alt={image.alt || 'Deliverable'}
                                          className="w-14 h-14 rounded-lg object-cover"
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
                                      <Image2Line className="w-6 h-6 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Button */}
                              <Button
                                variant="tertiary"
                                size="sm"
                                onClick={() => {
                                  setResponded(!responded);
                                  router.push(`/${role}/campaigns/influencer-detail-deliverables?campaignId=${campaignId}`);
                                }}
                                className="self-center mt-auto"
                              >
                                → Review now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Campaign Summary Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8" >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Campaign Summary</h3>

                      <div className="space-y-6">
                        {/* Goal */}
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Goal</p>
                          <p className="text-base text-gray-900">{campaign?.goal || campaign?.description || 'No goal defined'}</p>
                        </div>

                        {/* Campaign Type */}
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Campaign Type</p>
                          <div className="flex gap-2 flex-wrap">
                            {campaign?.types && Array.isArray(campaign.types) && campaign.types.length > 0 ? (
                              campaign.types.map((type) => (
                                <span key={type} className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                                  {type}
                                </span>
                              ))
                            ) : (
                              <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">General Campaign</span>
                            )}
                          </div>
                        </div>

                        {/* Target Countries */}
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Target Countries</p>
                          <p className="text-base text-gray-900">{campaign?.targetCountries || campaign?.location || 'Not specified'}</p>
                        </div>

                        {/* Campaign Period */}
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Campaign Period</p>
                          <div className="flex items-center gap-2 text-base text-gray-900">
                            <CalendarLine className="w-4 h-4 text-gray-600" />
                            <span>
                              {campaign?.startDate && campaign?.endDate
                                ? `${new Date(campaign.startDate).toLocaleDateString()} → ${new Date(campaign.endDate).toLocaleDateString()}`
                                : 'Date range not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Boost This Campaign Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 p-8 cursor-pointer" onClick={() => router.push(`/${role}/campaigns/boost-campaign?campaignId=${campaignId}`)}>
                      <div className="flex items-start gap-4">
                        {/* Icon Circle */}
                        <div className="w-12 h-12 bg-neutral-base rounded-full flex items-center justify-center flex-shrink-0">
                          <LineChartLine className="w-6 h-6 text-green-700" />
                        </div>

                        <div className="flex-1">
                          {/* Title */}
                          <h3 className="text-2xl font-semibold text-white mb-2">Boost This Campaign</h3>

                          {/* Description */}
                          <p className="text-green-50 text-sm mb-4">Amplify reach and engagement with advanced boost options</p>

                          {/* Stats */}
                          <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                              <LineChartLine className="w-4 h-4 text-green-50" />
                              <span className="text-sm font-medium text-green-50">+50% reach</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserLine className="w-4 h-4 text-green-50" />
                              <span className="text-sm font-medium text-green-50">+10 influencers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChartLine className="w-4 h-4 text-green-50" />
                              <span className="text-sm font-medium text-green-50">+65% ROI</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deliverables Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Deliverables</h3>

                      {loadingDeliverables ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-500">Loading deliverables...</div>
                        </div>
                      ) : deliverables.length > 0 ? (
                        <div className="space-y-0 divide-y divide-gray-200">
                          {deliverables.map((item) => (
                            <div key={item.id || item._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                              {/* Left Section - Icon and Content */}
                              <div className="flex items-start gap-4 flex-1">
                                {/* Icon Circle */}
                                <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0 text-gray-600">
                                  {item.icon || '📋'}
                                </div>

                                {/* Content */}
                                <div>
                                  <h4 className="text-base font-semibold text-gray-900">{item.title || item.name || 'Deliverable'}</h4>
                                  <p className="text-sm text-gray-500 mt-1">{item.details || item.description || ''}</p>
                                </div>
                              </div>

                              {/* Right Section - Status Badge */}
                              <div className="flex-shrink-0 ml-4">
                                <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center text-sm font-semibold">
                                  {item.status || '✓'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-6">No deliverables added yet</p>
                      )}
                    </div>

                    {/* Budget & Compensation Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Budget & Compensation</h3>

                      <div className="space-y-6">
                        {/* Total Budget */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MoneyDollarBoxLine className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-600 font-medium">Total Budget</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                              {campaign?.budget ? `₹${(campaign.budget / 100000).toFixed(1)}L` : '—'}
                            </span>
                          </div>

                          {/* Budget Used Info */}
                          {campaign?.budgetUsed && campaign?.budget ? (
                            <>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600">₹{(campaign.budgetUsed / 100000).toFixed(1)}L used</span>
                                <span className="text-sm text-gray-600 font-medium">{Math.round((campaign.budgetUsed / campaign.budget) * 100)}%</span>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-700 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.round((campaign.budgetUsed / campaign.budget) * 100)}%` }}
                                ></div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Budget usage data not available</p>
                          )}
                        </div>

                        {/* Compensation Model */}
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Compensation Model</p>
                          <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full">
                            {campaign?.compensationModel || 'Per Influencer'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Influencer Targeting Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Influencer Targeting</h3>
                      </div>

                      <div className="space-y-6">
                        {/* Influencers */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserLine className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600 font-medium">Target Influencers</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{campaign?.targetInfluencersCount || influencers.length || '—'}</span>
                        </div>

                        {/* Follower Range */}
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Follower Range</p>
                          <p className="text-base text-gray-900">{campaign?.followerRange || '—'}</p>
                        </div>

                        {/* Age Range */}
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Age Range</p>
                          <p className="text-base text-gray-900">{campaign?.ageRange || '—'}</p>
                        </div>

                        {/* Interests */}
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-3">Interests</p>
                          <div className="flex flex-wrap gap-2">
                            {campaign?.interests && campaign.interests.length > 0 ? (
                              campaign.interests.map((interest) => (
                                <span key={interest} className="bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full">
                                  {interest}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">No specific interests defined</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Media Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Product Media</h3>
                        {/* Count Badge */}
                        <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                          8
                        </div>
                      </div>

                      {/* Media Grid */}
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                          <div
                            key={`media-${item}`}
                            className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                          >
                            <Image2Line className="w-6 h-6 text-gray-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Section */}

                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-8">Timeline</h3>

                      {/* Timeline Container */}
                      <div className="space-y-6">
                        {[
                          { title: 'Brief Created', date: 'May 15', status: 'completed', color: 'bg-gray-700' },
                          { title: 'Influencer Approval', date: 'May 25', status: 'completed', color: 'bg-gray-700' },
                          { title: 'Campaign Live', date: 'June 1', status: 'active', color: 'bg-blue-500' },
                          { title: 'Campaign End', date: 'June 30', status: 'pending', color: 'bg-gray-300' }
                        ].map((event, index, array) => (
                          <div key={event.title} className="flex gap-4">
                            {/* Timeline Dot and Line */}
                            <div className="flex flex-col items-center">
                              {/* Dot */}
                              <div className={`w-4 h-4 rounded-full ${event.color} flex-shrink-0 ring-4 ring-white`}></div>

                              {/* Line (not on last item) */}
                              {index !== array.length - 1 && (
                                <div className={`w-0.5 h-12 ${event.status === 'completed' ? 'bg-gray-700' : 'bg-gray-300'} my-2`}></div>
                              )}
                            </div>

                            {/* Event Content */}
                            <div className="pt-1">
                              <h4 className={`text-base font-semibold ${event.status === 'active' ? 'text-blue-500' : 'text-gray-900'
                                }`}>
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 w-full">
                      <Button
                        variant="tertiary"
                        size="md"
                        fullWidth
                        icon={FileTextLine}
                        onClick={() => router.push(`/${role}/campaigns/campaign-summary?campaignId=${campaignId}`)}
                      >
                        Summarize
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        icon={DownloadLine}
                      >
                        Report
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "influencers" && (
                  <div>
                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8 flex flex-col items-center justify-center text-center">
                        <p className="text-4xl font-bold text-gray-900 mb-2">{applications.length}</p>
                        <p className="text-sm text-gray-600 font-medium">Total Applications</p>
                      </div>

                      <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8 flex flex-col items-center justify-center text-center">
                        <p className="text-4xl font-bold text-gray-900 mb-2">{influencers.length}</p>
                        <p className="text-sm text-gray-600 font-medium">Currently Working</p>
                      </div>
                    </div>
                    {/* New Applications Section */}
                    <div className="bg-neutral-base">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-gray-900">New Applications ({applications.length})</h3>
                        <button
                          onClick={() => router.push(`/${role}/campaigns/new-applications?campaignId=${campaignId}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          view all →
                        </button>
                      </div>

                      {/* Applications List */}
                      {loadingApplications ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-500">Loading applications...</div>
                        </div>
                      ) : applications.length > 0 ? (
                        <div className="space-y-4">
                          {applications.map((app) => (
                            <div
                              key={app.id || app._id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              {/* Left Section - Avatar and Info */}
                              <div className="flex items-start gap-4 flex-1 min-w-0">
                                <img
                                  src={app.avatar || app.profileImage || 'https://i.pravatar.cc/150?img=0'}
                                  alt={app.name}
                                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base font-semibold text-gray-900">{app.name || app.username || 'Unknown'}</h4>
                                  <p className="text-sm text-gray-600 mt-1 truncate">{app.role || app.bio || app.description || 'Influencer'}</p>
                                </div>
                              </div>

                              {/* Right Section - Portfolio Button */}
                              <Button
                                variant="outlined"
                                size="sm"
                                className="flex-shrink-0 ml-4"
                                onClick={() => router.push(`/${role}/influencers/${app.id || app._id}`)}
                              >
                                profile
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No applications yet</p>
                      )}
                    </div>
                    {/* Influencers Working On Section */}
                    <div className="bg-neutral-base">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-semibold text-gray-900">Influencers working on</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          view all →
                        </button>
                      </div>

                      {/* Influencers List */}
                      {loadingInfluencers ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-500">Loading influencers...</div>
                        </div>
                      ) : influencers.length > 0 ? (
                        <div className="space-y-4 divide-y divide-gray-200">
                          {influencers.map((influencer) => (
                            <div key={influencer.id || influencer._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                              <div className="flex items-start gap-4 flex-1 min-w-0">
                                <img
                                  src={influencer.avatar || influencer.profileImage || 'https://i.pravatar.cc/150?img=0'}
                                  alt={influencer.name || influencer.username || 'Influencer'}
                                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base font-semibold text-gray-900">{influencer.name || influencer.username || 'Unknown'}</h4>
                                  <p className="text-sm text-gray-600 mt-1 truncate">{influencer.role || influencer.bio || influencer.description || 'Influencer'}</p>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${influencer.statusColor || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                  {influencer.status || 'Active'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No influencers working on this campaign yet</p>
                      )}
                    </div>
                    <div className="my-8 border-t border-gray-200"></div>
                    {/* Find More Influencers Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">

                      {/* Header with Icon */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <SearchLine className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Find More Influencers</h3>
                          <p className="text-sm text-gray-600 mt-1">Discover and connect with influencers that match your campaign criteria</p>
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="space-y-4 mb-8">
                        {/* Follower Range */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 font-medium">Follower Range</p>
                          <p className="text-sm text-gray-900 font-medium">10K – 100K</p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 font-medium">Location</p>
                          <p className="text-sm text-gray-900 font-medium">United States</p>
                        </div>

                        {/* Interests */}
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Interests</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Fashion</span>
                            <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Lifestyle</span>
                            <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Beauty</span>
                          </div>
                        </div>
                      </div>

                      {/* Discover Button */}
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                      >
                        + Discover Influencers
                      </Button>
                    </div>

                  </div>
                )}

                {activeTab === "analytics" && (
                  <div>
                    {/* Analytics Placeholder Section */}
                    <div className="border-2 border-gray-300 rounded-2xl bg-neutral-base p-8">
                      <div className="flex items-center justify-center py-8">
                        <p className="text-center text-sm text-gray-600">
                          Analytics data will be available once the campaign goes live.
                        </p>
                      </div>
                    </div>
                    <div className="my-8 border-t border-white"></div>
                    {/* Audience Engagement */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Audience Engagement</h3>
                        <Button
                          variant="primary"
                          size="sm"
                        >
                          likes ▼
                        </Button>
                      </div>
                      <LineChartGraph
                        title="9.2K Likes"
                        percentage="24%"
                        strokeColor="#3D4F36"
                        fillColor="#43573B"
                      />
                    </div>
                    <br />
                    <div className="h-px bg-neutral-base w-full"></div>
                    {/* Spending Budget */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Spending Budget</h3>
                        <Button
                          variant="primary"
                          size="sm"
                        >
                          months ▼
                        </Button>
                      </div>
                      <SpendingBudgetGraph
                        title="₹1,24,657.80"
                        percentage="24%"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}