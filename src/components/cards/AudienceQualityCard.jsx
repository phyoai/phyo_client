'use client';

import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function AudienceQualityCard({ demographics }) {
  if (!demographics) return null;

  const qualityScore = demographics.audience_quality_score || 0;
  const fakeFollowers = demographics.fake_followers_percent || 0;
  
  // Determine quality level
  let qualityLevel = 'Excellent';
  let qualityColor = 'text-green-600';
  let qualityBg = 'bg-green-100';
  let progressColor = 'bg-gradient-to-r from-green-400 to-green-600';
  
  if (qualityScore < 50) {
    qualityLevel = 'Poor';
    qualityColor = 'text-red-600';
    qualityBg = 'bg-red-100';
    progressColor = 'bg-gradient-to-r from-red-400 to-red-600';
  } else if (qualityScore < 70) {
    qualityLevel = 'Fair';
    qualityColor = 'text-orange-600';
    qualityBg = 'bg-orange-100';
    progressColor = 'bg-gradient-to-r from-orange-400 to-orange-600';
  } else if (qualityScore < 85) {
    qualityLevel = 'Good';
    qualityColor = 'text-blue-600';
    qualityBg = 'bg-blue-100';
    progressColor = 'bg-gradient-to-r from-blue-400 to-blue-600';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className={`bg-gradient-to-br ${qualityBg.replace('bg-', 'from-')}-50 ${qualityBg.replace('bg-', 'to-')}-100 p-2.5 rounded-lg`}>
          <Shield className={qualityColor} size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Audience Quality</h3>
          <p className="text-xs text-gray-500">Authenticity score</p>
        </div>
      </div>

      {/* Quality Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - qualityScore / 100)}`}
              strokeLinecap="round"
              className={qualityColor}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - qualityScore / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${qualityColor}`}>{qualityScore}</span>
            <span className="text-gray-500 text-sm">/ 100</span>
          </div>
        </div>
      </div>

      {/* Quality Badge */}
      <div className={`${qualityBg} rounded-xl p-4 mb-4 text-center`}>
        <p className="text-sm text-gray-600 mb-1">Quality Rating</p>
        <p className={`text-2xl font-bold ${qualityColor}`}>{qualityLevel}</p>
      </div>

      {/* Info Note */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Audience quality score indicates the authenticity and engagement level of the influencer's followers based on multiple factors.
        </p>
      </div>

    </motion.div>
  );
}
