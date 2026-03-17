'use client';

import React, { useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import Card from '@/components/ui/Card';

/**
 * Portfolio Stats View (TIER 4)
 * KPI cards, status breakdown, budget utilization, top clients table
 */
const PortfolioStats = () => {
  const {
    portfolioStats,
    portfolioItems,
    loading,
    fetchStats,
    fetchPortfolioItems,
  } = usePortfolio();

  useEffect(() => {
    fetchStats();
    fetchPortfolioItems(1, 50);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-neutral-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (!portfolioStats) {
    return <div>No stats available</div>;
  }

  const topClients = portfolioItems
    .flatMap(portfolio =>
      portfolio.clients?.map(client => ({
        ...client,
        portfolioTitle: portfolio.title,
      })) || []
    )
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 5);

  const budgetUtilization = portfolioStats.projectStatusBreakdown.completed /
    (portfolioStats.projectStatusBreakdown.completed +
      portfolioStats.projectStatusBreakdown.inProgress +
      portfolioStats.projectStatusBreakdown.onHold) * 100;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {portfolioStats.totalPortfolios}
            </div>
            <div className="text-sm text-neutral-text mt-1">Total Portfolios</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {portfolioStats.totalClients}
            </div>
            <div className="text-sm text-neutral-text mt-1">Total Clients</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              ${(portfolioStats.totalBudget / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-neutral-text mt-1">Total Budget</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {Math.round(budgetUtilization)}%
            </div>
            <div className="text-sm text-neutral-text mt-1">Utilization</div>
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Project Status Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {portfolioStats.projectStatusBreakdown.completed}
            </div>
            <div className="text-sm text-green-700 mt-1">Completed</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    (portfolioStats.projectStatusBreakdown.completed /
                      (portfolioStats.projectStatusBreakdown.completed +
                        portfolioStats.projectStatusBreakdown.inProgress +
                        portfolioStats.projectStatusBreakdown.onHold)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {portfolioStats.projectStatusBreakdown.inProgress}
            </div>
            <div className="text-sm text-blue-700 mt-1">In Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${
                    (portfolioStats.projectStatusBreakdown.inProgress /
                      (portfolioStats.projectStatusBreakdown.completed +
                        portfolioStats.projectStatusBreakdown.inProgress +
                        portfolioStats.projectStatusBreakdown.onHold)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {portfolioStats.projectStatusBreakdown.onHold}
            </div>
            <div className="text-sm text-yellow-700 mt-1">On Hold</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: `${
                    (portfolioStats.projectStatusBreakdown.onHold /
                      (portfolioStats.projectStatusBreakdown.completed +
                        portfolioStats.projectStatusBreakdown.inProgress +
                        portfolioStats.projectStatusBreakdown.onHold)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Top Clients Table */}
      {topClients.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Top Clients by Budget</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-muted">
                  <th className="text-left py-2 px-3">Client</th>
                  <th className="text-left py-2 px-3">Project</th>
                  <th className="text-left py-2 px-3">Budget</th>
                  <th className="text-left py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((client, idx) => (
                  <tr key={idx} className="border-b border-neutral-muted hover:bg-neutral-muted/30">
                    <td className="py-2 px-3 font-medium">{client.clientName}</td>
                    <td className="py-2 px-3">{client.projectTitle}</td>
                    <td className="py-2 px-3 font-semibold">${client.budget.toLocaleString()}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        client.projectStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                        client.projectStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {client.projectStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PortfolioStats;
