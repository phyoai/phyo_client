/**
 * Influencer Service
 * Handles all influencer-related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import {
  INFLUENCER_ENDPOINTS,
  INFLUENCER_DISCOVERY_ENDPOINTS,
  INFLUENCER_DATA_ENDPOINTS,
  INFLUENCER_REQUEST_ENDPOINTS,
} from "@/utils/api-endpoints";

/**
 * Influencer Types
 */
export interface Influencer {
  id: string;
  username: string;
  name: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
  category?: string;
  city?: string;
  state?: string;
  followers?: number;
  following?: number;
  avgEngagement?: number;
  reviews?: number;
  rating?: number;
  isVerified?: boolean;
  isBusiness?: boolean;
  demographics?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface InfluencerRequest {
  id: string;
  username: string;
  email: string;
  name?: string;
  category?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInfluencerPayload {
  username: string;
  name: string;
  email?: string;
  bio?: string;
  category?: string;
  city?: string;
  state?: string;
  profilePicture?: string;
}

export interface UpdateInfluencerPayload {
  username?: string;
  name?: string;
  bio?: string;
  category?: string;
  city?: string;
  state?: string;
  profilePicture?: string;
}

/**
 * Influencer Service
 */
export class InfluencerService {
  /**
   * Get All Influencers
   */
  static async getAllInfluencers(): Promise<APIResponse<Influencer[]>> {
    return apiClient.get(INFLUENCER_ENDPOINTS.GET_ALL);
  }

  /**
   * Create Influencer
   */
  static async createInfluencer(
    payload: CreateInfluencerPayload
  ): Promise<APIResponse<Influencer>> {
    return apiClient.post(
      INFLUENCER_ENDPOINTS.CREATE,
      payload
    );
  }

  /**
   * Get Influencer by ID
   */
  static async getInfluencerById(
    id: string
  ): Promise<APIResponse<Influencer>> {
    return apiClient.get(INFLUENCER_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Update Influencer
   */
  static async updateInfluencer(
    id: string,
    payload: UpdateInfluencerPayload
  ): Promise<APIResponse<Influencer>> {
    return apiClient.patch(
      INFLUENCER_ENDPOINTS.UPDATE(id),
      payload
    );
  }

  /**
   * Delete Influencer
   */
  static async deleteInfluencer(id: string): Promise<APIResponse> {
    return apiClient.delete(INFLUENCER_ENDPOINTS.DELETE(id));
  }

  /**
   * Get Influencer Stats
   */
  static async getInfluencerStats(id: string): Promise<APIResponse> {
    return apiClient.get(INFLUENCER_ENDPOINTS.GET_STATS(id));
  }

  /**
   * Get Influencer Pricing
   */
  static async getInfluencerPricing(
    id: string
  ): Promise<APIResponse> {
    return apiClient.get(
      INFLUENCER_ENDPOINTS.GET_PRICING(id)
    );
  }

  /**
   * Add Portfolio Item
   */
  static async addPortfolioItem(
    id: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.post(
      INFLUENCER_ENDPOINTS.ADD_PORTFOLIO_ITEM(id),
      payload
    );
  }

  /**
   * Get Influencer Campaigns
   */
  static async getInfluencerCampaigns(
    id: string
  ): Promise<APIResponse> {
    return apiClient.get(
      INFLUENCER_ENDPOINTS.GET_CAMPAIGNS(id)
    );
  }

  /**
   * Get Influencer Reviews
   */
  static async getInfluencerReviews(
    id: string
  ): Promise<APIResponse> {
    return apiClient.get(
      INFLUENCER_ENDPOINTS.GET_REVIEWS(id)
    );
  }

  /**
   * Get Influencer by Username
   */
  static async getInfluencerByUsername(
    username: string
  ): Promise<APIResponse<Influencer>> {
    return apiClient.get(
      INFLUENCER_ENDPOINTS.GET_BY_USERNAME(username)
    );
  }

  /**
   * Discovery - Discover Influencers
   */
  static async discoverInfluencers(
    filters?: any
  ): Promise<APIResponse<Influencer[]>> {
    return apiClient.get(
      INFLUENCER_DISCOVERY_ENDPOINTS.DISCOVER
    );
  }

  /**
   * Discovery - Get Influencer Profile
   */
  static async getDiscoveryProfile(
    id: string
  ): Promise<APIResponse<Influencer>> {
    return apiClient.get(
      INFLUENCER_DISCOVERY_ENDPOINTS.GET_PROFILE(id)
    );
  }

  /**
   * Discovery - Search Influencers
   */
  static async searchInfluencers(query: string): Promise<APIResponse> {
    return apiClient.get(
      `${INFLUENCER_DISCOVERY_ENDPOINTS.SEARCH}?query=${query}`
    );
  }

  /**
   * Discovery - Get by Category
   */
  static async getByCategory(
    category: string
  ): Promise<APIResponse<Influencer[]>> {
    return apiClient.get(
      INFLUENCER_DISCOVERY_ENDPOINTS.GET_BY_CATEGORY(category)
    );
  }

  /**
   * Discovery - Get Categories
   */
  static async getCategories(): Promise<
    APIResponse<string[]>
  > {
    return apiClient.get(
      INFLUENCER_DISCOVERY_ENDPOINTS.GET_CATEGORIES
    );
  }

  /**
   * Discovery - Get Recommendations
   */
  static async getRecommendations(): Promise<
    APIResponse<Influencer[]>
  > {
    return apiClient.get(
      INFLUENCER_DISCOVERY_ENDPOINTS.GET_RECOMMENDATIONS
    );
  }

  /**
   * Discovery - Contact Influencer
   */
  static async contactInfluencer(
    id: string,
    message: string
  ): Promise<APIResponse> {
    return apiClient.post(
      INFLUENCER_DISCOVERY_ENDPOINTS.CONTACT_INFLUENCER(
        id
      ),
      { message }
    );
  }

  /**
   * Data - Create Influencer
   */
  static async createInfluencerData(
    payload: CreateInfluencerPayload
  ): Promise<APIResponse<Influencer>> {
    return apiClient.post(
      INFLUENCER_DATA_ENDPOINTS.CREATE,
      payload
    );
  }

  /**
   * Data - Get All
   */
  static async getAllInfluencerData(): Promise<
    APIResponse<Influencer[]>
  > {
    return apiClient.get(INFLUENCER_DATA_ENDPOINTS.GET_ALL);
  }

  /**
   * Data - Search
   */
  static async searchInfluencerData(
    query: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${INFLUENCER_DATA_ENDPOINTS.SEARCH}?query=${query}`
    );
  }

  /**
   * Data - Search by Name
   */
  static async searchByName(name: string): Promise<APIResponse> {
    return apiClient.get(
      `${INFLUENCER_DATA_ENDPOINTS.SEARCH_BY_NAME}?name=${name}`
    );
  }

  /**
   * Data - Search by Username
   */
  static async searchByUsername(
    username: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${INFLUENCER_DATA_ENDPOINTS.SEARCH_BY_USERNAME}?username=${username}`
    );
  }

  /**
   * Data - Advanced Search
   */
  static async advancedSearch(filters: any): Promise<APIResponse> {
    return apiClient.get(
      INFLUENCER_DATA_ENDPOINTS.ADVANCED_SEARCH
    );
  }

  /**
   * Data - Get Stats
   */
  static async getInfluencerDataStats(): Promise<APIResponse> {
    return apiClient.get(INFLUENCER_DATA_ENDPOINTS.GET_STATS);
  }

  /**
   * Data - Get by ID
   */
  static async getInfluencerDataById(
    id: string
  ): Promise<APIResponse<Influencer>> {
    return apiClient.get(
      INFLUENCER_DATA_ENDPOINTS.GET_BY_ID(id)
    );
  }

  /**
   * Data - Get by Username
   */
  static async getInfluencerDataByUsername(
    username: string
  ): Promise<APIResponse<Influencer>> {
    return apiClient.get(
      INFLUENCER_DATA_ENDPOINTS.GET_BY_USERNAME(username)
    );
  }

  /**
   * Data - Update by ID
   */
  static async updateInfluencerDataById(
    id: string,
    payload: UpdateInfluencerPayload
  ): Promise<APIResponse<Influencer>> {
    return apiClient.patch(
      INFLUENCER_DATA_ENDPOINTS.UPDATE_BY_ID(id),
      payload
    );
  }

  /**
   * Data - Update by Username
   */
  static async updateInfluencerDataByUsername(
    username: string,
    payload: UpdateInfluencerPayload
  ): Promise<APIResponse<Influencer>> {
    return apiClient.patch(
      INFLUENCER_DATA_ENDPOINTS.UPDATE_BY_USERNAME(username),
      payload
    );
  }

  /**
   * Data - Delete by ID
   */
  static async deleteInfluencerDataById(
    id: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      INFLUENCER_DATA_ENDPOINTS.DELETE_BY_ID(id)
    );
  }

  /**
   * Data - Delete by Username
   */
  static async deleteInfluencerDataByUsername(
    username: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      INFLUENCER_DATA_ENDPOINTS.DELETE_BY_USERNAME(username)
    );
  }

  /**
   * Request - Create Influencer Request
   */
  static async createInfluencerRequest(
    payload: Omit<
      InfluencerRequest,
      "id" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<APIResponse<InfluencerRequest>> {
    return apiClient.post(
      INFLUENCER_REQUEST_ENDPOINTS.CREATE,
      payload
    );
  }

  /**
   * Request - Get All Requests (Admin)
   */
  static async getAllInfluencerRequests(): Promise<
    APIResponse<InfluencerRequest[]>
  > {
    return apiClient.get(
      INFLUENCER_REQUEST_ENDPOINTS.GET_ALL
    );
  }

  /**
   * Request - Get by ID (Admin)
   */
  static async getInfluencerRequestById(
    id: string
  ): Promise<APIResponse<InfluencerRequest>> {
    return apiClient.get(
      INFLUENCER_REQUEST_ENDPOINTS.GET_BY_ID(id)
    );
  }

  /**
   * Request - Get by Email
   */
  static async getInfluencerRequestByEmail(
    email: string
  ): Promise<APIResponse<InfluencerRequest>> {
    return apiClient.get(
      `${INFLUENCER_REQUEST_ENDPOINTS.GET_BY_EMAIL}?email=${email}`
    );
  }

  /**
   * Request - Get by Username
   */
  static async getInfluencerRequestByUsername(
    username: string
  ): Promise<APIResponse<InfluencerRequest>> {
    return apiClient.get(
      `${INFLUENCER_REQUEST_ENDPOINTS.GET_BY_USERNAME}?username=${username}`
    );
  }

  /**
   * Request - Approve Request (Admin)
   */
  static async approveInfluencerRequest(
    id: string
  ): Promise<APIResponse> {
    return apiClient.patch(
      INFLUENCER_REQUEST_ENDPOINTS.APPROVE(id),
      {}
    );
  }

  /**
   * Request - Reject Request (Admin)
   */
  static async rejectInfluencerRequest(
    id: string
  ): Promise<APIResponse> {
    return apiClient.patch(
      INFLUENCER_REQUEST_ENDPOINTS.REJECT(id),
      {}
    );
  }

  /**
   * Request - Delete Request (Admin)
   */
  static async deleteInfluencerRequest(
    id: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      INFLUENCER_REQUEST_ENDPOINTS.DELETE(id)
    );
  }

  /**
   * Request - Search Requests (Admin)
   */
  static async searchInfluencerRequests(
    query: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${INFLUENCER_REQUEST_ENDPOINTS.SEARCH}?query=${query}`
    );
  }

  /**
   * Request - Advanced Search (Admin)
   */
  static async advancedSearchInfluencers(
    filters: any
  ): Promise<APIResponse> {
    return apiClient.get(
      INFLUENCER_REQUEST_ENDPOINTS.ADVANCED_SEARCH
    );
  }

  /**
   * Request - Get Stats (Admin)
   */
  static async getInfluencerRequestStats(): Promise<APIResponse> {
    return apiClient.get(
      INFLUENCER_REQUEST_ENDPOINTS.GET_STATS
    );
  }
}

export default InfluencerService;
