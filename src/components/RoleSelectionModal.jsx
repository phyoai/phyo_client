'use client'
import React from 'react';
import { X } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose, onSelectInfluencer, onSelectBrand }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Award/Badge Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                {/* Ribbon tails */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <div className="w-6 h-8 bg-blue-500 clip-ribbon"></div>
                  <div className="w-6 h-8 bg-blue-600 clip-ribbon"></div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Turn influence into opportunity
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Join as a creator to collaborate with brands, or as a business to launch influencer campaigns.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onSelectInfluencer}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Continue as Influencer
              </button>
              <button
                onClick={onSelectBrand}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-full font-medium hover:from-teal-800 hover:to-teal-900 transition-all shadow-md hover:shadow-lg"
              >
                Continue as a Brand
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .clip-ribbon {
          clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
        }
      `}</style>
    </>
  );
};

export default RoleSelectionModal;
