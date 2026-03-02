'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { campaignAPI } from '../../../../utils/api';
import { LineChartGraph } from '../../../../components/AudienceEngagementGraphs';
import { SpendingBudgetGraph } from '../../../../components/SpendingBudgetGraph';

export default function CampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      const response = await campaignAPI.getCampaignById(campaignId);
      setCampaign(response.data || response);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600">Campaign not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Fixed Header Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1 ml-4">
          {campaign.campaignName || 'Campaign'}
        </h1>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Scrollable Content with Invisible Scrollbar */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Hero Image Section */}
        <div className="relative w-full h-80 sm:h-96 bg-gradient-to-br from-blue-400 to-teal-500 overflow-hidden">
          {campaign.productImages && campaign.productImages.length > 0 ? (
            <img
              src={campaign.productImages[0]}
              alt={campaign.campaignName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl font-bold">{campaign.campaignName?.substring(0, 2).toUpperCase()}</div>
              </div>
            </div>
          )}

          {/* Floating Header Card - Overlaid on Image */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-12 bg-gradient-to-t from-black/50 to-transparent">
            <div className="bg-white rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {campaign.campaignName?.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{campaign.campaignName || 'Campaign'}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium flex-shrink-0">
                ● On going
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">

          {/* Campaign Brief Label and Text */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Campaign Brief</p>
            <p className="text-base text-gray-700 leading-relaxed">
              {campaign.campaignBrief || 'Engage influencers to promote our latest beverage and encourage their followers to try it out. Lets create buzz and excitement around this new drink!'}
            </p>
          </div>

          {/* Tabs - Horizontally Scrollable */}
          <div
            className="flex gap-6 border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {['Overview', 'Influencers', 'Analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.toLowerCase()
                    ? 'text-gray-900 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Action Required Section */}
              <div className="space-y-3">
                {/* Sarah Lee - Negotiating */}
                <div className="border border-yellow-200 rounded-lg">
                  <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-200">
                    <p className="text-xs font-medium text-yellow-700">Negotiating • 1 day ago</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        AB
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Sarah Lee sent counter offer</p>
                        <p className="text-xs text-gray-600 mt-1">Proposed budget increased from $3,000 to $3,500</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm">
                        <p className="text-gray-600 text-xs mb-1">Your offer</p>
                        <p className="font-bold text-gray-900">$3,000</p>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="text-sm">
                        <p className="text-gray-600 text-xs mb-1">Counter offer</p>
                        <p className="font-bold text-gray-900">$3,500</p>
                      </div>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors w-full">
                      → Respond to offer
                    </button>
                  </div>
                </div>

                {/* Michael Smith - Pending Review */}
                <div className="border border-blue-200 rounded-lg">
                  <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                    <p className="text-xs font-medium text-blue-700">Pending Review • 2 hours ago</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        AB
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">Michael Smith submitted deliverables</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {campaign.productImages?.slice(0, 3).map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt={`Deliverable ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                      → Review now
                    </button>
                  </div>
                </div>
              </div>

              {/* Campaign Summary */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Campaign Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Goal</p>
                    <p className="text-sm text-gray-900">{campaign.campaignBrief || 'Drive awareness and engagement for our new summer fashion collection'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Campaign Type</p>
                    <div className="flex flex-wrap gap-2">
                      {(campaign.campaignType ? campaign.campaignType.split(',') : ['Brand Awareness', 'Product Launch']).map((type, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                          {type.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Target Countries</p>
                      <p className="text-sm font-semibold text-gray-900">{campaign.targetCountries?.join(', ') || 'USA, Canada, UK'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Campaign Period</p>
                      <p className="text-sm font-semibold text-gray-900">June 1, 2026 → June 30, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boost This Campaign */}
              <div className="bg-green-700 text-white rounded-lg p-6 flex items-start gap-4">
                <div className="text-2xl">🚀</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Boost This Campaign</h3>
                  <p className="text-sm text-green-100 mb-3">Amplify reach and engagement with advanced boost options</p>
                  <div className="flex gap-2 text-xs flex-wrap">
                    <span className="bg-green-600 px-2 py-1 rounded">+250% reach</span>
                    <span className="bg-green-600 px-2 py-1 rounded">+10 influencers</span>
                    <span className="bg-green-600 px-2 py-1 rounded">+150% ROI</span>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Deliverables</h3>
                <div className="space-y-3">
                  {campaign.deliverables?.instagramStory > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                          ○
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Instagram Story</p>
                          <p className="text-xs text-gray-600">UTC • Duration: 15 Secs</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {campaign.deliverables.instagramStory}
                      </div>
                    </div>
                  )}

                  {campaign.deliverables?.instagramReel > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-xs">
                          ▶
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Instagram Reel</p>
                          <p className="text-xs text-gray-600">UTC • Duration: 30-60 Secs</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {campaign.deliverables.instagramReel}
                      </div>
                    </div>
                  )}

                  {campaign.deliverables?.instagramPost > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs">
                          ▦
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Instagram Post</p>
                          <p className="text-xs text-gray-600">UTC • Posted Regularly</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {campaign.deliverables.instagramPost}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget & Compensation */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Budget & Compensation</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                    <div className="flex justify-between items-baseline mb-2">
                      <p className="text-2xl font-bold text-gray-900">₹{campaign.totalBudget?.toLocaleString() || '50,000'}</p>
                      <span className="text-xs text-gray-500">45%</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">₹22,500 used</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Compensation Model</p>
                    <div className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      Per Influencer
                    </div>
                  </div>
                </div>
              </div>

              {/* Influencer Targeting */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Influencer Targeting</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">👥 Influencers</span>
                    <span className="font-semibold text-gray-900">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Follower Range</span>
                    <span className="text-sm text-gray-900">10K - 100K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Age Range</span>
                    <span className="text-sm text-gray-900">18 - 35 years</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {['Fashion', 'Lifestyle', 'Beauty', 'Travel'].map((interest, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Media */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Product Media</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Timeline</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                  {[
                    { milestone: 'Brief Created', date: 'May 15' },
                    { milestone: 'Influencer Approval', date: 'May 20' },
                    { milestone: 'Campaign Live', date: 'June 1', active: true },
                    { milestone: 'Campaign End', date: 'June 30' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${item.active ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.milestone}</p>
                        <p className="text-xs text-gray-600">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* INFLUENCERS TAB */}
          {activeTab === 'influencers' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">15</p>
                  <p className="text-xs text-gray-600 mt-1">Total Influencers</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-gray-600 mt-1">Currently Active</p>
                </div>
              </div>

              {/* New Applications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">New Applications</h3>
                  <a href="#" className="text-blue-600 text-sm font-medium hover:underline">view all {`>`}</a>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Lee', role: 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex...' },
                    { name: 'David Chen', role: 'A UX researcher dedicated to understanding user behavior and needs. She utilizes qualitative a...' },
                    { name: 'Emma Garcia', role: 'A digital marketer with a focus on brand strategy and social media engagement. He enjoys craft...' },
                    { name: 'James Brown', role: 'A product manager with a strong background in agile methodologies. She excels at aligning stra...' },
                    { name: 'Michael Johnson', role: 'A content strategist who specializes in creating impactful copy and storytelling. He believes...' }
                  ].map((influencer, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${['bg-green-600', 'bg-pink-600', 'bg-orange-600', 'bg-purple-600', 'bg-blue-600'][idx] || 'bg-gray-600'}`}>
                        {influencer.name.substring(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{influencer.name}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{influencer.role}</p>
                      </div>
                      <button className="px-3 py-1 border border-green-600 text-green-600 rounded-full text-xs font-medium hover:bg-green-50 transition-colors flex-shrink-0">
                        portfolio
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Influencers Working On */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Influencers working on</h3>
                  <a href="#" className="text-blue-600 text-sm font-medium hover:underline">view all {`>`}</a>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Michael Smith', status: 'pending-review', badge: 'Pending Review', role: 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex...' },
                    { name: 'Sarah Lee', status: 'negotiating', badge: 'Negotiating', role: 'A UX researcher dedicated to understanding user behavior and needs. She utilizes qualitative a...' },
                    { name: 'David Chen', status: 'approved', badge: 'Approved', role: 'A digital marketer with a focus on brand strategy and social media engagement. He enjoys craft...' },
                    { name: 'Emma Garcia', status: 'rejected', badge: 'Rejected', role: 'A product manager with a strong background in agile methodologies. She excels at aligning stra...' },
                    { name: 'James Brown', status: 'approved', badge: 'Approved', role: 'A content strategist who specializes in creating impactful copy and storytelling. He believes...' }
                  ].map((influencer, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${['bg-green-600', 'bg-pink-600', 'bg-orange-600', 'bg-purple-600', 'bg-blue-600'][idx] || 'bg-gray-600'}`}>
                          {influencer.name.substring(0, 1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{influencer.name}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{influencer.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                        influencer.status === 'pending-review' ? 'bg-blue-100 text-blue-700' :
                        influencer.status === 'negotiating' ? 'bg-yellow-100 text-yellow-700' :
                        influencer.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {influencer.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Find More Influencers */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Find More Influencers</h3>
                    <p className="text-sm text-gray-600 mt-1">Discover and connect with influencers that match your campaign criteria</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Follower Range</p>
                    <p className="text-sm font-semibold text-gray-900">10K - 100K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <p className="text-sm font-semibold text-gray-900">United States</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {['Fashion', 'Lifestyle', 'Beauty'].map((interest, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors text-sm">
                  + Discover Influencers
                </button>
              </div>
            </>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Notice Box */}
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">Analytics data will be available once the campaign goes live.</p>
              </div>

              {/* Audience Engagement */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Audience Engagement</h3>
                  <button className="bg-green-700 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-green-800 transition-colors">
                    likes ▼
                  </button>
                </div>
                <LineChartGraph
                  title="9.2K Likes"
                  percentage="24%"
                  strokeColor="#3D4F36"
                  fillColor="#43573B"
                />
              </div>

              {/* Spending Budget */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Spending Budget</h3>
                  <button className="bg-green-700 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-green-800 transition-colors">
                    months ▼
                  </button>
                </div>
                <SpendingBudgetGraph
                  title="₹1,24,657.80"
                  percentage="24%"
                />
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex gap-3 pb-6">
            <button className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm">
              📊 Summarize
            </button>
            <button className="flex-1 px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors text-sm">
              📈 Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
