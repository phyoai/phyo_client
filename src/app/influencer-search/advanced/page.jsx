'use client';

import React, { useState, useEffect } from 'react';
import { useInfluencerData } from '@/hooks/useInfluencerData';
import AdvancedSearchForm from '@/components/influencer-search/AdvancedSearchForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { colors } from '@/config/colors';

/**
 * Advanced Influencer Search Results Page
 * Displays filtered influencers with pagination, sorting, and comparison options
 */
export default function AdvancedSearchPage() {
  const {
    searchResults,
    loading,
    error,
    pagination,
    selectNewInfluencer,
    advancedSearch,
  } = useInfluencerData();

  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('followers_desc'); // followers_asc, followers_desc, engagement, recent
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [showForm, setShowForm] = useState(true);

  // Handle sort change
  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    const sortedResults = [...searchResults];

    switch (sortOption) {
      case 'followers_asc':
        sortedResults.sort((a, b) => (a.instagramData?.followers || 0) - (b.instagramData?.followers || 0));
        break;
      case 'followers_desc':
        sortedResults.sort((a, b) => (b.instagramData?.followers || 0) - (a.instagramData?.followers || 0));
        break;
      case 'engagement':
        sortedResults.sort((a, b) => (b.averageEngagement || 0) - (a.averageEngagement || 0));
        break;
      case 'recent':
        // Assuming there's a createdAt field; otherwise, keep original order
        sortedResults.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }
  };

  // Toggle comparison selection
  const toggleComparison = (influencer) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.find(inf => inf._id === influencer._id);
      if (isSelected) {
        return prev.filter(inf => inf._id !== influencer._id);
      } else if (prev.length < 4) {
        return [...prev, influencer];
      }
      return prev;
    });
  };

  // Remove filter tag
  const removeFilter = (filterKey) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      delete updated[filterKey];
      return updated;
    });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalPages = Math.ceil((pagination?.total || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = searchResults.slice(startIndex, endIndex);

  // Loading skeleton
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="aspect-square bg-neutral-muted rounded-lg mb-3"></div>
      <div className="h-4 bg-neutral-muted rounded mb-2"></div>
      <div className="h-3 bg-neutral-muted rounded w-3/4"></div>
    </div>
  );

  // Result Card (Grid View)
  const ResultCard = ({ influencer }) => {
    const isSelected = selectedForComparison.some(inf => inf._id === influencer._id);

    return (
      <Card
        variant={isSelected ? 'outlined' : 'default'}
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full"
        onClick={() => selectNewInfluencer(influencer)}
      >
        {/* Profile Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-muted mb-3 -m-6 mb-4">
          <Avatar
            src={influencer.image}
            alt={influencer.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Comparison Checkbox */}
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              toggleComparison(influencer);
            }}
            className="w-5 h-5 rounded cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div>
            <Card.Title size="sm">{influencer.name}</Card.Title>
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              @{influencer.user_name}
            </p>
          </div>

          {/* Metrics */}
          <Card.Meta
            label="Followers"
            value={`${(influencer.instagramData?.followers || 0).toLocaleString()}`}
          />
          <Card.Meta
            label="Engagement"
            value={`${(influencer.averageEngagement || 0).toFixed(2)}%`}
          />
          <Card.Meta
            label="Category"
            value={influencer.categoryInstagram || 'N/A'}
          />
        </div>

        {/* Footer */}
        <Card.Footer className="flex-col gap-2">
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              selectNewInfluencer(influencer);
            }}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            variant={isSelected ? 'outlined' : 'outlined'}
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              toggleComparison(influencer);
            }}
          >
            {isSelected ? 'Remove from Comparison' : 'Add to Comparison'}
          </Button>
        </Card.Footer>
      </Card>
    );
  };

  // Result Row (List View)
  const ResultRow = ({ influencer }) => {
    const isSelected = selectedForComparison.some(inf => inf._id === influencer._id);

    return (
      <div
        className="flex items-center gap-4 p-4 border-b border-neutral-muted hover:bg-neutral-muted/30 transition-colors cursor-pointer"
        onClick={() => selectNewInfluencer(influencer)}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            toggleComparison(influencer);
          }}
          className="w-5 h-5 rounded cursor-pointer"
        />

        {/* Avatar */}
        <Avatar
          src={influencer.image}
          alt={influencer.name}
          size="lg"
          className="w-16 h-16 rounded-full flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold" style={{ color: colors.text.neutral.base }}>
            {influencer.name}
          </h3>
          <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
            @{influencer.user_name}
          </p>
        </div>

        {/* Metrics */}
        <div className="hidden md:flex gap-6 text-right">
          <div>
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Followers
            </p>
            <p className="font-semibold text-sm" style={{ color: colors.text.neutral.base }}>
              {(influencer.instagramData?.followers || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Engagement
            </p>
            <p className="font-semibold text-sm" style={{ color: colors.text.neutral.base }}>
              {(influencer.averageEngagement || 0).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: colors.text.neutral.muted }}>
              Category
            </p>
            <p className="font-semibold text-sm" style={{ color: colors.text.neutral.base }}>
              {influencer.categoryInstagram || 'N/A'}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          <Button
            size="sm"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              selectNewInfluencer(influencer);
            }}
          >
            View
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-base p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Form */}
        {showForm && (
          <div className="mb-6">
            <AdvancedSearchForm
              onSearchComplete={() => {
                setCurrentPage(1);
                setSelectedForComparison([]);
              }}
            />
            <div className="text-center mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Hide Search Form
              </Button>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="mb-4">
            <Button
              variant="outlined"
              onClick={() => setShowForm(true)}
            >
              Show Search Form
            </Button>
          </div>
        )}

        {/* Results Header */}
        {searchResults.length > 0 && (
          <Card variant="default" className="mb-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: colors.text.neutral.base }}>
                  Search Results
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.text.neutral.muted }}>
                  Found {pagination?.total || 0} influencer{(pagination?.total || 0) !== 1 ? 's' : ''}
                </p>
              </div>

              {/* View Controls */}
              <div className="flex gap-2 flex-wrap items-center justify-end">
                {/* View Mode Toggle */}
                <div className="flex gap-1 border border-neutral-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-brand-base text-white'
                        : 'text-text-base hover:bg-neutral-muted'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-brand-base text-white'
                        : 'text-text-base hover:bg-neutral-muted'
                    }`}
                  >
                    List
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-2 border border-neutral-muted rounded-lg text-sm"
                  style={{ color: colors.text.neutral.base }}
                >
                  <option value="followers_desc">Followers (High to Low)</option>
                  <option value="followers_asc">Followers (Low to High)</option>
                  <option value="engagement">Engagement Rate</option>
                  <option value="recent">Most Recent</option>
                </select>

                {/* Page Size */}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-neutral-muted rounded-lg text-sm"
                  style={{ color: colors.text.neutral.base }}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <Card variant="outlined" className="mb-6 p-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium" style={{ color: colors.text.neutral.muted }}>
                Active Filters:
              </span>
              {Object.entries(activeFilters).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1 bg-neutral-muted rounded-full text-sm"
                  style={{ color: colors.text.neutral.base }}
                >
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="font-bold hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comparison Selection Count */}
        {selectedForComparison.length > 0 && (
          <Card variant="outlined" className="mb-6 p-4 bg-accent-subtle">
            <div className="flex items-center justify-between">
              <p style={{ color: colors.text.neutral.base }}>
                <span className="font-bold">{selectedForComparison.length}</span> influencer
                {selectedForComparison.length !== 1 ? 's' : ''} selected for comparison
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  // Navigate to comparison view or show modal
                  console.log('Compare:', selectedForComparison);
                }}
              >
                Compare Selected
              </Button>
            </div>
          </Card>
        )}

        {/* Results Grid/List */}
        {loading && (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''} mb-6`}>
            {Array(pageSize).fill(null).map((_, i) => (
              <div key={i}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}

        {!loading && searchResults.length === 0 && (
          <Card variant="default" className="text-center p-12">
            <p className="text-lg font-semibold mb-2" style={{ color: colors.text.neutral.muted }}>
              No influencers found
            </p>
            <p style={{ color: colors.text.neutral.muted }} className="mb-4">
              Try adjusting your filters to find more results
            </p>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Modify Search
            </Button>
          </Card>
        )}

        {!loading && searchResults.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {paginatedResults.map(influencer => (
                  <ResultCard key={influencer._id} influencer={influencer} />
                ))}
              </div>
            ) : (
              <Card variant="default" className="overflow-hidden mb-6">
                {paginatedResults.map(influencer => (
                  <ResultRow key={influencer._id} influencer={influencer} />
                ))}
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Card variant="default" className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: colors.text.neutral.muted }}>
                    Showing {startIndex + 1} to {Math.min(endIndex, pagination?.total || 0)} of {pagination?.total || 0}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-brand-base text-white'
                            : 'border border-neutral-muted hover:bg-neutral-muted'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <Button
                      size="sm"
                      variant="outlined"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Error State */}
        {error && (
          <Card variant="default" className="p-6 bg-red-50 border-red-200">
            <h3 className="text-red-700 font-semibold mb-2">Error loading results</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button
              size="sm"
              variant="outlined"
              onClick={() => setShowForm(true)}
            >
              Try Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
