import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Reusable Section Heading Component
 * Used across dashboard for consistent section headers with optional view all button
 */
export default function SectionHeading({ 
  title, 
  eyebrow, 
  showViewAll = true,
  onViewAll 
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 font-medium">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {showViewAll && (
        <button 
          onClick={onViewAll}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          view all
          <ChevronRight className="h-4 w-4 ml-0.5" />
        </button>
      )}
    </div>
  );
}
