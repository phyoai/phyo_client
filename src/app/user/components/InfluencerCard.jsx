'use client'
import React from 'react';
import { CheckCircle, Star } from 'lucide-react';

const InfluencerCard = ({ 
  name, 
  description, 
  avatar, 
  rating, 
  reviewCount,
  platforms,
  isVerified = true 
}) => {
  return (
    <div className="bg-[#F3F2EB] rounded-3xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header with Avatar and Verification */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {isVerified && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle className="w-6 h-6 text-[#00674F] bg-white rounded-full" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating} ({reviewCount.toLocaleString()} Reviews)
        </span>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {platforms.map((platform, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-5 h-5 rounded ${platform.color} flex items-center justify-center`}>
                <platform.icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-600">{platform.followers}</span>
            </div>
            <span className="text-xs font-medium text-gray-700">{platform.engagement}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="flex-1 bg-[#00674F] text-white py-2 px-4 rounded-3xl  transition-colors text-sm font-medium ">
          View Profile
        </button>
        <button className="flex-1 bg-[#00674F] text-white py-2 px-4 rounded-3xl  transition-colors text-sm font-medium">
          Send Message
        </button>
      </div>
    </div>
  );
};

export default InfluencerCard;






