'use client'
import React from 'react';
import PostTimelineChart from './PostTimeLineChart';

const PostTimelineSection = () => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Post Timeline</h2>
          <button className="text-green-600 hover:text-green-700 font-medium">
            View all
          </button>
        </div>

        {/* Chart Component */}
        <PostTimelineChart />
      </div>
    </div>
  );
};

export default PostTimelineSection;
