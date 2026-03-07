'use client';

import React from 'react';

/**
 * PostTimelineSection Component - SHARED
 * Consolidated from role-specific components
 * Displays timeline data with customizable title and actions
 */
const PostTimelineSection = React.memo(({
  title = 'Post Timeline',
  onViewAll,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-[#F3F2EB] py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 bg-neutral-base p-5 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              View all
            </button>
          )}
        </div>

        {/* Content */}
        {children && (
          <div>
            {children}
          </div>
        )}
      </div>
    </div>
  );
});

PostTimelineSection.displayName = 'PostTimelineSection';
export default PostTimelineSection;
