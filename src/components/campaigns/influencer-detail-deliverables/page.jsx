'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeftLine, MoreLine, DownloadLine, CloseLine } from '@phyoofficial/phyo-icon-library';
import { useSearchParams, useRouter } from 'next/navigation';
import apiClient from '@/utils/api';

const normalizeId = (item, fallback = '') => item?._id || item?.id || fallback;
const normalizeDeliverable = (deliverable, index = 0) => ({
  ...deliverable,
  id: normalizeId(deliverable, `${index}`),
  _id: normalizeId(deliverable, `${index}`),
  type: deliverable?.type || deliverable?.name || deliverable?.title || 'Deliverable',
  submittedDate: deliverable?.submittedDate || deliverable?.createdAt || 'Submitted recently',
  image:
    deliverable?.image ||
    deliverable?.mediaUrl ||
    deliverable?.thumbnail ||
    deliverable?.previewUrl ||
    '/world-bg.png',
  caption: deliverable?.caption || deliverable?.message || '',
  status: deliverable?.status || 'pending',
});

export default function InfluencersDetailsWithDeliverable({ campaignId: propCampaignId, influencerId: propInfluencerId }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignId = propCampaignId || searchParams.get('campaignId');
  const influencerId = propInfluencerId || searchParams.get('influencerId');

  const [deliverableStates, setDeliverableStates] = useState({});
  const [deliverables, setDeliverables] = useState([]);
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState([]);

  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changesText, setChangesText] = useState('');

  useEffect(() => {
    if (campaignId) {
      fetchDeliverables(campaignId);
      fetchActivityTimeline(campaignId);
    } else {
      setLoading(false);
    }
  }, [campaignId]);

  const fetchDeliverables = async (id) => {
    try {
      const response = await apiClient.get(`/campaigns/${id}/deliverables`, {
        params: influencerId ? { influencerId } : undefined,
      });
      const raw = response.data?.data || response.data || [];
      const normalized = Array.isArray(raw) ? raw.map(normalizeDeliverable) : [];
      setDeliverables(normalized);

      const initialStates = {};
      normalized.forEach((item) => {
        initialStates[item.id] = item.status || 'pending';
      });
      setDeliverableStates(initialStates);

      if (response.data?.data?.influencer) {
        setInfluencer(response.data.data.influencer);
      }
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      setDeliverables([
        normalizeDeliverable({
          id: 1,
          type: 'Instagram Post',
          submittedDate: 'Submitted June 15, 2026',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          caption: 'Loving this new summer collection! #SummerVibes #Fashion #Ad',
          status: 'pending',
        }),
      ]);
      setDeliverableStates({ 1: 'pending' });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityTimeline = async (id) => {
    try {
      const response = await apiClient.get(`/campaigns/${id}/activity-timeline`, {
        params: influencerId ? { influencerId } : undefined,
      });
      setTimelineEvents(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching activity timeline:', error);
      setTimelineEvents([
        { id: 1, title: 'Deliverable Submitted', time: '2 hours ago', status: 'completed' },
        { id: 2, title: 'Counter offer sent', time: '1 day ago', status: 'completed' },
        { id: 3, title: 'Influencer invited', time: '3 days ago', status: 'pending' },
      ]);
    }
  };

  const handleRequestChanges = () => {
    setShowRequestChangesModal(true);
  };

  const handleSubmitChanges = () => {
    setShowRequestChangesModal(false);
    setChangesText('');
    if (deliverables[0]) {
      setDeliverableStates((prev) => ({
        ...prev,
        [deliverables[0].id]: 'changes_requested',
      }));
    }
  };

  const handleAction = (id, action) => {
    setDeliverableStates((prev) => ({
      ...prev,
      [id]: action,
    }));
  };

  const displayDeliverables = deliverables.length > 0 ? deliverables : [];

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-neutral-base flex flex-col items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Deliverables Review</h1>
          <p className="text-gray-600 mb-8">No campaign selected</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-base flex flex-col">
      <div className="sticky top-0 bg-neutral-base border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
          >
            <ArrowLeftLine className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Influencers Details</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreLine className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {(influencer?.name || influencer?.username || 'IN').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {influencer?.name || influencer?.username || 'Influencer'}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {influencer?.bio || 'Submitted deliverables for review'}
                </p>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-300">
                    Pending Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <DownloadLine className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Submitted Deliverables</h3>
            </div>

            {loading ? (
              <div className="border border-gray-200 rounded-lg p-6 text-gray-500">Loading deliverables...</div>
            ) : displayDeliverables.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-6 text-gray-500 text-center">No deliverables submitted yet</div>
            ) : (
              <div className="space-y-4">
                {displayDeliverables.map((deliverable) => (
                  <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={deliverable.image}
                          alt={deliverable.type}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="mt-2 flex justify-center">
                          <DownloadLine className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{deliverable.type}</h4>
                          <p className="text-xs text-gray-600 mt-1">{deliverable.submittedDate}</p>
                          {deliverable.caption ? (
                            <div className="mt-3">
                              <p className="text-xs text-gray-600 font-medium mb-1">Caption</p>
                              <p className="text-sm text-gray-700 whitespace-pre-line">{deliverable.caption}</p>
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                            deliverableStates[deliverable.id] === 'approved'
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : deliverableStates[deliverable.id] === 'changes_requested'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}>
                            {deliverableStates[deliverable.id] === 'approved'
                              ? 'approved'
                              : deliverableStates[deliverable.id] === 'changes_requested'
                              ? 'changes requested'
                              : 'pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {deliverableStates[deliverable.id] === 'pending' && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleAction(deliverable.id, 'rejected')}
                          className="flex-1 border-2 border-gray-400 text-gray-700 font-semibold py-2 px-3 rounded-full hover:bg-gray-50 transition-colors text-sm"
                        >
                          X Reject
                        </button>
                        <button
                          onClick={handleRequestChanges}
                          className="flex-1 border-2 border-green-600 text-green-700 font-semibold py-2 px-3 rounded-full hover:bg-green-50 transition-colors text-sm"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => handleAction(deliverable.id, 'approved')}
                          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-3 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <span>✓</span> Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Activity Timeline</h3>
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id || index} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${event.status === 'completed' ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                    {index !== timelineEvents.length - 1 && (
                      <div className={`w-0.5 h-12 ${event.status === 'completed' ? 'bg-green-700' : 'bg-gray-300'} my-2`}></div>
                    )}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showRequestChangesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Required Changes</h2>
              <button
                onClick={() => setShowRequestChangesModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseLine className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={changesText}
                onChange={(e) => setChangesText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Describe the requested changes..."
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowRequestChangesModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitChanges}
                  className="px-4 py-2 rounded-lg bg-green-700 text-white"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
