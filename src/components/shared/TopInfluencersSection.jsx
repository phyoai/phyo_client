'use client'
import React from 'react';
import InfluencerCard from './InfluencerCard';
import { Linkedin, Instagram, Twitter, Youtube } from 'lucide-react';

const influencers = Array(6).fill(null).map((_, i) => ({
  id: i + 1,
  name: 'Andrew Power',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  avatar: '/api/placeholder/64/64',
  rating: 4.2,
  reviewCount: 1024,
  platforms: [
    { icon: Linkedin, followers: '22.5k', engagement: '22.5k', color: 'bg-blue-600' },
    { icon: Instagram, followers: '22.5k', engagement: '22.5k', color: 'bg-pink-500' },
    { icon: Twitter, followers: '22.5k', engagement: '22.5k', color: 'bg-blue-400' },
    { icon: Youtube, followers: '22.5k', engagement: '22.5k', color: 'bg-red-500' },
  ],
}));

const TopInfluencersSection = () => {
  return (
    <div className="bg-[#F3F2EB] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-2 bg-white p-5 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-900">Top influencers</h2>
          <button className="text-green-600 hover:text-green-700 font-medium">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-8 rounded-3xl">
          {influencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              name={influencer.name}
              description={influencer.description}
              avatar={influencer.avatar}
              rating={influencer.rating}
              reviewCount={influencer.reviewCount}
              platforms={influencer.platforms}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopInfluencersSection;
