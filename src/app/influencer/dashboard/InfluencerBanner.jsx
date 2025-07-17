// components/InfluencerBanner.jsx
'use client'
import React from 'react';
import { ChevronDown } from 'lucide-react';

const InfluencerBanner = ({ 
  influencer = {
    name: "Bhuvan bam",
    category: "Skin care",
    avatar: "/api/placeholder/80/80",
    followers: "9.7k",
    viewRate: "17.1",
    engagementRate: "27.4",
    socialMedia: {
      instagram: "20.6M",
      youtube: "20.6M"
    }
  }
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Green Header */}
      <div className="bg-green-600 text-white text-center py-6">
        <h1 className="text-2xl font-bold tracking-wider">BANNER</h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-start justify-between mb-6">
          {/* Left: Avatar and Info */}
          <div className="flex items-start space-x-4">
            <img
              src={influencer.avatar}
              alt={influencer.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {influencer.name}
              </h2>
              <p className="text-sm text-gray-600">{influencer.category}</p>
            </div>
          </div>

          {/* Right: Social Media Stats */}
          <div className="flex items-center space-x-4">
            {/* Instagram */}
            <div className="flex items-center space-x-2 bg-pink-50 px-3 py-2 rounded-lg">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{influencer.socialMedia.instagram}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* YouTube */}
            <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
              <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{influencer.socialMedia.youtube}</span>
            </div>
          </div>
        </div>

        {/* Stats and Contact Section */}
        <div className="flex items-end justify-between">
          {/* Stats */}
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{influencer.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{influencer.viewRate}</div>
              <div className="text-sm text-gray-600">View rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{influencer.engagementRate}</div>
              <div className="text-sm text-gray-600">Engagement rate</div>
            </div>
          </div>

          {/* Contact Button */}
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Contact Now
          </button>
        </div>
      </div>

      {/* Overview Section */}
      <div className="px-6 pb-6">
        <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
      </div>
    </div>
  );
};

export default InfluencerBanner;