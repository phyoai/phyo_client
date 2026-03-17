'use client';

import React, { useEffect, useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Portfolio Gallery Component (TIER 4)
 * Grid/list view toggle, category filters, pagination with lazy loading
 */
const PortfolioGallery = () => {
  const {
    portfolioItems,
    loading,
    pagination,
    fetchPortfolioItems,
  } = usePortfolio();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPortfolioItems(currentPage, 12);
  }, [currentPage]);

  const categories = [
    'All',
    'Web Design',
    'Branding',
    'Photography',
    'Development',
    'Marketing',
    'Other',
  ];

  const filteredItems = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Portfolio Gallery</h1>
        <p className="text-neutral-text mt-2">Browse all portfolio items</p>
      </div>

      {/* Controls */}
      <Card>
        <div className="space-y-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>

          {/* Category Filters */}
          <div>
            <span className="text-sm font-medium block mb-2">Categories:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Gallery */}
      {loading && !filteredItems.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-neutral-text">No portfolio items found</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <Link key={item._id} href={`/service-provider/portfolio/${item._id}`}>
              <Card className="h-full hover:shadow-lg transition cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-neutral-muted to-neutral-base rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-neutral-text">Image</span>
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                {item.category && (
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded inline-block mt-2">
                    {item.category}
                  </span>
                )}
                <p className="text-sm text-neutral-text mt-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="text-xs text-neutral-text mt-3">
                  {item.clients?.length || 0} clients
                </div>
                {item.featured && (
                  <div className="mt-2 text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded inline-block">
                    Featured
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <Link key={item._id} href={`/service-provider/portfolio/${item._id}`}>
              <Card className="hover:shadow-md transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-neutral-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-neutral-text text-sm">Image</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-neutral-text mt-1 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      {item.category && (
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                          {item.category}
                        </span>
                      )}
                      <span className="text-xs text-neutral-text">
                        {item.clients?.length || 0} clients
                      </span>
                      {item.featured && (
                        <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <Card className="flex items-center justify-between">
          <p className="text-sm text-neutral-text">
            Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PortfolioGallery;
