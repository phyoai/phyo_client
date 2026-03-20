'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeftLine, MoreLine, Message3Line, CloseLine } from '@phyoofficial/phyo-icon-library';
import apiClient from '@/utils/api';

export default function InfluencersDetail({ campaignId: propCampaignId, influencerId: propInfluencerId }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use props first, then fall back to query parameters
  const campaignId = propCampaignId || searchParams.get('campaignId');
  const influencerId = propInfluencerId || searchParams.get('influencerId');

  const [negotiationStatus, setNegotiationStatus] = useState('pending');
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState('$3,500');
  const [counterOfferMessage, setCounterOfferMessage] = useState('');
  const [negotiation, setNegotiation] = useState(null);
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState([]);

  useEffect(() => {
    if (campaignId && influencerId) {
      fetchNegotiationDetails(campaignId, influencerId);
      fetchNegotiationTimeline(campaignId, influencerId);
    } else {
      setLoading(false);
    }
  }, [campaignId, influencerId]);

  const fetchNegotiationDetails = async (cId, iId) => {
    try {
      const response = await apiClient.get(`/campaigns/${cId}/negotiations/${iId}`);
      const data = response.data.data || {};
      setNegotiation(data);
      setInfluencer(data.influencer || {});
      setNegotiationStatus(data.status || 'pending');
      if (data.counterOfferAmount) {
        setCounterOfferAmount(data.counterOfferAmount.toString());
      }
    } catch (error) {
      console.error('Error fetching negotiation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationTimeline = async (cId, iId) => {
    try {
      const response = await apiClient.get(`/campaigns/${cId}/negotiations/${iId}/activity-timeline`);
      setTimelineEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching negotiation timeline:', error);
      setTimelineEvents([]);
    }
  };

  const handleSendCounterOfferApi = async () => {
    if (!counterOfferAmount.trim() || !campaignId || !influencerId) return;
    try {
      await apiClient.post(`/campaigns/${campaignId}/counter-offer`, {
        influencerId: influencerId,
        amount: counterOfferAmount,
        message: counterOfferMessage
      });
      setShowCounterOfferModal(false);
      setCounterOfferMessage('');
      // Refresh negotiation details
      await fetchNegotiationDetails(campaignId, influencerId);
    } catch (error) {
      console.error('Error sending counter offer:', error);
    }
  };

  const handleAcceptCounterOfferApi = async () => {
    if (!campaignId || !influencerId) return;
    try {
      await apiClient.post(`/campaigns/${campaignId}/negotiations/${influencerId}/accept`);
      setNegotiationStatus('accepted');
      // Refresh negotiation details
      await fetchNegotiationDetails(campaignId, influencerId);
    } catch (error) {
      console.error('Error accepting counter offer:', error);
    }
  };

  const handleRejectCounterOfferApi = async () => {
    if (!campaignId || !influencerId) return;
    try {
      await apiClient.post(`/campaigns/${campaignId}/negotiations/${influencerId}/reject`);
      setNegotiationStatus('rejected');
      // Refresh negotiation details
      await fetchNegotiationDetails(campaignId, influencerId);
    } catch (error) {
      console.error('Error rejecting counter offer:', error);
    }
  };
const handleCounterOfferClick = () => {
    setShowCounterOfferModal(true);
  };

  const handleSendCounterOffer = handleSendCounterOfferApi;

  const handleReject = handleRejectCounterOfferApi;

  const handleCounterOffer = () => {
    setShowCounterOfferModal(true);
  };

  const handleAccept = handleAcceptCounterOfferApi;


  // Show fallback UI if no IDs provided
  if (!campaignId || !influencerId) {
    return (
      <div className="min-h-screen bg-neutral-base flex flex-col items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Negotiation Details</h1>
          <p className="text-gray-600 mb-8">No campaign or influencer selected</p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              To view negotiation details, please select a campaign and influencer from the campaign detail page
            </p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Go Back
            </button>
            <div className="pt-8 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Sample URL:</p>
              <code className="text-xs bg-gray-100 p-3 rounded text-left block break-words">
                /brand/campaigns/influencer-counter-offer?campaignId=69bbbd5948e716248cc066e9&influencerId=influencer123
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-base flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-base border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
            <ArrowLeftLine className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Influencers Details</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreLine className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Influencer Header */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {(influencer?.name || influencer?.username || 'IN').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{influencer?.name || influencer?.username || 'Influencer'}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-3">{influencer?.bio || negotiation?.message || 'Negotiating on campaign'}</p>
                <div className="flex gap-2">
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full border border-yellow-300">
                    Negotiating
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Followers</p>
                <p className="text-lg font-bold text-gray-900">45.2K</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Engagement</p>
                <p className="text-lg font-bold text-gray-900">4.8%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Posts</p>
                <p className="text-lg font-bold text-gray-900">3/5</p>
              </div>
            </div>
          </div>

          {/* Budget Negotiation */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
                <span className="text-xs">💰</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Budget Negotiation</h3>
            </div>

            {/* Offer Comparison */}
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-2">Your offer</p>
                  <p className="text-2xl font-bold text-gray-900">$3,000</p>
                </div>
                <div className="flex justify-center">
                  <span className="text-gray-400 text-2xl">→</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-2">Counter offer</p>
                  <p className="text-2xl font-bold text-gray-900">$3,500</p>
                </div>
              </div>
            </div>

            {/* Message from Influencer */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <Message3Line className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                <h4 className="font-semibold text-gray-900 text-sm">Message from influencer</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                I'd love to work on this campaign! Given my engagement rate and the deliverables required, I believe $3,500 would be more appropriate. I can also offer an additional story for this price.
              </p>
              <p className="text-xs text-gray-600">Received on June 19, 2026</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <button
                onClick={handleReject}
                className="flex-1 border-2 border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                ⊗ Reject
              </button>
              <button
                onClick={handleCounterOffer}
                className="flex-1 border-2 border-green-600 text-green-700 font-semibold py-2 px-4 rounded-full hover:bg-green-50 transition-colors text-sm"
              >
                ↔ Counter Offer
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
              >
                <span>✓</span> Accept
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-6">Activity Timeline</h3>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id || index} className="flex gap-4">
                    {/* Timeline Dot and Line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Dot */}
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        event.status === 'completed' ? 'bg-green-700' : 'bg-gray-300'
                      }`}></div>
                      
                      {/* Line (not on last item) */}
                      {index !== timelineEvents.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          event.status === 'completed' ? 'bg-green-700' : 'bg-gray-300'
                        } my-2`}></div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="pt-0.5">
                      <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
{/* Counter Offer Modal */}
      {showCounterOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-base rounded-2xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Send Counter Offer</h2>
              <button
                onClick={() => setShowCounterOfferModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseLine className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Current Offer Display */}
              <div>
                <p className="text-xs text-gray-600 font-medium mb-2">Their Ask</p>
                <p className="text-2xl font-bold text-gray-900">$3,500</p>
              </div>

              {/* Counter Offer Amount */}
              <div>
                <label className="text-sm text-gray-600 font-medium mb-2 block">Your Counter Offer Amount</label>
                <input
                  type="text"
                  value={counterOfferAmount}
                  onChange={(e) => setCounterOfferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm text-gray-600 font-medium mb-2 block">Message (Optional)</label>
                <textarea
                  value={counterOfferMessage}
                  onChange={(e) => setCounterOfferMessage(e.target.value)}
                  placeholder="Option counter offer"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm h-20"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCounterOfferModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCounterOffer}
                disabled={!counterOfferAmount.trim()}
                className="flex-1 px-4 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold rounded-full transition-colors text-sm"
              >
                Send Counter Offer
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}