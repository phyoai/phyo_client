/**
 * AI Search Service
 * Handles AI-powered influencer search
 */

import { apiClient, APIResponse } from "./api-client";
import { AI_ENDPOINTS } from "@/utils/api-endpoints";

export interface IAISearchResult {
  _id: string;
  name: string;
  city: string;
  instagramFollowers: number;
  categoryInstagram: string;
  relevance_score: number;
}

export interface IInfluencerDetails {
  _id: string;
  name: string;
  userName: string;
  analytics: {
    followers: number;
    averageEngagement: number;
    audienceGender: Record<string, number>;
    topCountries: string[];
  };
}

export interface IDebugInfo {
  totalInfluencers: number;
  categories: string[];
  cities: string[];
  sampleInfluencers: any[];
}

export class AISearchService {
  /**
   * Search influencers using AI natural language
   */
  static async searchInfluencers(
    prompt: string
  ): Promise<APIResponse<{
    data: IAISearchResult[];
    query: string;
  }>> {
    return apiClient.post(AI_ENDPOINTS.SEARCH, { prompt });
  }

  /**
   * Get detailed influencer information
   */
  static async getInfluencerDetails(
    userName: string
  ): Promise<APIResponse<IInfluencerDetails>> {
    return apiClient.get(AI_ENDPOINTS.GET_DETAILS, {
      params: { userName },
    });
  }

  /**
   * Get debug information about database
   */
  static async getDebugInfo(): Promise<APIResponse<IDebugInfo>> {
    return apiClient.get(AI_ENDPOINTS.DEBUG);
  }
}
