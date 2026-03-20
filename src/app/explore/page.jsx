'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCampaigns } from '@/store/slices/campaignSlice';
import { getInfluencers } from '@/store/slices/influencerSlice';
import { getBrands } from '@/store/slices/brandSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import { Search, Filter } from 'lucide-react';

export default function ExplorePage() {
  const dispatch = useDispatch();

  const { campaigns, loading: campaignsLoading } = useSelector((state) => state.campaign);
  const { influencers, loading: influencersLoading } = useSelector(
    (state) => state.influencer
  );
  const { brands, loading: brandsLoading } = useSelector((state) => state.brand);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    dispatch(getCampaigns({ limit: 20 }));
    dispatch(getInfluencers({ limit: 20 }));
    dispatch(getBrands({ limit: 20 }));
  }, [dispatch]);

  const loading = campaignsLoading || influencersLoading || brandsLoading;

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'campaigns', label: 'Campaigns' },
    { value: 'influencers', label: 'Influencers' },
    { value: 'brands', label: 'Brands' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' },
  ];

  const filteredCampaigns =
    filterType === 'all' || filterType === 'campaigns'
      ? campaigns.filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      : [];

  const filteredInfluencers =
    filterType === 'all' || filterType === 'influencers'
      ? influencers.filter((i) => i.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      : [];

  const filteredBrands =
    filterType === 'all' || filterType === 'brands'
      ? brands.filter((b) => b.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      : [];

  const renderCampaignCard = (campaign) => (
    <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{campaign.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Budget</p>
          <p className="font-semibold text-gray-900">
            ${campaign.budget?.toLocaleString() || 0}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-semibold text-blue-600">{campaign.status || 'Active'}</p>
        </div>
      </div>
    </Card>
  );

  const renderInfluencerCard = (influencer) => (
    <Card key={influencer.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
          <p className="text-sm text-gray-600">@{influencer.username}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Followers</p>
          <p className="font-semibold text-gray-900">
            {(influencer.followers / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Engagement</p>
          <p className="font-semibold text-gray-900">
            {influencer.engagementRate?.toFixed(1) || 0}%
          </p>
        </div>
      </div>
    </Card>
  );

  const renderBrandCard = (brand) => (
    <Card key={brand.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{brand.industry}</p>
      </div>

      <p className="text-sm text-gray-700 line-clamp-2 mb-4">{brand.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Rating</p>
          <p className="font-semibold text-yellow-600">★ {brand.rating || 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Followers</p>
          <p className="font-semibold text-gray-900">
            {(brand.followers / 1000).toFixed(1) || 0}K
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <p className="text-gray-600 mt-2">Discover campaigns, influencers, and brands</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>

            <Select
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
            />

            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Campaigns */}
            {filteredCampaigns.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map(renderCampaignCard)}
                </div>
              </div>
            )}

            {/* Influencers */}
            {filteredInfluencers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Influencers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInfluencers.map(renderInfluencerCard)}
                </div>
              </div>
            )}

            {/* Brands */}
            {filteredBrands.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Brands</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrands.map(renderBrandCard)}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredCampaigns.length === 0 &&
              filteredInfluencers.length === 0 &&
              filteredBrands.length === 0 && (
                <Card className="p-12 text-center">
                  <Filter size={48} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
                  <p className="text-gray-600">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                </Card>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
