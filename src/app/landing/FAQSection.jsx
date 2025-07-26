'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const faqs = [
    {
      question: "How do Credits work?",
      answer: "Credits are used all around PHYO for Transparent usage and maximum flexibility."
    },
    {
      question: "Can I try Phyo before subscribing?",
      answer: "Yes, we offer a free trial period where you can explore all features and see how Phyo can help grow your brand before committing to a subscription."
    },
    {
      question: "How Secure is my data on Phyo?",
      answer: "Your data security is our top priority. We use enterprise-grade encryption, secure servers, and follow industry best practices to ensure your information is always protected."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time with no hidden fees or penalties. Your account will remain active until the end of your current billing period."
    },
    {
      question: "Can Phyo actually help me grow my brand fast?",
      answer: "Yes! Our platform is designed to accelerate brand growth through strategic influencer partnerships, advanced analytics, and automated campaign management that delivers measurable results."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 px-6 ">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Side - Illustration */}
        <div className="relative mt-40">
          <div className="bg-green-100 rounded-3xl p-12 relative overflow-hidden flex items-center justify-center min-h-[340px]">
            <img 
              src="/faq.png" 
              alt="FAQ Illustration" 
              className="w-full h-full object-contain max-h-72 rounded-2xl shadow-lg" 
            />
          </div>
        </div>

        {/* Right Side - FAQ Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              FAQs
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Frequently asked questions
            </h2>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'bg-green-500 text-white' : 'bg-white hover:border-green-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                >
                  <span className="font-semibold text-lg">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-green-400 pt-4">
                      <p className="text-green-50 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;