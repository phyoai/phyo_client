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
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${initialsColor} rounded-full flex items-center justify-center text-white font-semibold text-xs`}>
            {brandInitials}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{brandName}</h3>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <button 
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          <HeartLine className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Campaign Image2Line */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src={campaignImage} 
          alt={brandName}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
