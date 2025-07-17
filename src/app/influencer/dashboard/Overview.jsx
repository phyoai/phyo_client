// components/Overview.jsx
'use client'
import React from 'react';
import { Facebook, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';

const Overview = ({ 
  data = {
    location: "Delhi NCR",
    languages: "English, Hindi",
    socialLinks: {
      facebook: "https://facebook.com/user",
      linkedin: "https://linkedin.com/user", 
      instagram: "https://instagram.com/user",
      youtube: "https://youtube.com/user",
      twitter: "https://twitter.com/user"
    }
  }
}) => {
  const socialIcons = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: data.socialLinks.facebook,
      color: 'text-blue-600 hover:text-blue-700'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: data.socialLinks.linkedin,
      color: 'text-blue-700 hover:text-blue-800'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: data.socialLinks.instagram,
      color: 'text-pink-600 hover:text-pink-700'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: data.socialLinks.youtube,
      color: 'text-red-600 hover:text-red-700'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: data.socialLinks.twitter,
      color: 'text-blue-500 hover:text-blue-600'
    }
  ];

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h2>

        {/* Overview Content */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="space-y-6">
            {/* Location */}
            <div className="flex items-start">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">Location</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900">{data.location}</span>
              </div>
            </div>

            {/* Languages */}
            <div className="flex items-start">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">Languages speaks</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900">{data.languages}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-start">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">Social links</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  {socialIcons.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors group`}
                        title={social.name}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;