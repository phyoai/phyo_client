import { useState } from 'react';
import { MoreVertical, TrendingUp } from 'lucide-react';

export default function CampaignCard({
  brandName,
  brandInitials,
  timeAgo,
  campaignImage,
  initialsColor = 'bg-[#16A34A]',
  onMenuClick,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-3xl overflow-hidden cursor-pointer shrink-0 w-full flex flex-col h-[260px] transition-all duration-200 border border-white/5"
      style={{ backgroundColor: hovered ? '#F8FFF7' : '#181818' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Content */}
      <div className="h-[72px] shrink-0 flex items-center" style={{ padding: '12px 4px 12px 16px' }}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`shrink-0 w-10 h-10 ${initialsColor} rounded-full flex items-center justify-center text-white font-medium text-base`}>
            {brandInitials || brandName?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <p className="text-base font-medium leading-6 truncate transition-colors duration-200"
               style={{ color: hovered ? '#1D1B20' : '#ffffff' }}>
              {brandName}
            </p>
            <p className="text-sm font-normal leading-5 truncate transition-colors duration-200"
               style={{ color: hovered ? '#49454F' : '#9A9A9A' }}>
              {timeAgo}
            </p>
          </div>
        </div>
        <button
          className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors"
          style={{ color: hovered ? '#1D1B20' : '#ffffff' }}
          onClick={(e) => { e.stopPropagation(); onMenuClick?.(); }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Media — fills rest */}
      <div
        className="flex-1 relative overflow-hidden transition-colors duration-200"
        style={{ backgroundColor: hovered ? '#E6F0E6' : '#252525' }}
      >
        {campaignImage ? (
          <img
            src={campaignImage}
            alt={brandName}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-12 h-12" style={{ color: hovered ? '#16A34A' : '#404040' }} />
          </div>
        )}
      </div>
    </div>
  );
}
