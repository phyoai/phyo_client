'use client';

import React, { useState, useEffect } from 'react';
import { useInfluencerData } from '@/hooks/useInfluencerData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/config/colors';

/**
 * Advanced Search Form Component
 * Allows users to filter influencers by multiple criteria
 * Supports filter presets saved to localStorage
 */
const AdvancedSearchForm = ({ onSearchComplete }) => {
  const { advancedSearch, clearResults, loading, error } = useInfluencerData();

  // State for filters
  const [filters, setFilters] = useState({
    platforms: [],
    contentCategory: '',
    city: '',
    state: '',
    gender: '',
    minFollowers: 0,
    maxFollowers: 1000000,
    minEngagement: 0,
    maxEngagement: 100,
    keyword: '',
  });

  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    platforms: true,
    location: true,
    demographics: true,
    followers: true,
    engagement: true,
    keyword: true,
  });

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('influencerSearchPresets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (err) {
        console.error('Failed to load presets:', err);
      }
    }
  }, []);

  // Handle platform toggle
  const handlePlatformToggle = (platform) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  // Handle range slider change
  const handleRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle text input change
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Apply filters and search
  const handleApplyFilters = async () => {
    const searchFilters = {
      ...(filters.category && { category: filters.contentCategory }),
      ...(filters.city && { city: filters.city }),
      ...(filters.state && { state: filters.state }),
      ...(filters.gender && { gender: filters.gender }),
      minFollowers: filters.minFollowers,
      maxFollowers: filters.maxFollowers,
      page: 1,
      limit: 10,
    };

    try {
      await advancedSearch(searchFilters);
      if (onSearchComplete) {
        onSearchComplete();
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      platforms: [],
      contentCategory: '',
      city: '',
      state: '',
      gender: '',
      minFollowers: 0,
      maxFollowers: 1000000,
      minEngagement: 0,
      maxEngagement: 100,
      keyword: '',
    });
    clearResults();
    setSelectedPreset('');
  };

  // Save current filters as preset
  const handleSavePreset = () => {
    const presetName = prompt('Enter preset name:');
    if (presetName) {
      const newPreset = {
        id: Date.now(),
        name: presetName,
        filters: { ...filters },
      };
      const updatedPresets = [...presets, newPreset];
      setPresets(updatedPresets);
      localStorage.setItem('influencerSearchPresets', JSON.stringify(updatedPresets));
    }
  };

  // Load preset
  const handleLoadPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setFilters(preset.filters);
      setSelectedPreset(presetId);
    }
  };

  // Delete preset
  const handleDeletePreset = (presetId) => {
    const updatedPresets = presets.filter(p => p.id !== presetId);
    setPresets(updatedPresets);
    localStorage.setItem('influencerSearchPresets', JSON.stringify(updatedPresets));
    if (selectedPreset === presetId) {
      setSelectedPreset('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <Card variant="default" className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.neutral.base }}>
          Advanced Influencer Search
        </h2>
        <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
          Filter and find the perfect influencers for your campaign
        </p>
      </Card>

      {/* Preset Management */}
      {presets.length > 0 && (
        <Card variant="outlined" className="mb-6 p-4">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text.neutral.base }}>
            Load Preset
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map(preset => (
              <div key={preset.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleLoadPreset(preset.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPreset === preset.id
                      ? 'bg-brand-base text-white'
                      : 'bg-neutral-muted text-text-base hover:bg-neutral-base'
                  }`}
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
                  aria-label={`Delete ${preset.name} preset`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Platform Filter */}
      <Card variant="default" className="mb-4 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('platforms')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Platform
          </h3>
          <span className="text-xl">{expandedSections.platforms ? '−' : '+'}</span>
        </div>
        {expandedSections.platforms && (
          <div className="mt-4 flex flex-wrap gap-3">
            {['Instagram', 'YouTube', 'TikTok'].map(platform => (
              <label key={platform} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(platform)}
                  onChange={() => handlePlatformToggle(platform)}
                  className="w-4 h-4 rounded"
                />
                <span style={{ color: colors.text.neutral.base }}>{platform}</span>
              </label>
            ))}
          </div>
        )}
      </Card>

      {/* Content Category */}
      <Card variant="default" className="mb-4 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('category')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Content Category
          </h3>
          <span className="text-xl">{expandedSections.category ? '−' : '+'}</span>
        </div>
        {expandedSections.category && (
          <select
            value={filters.contentCategory}
            onChange={(e) => handleInputChange('contentCategory', e.target.value)}
            className="w-full mt-4 p-2 border border-neutral-muted rounded-lg"
            style={{ color: colors.text.neutral.base }}
          >
            <option value="">Select category...</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Travel">Travel</option>
            <option value="Fitness">Fitness</option>
            <option value="Food">Food</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Technology">Technology</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        )}
      </Card>

      {/* Location Filter */}
      <Card variant="default" className="mb-4 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('location')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Location
          </h3>
          <span className="text-xl">{expandedSections.location ? '−' : '+'}</span>
        </div>
        {expandedSections.location && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: colors.text.neutral.muted }}>
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="e.g., New York"
                className="w-full p-2 border border-neutral-muted rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: colors.text.neutral.muted }}>
                State/Region
              </label>
              <input
                type="text"
                value={filters.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="e.g., New York"
                className="w-full p-2 border border-neutral-muted rounded-lg"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Demographics */}
      <Card variant="default" className="mb-4 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('demographics')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Demographics
          </h3>
          <span className="text-xl">{expandedSections.demographics ? '−' : '+'}</span>
        </div>
        {expandedSections.demographics && (
          <div className="mt-4">
            <label className="block text-sm mb-1" style={{ color: colors.text.neutral.muted }}>
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full p-2 border border-neutral-muted rounded-lg"
              style={{ color: colors.text.neutral.base }}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
      </Card>

      {/* Followers Range */}
      <Card variant="default" className="mb-4 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('followers')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Followers
          </h3>
          <span className="text-xl">{expandedSections.followers ? '−' : '+'}</span>
        </div>
        {expandedSections.followers && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.text.neutral.muted }}>
                Min Followers: {filters.minFollowers.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="1000000"
                value={filters.minFollowers}
                onChange={(e) => handleRangeChange('minFollowers', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.text.neutral.muted }}>
                Max Followers: {filters.maxFollowers.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="1000000"
                value={filters.maxFollowers}
                onChange={(e) => handleRangeChange('maxFollowers', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Engagement Rate Range */}
      <Card variant="default" className="mb-4 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('engagement')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Engagement Rate (%)
          </h3>
          <span className="text-xl">{expandedSections.engagement ? '−' : '+'}</span>
        </div>
        {expandedSections.engagement && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.text.neutral.muted }}>
                Min: {filters.minEngagement.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={filters.minEngagement}
                onChange={(e) => handleRangeChange('minEngagement', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: colors.text.neutral.muted }}>
                Max: {filters.maxEngagement.toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={filters.maxEngagement}
                onChange={(e) => handleRangeChange('maxEngagement', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Keyword Search */}
      <Card variant="default" className="mb-6 p-4">
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => toggleSection('keyword')}
        >
          <h3 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>
            Keyword Search
          </h3>
          <span className="text-xl">{expandedSections.keyword ? '−' : '+'}</span>
        </div>
        {expandedSections.keyword && (
          <div className="mt-4">
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              placeholder="Search by name, handle, or keyword..."
              className="w-full p-2 border border-neutral-muted rounded-lg"
            />
          </div>
        )}
      </Card>

      {/* Error Message */}
      {error && (
        <Card variant="default" className="mb-4 p-4 bg-red-50 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-700 font-medium mb-2">Error occurred</p>
              <p className="text-red-600 text-sm mb-3">{error}</p>
            </div>
            <Button
              size="sm"
              variant="outlined"
              onClick={handleApplyFilters}
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Button
          onClick={handleApplyFilters}
          disabled={loading}
          loading={loading}
          className="flex-1"
        >
          {loading ? 'Searching...' : 'Apply Filters'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleResetFilters}
          disabled={loading}
          className="flex-1 md:flex-none"
        >
          Reset Filters
        </Button>
        <Button
          variant="outlined"
          onClick={handleSavePreset}
          className="flex-1 md:flex-none"
        >
          Save as Preset
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSearchForm;
