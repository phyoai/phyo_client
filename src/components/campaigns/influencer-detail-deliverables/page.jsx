'use client'
import React, { useState } from 'react';
import { ArrowLeftLine, MoreLine, DownloadLine, CloseLine } from '@phyoofficial/phyo-icon-library';

export default function InfluencersDetailsWithDeliverable() {
  const [deliverableStates, setDeliverableStates] = useState({
    1: 'pending', // pending, changes_requested, approved
    2: 'approved'
  });

  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changesText, setChangesText] = useState(''); 
    const handleRequestChanges = () => {
    setShowRequestChangesModal(true);
  };
  const handleSubmitChanges = () => {    // Here you would typically send the changesText to your backend to save the requested changes
    // console.log('Requested Changes:', changesText);
    setShowRequestChangesModal(false);   
     setChangesText('');
    setDeliverableStates({
      ...deliverableStates,
      1: 'changes_requested'
    });
  }
  const handleAction = (id, action) => {
    setDeliverableStates({
      ...deliverableStates,
      [id]: action
    });
  };

  const deliverables = [
    {
      id: 1,
      type: 'InstagramFill Post',
      submittedDate: 'Submitted June 15, 2026',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
      caption: 'Loving this new summer collection! 😍\nPerfect for the beach. #SummerVibes\n#Fashion #Ad',
      status: 'pending'
    },
    {
      id: 2,
      type: 'InstagramFill Reel',
      submittedDate: 'Submitted June 15, 2026',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
      status: 'approved'
    }
  ];

  const timelineEvents = [
    {
      id: 1,
      title: 'Deliverable Submitted',
      time: '2hours ago',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Counter offer sent',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Influencer invited',
      time: '3 days ago',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-base flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-base border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
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
                MS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">Michael Smith</h2>
                </div>
                <p className="text-sm text-gray-600 mb-3">Paragraph</p>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-300">
                    Pending Review
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

          {/* Submitted Deliverables */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DownloadLine className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Submitted Deliverables</h3>
            </div>

            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-4 mb-4">
                    {/* Thumbnail */}
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

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{deliverable.type}</h4>
                        <p className="text-xs text-gray-600 mt-1">{deliverable.submittedDate}</p>
                        
                        {/* Caption (for InstagramFill Post) */}
                        {deliverable.id === 1 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-600 font-medium mb-1">Caption</p>
                            <p className="text-sm text-gray-700">{deliverable.caption}</p>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="mt-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                          deliverableStates[deliverable.id] === 'approved'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : deliverableStates[deliverable.id] === 'changes_requested'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}>
                          {deliverableStates[deliverable.id] === 'approved' ? 'approved' : 
                           deliverableStates[deliverable.id] === 'changes_requested' ? 'changes requested' :
                           'pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (only for pending items) */}
                  {deliverableStates[deliverable.id] === 'pending' && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleAction(deliverable.id, 'rejected')}
                        className="flex-1 border-2 border-gray-400 text-gray-700 font-semibold py-2 px-3 rounded-full hover:bg-gray-50 transition-colors text-sm"
                      >
                        ⊗ Reject
                      </button>
                      <button
                       onClick={handleRequestChanges}
                        className="flex-1 border-2 border-green-600 text-green-700 font-semibold py-2 px-3 rounded-full hover:bg-green-50 transition-colors text-sm"
                      >
                        ↺ Request Changes
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
          </div>

          {/* Activity Timeline */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Activity Timeline</h3>
            
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="flex gap-4">
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
 {/* Request Changes Modal */}
      {showRequestChangesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-base rounded-2xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Required Changes</h2>
              <button
                onClick={() => setShowRequestChangesModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseLine className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <textarea
                value={changesText}
                onChange={(e) => setChangesText(e.target.value)}
                placeholder="Add changes/comments here..."
                className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRequestChangesModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitChanges}
                disabled={!changesText.trim()}
                className="flex-1 px-4 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold rounded-full transition-colors text-sm"
              >
                Request Changes
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