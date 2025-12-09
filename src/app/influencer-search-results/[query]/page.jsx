'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

export default function SearchResultsPage() {
  const router = useRouter();
  const params = useParams();
  const query = params?.query;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      fetchInfluencers(decodeURIComponent(query));
    }
  }, [query]);

  const fetchInfluencers = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('https://api.phyo.ai/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchQuery }),
      });
      
      if (!res.ok) throw new Error('Failed to fetch');
      
      const result = await res.json();
      
      if (result.success && result.data) {
        setData(result.data);
        // Store in localStorage for the detail page
        if (typeof window !== 'undefined') {
          localStorage.setItem('influencer_search_results', JSON.stringify(result.data));
        }
      } else {
        throw new Error(result.message || 'No data found');
      }
      
    } catch (err) {
      console.error('Error fetching influencers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInfluencerClick = (username) => {
    router.push(`/influencer-details/${username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Searching for influencers...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Found <span className="font-bold text-green-600">{data?.length || 0}</span> influencer(s) for: 
            <span className="font-semibold ml-2">"{decodeURIComponent(query)}"</span>
          </p>
        </motion.div>

        {/* Results Grid */}
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((influencer, index) => (
              <InfluencerCard
                key={influencer.username}
                influencer={influencer}
                index={index}
                onClick={() => handleInfluencerClick(influencer.username)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No influencers found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfluencerCard({ influencer, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
    >
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
        <img
          src={influencer.profile_pic_url || '/dummyAvatar.jpg'}
          alt={influencer.profile_name}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>

      {/* Profile Info */}
      <div className="pt-16 pb-6 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-800">{influencer.profile_name}</h3>
          {influencer.is_verified && (
            <CheckCircle className="text-blue-500" size={20} />
          )}
        </div>
        
        <p className="text-green-600 font-medium mb-4">@{influencer.username}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatBox label="Followers" value={formatNumber(influencer.followers)} />
          <StatBox label="Posts" value={formatNumber(influencer.posts_count)} />
          <StatBox label="Engagement" value={`${influencer.avg_engagement?.toFixed(1)}%`} />
        </div>

        {/* Quality Badge */}
        {influencer.demographics?.audience_quality_score && (
          <div className="flex items-center justify-center gap-2 bg-green-50 py-2 px-4 rounded-lg mb-4">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-sm font-semibold text-green-700">
              Quality: {influencer.demographics.audience_quality_score}/100
            </span>
          </div>
        )}

        {/* View Details Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
          View Details
          <ArrowRight size={18} className="transition-all" />
        </button>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg py-2">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-gray-800">{value}</p>
    </div>
  );
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
} 