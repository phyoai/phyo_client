'use client'
import React, { memo } from 'react';

const InfluencersTable = memo(({
  influencers = [],
  title = 'Influencers',
  count = 25,
  showViewAll = true,
  onViewAll = null,
  backgroundColor = 'bg-[#F5F3EE]',
  columns = ['Profile', 'Deliverables', 'Total Cost', 'Comments', 'Likes', 'CPE', 'CPV']
}) => {
  const defaultInfluencers = [
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

  const data = influencers.length > 0 ? influencers : defaultInfluencers;

  const getColumnValue = (influencer, column) => {
    const columnMap = {
      'Profile': influencer.username,
      'Deliverables': influencer.deliverables,
      'Total Cost': influencer.totalCost,
      'Comments': influencer.comments,
      'Likes': influencer.likes,
      'CPE': influencer.cpe,
      'CPV': influencer.cpv
    };
    return columnMap[column];
  };

  return (
    <div className={`${backgroundColor} py-6`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 bg-neutral-base p-5 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-900">{title} ({count})</h2>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View all
            </button>
          )}
        </div>
        <div className='bg-neutral-base p-6 rounded-3xl'>
          {/* Table Container */}
          <div className="bg-neutral-base rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#00674F] text-white">
              <div className="grid grid-cols-7 gap-4 px-6 py-4">
                {columns.map((column) => (
                  <div key={column} className="font-medium">{column}</div>
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-400 bg-[#F3F2EB]">
              {data.map((influencer) => (
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

                  {/* Other Columns */}
                  {columns.slice(1).map((column) => (
                    <div key={column} className="flex items-center">
                      <span className="text-gray-700">{getColumnValue(influencer, column)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InfluencersTable.displayName = 'InfluencersTable';

export default InfluencersTable;
