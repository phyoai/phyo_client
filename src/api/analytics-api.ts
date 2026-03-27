/**
 * Analytics API Utility Functions
 * Provides typed wrapper functions for analytics and reporting operations
 *
 * Usage:
 * import { analyticsApi } from '@/api/analytics-api';
 * const dashboardData = await analyticsApi.getDashboardAnalytics({ startDate, endDate });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Analytics Types
 */
export interface IDateRange {
  startDate: string;
  endDate: string;
}

export interface IDashboardMetric {
  label: string;
  value: number;
  change: number;
  changeDirection: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface ITrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ITrendChart {
  title: string;
  data: ITrendDataPoint[];
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

export interface IDashboardAnalytics {
  period: IDateRange;
  metrics: {
    totalCampaigns: IDashboardMetric;
    totalInfluencers: IDashboardMetric;
    totalReach: IDashboardMetric;
    totalEngagement: IDashboardMetric;
    conversionRate: IDashboardMetric;
    averageROI: IDashboardMetric;
  };
  trends: ITrendChart[];
  summary: {
    topCampaigns: Array<{ id: string; name: string; reach: number; engagement: number }>;
    topInfluencers: Array<{ id: string; name: string; followers: number; engagementRate: number }>;
  };
}

export interface ICampaignMetric {
  id: string;
  campaignId: string;
  campaignName: string;
  status: 'active' | 'completed' | 'paused';
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
  cost: number;
  revenue: number;
  roi: number;
  startDate: string;
  endDate?: string;
}

export interface ICampaignAnalyticsResponse {
  data: ICampaignMetric[];
  pagination: IPagination;
  summary: {
    totalReach: number;
    totalImpressions: number;
    totalConversions: number;
    averageEngagementRate: number;
    totalROI: number;
  };
}

export interface IInfluencerMetric {
  id: string;
  influencerId: string;
  influencerName: string;
  niche: string;
  followers: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  reachPerPost: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalRevenue: number;
  performanceScore: number;
}

export interface IInfluencerAnalyticsResponse {
  data: IInfluencerMetric[];
  pagination: IPagination;
  summary: {
    topPerformer: IInfluencerMetric;
    averageEngagementRate: number;
    averagePerformanceScore: number;
  };
}

export interface IReportData {
  period: string;
  startDate: string;
  endDate: string;
  metrics: {
    totalCampaigns: number;
    totalInfluencers: number;
    totalReach: number;
    totalEngagement: number;
    totalRevenue: number;
    averageROI: number;
  };
  trends: ITrendChart[];
  topCampaigns: Array<{ name: string; reach: number; roi: number }>;
  topInfluencers: Array<{ name: string; niche: string; engagementRate: number }>;
}

/**
 * Legacy Dashboard Metrics (kept for backwards compatibility)
 */
export interface IDashboardMetrics {
  totalReach: number;
  totalEngagement: number;
  conversionRate: number;
  avgCostPerEngagement: number;
  topPerformingContent: Array<{
    id: string;
    title: string;
    engagement: number;
    reach: number;
  }>;
  reachTrend: Array<{ date: string; value: number }>;
  engagementTrend: Array<{ date: string; value: number }>;
}

export interface IInfluencerPerformance {
  influencerId: string;
  name: string;
  followers: number;
  engagement: number;
  engagementRate: number;
  averageReach: number;
  costPerEngagement: number;
  topContent: Array<{
    id: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
}

export interface ICampaignPerformance {
  campaignId: string;
  campaignName: string;
  status: string;
  budget: number;
  spent: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  topPerformingInfluencers: Array<{
    influencerId: string;
    name: string;
    reach: number;
    engagement: number;
  }>;
}

export interface IAnalyticsReport {
  reportId: string;
  generatedAt: string;
  period: string;
  totalCampaigns: number;
  activeInfluencers: number;
  totalReach: number;
  totalEngagement: number;
  averageRoi: number;
  topCampaigns: Array<{
    campaignId: string;
    name: string;
    roi: number;
  }>;
  topInfluencers: Array<{
    influencerId: string;
    name: string;
    totalReach: number;
  }>;
}

export interface IEarnings {
  totalEarned: number;
  currentMonth: number;
  previousMonth: number;
  pendingPayment: number;
  paidOut: number;
  earningsTrend: Array<{
    month: string;
    amount: number;
  }>;
  earningsBySource: Array<{
    source: string;
    amount: number;
  }>;
}

/**
 * Analytics API service
 * Handles all analytics-related operations
 */
export const analyticsApi = {
  /**
   * Get dashboard metrics and overview
   *
   * @param params - Optional filter parameters
   * @returns Promise resolving to dashboard metrics
   */
  getDashboard: async (params?: Record<string, any>): Promise<IDashboardMetrics> => {
    try {
      const response = await api.get<IApiResponse<IDashboardMetrics>>(
        '/analytics/dashboard',
        { params }
      );
      return response.data?.data as any;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch dashboard';
      console.error('Error in getDashboard:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get influencer performance metrics
   *
   * @param influencerId - Optional influencer ID to filter
   * @param params - Filter parameters (date range, metrics, etc.)
   * @returns Promise resolving to influencer performance data
   */
  getInfluencerPerformance: async (
    influencerId?: string,
    params?: Record<string, any>
  ): Promise<IInfluencerPerformance[]> => {
    try {
      const endpoint = influencerId
        ? `/analytics/influencer-performance/${influencerId}`
        : '/analytics/influencer-performance';

      const response = await api.get<IApiResponse<IInfluencerPerformance[]>>(endpoint, {
        params,
      });
      return response.data?.data as any;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencer performance';
      console.error('Error in getInfluencerPerformance:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get campaign performance metrics
   *
   * @param campaignId - Campaign ID
   * @param params - Filter parameters
   * @returns Promise resolving to campaign performance data
   */
  getCampaignPerformance: async (
    campaignId: string,
    params?: Record<string, any>
  ): Promise<ICampaignPerformance> => {
    try {
      if (!campaignId) {
        throw new Error('Campaign ID is required');
      }

      const response = await api.get<IApiResponse<ICampaignPerformance>>(
        `/analytics/campaign-performance/${campaignId}`,
        { params }
      );
      return response.data?.data as any;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch campaign performance';
      console.error('Error in getCampaignPerformance:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Generate analytics report
   *
   * @param params - Report generation parameters (date range, metrics, format)
   * @returns Promise resolving to generated report
   */
  generateReport: async (params?: Record<string, any>): Promise<IAnalyticsReport> => {
    try {
      const response = await api.get<IApiResponse<IAnalyticsReport>>(
        '/analytics/reports',
        { params }
      );
      return response.data?.data as any;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to generate report';
      console.error('Error in generateReport:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get earnings summary and details
   *
   * @param params - Filter parameters (date range, breakdown type)
   * @returns Promise resolving to earnings data
   */
  getEarnings: async (params?: Record<string, any>): Promise<IEarnings> => {
    try {
      const response = await api.get<IApiResponse<IEarnings>>(
        '/analytics/earnings',
        { params }
      );
      return response.data?.data as any;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch earnings';
      console.error('Error in getEarnings:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get comprehensive dashboard analytics with key metrics and trends
   *
   * @param params - Date range parameters
   * @returns Promise resolving to dashboard analytics data
   */
  getDashboardAnalytics: async (
    params?: Partial<IDateRange>
  ): Promise<IDashboardAnalytics> => {
    try {
      const response = await api.get<IApiResponse<IDashboardAnalytics>>(
        '/analytics/dashboard-v2',
        { params }
      );

      return response.data?.data || ({
        period: (params as IDateRange) || { startDate: '', endDate: '' },
        metrics: {
          totalCampaigns: { label: 'Total Campaigns', value: 0, change: 0, changeDirection: 'neutral' },
          totalInfluencers: { label: 'Total Influencers', value: 0, change: 0, changeDirection: 'neutral' },
          totalReach: { label: 'Total Reach', value: 0, change: 0, changeDirection: 'neutral' },
          totalEngagement: { label: 'Total Engagement', value: 0, change: 0, changeDirection: 'neutral' },
          conversionRate: { label: 'Conversion Rate', value: 0, change: 0, changeDirection: 'neutral' },
          averageROI: { label: 'Average ROI', value: 0, change: 0, changeDirection: 'neutral' },
        },
        trends: [],
        summary: { topCampaigns: [], topInfluencers: [] },
      } as IDashboardAnalytics);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch dashboard analytics';
      console.error('Error in getDashboardAnalytics:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get campaign analytics with metrics and performance data
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated campaign analytics
   */
  getCampaignAnalytics: async (
    params?: Partial<IDateRange & { campaignId?: string; page?: number; limit?: number }>
  ): Promise<{ campaigns: ICampaignMetric[]; pagination: IPagination; summary: any }> => {
    try {
      const defaultPagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const response = await api.get<IApiResponse<ICampaignAnalyticsResponse>>(
        '/analytics/campaigns-v2',
        { params }
      );

      const payload = response.data?.data;
      return {
        campaigns: (payload?.data ?? []) as ICampaignMetric[],
        pagination: payload?.pagination ?? defaultPagination,
        summary: payload?.summary ?? {
          totalReach: 0,
          totalImpressions: 0,
          totalConversions: 0,
          averageEngagementRate: 0,
          totalROI: 0,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch campaign analytics';
      console.error('Error in getCampaignAnalytics:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get influencer analytics with performance metrics
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated influencer analytics
   */
  getInfluencerAnalytics: async (
    params?: Partial<IDateRange & { influencerId?: string; niche?: string; page?: number; limit?: number }>
  ): Promise<{ influencers: IInfluencerMetric[]; pagination: IPagination; summary: any }> => {
    try {
      const defaultPagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const response = await api.get<IApiResponse<IInfluencerAnalyticsResponse>>(
        '/analytics/influencers-v2',
        { params }
      );

      const payload = response.data?.data;
      return {
        influencers: (payload?.data ?? []) as IInfluencerMetric[],
        pagination: payload?.pagination ?? defaultPagination,
        summary: payload?.summary ?? {
          topPerformer: null,
          averageEngagementRate: 0,
          averagePerformanceScore: 0,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencer analytics';
      console.error('Error in getInfluencerAnalytics:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Export analytics report as CSV or PDF
   *
   * @param params - Report parameters
   * @returns Promise resolving to download URL or blob
   */
  exportAnalytics: async (
    params: {
      type: 'campaigns' | 'influencers' | 'dashboard' | 'monthly' | 'quarterly';
      format?: 'csv' | 'pdf';
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ downloadUrl: string; fileName: string }> => {
    try {
      const response = await api.post<IApiResponse<{ downloadUrl: string; fileName: string }>>(
        '/analytics/export',
        params
      );

      return response.data?.data || { downloadUrl: '', fileName: 'analytics.csv' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to export analytics';
      console.error('Error in exportAnalytics:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get period-based report (monthly or quarterly)
   *
   * @param params - Report period parameters
   * @returns Promise resolving to period report data
   */
  getPeriodReport: async (
    params: {
      period: 'monthly' | 'quarterly';
      year: number;
      month?: number;
      quarter?: number;
    }
  ): Promise<IReportData> => {
    try {
      const response = await api.get<IApiResponse<IReportData>>(
        '/analytics/reports-v2',
        { params }
      );

      return response.data?.data || {
        period: `${params.period}_${params.year}`,
        startDate: '',
        endDate: '',
        metrics: {
          totalCampaigns: 0,
          totalInfluencers: 0,
          totalReach: 0,
          totalEngagement: 0,
          totalRevenue: 0,
          averageROI: 0,
        },
        trends: [],
        topCampaigns: [],
        topInfluencers: [],
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch period report';
      console.error('Error in getPeriodReport:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};
