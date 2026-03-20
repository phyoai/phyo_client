'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFavorites,
  getFavoriteCampaigns,
  getFavoriteInfluencers,
  getFavoriteBrands,
  removeFavorite,
} from '@/store/slices/favoritesSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Heart, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const dispatch = useDispatch();

  const { items, campaigns, influencers, brands, loading } = useSelector(
    (state) => state.favorites
  );

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(getFavorites());
    dispatch(getFavoriteCampaigns());
    dispatch(getFavoriteInfluencers());
    dispatch(getFavoriteBrands());
  }, [dispatch]);

  const handleRemove = (type, itemId) => {
    dispatch(removeFavorite({ type, itemId }));
  };

  const renderItemCard = (item, type) => (
    <Card key={`${type}-${item.id}`} className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.name || item.title}</h3>
          {item.description && (
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          )}
          {item.budget && (
            <p className="text-sm font-medium text-gray-700 mt-2">
              Budget: ${item.budget?.toLocaleString()}
            </p>
          )}
          {item.followers && (
            <p className="text-sm font-medium text-gray-700 mt-2">
              Followers: {item.followers?.toLocaleString()}
            </p>
          )}
        </div>

        <button
          onClick={() => handleRemove(type, item.id)}
          className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </Card>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500" size={32} />
            Favorites
          </h1>
          <p className="text-gray-600 mt-2">Your saved campaigns, influencers, and brands</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: 'all', label: 'All', count: items.length },
            { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
            { id: 'influencers', label: 'Influencers', count: influencers.length },
            { id: 'brands', label: 'Brands', count: brands.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 font-medium transition-colors border-b-2
                ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }
              `}
            >
              {tab.label} <span className="text-xs ml-2">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'all' && items.length === 0 && (
              <Card className="p-12 text-center">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h2>
                <p className="text-gray-600">
                  Start adding campaigns, influencers, and brands to your favorites!
                </p>
              </Card>
            )}

            {(activeTab === 'all' || activeTab === 'campaigns') && (
              <>
                {campaigns.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaigns</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {campaigns.map((campaign) =>
                        renderItemCard(campaign, 'campaign')
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {(activeTab === 'all' || activeTab === 'influencers') && (
              <>
                {influencers.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Influencers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {influencers.map((influencer) =>
                        renderItemCard(influencer, 'influencer')
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {(activeTab === 'all' || activeTab === 'brands') && (
              <>
                {brands.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Brands</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {brands.map((brand) =>
                        renderItemCard(brand, 'brand')
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'campaigns' && campaigns.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No favorite campaigns yet</p>
              </Card>
            )}

            {activeTab === 'influencers' && influencers.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No favorite influencers yet</p>
              </Card>
            )}

            {activeTab === 'brands' && brands.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No favorite brands yet</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
