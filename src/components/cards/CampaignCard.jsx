import React from 'react';
import { HeartLine } from '@phyoofficial/phyo-icon-library';

/**
 * Reusable Campaign Card Component
 * Used across the dashboard for displaying campaign information
 */
export default function CampaignCard({
  brandName,
  brandInitials,
  timeAgo,
  campaignImage = '/dummyAvatar.jpg',
  initialsColor = 'bg-blue-500',
  campaignTitle,
  budget,
  applications,
  onLike,
  onClick
}) {
  return (
    <div
      className="bg-neutral-base rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* Campaign Header */}
      <div className="p-3 flex items-center justify-between bg-neutral-base">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-9 h-9 ${initialsColor} rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}>
            {brandInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">{brandName}</h3>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          <HeartLine className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Campaign Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <img
          src={campaignImage}
          alt={campaignTitle || brandName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Campaign Info Overlay */}
        {(campaignTitle || budget) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
            {campaignTitle && (
              <h4 className="text-white font-semibold text-sm truncate">{campaignTitle}</h4>
            )}
            {budget > 0 && (
              <p className="text-gray-200 text-xs">Budget: ₹{(budget / 100000).toFixed(1)}L</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
