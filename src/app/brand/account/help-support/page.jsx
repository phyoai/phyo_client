'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, FileText, MessageSquare, Mail, Phone, X } from 'lucide-react';

export default function HelpSupport() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const faqs = [
    "How to use the app?",
    "How to convert to an influencer account?",
    "What's the difference between influencer and brand accounts?",
    "How do I choose the right influencer for my brand?",
    "How can user feedback improve product design?"
  ];

  const FaqItem = ({ question }) => (
    <button className="w-full flex items-center px-6 py-5 bg-white hover:bg-gray-50 transition-colors">
      <FileText className="w-6 h-6 text-[#43573b] mr-3 flex-shrink-0" strokeWidth={1.5} />
      <span className="text-base font-semibold text-[#242527] text-left">{question}</span>
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* App Bar */}
      <div className="flex items-center justify-between px-1 py-2 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#242527]" />
        </button>
        
        <h1 className="flex-1 text-xl font-semibold text-[#242527] px-2">
          Help & Support
        </h1>
        
        <button className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-6 h-6 text-[#242527]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-9 relative">
        {/* FAQs Section */}
        <div className="pt-4 px-4">
          <p className="text-xs text-[#505152] mb-2">FAQs</p>
        </div>

        <div className="w-full">
          {faqs.map((question, index) => (
            <FaqItem key={index} question={question} />
          ))}
        </div>

        {/* Contact Us FAB */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-9 right-9 bg-[#43573b] hover:bg-[#3d4f36] text-white px-4 py-4 rounded-xl flex items-center gap-2 shadow-lg transition-colors"
        >
          <MessageSquare className="w-6 h-6" strokeWidth={1.5} />
          <span className="text-base font-semibold">Contact Us</span>
        </button>
      </div>

      {/* Contact Us Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-[400px] max-w-[90%] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4">
              <h2 className="text-lg font-semibold text-[#242527]">Contact us by</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#242527]" />
              </button>
            </div>

            {/* Contact Options */}
            <div className="flex flex-col">
              {/* Email Option */}
              <button className="flex items-center w-full hover:bg-gray-50 transition-colors">
                <div className="flex items-center px-6 py-5">
                  <Mail className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 py-3 pr-4">
                  <p className="text-base font-semibold text-[#242527] text-left">Email</p>
                </div>
              </button>

              {/* Call Us Option */}
              <button className="flex items-center w-full hover:bg-gray-50 transition-colors">
                <div className="flex items-center px-6 py-5">
                  <Phone className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 py-3 pr-4">
                  <p className="text-base font-semibold text-[#242527] text-left">Call Us</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
