'use client'
import React from 'react';
import { ChevronLeft, MoreVertical, Share2, Download, DollarSign, Users, FileText, Calendar, Plus, Play, User2 } from 'lucide-react';

export default function CampaignSummary() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 flex-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Campaign Summary</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Campaign Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                L
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Lenskart</h2>
                <p className="text-base text-gray-600">Campaign Brief</p>
              </div>
            </div>
            {/* Status Badge */}
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              On going
            </span>
          </div>

          {/* Campaign Description */}
          <div>
            <p className="text-base text-gray-700 leading-relaxed">
              Engage influencers to promote our latest beverage and encourage their followers to try it out. Let's create buzz and excitement around this new drink!
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Budget */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">Budget</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">$25,000</p>
              <p className="text-xs text-gray-500 mt-2">64% used</p>
            </div>

            {/* Influencers */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">Influencers</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-xs text-gray-500 mt-2">2 active</p>
            </div>

            {/* Total Posts */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">Total Posts</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">41</p>
              <p className="text-xs text-gray-500 mt-2">Deliverables</p>
            </div>

            {/* Duration */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">Duration</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">30</p>
              <p className="text-xs text-gray-500 mt-2">Days</p>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Campaign Details</h3>

            {/* Goal */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Goal</p>
              <p className="text-base text-gray-900">
                Drive awareness and engagement for our new summer fashion collection
              </p>
            </div>

            {/* Campaign Type */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 font-medium mb-3">Campaign Type</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
                  Brand Awareness
                </span>
                <span className="bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
                  Product Launch
                </span>
              </div>
            </div>

            {/* Target Countries */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Target Countries</p>
              <p className="text-base text-gray-900">
                United States, Canada, United Kingdom
              </p>
            </div>

            {/* Campaign Period */}
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Campaign Period</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <p className="text-base text-gray-900">June 1, 2026 → June 30, 2026</p>
              </div>
            </div>
          </div>

          {/* Deliverables Breakdown */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Deliverables Breakdown</h3>

            <div className="space-y-4">
              {/* Instagram Story */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-gray-700" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Instagram Story</h4>
                    <p className="text-sm text-gray-600">UTC • Duration 15 Secs</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                  1
                </div>
              </div>

              {/* Instagram Reel */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Play className="w-6 h-6 text-gray-700" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Instagram Reel</h4>
                    <p className="text-sm text-gray-600">UTC • Duration 30-60 Secs</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                  3
                </div>
              </div>
            </div>
          </div>

          {/* Influencer Targeting */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Influencer Targeting</h3>

            <div className="space-y-4">
              {/* Influencers */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <p className="text-base text-gray-600 font-medium">Influencers</p>
                </div>
                <p className="text-lg font-bold text-gray-900">15</p>
              </div>

              {/* Follower Range */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <p className="text-base text-gray-600 font-medium">Follower Range</p>
                <p className="text-base text-gray-900">10K – 100K</p>
              </div>

              {/* Age Range */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <p className="text-base text-gray-600 font-medium">Age Range</p>
                <p className="text-base text-gray-900">18 – 35 years</p>
              </div>

              {/* Interests */}
              <div className="py-3">
                <p className="text-base text-gray-600 font-medium mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    Fashion
                  </span>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    Lifestyle
                  </span>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    Beauty
                  </span>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    Travel
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Compensation */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Budget & Compensation</h3>

            <div className="space-y-4 mb-6">
              {/* Total Allocated */}
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-600 font-medium">Total Allocated</p>
                <p className="text-lg font-bold text-gray-900">$50,000</p>
              </div>

              {/* Amount Used */}
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-600 font-medium">Amount Used</p>
                <p className="text-lg font-bold text-gray-900">$32,000</p>
              </div>

              {/* Remaining */}
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-600 font-medium">Remaining</p>
                <p className="text-lg font-bold text-gray-900">$18,000</p>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">₹32,000 used</p>
                  <p className="text-sm font-bold text-gray-900">64%</p>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-700" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>

            {/* Compensation Model */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-base text-gray-600 font-medium mb-3">Compensation Model</p>
              <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
                Per Influencer
              </span>
            </div>
          </div>

          {/* Campaign Status Timeline */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Campaign Status</h3>

            <div className="space-y-6">
              {/* Brief Created */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-green-700"></div>
                  <div className="w-0.5 h-12 bg-green-700 my-2"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Brief Created</h4>
                  <p className="text-sm text-gray-600">May 15</p>
                </div>
              </div>

              {/* Influencer Approval */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-green-700"></div>
                  <div className="w-0.5 h-12 bg-green-700 my-2"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Influencer Approval</h4>
                  <p className="text-sm text-gray-600">May 25</p>
                </div>
              </div>

              {/* Campaign Live */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600">Campaign Live</h4>
                  <p className="text-sm text-gray-600">June 1</p>
                </div>
              </div>

              {/* Campaign End */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-600">Campaign End</h4>
                  <p className="text-sm text-gray-600">June 30</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}