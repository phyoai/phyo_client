/**
 * Analytics Service
 * Handles all analytics and reporting API calls
 */

import { apiClient, APIResponse } from "./api-client";
import { ANALYTICS_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * Analytics Types
 */
export interface DashboardData {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalInfluencers: number;
  totalEarnings: number;
  totalSpent: number;
  conversionRate: number;
  averageEngagement: number;
  recentActivity?: any[];
  topPerformingCampaigns?: any[];
  topInfluencers?: any[];
}

export interface InfluencerPerformance {
  influencerId: string;
  influencerName: string;
  campaignId?: string;
  campaignName?: string;
  followers: number;
  engagement: number;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  conversions: number;
  conversionRate: number;
  roi: number;
  rating?: number;
  reviews?: number;
  lastActive?: string;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  status: string;
  budget: number;
  spent: number;
  roi: number;
  impressions: number;
  engagements: number;
  engagementRate: number;
  conversions: number;
  conversionRate: number;
  influencers: number;
  duration: string;
  startDate: string;
  endDate: string;
  topPerformingInfluencers?: any[];
}

export interface Report {
  id: string;
  userId: string;
  type: "summary" | "detailed" | "performance";
  startDate: string;
  endDate: string;
  data: any;
  generatedAt: string;
  downloadUrl?: string;
}

export interface EarningsData {
  totalEarnings: number;
  pendingEarnings: number;
  withdrawnEarnings: number;
  monthlyEarnings: Record<string, number>;
  earningsByCampaign: any[];
  payoutHistory: any[];
}

/**
 * Analytics Service
 */
export class AnalyticsService {
  /**
   * Get Dashboard Data
   */
  static async getDashboard(): Promise<
    APIResponse<DashboardData>
  > {
    return apiClient.get(
      ANALYTICS_ENDPOINTS.GET_DASHBOARD
    );
  }

  /**
   * Get Influencer Performance Metrics
   */
  static async getInfluencerPerformance(
    influencerId?: string
  ): Promise<APIResponse<InfluencerPerformance[]>> {
    let url = ANALYTICS_ENDPOINTS.GET_INFLUENCER_PERFORMANCE;
    if (influencerId) {
      url += `?influencerId=${influencerId}`;
    }
    return apiClient.get(url);
  }

  /**
   * Get Campaign Performance Metrics
   */
  static async getCampaignPerformance(
    campaignId: string
  ): Promise<APIResponse<CampaignPerformance>> {
    return apiClient.get(
      ANALYTICS_ENDPOINTS.GET_CAMPAIGN_PERFORMANCE(campaignId)
    );
  }

  /**
   * Generate Report
   */
  static async generateReport(
    type: "summary" | "detailed" | "performance",
    startDate: string,
    endDate: string
  ): Promise<APIResponse<Report>> {
    return apiClient.get(
      `${ANALYTICS_ENDPOINTS.GENERATE_REPORT}?type=${type}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Get Earnings Data
   */
  static async getEarnings(): Promise<
    APIResponse<EarningsData>
  > {
    return apiClient.get(ANALYTICS_ENDPOINTS.GET_EARNINGS);
  }

  /**
   * Get Monthly Earnings
   */
  static async getMonthlyEarnings(
    month: string,
    year: number
  ): Promise<APIResponse> {
    return apiClient.get(
      `${ANALYTICS_ENDPOINTS.GET_EARNINGS}?month=${month}&year=${year}`
    );
  }

  /**
   * Get Earnings by Campaign
   */
  static async getEarningsByCampaign(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${ANALYTICS_ENDPOINTS.GET_EARNINGS}?campaignId=${campaignId}`
    );
  }
}

export default AnalyticsService;
