import React from 'react';
import Image from 'next/image';

const FeatureSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* First Section - Find Creators */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-gray-600 backdrop-blur-sm">
              Search Instantly
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Creators
              <br />
              <span className="text-green-600">in Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              No more scrolling for hours. Just type your niche, and our AI 
              shows you the best and Right Influencers in seconds.
            </p>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/feature4.png"
                alt="Creator search interface"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl transform rotate-3 opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Second Section - Campaign Tracking */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 bg-gray-50 rounded-2xl shadow-2xl p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/landing/feature1.png"
                alt="Campaign tracking dashboard"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl transform -rotate-3 opacity-20"></div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-600">
              Real Results
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Tracking your
              <br />
              <span className="text-blue-600">Campaigns Live</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              See clear performance reports and accurate ROI 
              tracking from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Third Section - Fully Managed */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
              Zero Hassle
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Fully Managed
              <br />
              <span className="text-gray-700">Campaigns</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              From Delhi to Dubai, LA to London get access to 300k+ real 
              influencers across 15+ Countries and 95+ languages.
            </p>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/feature3.png"
                alt="Campaign management interface"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl transform rotate-3 opacity-20"></div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default FeatureSection;