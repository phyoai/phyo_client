import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Inline Conversion Card Component
 * Call-to-action card to encourage users to reach their goals
 */
export default function InlineConversionCard({ 
  eyebrow = "PREMIUM ACCESS",
  title = "Boost your reach",
  description = "Upgrade to Influencer Pro or Brand Premium to unlock exclusive analytics and campaigns.",
  primaryButtonText = "Get Pro",
  secondaryButtonText = "Learn more"
}) {
  const router = useRouter();

  return (
    <div className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gray-500 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative star shape on right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M60 0L70 50L120 60L70 70L60 120L50 70L0 60L50 50L60 0Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl">
        <p className="text-[10px] uppercase tracking-wider mb-2 font-medium text-gray-400">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          {title}
        </h2>
        <p className="text-gray-300 mb-5 text-sm">
          {description}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => router.push('/brand/get-started')}
            className="px-5 py-2 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
          >
            {primaryButtonText}
          </button>
          <button 
            onClick={() => router.push('/brand/learn-more')}
            className="px-5 py-2 border border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors text-sm"
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
