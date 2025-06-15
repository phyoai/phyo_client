// components/InfluencersTable.jsx
'use client'
import React from 'react';

const InfluencersTable = () => {
  // Sample influencer data
  const influencers = [
    {
      id: 1,
      username: '@King',
      avatar: '/api/placeholder/40/40',
      deliverables: '1 of 1',
      totalCost: 16,
      comments: '23k',
      likes: '455k',
      cpe: '0.70%',
      cpv: '0.70%'
    },
    {
      id: 2,
      username: '@Kong',
      avatar: '/api/placeholder/40/40',
      deliverables: '1 of 1',
      totalCost: 12,
      comments: '23k',
      likes: '455k',
      cpe: '0.46%',
      cpv: '0.46%'
    },
    {
      id: 3,
      username: '@Kong',
      avatar: '/api/placeholder/40/40',
      deliverables: '1 of 1',
      totalCost: 12,
      comments: '23k',
      likes: '455k',
      cpe: '0.46%',
      cpv: '0.46%'
    },
    {
      id: 4,
      username: '@Kong',
      avatar: '/api/placeholder/40/40',
      deliverables: '1 of 1',
      totalCost: 12,
      comments: '23k',
      likes: '455k',
      cpe: '0.46%',
      cpv: '0.46%'
    },
    {
      id: 5,
      username: '@Kong',
      avatar: '/api/placeholder/40/40',
      deliverables: '1 of 1',
      totalCost: 12,
      comments: '23k',
      likes: '455k',
      cpe: '0.46%',
      cpv: '0.46%'
    }
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Influencers (25)</h2>
          <button className="text-green-600 hover:text-green-700 font-medium">
            View all
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-green-600 text-white">
            <div className="grid grid-cols-7 gap-4 px-6 py-4">
              <div className="font-medium">Profile</div>
              <div className="font-medium">Deliverables</div>
              <div className="font-medium">Total Cost</div>
              <div className="font-medium">Comments</div>
              <div className="font-medium">Likes</div>
              <div className="font-medium">CPE</div>
              <div className="font-medium">CPV</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {influencers.map((influencer, index) => (
              <div 
                key={influencer.id}
                className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Profile Column */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {influencer.username.charAt(1).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {influencer.username}
                  </span>
                </div>

                {/* Deliverables Column */}
                <div className="flex items-center">
                  <span className="text-gray-700">{influencer.deliverables}</span>
                </div>

                {/* Total Cost Column */}
                <div className="flex items-center">
                  <span className="text-gray-700">{influencer.totalCost}</span>
                </div>

                {/* Comments Column */}
                <div className="flex items-center">
                  <span className="text-gray-700">{influencer.comments}</span>
                </div>

                {/* Likes Column */}
                <div className="flex items-center">
                  <span className="text-gray-700">{influencer.likes}</span>
                </div>

                {/* CPE Column */}
                <div className="flex items-center">
                  <span className="text-gray-700">{influencer.cpe}</span>
                </div>

                {/* CPV Column */}
                <div className="flex items-center">
                  <span className="text-gray-700">{influencer.cpv}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer/Load More */}
        <div className="mt-6 text-center">
          <button className="text-green-600 hover:text-green-700 font-medium">
            Load more influencers
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencersTable;