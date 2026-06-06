import React from 'react';
import { useRouter } from 'next/navigation';

export default function InlineConversionCard({
  eyebrow = "PREMIUM ACCESS",
  title = "Boost your reach",
  description = "Upgrade to Influencer Pro or Brand Premium to unlock exclusive analytics and campaigns.",
  primaryButtonText = "Get Premium Access",
  secondaryButtonText = "Learn More"
}) {
  const router = useRouter();

  return (
    <div
      className="mb-8 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
      style={{ background: 'linear-gradient(-56.7deg, #16a34a 37.6%, #073618 98.8%)' }}
    >
      {/* Content */}
      <div className="relative z-10 max-w-xl">
        <p className="text-[11px] uppercase tracking-widest mb-3 font-medium" style={{ color: '#ffdbb4' }}>
          {eyebrow}
        </p>
        <h2 className="text-2xl font-['Bricolage_Grotesque'] font-normal mb-3">
          {title}
        </h2>
        <p className="text-[#e4e4e4] mb-6 text-sm leading-relaxed max-w-lg">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => router.push('/brand/account/upgrade-plan')}
            className="px-6 py-3 bg-white text-[#16a34a] rounded-full font-medium hover:bg-white/90 transition-colors text-sm"
          >
            {primaryButtonText}
          </button>
          <button
            onClick={() => router.push('/brand/learn-more')}
            className="px-6 py-3 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors text-sm"
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
