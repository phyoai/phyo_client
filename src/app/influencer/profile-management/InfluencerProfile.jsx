import React from 'react';
import { Edit2, MapPin, Facebook, Linkedin, Instagram, Youtube, Twitter, MoreHorizontal, TrendingUp, Eye } from 'lucide-react';

const InfluencerProfileDashboard = () => {
  const profileStats = [
    { value: "489.09k", growth: "26.6%", label: "Profile Search" },
    { value: "489.09k", growth: "26.6%", label: "Profile Search" },
    { value: "489.09k", growth: "26.6%", label: "Profile Search" }
  ];

  const countryData = [
    { country: "Bangladesh", flag: "🇧🇩", percentage: 80, color: "bg-emerald-500" },
    { country: "Canada", flag: "🇨🇦", percentage: 60, color: "bg-orange-500" },
    { country: "United States", flag: "🇺🇸", percentage: 60, color: "bg-red-500" }
  ];

  const mapMarkers = [
    { id: 1, top: "25%", left: "20%", value: "2.7k" },
    { id: 2, top: "40%", left: "60%", value: "1.2k" },
    { id: 3, top: "55%", left: "75%", value: "3.1k" },
    { id: 4, top: "70%", left: "15%", value: "890" },
    { id: 5, top: "35%", left: "85%", value: "1.5k" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                alt="Ashish Chanchlani"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ashish Chanchlani</h1>
                <p className="text-gray-600">YouTuber | Comedian</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">30M</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">7.1%</div>
                <div className="text-sm text-gray-600">View rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">27.5%</div>
                <div className="text-sm text-gray-600">Engagement rate</div>
              </div>
              <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 mb-6">
            Ashish has one of India's biggest comedy channels with pure desi humor, emotional punchlines and great character energy. From viral skits to trending collabs, his content connects like no other.
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Mumbai, India</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
              <div className="flex space-x-3">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
              AI Optimisation
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Stats Cards Row */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-emerald-600 p-2 rounded-lg">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm">{stat.label}</span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="flex items-center bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Country Analytics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">14.8k</h3>
              </div>
              <button className="text-emerald-600 text-sm hover:text-emerald-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-gray-700">{country.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${country.color}`}
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-500 text-sm">{country.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* World Map */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg relative overflow-hidden">
                {/* Simplified world map pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <defs>
                      <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                        <circle cx="4" cy="4" r="1" fill="#059669" />
                      </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#dots)" />
                  </svg>
                </div>
                
                {/* Map markers */}
                {mapMarkers.map((marker) => (
                  <div
                    key={marker.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: marker.top, left: marker.left }}
                  >
                    <div className="bg-emerald-600 p-2 rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                ))}
                
                {/* Central large marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg">
                    <div className="text-lg font-bold">2.78k</div>
                    <div className="text-xs opacity-75">Central District</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Visitor Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Total Visitor</h3>
            <div className="flex items-center bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              26.6%
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="125 251"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="63 251"
                  strokeDashoffset="-125"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#ef4444"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="31 251"
                  strokeDashoffset="-188"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 text-sm">Chrome</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 text-sm">Safari</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 text-sm">Edge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileDashboard;