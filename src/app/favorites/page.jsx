'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Trash2, AlertCircle } from 'lucide-react';
import { favoritesApi } from '@/api/favorites-api';

const FavoriteSkeleton = () => (
  <div className="h-40 bg-gray-200 rounded animate-pulse" />
);

export default function FavoritesPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch favorites on mount and when tab changes
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'campaigns' || activeTab === 'all') {
          const campaignResponse = await favoritesApi.getFavoriteCampaigns({ page: 1, limit: 20 });
          setCampaigns(campaignResponse.favorites || []);
        }

        if (activeTab === 'influencers' || activeTab === 'all') {
          const influencerResponse = await favoritesApi.getFavoriteInfluencers({ page: 1, limit: 20 });
          setInfluencers(influencerResponse.favorites || []);
        }

        if (activeTab === 'brands' || activeTab === 'all') {
          const brandResponse = await favoritesApi.getFavoriteBrands({ page: 1, limit: 20 });
          setBrands(brandResponse.favorites || []);
        }
      } catch (err) {
        setError(err?.message || 'Failed to load favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab]);

  const handleRemove = async (itemId, itemType) => {
    try {
      setActionLoading(true);
      await favoritesApi.removeFavorite(itemType, itemId);

      // Update local state
      if (itemType === 'campaign') {
        setCampaigns(campaigns.filter(c => c.itemId !== itemId));
      } else if (itemType === 'influencer') {
        setInfluencers(influencers.filter(i => i.itemId !== itemId));
      } else if (itemType === 'brand') {
        setBrands(brands.filter(b => b.itemId !== itemId));
      }

      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to remove favorite');
      console.error('Error removing favorite:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getTotalCount = () => {
    return campaigns.length + influencers.length + brands.length;
  };

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
    { id: 'influencers', label: 'Influencers', count: influencers.length },
    { id: 'brands', label: 'Brands', count: brands.length },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-xl font-semibold">Favorites</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 border-b border-gray-100 flex gap-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setError(null);
            }}
            className={`pb-2 whitespace-nowrap font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <FavoriteSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && getTotalCount() === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-center text-gray-500 text-lg">No favorites yet</p>
            <p className="text-center text-gray-400 text-sm mt-2">
              Start adding {activeTab} to your favorites
            </p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && activeTab === 'campaigns' && campaigns.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {campaigns.map(item => (
              <div
                key={item.itemId}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {item.itemImage && (
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => handleRemove(item.itemId, 'campaign')}
                    disabled={actionLoading}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-2">{item.itemName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaigns Empty */}
        {!loading && activeTab === 'campaigns' && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-gray-500">No favorite campaigns</p>
          </div>
        )}

        {/* Influencers Grid */}
        {!loading && activeTab === 'influencers' && influencers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {influencers.map(item => (
              <div
                key={item.itemId}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {item.itemImage && (
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => handleRemove(item.itemId, 'influencer')}
                    disabled={actionLoading}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-2">{item.itemName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Influencers Empty */}
        {!loading && activeTab === 'influencers' && influencers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-gray-500">No favorite influencers</p>
          </div>
        )}

        {/* Brands Grid */}
        {!loading && activeTab === 'brands' && brands.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map(item => (
              <div
                key={item.itemId}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {item.itemImage && (
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => handleRemove(item.itemId, 'brand')}
                    disabled={actionLoading}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-2">{item.itemName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Brands Empty */}
        {!loading && activeTab === 'brands' && brands.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-gray-500">No favorite brands</p>
          </div>
        )}
      </div>
    </div>
  );
}
