/**
 * Dynamic Import Utilities
 * Implements code splitting and lazy loading for performance optimization
 *
 * Usage:
 * const Component = lazy(() => import('@/app/admin/dashboard/page'));
 */

import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Loading component for suspense boundaries
 */
export const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

/**
 * Error component for error boundaries
 */
export const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-red-600 font-semibold mb-2">Failed to load component</p>
      <p className="text-gray-600 text-sm">{error?.message}</p>
    </div>
  </div>
);

/**
 * Dynamic page imports for code splitting
 * These pages are lazily loaded only when needed
 */
export const DynamicPages = {
  // Admin Pages
  AdminDashboard: dynamic(() => import('@/app/admin/dashboard/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  BrandRequests: dynamic(() => import('@/app/admin/brand-requests/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  InfluencerRequests: dynamic(() => import('@/app/admin/influencer-requests/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  Approvals: dynamic(() => import('@/app/admin/approvals/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  Users: dynamic(() => import('@/app/admin/users/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),

  // Analytics Pages
  AnalyticsDashboard: dynamic(() => import('@/app/analytics/dashboard/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  CampaignPerformance: dynamic(() => import('@/app/analytics/campaigns/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  InfluencerMetrics: dynamic(() => import('@/app/analytics/influencers/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  Reports: dynamic(() => import('@/app/analytics/reports/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),

  // Integration Pages
  FacebookConnect: dynamic(() => import('@/app/integrations/facebook/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  CampaignInsights: dynamic(() => import('@/app/integrations/campaign-insights/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
  AnalyticsMetrics: dynamic(() => import('@/app/integrations/analytics-metrics/page'), {
    loading: LoadingComponent,
    ssr: true,
  }),
};

/**
 * Dynamic component imports for optimization
 */
export const DynamicComponents = {
  ErrorBoundary: dynamic(() => import('@/components/error-boundary'), {
    loading: () => null,
    ssr: false,
  }),
};

/**
 * Preload a page for better UX when navigation is expected
 * @param pageLoader - The dynamic page loader function
 */
export const preloadPage = (pageLoader: any) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      pageLoader.preload?.();
    });
  }
};

/**
 * Get performance metrics for page load
 */
export const getPageMetrics = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigation) {
    return null;
  }

  return {
    // Time to First Byte
    ttfb: Math.round(navigation.responseStart - navigation.requestStart),

    // DOM Content Loaded
    domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.requestStart),

    // Full page load time
    loadComplete: Math.round(navigation.loadEventEnd - navigation.requestStart),

    // Time to Interactive (approximate)
    tti: Math.round(navigation.domInteractive - navigation.requestStart),

    // Resource timing
    resources: {
      count: performance.getEntriesByType('resource').length,
      duration: performance
        .getEntriesByType('resource')
        .reduce((sum, entry) => sum + entry.duration, 0),
    },
  };
};

/**
 * Log page performance metrics (for monitoring)
 */
export const logPageMetrics = () => {
  const metrics = getPageMetrics();

  if (metrics && process.env.NODE_ENV === 'development') {
    console.log('📊 Page Performance Metrics:', metrics);
  }
};

/**
 * Optimize images with loading attributes
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Batch update API cache after mutations
 * Clears related cache entries after a successful action
 */
export const invalidateRelatedCache = (section: 'admin' | 'analytics' | 'meta') => {
  // Import cache utility and clear relevant entries
  const { clearCacheSection } = require('@/utils/cache');
  clearCacheSection(section);
};
