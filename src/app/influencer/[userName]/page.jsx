"use client";
import { useParams } from 'next/navigation';
import demoInfluencers from '../../../data/demoInfluencers';
import React from 'react';

const InfluencerDetail = () => {
  const params = useParams();
  const { userName } = params;
  const influencer = demoInfluencers.find(
    (inf) => inf.user_name === userName
  );

  if (!influencer) {
    return <div className="text-center mt-20 text-2xl">Influencer not found.</div>;
  }

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="flex flex-col items-center mb-8">
          <img
            src={influencer.image}
            alt={influencer.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-green-200 mb-4"
          />
          <h2 className="text-3xl font-bold mb-2">{influencer.name}</h2>
          <p className="text-gray-500">@{influencer.user_name}</p>
          <p className="text-green-700 text-sm font-medium mt-2">{influencer.categoryInstagram}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">City:</span>
            <span>{influencer.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Instagram Followers:</span>
            <span>{influencer.instagramData?.followers?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">YouTube Followers:</span>
            <span>{influencer.youtubeData?.followers?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Followers:</span>
            <span>{(influencer.instagramData?.followers + influencer.youtubeData?.followers).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetail;
