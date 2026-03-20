/**
 * Trending Service
 * Handles trending endpoints for influencers, campaigns, and brands
 */

import { apiClient, APIResponse } from "./api-client";
import { TRENDING_ENDPOINTS } from "@/utils/api-endpoints";

export interface ITrendingInfluencer {
  _id: string;
  name: string;
  categoryInstagram: string;
  averageEngagement: number;
  instagramFollowers: number;
  trendingScore: number;
  platforms: Record<string, number>;
  lastActive: string;
}

export interface ITrendingCampaign {
  _id: string;
  brand: {
    id: string;
    name: string;
    avatar?: string;
  };
  budget: number;
  applications: number;
  acceptedInfluencers: number;
  engagement: number;
  trendingRank: number;
  status: string;
  daysLeft: number;
  createdAt: string;
}

export interface ITrendingBrand {
  _id: string;
  name: string;
  avatar?: string;
  trendingRank: number;
  activeCampaigns: number;
  totalBudget: number;
  influencersWorkedWith: number;
}

export interface ITrendingCategory {
  category: string;
  count: number;
  growth: number;
  influencers: number;
  campaigns: number;
}

export class TrendingService {
  /**
   * Get trending influencers
   */
  static async getTrendingInfluencers(
    limit = 20,
    offset = 0
  ): Promise<APIResponse<{
    data: ITrendingInfluencer[];
    pagination: any;
    metadata: any;
  }>> {
    return apiClient.get(TRENDING_ENDPOINTS.GET_INFLUENCERS, {
      params: { limit, offset },
    });
  }

  /**
   * Get trending campaigns
   */
  static async getTrendingCampaigns(
    limit = 6,
    offset = 0
  ): Promise<APIResponse<{
    data: ITrendingCampaign[];
    pagination: any;
  }>> {
    return apiClient.get(TRENDING_ENDPOINTS.GET_CAMPAIGNS, {
      params: { limit, offset },
    });
  }

  /**
   * Get trending brands
   */
  static async getTrendingBrands(
    limit = 8,
    offset = 0
  ): Promise<APIResponse<{
    data: ITrendingBrand[];
    pagination: any;
  }>> {
    return apiClient.get(TRENDING_ENDPOINTS.GET_BRANDS, {
      params: { limit, offset },
    });
  }

  /**
   * Get trending categories
   */
  static async getTrendingCategories(): Promise<
    APIResponse<{
      data: ITrendingCategory[];
    }>
  > {
    return apiClient.get(TRENDING_ENDPOINTS.GET_CATEGORIES);
  }
}
