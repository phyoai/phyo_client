/**
 * Analytics API Utility Functions
 * Provides typed wrapper functions for all analytics-related API operations
 *
 * Usage:
 * import { analyticsApi } from '@/api/analytics-api';
 * const dashboard = await analyticsApi.getDashboard();
 */

import api from '@/utils/api';
import { IApiResponse } from '@/types';

/**
 * Analytics response types
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
};
