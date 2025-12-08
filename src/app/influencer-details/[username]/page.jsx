'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  ImageIcon, 
  CheckCircle, 
  Briefcase,
  TrendingUp,
  Globe,
  MapPin,
  Calendar,
  Heart
} from 'lucide-react';
import GenderChart from '@/components/charts/GenderChart';
import AgeChart from '@/components/charts/AgeChart';
import LocationChart from '@/components/charts/LocationChart';
import LanguageChart from '@/components/charts/LanguageChart';
import AudienceQualityCard from '@/components/cards/AudienceQualityCard';
import EngagementCard from '@/components/cards/EngagementCard';

export default function InfluencerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username;
  
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetchInfluencerDetails(username);
    }
  }, [username]);

  const fetchInfluencerDetails = async (username) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get data from localStorage (stored by search results page)
      const storedData = localStorage.getItem('influencer_search_results');
      
      if (storedData) {
        const results = JSON.parse(storedData);
        const found = results.find(inf => inf.username === username);
        
        if (found) {
          setInfluencer(found);
          setLoading(false);
          return;
        }
      }
      
      // If not found in localStorage, user needs to search again
      setError('Influencer data not found. Please go back and search again to view details.');
      setLoading(false);
      
    } catch (err) {
      console.error('Error loading influencer details:', err);
      setError('Failed to load influencer details. Please try searching again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Function to proxy image URL
  const getProxiedImageUrl = (url) => {
    if (!url) return '/dummyAvatar.jpg';
    
    // Google Translate proxy method (same as Hero.jsx)
    let p = url?.split("/") || [""];
    let t = '';
    for (let i = 0; i < p.length; i++) {
      if (i == 2) {
        t += p[i].replaceAll('-', '--').replaceAll('.', '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
      } else {
        if (i != p.length - 1) {
          t += p[i] + '/';
        } else {
          t += p[i];
        }
      }
    }
    return encodeURI(t);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading influencer details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Influencer not found'}</p>
          <button
            onClick={handleBack}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const { demographics } = influencer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(34 197 94) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Header with Back Button */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors group font-medium"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Search</span>
          </button>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
        {/* Profile Header - Clean Professional Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-8"
        >
          {/* Top Banner */}
          <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 relative">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          {/* Content */}
          <div className="relative px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-16">
              {/* Profile Picture */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative shrink-0"
              >
                <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
                  <img
                    src={getProxiedImageUrl(influencer.profile_pic_url)}
                    alt={influencer.profile_name}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/dummyAvatar.jpg';
                    }}
                  />
                </div>
                {influencer.is_verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg"
                  >
                    <CheckCircle className="text-white" size={20} />
                  </motion.div>
                )}
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 pt-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1"
                >
                  {influencer.profile_name}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-3"
                >
                  @{influencer.username}
                </motion.p>

                {/* Badges Row */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {influencer.is_business && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                      <Briefcase size={14} />
                      Business Account
                    </span>
                  )}
                </motion.div>
                
                {influencer.biography && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-700 leading-relaxed max-w-3xl"
                  >
                    {influencer.biography}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Stats Row - Clean Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-green-600" size={20} />
                  <p className="text-sm text-gray-600 font-medium">Followers</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(influencer.followers)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="text-blue-600" size={20} />
                  <p className="text-sm text-gray-600 font-medium">Following</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(influencer.following)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="text-purple-600" size={20} />
                  <p className="text-sm text-gray-600 font-medium">Posts</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(influencer.posts_count)}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="text-pink-600" size={20} />
                  <p className="text-sm text-gray-600 font-medium">Engagement</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{influencer.avg_engagement?.toFixed(2)}%</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Audience Quality & Engagement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AudienceQualityCard demographics={demographics} />
          <EngagementCard 
            avgEngagement={influencer.avg_engagement}
            followers={influencer.followers}
            demographics={demographics}
          />
        </div>

        {/* Demographics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gender Distribution */}
          <GenderChart data={demographics?.gender_distribution} />

          {/* Age Distribution */}
          <AgeChart data={demographics?.age_distribution} />

          {/* Country Distribution */}
          <LocationChart 
            data={demographics?.country_distribution} 
            title="Top Countries"
            type="country"
          />

          {/* City Distribution */}
          <LocationChart 
            data={demographics?.city_distribution} 
            title="Top Cities"
            type="city"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatBadge({ icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm`}
    >
      <div className="opacity-70">{icon}</div>
      <div>
        <p className="text-xs opacity-80">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-green-300/30 pb-2">
      <span className="text-green-50">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}

// Helper Functions
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
