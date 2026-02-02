'use client'
import React, { useState } from 'react';

const RejectionModal = ({ isOpen, onClose, onConfirm, creatorName }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'Audience not aligned with this campaign',
    'Content style doesn\'t match brand',
    'Budget or deliverables mismatch',
    'Looking for different creator demographics',
    'Already selected other creators',
    'Not a fit for this campaign',
    'Other'
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other' ? otherReason : selectedReason;
    if (finalReason) {
      onConfirm(finalReason);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[rgba(12,12,13,0.24)] z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] shadow-[0px_16px_48px_0px_rgba(12,12,13,0.24)] w-[480px] relative animate-fadeIn">
          {/* Content */}
          <div className="p-6 flex flex-col gap-2">
            {/* Title */}
            <h2 className="text-[18px] font-semibold text-[#242527] leading-[26px] tracking-[-0.08px] mb-0">
              Why are you declining this creator?
            </h2>

            {/* Options */}
            <div className="flex flex-col">
              {reasons.map((reason, index) => (
                <label
                  key={index}
                  className="flex items-center gap-[15px] pr-4 cursor-pointer group"
                >
                  {/* Radio Button Container */}
                  <div className="flex items-center justify-center w-12 h-12 shrink-0">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <input
                        type="radio"
                        name="rejection-reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="sr-only"
                      />
                      {selectedReason === reason ? (
                        // Selected state - filled circle
                        <div className="w-6 h-6 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
                        </div>
                      ) : (
                        // Unselected state - empty circle
                        <div className="w-6 h-6 rounded-full border-2 border-[#79747E]" />
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <span className="flex-1 text-[12px] font-medium text-[#808080] leading-[16px] tracking-[0.16px] py-4">
                    {reason}
                  </span>
                </label>
              ))}
            </div>

            {/* Other Reason Input */}
            {selectedReason === 'Other' && (
              <div className="mt-2 pl-[60px] pr-4">
                <input
                  type="text"
                  placeholder="Please specify the reason..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-[#242527] placeholder-[#808080] focus:outline-none focus:border-[#43573b]"
                  autoFocus
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-[#79747E] text-[#1C1B1F] rounded-full text-[14px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedReason || (selectedReason === 'Other' && !otherReason.trim())}
                className="flex-1 px-6 py-3 bg-[#6B7C5E] text-white rounded-full text-[14px] font-medium hover:bg-[#5a6a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6B7C5E]"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default RejectionModal;
