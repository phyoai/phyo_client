'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const UpgradeAccountBanner = ({ userType, isVisible }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Show banner for authenticated users who haven't upgraded to brand/influencer accounts
  if (!isVisible) {
    return null;
  }

  const handleUpgradeToBrand = () => {
    router.push('/brand/signup');
  };

  const handleUpgradeToInfluencer = () => {
    router.push('/influencer/signup');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-4 px-6 shadow-lg relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between">
          {/* Main Content */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold">
                Want Full Access?
              </h3>
              <p className="text-white/90 text-sm">
                Upgrade your account to unlock premium features and unlimited access
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/80 hover:text-white text-sm underline transition-colors duration-200"
            >
              {isExpanded ? 'Show Less' : 'Learn More'}
            </button>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgradeToBrand}
                className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
              >
                Join as Brand
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgradeToInfluencer}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
              >
                Join as Influencer
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-6 border-t border-white/20 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand Benefits */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <h4 className="text-lg font-bold mb-3 flex items-center">
                  <span className="bg-white/20 rounded-lg p-2 mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  Join as Brand
                </h4>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Create unlimited campaigns
                  </li>
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Access premium influencer database
                  </li>
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Advanced analytics & insights
                  </li>
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Direct messaging with influencers
                  </li>
                </ul>
              </div>

              {/* Influencer Benefits */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <h4 className="text-lg font-bold mb-3 flex items-center">
                  <span className="bg-white/20 rounded-lg p-2 mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  Join as Influencer
                </h4>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Get discovered by top brands
                  </li>
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Access exclusive brand partnerships
                  </li>
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Detailed audience analytics
                  </li>
                  <li className="flex items-center">
                    <span className="text-white mr-2">✓</span>
                    Secure payment processing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UpgradeAccountBanner;
