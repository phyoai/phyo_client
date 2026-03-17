'use client';

import React, { useState } from 'react';
import { useInfluencerData } from '@/hooks/useInfluencerData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { colors } from '@/config/colors';

/**
 * Influencer Comparison Component
 * Displays side-by-side comparison of up to 4 influencers
 */
const InfluencerComparison = ({ selectedInfluencers = [] }) => {
  const { selectNewInfluencer } = useInfluencerData();
  const [viewMode, setViewMode] = useState('comparison'); // comparison or detail

  // Get max and min values for metrics
  const getMetricStats = (metric) => {
    const values = selectedInfluencers
      .map(inf => {
        if (metric === 'followers') return inf.instagramData?.followers || 0;
        if (metric === 'engagement') return inf.averageEngagement || 0;
        return 0;
      })
      .filter(v => v > 0);

    return {
      max: Math.max(...values, 0),
      min: Math.min(...values, 0),
    };
  };

  // Calculate metric percentage for visualization
  const getMetricPercentage = (metric, influencer) => {
    let value = 0;
    if (metric === 'followers') {
      value = influencer.instagramData?.followers || 0;
    } else if (metric === 'engagement') {
      value = influencer.averageEngagement || 0;
    } else if (metric === 'likes') {
      value = influencer.averageLikes || 0;
    }

    const stats = getMetricStats(metric);
    const range = stats.max - stats.min || 1;
    return ((value - stats.min) / range) * 100;
  };

  // Check if metric is highest or lowest
  const isHighest = (metric, value) => {
    const stats = getMetricStats(metric);
    return value === stats.max && stats.max > 0;
  };

  const isLowest = (metric, value) => {
    const stats = getMetricStats(metric);
    return value === stats.min && stats.min > 0;
  };

  // Export as PDF
  const handleExportPDF = () => {
    // Simple PDF export implementation
    let content = 'Influencer Comparison Report\n\n';
    selectedInfluencers.forEach(inf => {
      content += `Name: ${inf.name}\n`;
      content += `Followers: ${inf.instagramData?.followers?.toLocaleString() || 'N/A'}\n`;
      content += `Engagement: ${inf.averageEngagement?.toFixed(2) || 'N/A'}%\n`;
      content += `Category: ${inf.categoryInstagram || 'N/A'}\n\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'influencer-comparison.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Export as CSV
  const handleExportCSV = () => {
    let csvContent = 'Name,Followers,Engagement Rate,Category,City,State,Gender\n';

    selectedInfluencers.forEach(inf => {
      const row = [
        inf.name,
        inf.instagramData?.followers || '',
        (inf.averageEngagement || 0).toFixed(2),
        inf.categoryInstagram || '',
        inf.city || '',
        inf.state || '',
        inf.gender || '',
      ].join(',');
      csvContent += row + '\n';
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', 'influencer-comparison.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Remove influencer from comparison
  const handleRemoveInfluencer = (influencerId) => {
    // This should be handled by parent component
    // For now, just notify via log
    console.log('Remove influencer:', influencerId);
  };

  if (selectedInfluencers.length === 0) {
    return (
      <Card variant="default" className="p-6 text-center">
        <p
          className="text-lg font-semibold mb-4"
          style={{ color: colors.text.neutral.muted }}
        >
          No influencers selected for comparison
        </p>
        <p style={{ color: colors.text.neutral.muted }}>
          Add influencers to your comparison list to see metrics side-by-side
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card variant="default" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.text.neutral.base }}>
              Influencer Comparison
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.text.neutral.muted }}>
              Comparing {selectedInfluencers.length} influencer{selectedInfluencers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button
              size="sm"
              variant="outlined"
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
            <Button
              size="sm"
              variant="outlined"
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(selectedInfluencers.length, 4)}, minmax(250px, 1fr))` }}>
          {selectedInfluencers.slice(0, 4).map((influencer, idx) => (
            <Card key={influencer._id || idx} variant="elevated" className="p-4">
              {/* Profile Header */}
              <div className="text-center mb-4">
                <div className="flex justify-center mb-3">
                  <Avatar
                    src={influencer.image}
                    alt={influencer.name}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                <h3 className="font-bold text-lg" style={{ color: colors.text.neutral.base }}>
                  {influencer.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: colors.text.neutral.muted }}>
                  @{influencer.user_name}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-4 mb-4">
                {/* Followers */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold" style={{ color: colors.text.neutral.muted }}>
                      Followers
                    </label>
                    {isHighest('followers', influencer.instagramData?.followers) && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Highest
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-neutral-muted rounded-lg h-2 mb-1">
                    <div
                      className="bg-brand-base rounded-lg h-2 transition-all"
                      style={{ width: `${getMetricPercentage('followers', influencer)}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                    {(influencer.instagramData?.followers || 0).toLocaleString()}
                  </p>
                </div>

                {/* Engagement Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold" style={{ color: colors.text.neutral.muted }}>
                      Engagement
                    </label>
                    {isHighest('engagement', influencer.averageEngagement) && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Highest
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-neutral-muted rounded-lg h-2 mb-1">
                    <div
                      className="bg-accent-base rounded-lg h-2 transition-all"
                      style={{ width: `${getMetricPercentage('engagement', influencer)}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                    {(influencer.averageEngagement || 0).toFixed(2)}%
                  </p>
                </div>

                {/* Average Likes */}
                <div>
                  <label className="text-xs font-semibold" style={{ color: colors.text.neutral.muted }}>
                    Avg. Likes
                  </label>
                  <p className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>
                    {(influencer.averageLikes || 0).toLocaleString()}
                  </p>
                </div>

                {/* Demographics */}
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: colors.text.neutral.muted }}>
                    Demographics
                  </label>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Category:</span>
                      <span className="font-semibold">{influencer.categoryInstagram || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Gender:</span>
                      <span className="font-semibold">{influencer.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Location:</span>
                      <span className="font-semibold">
                        {influencer.city || 'N/A'}{influencer.city && influencer.state ? ', ' : ''}{influencer.state || ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-neutral-muted">
                <Button
                  size="sm"
                  variant="primary"
                  fullWidth
                  onClick={() => selectNewInfluencer(influencer)}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  fullWidth
                  onClick={() => handleRemoveInfluencer(influencer._id)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      {selectedInfluencers.length > 1 && (
        <Card variant="default" className="p-4">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text.neutral.base }}>
            Summary Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-neutral-muted rounded-lg">
              <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
                Avg Followers
              </p>
              <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
                {(
                  selectedInfluencers.reduce((sum, inf) => sum + (inf.instagramData?.followers || 0), 0) /
                  selectedInfluencers.length
                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="p-3 bg-neutral-muted rounded-lg">
              <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
                Avg Engagement
              </p>
              <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
                {(
                  selectedInfluencers.reduce((sum, inf) => sum + (inf.averageEngagement || 0), 0) /
                  selectedInfluencers.length
                ).toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-neutral-muted rounded-lg">
              <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
                Total Combined
              </p>
              <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
                {selectedInfluencers
                  .reduce((sum, inf) => sum + (inf.instagramData?.followers || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-neutral-muted rounded-lg">
              <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
                Influencers
              </p>
              <p className="text-lg font-bold" style={{ color: colors.text.neutral.base }}>
                {selectedInfluencers.length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InfluencerComparison;
