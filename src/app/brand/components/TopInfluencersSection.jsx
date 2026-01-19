'use client'
import React from 'react';
import InfluencerCard from './InfluencerCard';
import { 
  Linkedin, 
  Instagram, 
  Twitter, 
  Youtube,
  Facebook
} from 'lucide-react';

const TopInfluencersSection = () => {
  // Sample influencer data
  const influencers = [
    {
      id: 1,
      name: "Andrew Power",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/64/64", // Replace with actual image
      rating: 4.2,
      reviewCount: 1024,
      platforms: [
        { icon: Linkedin, followers: "22.5k", engagement: "22.5k", color: "bg-blue-600" },
        { icon: Instagram, followers: "22.5k", engagement: "22.5k", color: "bg-pink-500" },
        { icon: Twitter, followers: "22.5k", engagement: "22.5k", color: "bg-blue-400" },
        { icon: Youtube, followers: "22.5k", engagement: "22.5k", color: "bg-red-500" }
      ]
    },
    {
      id: 2,
      name: "Andrew Power",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/64/64",
      rating: 4.2,
      reviewCount: 1024,
      platforms: [
        { icon: Linkedin, followers: "22.5k", engagement: "22.5k", color: "bg-blue-600" },
        { icon: Instagram, followers: "22.5k", engagement: "22.5k", color: "bg-pink-500" },
        { icon: Twitter, followers: "22.5k", engagement: "22.5k", color: "bg-blue-400" },
        { icon: Youtube, followers: "22.5k", engagement: "22.5k", color: "bg-red-500" }
      ]
    },
    {
      id: 3,
      name: "Andrew Power",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/64/64",
      rating: 4.2,
      reviewCount: 1024,
      platforms: [
        { icon: Linkedin, followers: "22.5k", engagement: "22.5k", color: "bg-blue-600" },
        { icon: Instagram, followers: "22.5k", engagement: "22.5k", color: "bg-pink-500" },
        { icon: Twitter, followers: "22.5k", engagement: "22.5k", color: "bg-blue-400" },
        { icon: Youtube, followers: "22.5k", engagement: "22.5k", color: "bg-red-500" }
      ]
    },
    {
      id: 4,
      name: "Andrew Power",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/64/64",
      rating: 4.2,
      reviewCount: 1024,
      platforms: [
        { icon: Linkedin, followers: "22.5k", engagement: "22.5k", color: "bg-blue-600" },
        { icon: Instagram, followers: "22.5k", engagement: "22.5k", color: "bg-pink-500" },
        { icon: Twitter, followers: "22.5k", engagement: "22.5k", color: "bg-blue-400" },
        { icon: Youtube, followers: "22.5k", engagement: "22.5k", color: "bg-red-500" }
      ]
    },
    {
      id: 5,
      name: "Andrew Power",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/64/64",
      rating: 4.2,
      reviewCount: 1024,
      platforms: [
        { icon: Linkedin, followers: "22.5k", engagement: "22.5k", color: "bg-blue-600" },
        { icon: Instagram, followers: "22.5k", engagement: "22.5k", color: "bg-pink-500" },
        { icon: Twitter, followers: "22.5k", engagement: "22.5k", color: "bg-blue-400" },
        { icon: Youtube, followers: "22.5k", engagement: "22.5k", color: "bg-red-500" }
      ]
    },
    {
      id: 6,
      name: "Andrew Power",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/64/64",
      rating: 4.2,
      reviewCount: 1024,
      platforms: [
        { icon: Linkedin, followers: "22.5k", engagement: "22.5k", color: "bg-blue-600" },
        { icon: Instagram, followers: "22.5k", engagement: "22.5k", color: "bg-pink-500" },
        { icon: Twitter, followers: "22.5k", engagement: "22.5k", color: "bg-blue-400" },
        { icon: Youtube, followers: "22.5k", engagement: "22.5k", color: "bg-red-500" }
      ]
    }
  ];

  return (
    <div className="bg-[#F3F2EB] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2 bg-white p-5 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-900">Top influencers</h2>
          <button className="text-green-600 hover:text-green-700 font-medium">
            View all
          </button>
        </div>

        {/* Influencers Grid */}
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
