'use client';

import React, { useEffect, useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Portfolio Dashboard Page (TIER 4)
 * Stats cards: portfolios, clients, budget, completion rate
 * Recent items list
 */
const PortfolioDashboardPage = () => {
  const router = useRouter();
  const {
    portfolioItems,
    portfolioStats,
    loading,
    error,
    fetchPortfolioItems,
    fetchStats,
  } = usePortfolio();

  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPortfolioItems(1, 10);
  }, []);

  useEffect(() => {
    setDisplayItems(portfolioItems.slice(0, 5));
  }, [portfolioItems]);

  const handleCreatePortfolio = () => {
    router.push('/service-provider/portfolio/create');
  };

  if (loading && !portfolioStats) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-neutral-text mt-2">Showcase your work and manage clients</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleCreatePortfolio}
        >
          + Add Portfolio Item
        </Button>
      </div>

      {/* Stats Cards */}
      {portfolioStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {portfolioStats.totalPortfolios}
              </div>
              <div className="text-sm text-blue-700 mt-1">Portfolios</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {portfolioStats.totalClients}
              </div>
              <div className="text-sm text-green-700 mt-1">Clients</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ${(portfolioStats.totalBudget / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-purple-700 mt-1">Total Budget</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">
                {Math.round(
                  (portfolioStats.projectStatusBreakdown.completed /
                    (portfolioStats.projectStatusBreakdown.completed +
                      portfolioStats.projectStatusBreakdown.inProgress +
                      portfolioStats.projectStatusBreakdown.onHold)) *
                    100 || 0
                )}%
              </div>
              <div className="text-sm text-amber-700 mt-1">Completion Rate</div>
            </div>
          </Card>
        </div>
      )}

      {/* Project Status Breakdown */}
      {portfolioStats && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Project Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {portfolioStats.projectStatusBreakdown.completed}
              </div>
              <div className="text-sm text-green-700 mt-1">Completed</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {portfolioStats.projectStatusBreakdown.inProgress}
              </div>
              <div className="text-sm text-blue-700 mt-1">In Progress</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {portfolioStats.projectStatusBreakdown.onHold}
              </div>
              <div className="text-sm text-yellow-700 mt-1">On Hold</div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Items */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Portfolio Items</h2>
          <Link href="/service-provider/portfolio/gallery">
            <Button variant="secondary" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-text">No portfolio items yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePortfolio}
              className="mt-4"
            >
              Create First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayItems.map(item => (
              <Link key={item._id} href={`/service-provider/portfolio/${item._id}`}>
                <div className="p-4 border border-neutral-muted rounded-lg hover:shadow-md transition cursor-pointer">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-neutral-text mt-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="text-xs text-neutral-text mt-3">
                    {item.clients?.length || 0} clients
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PortfolioDashboardPage;
