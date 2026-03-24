// components/HelpAndSupportSection.jsx
'use client'
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const HelpAndSupportSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: "How do I create a new campaign?",
      answer: "To create a new campaign, click on the 'Create New Campaign' button in the top right corner of your dashboard. Follow the step-by-step wizard to set up your campaign details, select influencers, and launch your campaign."
    },
    {
      id: 2,
      question: "How do I create a new campaign?",
      answer: "You can create campaigns by navigating to the campaigns section and clicking the create button. Make sure to fill out all required fields including budget, target audience, and campaign objectives."
    },
    {
      id: 3,
      question: "How do I create a new campaign?",
      answer: "Start by defining your campaign goals, then select your target audience and budget. Our platform will guide you through the entire process with helpful tips and best practices."
    },
    {
      id: 4,
      question: "How do I create a new campaign?",
      answer: "Campaign creation involves several steps: setting objectives, choosing influencers, defining deliverables, and setting budgets. Our intuitive interface makes this process simple and efficient."
    }
  ];

  // Toggle FAQ accordion
  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', contactForm);
    // Here you would typically send the form data to your backend
    alert('Message sent successfully! We\'ll get back to you soon.');
    setContactForm({ subject: '', message: '' });
  };

  return (
    <div className="bg-[#F5F3EE] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help & Support</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search influencer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Getting Started Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-500 text-sm mb-4">Learn the basic of creating and managing campaigns</p>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Campaign Management Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Management</h3>
            <p className="text-gray-500 text-sm mb-4">Tips for running successful influencer campaigns</p>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-0">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 transition-colors rounded px-2"
                >
                  <span className="text-gray-700 text-sm font-normal">{faq.question}</span>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {/* Accordion Content */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-96 pb-4' : 'max-h-0'
                }`}>
                  <div className="text-gray-600 text-sm leading-relaxed px-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                placeholder="What can we help you with?"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                placeholder="What can we help you with?"
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-vertical text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupportSection;
