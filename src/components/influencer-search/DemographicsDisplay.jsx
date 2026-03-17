'use client';

import React, { useEffect, useState } from 'react';
import { useInfluencerData } from '@/hooks/useInfluencerData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/config/colors';

/**
 * Demographics Display Component
 * Shows gender, age, and geographic distribution of influencer audience
 */
const DemographicsDisplay = ({ influencerId }) => {
  const { selectedInfluencer, loading, error, fetchInfluencerById } = useInfluencerData();
  const [activeTab, setActiveTab] = useState('instagram');
  const [chartData, setChartData] = useState(null);

  // Fetch detailed demographics on mount
  useEffect(() => {
    if (influencerId) {
      fetchInfluencerById(influencerId);
    }
  }, [influencerId, fetchInfluencerById]);

  // Process demographics data
  useEffect(() => {
    if (selectedInfluencer) {
      const platformData = activeTab === 'instagram'
        ? selectedInfluencer.instagramData
        : activeTab === 'youtube'
          ? selectedInfluencer.youtubeData
          : null;

      if (platformData) {
        setChartData(platformData);
      }
    }
  }, [selectedInfluencer, activeTab]);

  // Simple pie chart implementation using CSS
  const GenderChart = ({ data }) => {
    if (!data || !data.genderDistribution || data.genderDistribution.length === 0) {
      return <p style={{ color: colors.text.neutral.muted }}>No data available</p>;
    }

    const total = data.genderDistribution.reduce((sum, item) => sum + item.distribution, 0);
    const colors_palette = ['#FF6B6B', '#4ECDC4', '#95E1D3'];

    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div style={{ width: '200px', height: '200px', position: 'relative' }}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
              {data.genderDistribution.map((item, idx) => {
                const percentage = (item.distribution / total) * 100;
                const startAngle = data.genderDistribution.slice(0, idx).reduce(
                  (sum, x) => sum + (x.distribution / total) * 360,
                  0
                );
                const endAngle = startAngle + (percentage / 100) * 360;

                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);

                const x1 = 100 + 80 * Math.cos(startRad);
                const y1 = 100 + 80 * Math.sin(startRad);
                const x2 = 100 + 80 * Math.cos(endRad);
                const y2 = 100 + 80 * Math.sin(endRad);

                const largeArc = percentage > 50 ? 1 : 0;

                return (
                  <path
                    key={idx}
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={colors_palette[idx % colors_palette.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          {data.genderDistribution.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors_palette[idx % colors_palette.length] }}
                />
                <span style={{ color: colors.text.neutral.base }}>{item.gender}</span>
              </div>
              <span className="font-semibold" style={{ color: colors.text.neutral.base }}>
                {item.distribution.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Age distribution bar chart
  const AgeChart = ({ data }) => {
    if (!data || !data.ageDistribution || data.ageDistribution.length === 0) {
      return <p style={{ color: colors.text.neutral.muted }}>No data available</p>;
    }

    const maxValue = Math.max(...data.ageDistribution.map(item => item.value));

    return (
      <div className="space-y-3">
        {data.ageDistribution.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium" style={{ color: colors.text.neutral.base }}>
                {item.age}
              </label>
              <span className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                {item.value.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-neutral-muted rounded-full h-3">
              <div
                className="bg-brand-base rounded-full h-3 transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Geographic distribution
  const GeographicChart = ({ data }) => {
    if (!data || !data.audienceByCountry || data.audienceByCountry.length === 0) {
      return <p style={{ color: colors.text.neutral.muted }}>No data available</p>;
    }

    const topCountries = data.audienceByCountry.slice(0, 5);
    const otherPercentage = data.audienceByCountry
      .slice(5)
      .reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {topCountries.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium" style={{ color: colors.text.neutral.base }}>
                  {item.name}
                </label>
                <span className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                  {item.value.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-neutral-muted rounded-full h-3">
                <div
                  className="bg-accent-base rounded-full h-3 transition-all"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
          {otherPercentage > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium" style={{ color: colors.text.neutral.base }}>
                  Others
                </label>
                <span className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                  {otherPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-neutral-muted rounded-full h-3">
                <div
                  className="bg-neutral-muted rounded-full h-3"
                  style={{ width: `${otherPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Cities breakdown table
  const CitiesTable = ({ data }) => {
    if (!data || !data.audienceByCountry) {
      return <p style={{ color: colors.text.neutral.muted }}>No data available</p>;
    }

    const cities = data.audienceByCountry.slice(0, 10);

    if (cities.length === 0) {
      return <p style={{ color: colors.text.neutral.muted }}>No data available</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-muted">
              <th className="text-left py-2 px-2 text-sm font-semibold" style={{ color: colors.text.neutral.muted }}>
                City
              </th>
              <th className="text-right py-2 px-2 text-sm font-semibold" style={{ color: colors.text.neutral.muted }}>
                Distribution %
              </th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, idx) => (
              <tr key={idx} className="border-b border-neutral-muted hover:bg-neutral-muted/30 transition-colors">
                <td className="py-2 px-2 text-sm" style={{ color: colors.text.neutral.base }}>
                  {city.name}
                </td>
                <td className="text-right py-2 px-2 text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                  {city.value.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Export chart as image
  const handleExportImage = (chartName) => {
    // Simple implementation - could be enhanced with html2canvas
    console.log('Export chart:', chartName);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card variant="default" className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-muted rounded w-1/3"></div>
          <div className="h-64 bg-neutral-muted rounded"></div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card variant="default" className="p-6 bg-red-50 border-red-200">
        <h3 className="text-red-700 font-semibold mb-2">Error loading demographics</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => influencerId && fetchInfluencerById(influencerId)}
        >
          Retry
        </Button>
      </Card>
    );
  }

  // No data state
  if (!selectedInfluencer || !chartData) {
    return (
      <Card variant="default" className="p-6 text-center">
        <p className="text-lg font-semibold mb-2" style={{ color: colors.text.neutral.muted }}>
          No demographics data available
        </p>
        <p style={{ color: colors.text.neutral.muted }}>
          Please select an influencer to view audience demographics
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card variant="default" className="p-4">
        <h2 className="text-2xl font-bold" style={{ color: colors.text.neutral.base }}>
          Audience Demographics
        </h2>
        <p className="text-sm mt-1" style={{ color: colors.text.neutral.muted }}>
          {selectedInfluencer.name}'s audience insights
        </p>
      </Card>

      {/* Platform Tabs */}
      {(selectedInfluencer.instagramData || selectedInfluencer.youtubeData) && (
        <div className="flex gap-2 border-b border-neutral-muted">
          {selectedInfluencer.instagramData && (
            <button
              onClick={() => setActiveTab('instagram')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'instagram'
                  ? 'border-b-2 border-brand-base text-brand-text'
                  : 'text-text-neutral-muted hover:text-text-neutral-base'
              }`}
            >
              Instagram
            </button>
          )}
          {selectedInfluencer.youtubeData && (
            <button
              onClick={() => setActiveTab('youtube')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'youtube'
                  ? 'border-b-2 border-brand-base text-brand-text'
                  : 'text-text-neutral-muted hover:text-text-neutral-base'
              }`}
            >
              YouTube
            </button>
          )}
        </div>
      )}

      {/* Gender Distribution */}
      <Card variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
            Gender Distribution
          </h3>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => handleExportImage('gender')}
          >
            Export
          </Button>
        </div>
        <GenderChart data={chartData} />
      </Card>

      {/* Age Distribution */}
      <Card variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
            Age Distribution
          </h3>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => handleExportImage('age')}
          >
            Export
          </Button>
        </div>
        <AgeChart data={chartData} />
      </Card>

      {/* Geographic Distribution */}
      <Card variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
            Geographic Distribution (Top 5 Countries)
          </h3>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => handleExportImage('geographic')}
          >
            Export
          </Button>
        </div>
        <GeographicChart data={chartData} />
      </Card>

      {/* Top Cities */}
      <Card variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
            Top 10 Cities
          </h3>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => handleExportImage('cities')}
          >
            Export
          </Button>
        </div>
        <CitiesTable data={chartData} />
      </Card>

      {/* Summary Stats */}
      <Card variant="default" className="p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: colors.text.neutral.base }}>
          Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-neutral-muted rounded-lg">
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Total Followers
            </p>
            <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
              {(chartData.followers || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-neutral-muted rounded-lg">
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Avg Engagement
            </p>
            <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
              {selectedInfluencer.averageEngagement?.toFixed(2) || 'N/A'}%
            </p>
          </div>
          <div className="p-3 bg-neutral-muted rounded-lg">
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Category
            </p>
            <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
              {selectedInfluencer.categoryInstagram || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-neutral-muted rounded-lg">
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Location
            </p>
            <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
              {selectedInfluencer.city || 'N/A'}, {selectedInfluencer.state || ''}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DemographicsDisplay;
