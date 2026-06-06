import React from 'react';

/**
 * Reusable Brand Card Component
 * Used for displaying brand information in grid layout
 */
export default function BrandCard({ 
  brandName, 
  brandInitial,
  bgColor = 'bg-blue-500',
  onClick 
}) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-4 bg-[#181818] rounded-3xl hover:bg-[#202020] transition-all cursor-pointer border border-white/5"
      onClick={onClick}
    >
      {/* Brand Avatar Circle */}
      <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 group-hover:scale-105 transition-transform`}>
        {brandInitial}
      </div>
      
      {/* Brand Name */}
      <h3 className="text-xs font-medium text-white text-center">
        {brandName}
      </h3>
    </div>
  );
}
