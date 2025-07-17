import React from 'react';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Content */}
        <div className="space-y-8">
          <h1 className="text-[48px]  font-bold text-gray-900 leading-tight">
            AI Search, Verified
            <br />
            Influencers, Live Tracking.
            <br />
            <span className="text-gray-700">We've Got Everything For</span>
            <br />
            <span className="text-green-600">Your Brand To Win.</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            You don't need luck. You need data, speed and a tool that actually 
            works Phyo is that weapon.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg group">
              Start with Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button className="inline-flex items-center px-8 py-4 border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-colors duration-200 group">
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side - Dashboard Preview */}
        <div className="relative">
          {/* Main Dashboard Container */}
          <div className="relative bg-green-500 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Dashboard Content */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/feature1.png"
                alt="Phyo Dashboard Interface"
                width={700}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            
            {/* Get PHYO Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">Get PHYO</div>
                  <div className="text-sm text-gray-600">
                    Simple, Fast & Feature rich,
                    <br />
                    premium features.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-green-300 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 -right-16 w-24 h-24 bg-green-400 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Optional: Floating Feature Pills */}
     
    </section>
  );
};

export default CTASection;