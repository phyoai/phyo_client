/**
 * Utility Services
 * Handles all utility API calls: collaborations, favorites, reviews, trending, locations, portfolios, projects, support, SMS
 */

import { apiClient, APIResponse } from "./api-client";
import {
  COLLABORATION_ENDPOINTS,
  FAVORITES_ENDPOINTS,
  REVIEWS_ENDPOINTS,
  TRENDING_ENDPOINTS,
  LOCATION_ENDPOINTS,
  PORTFOLIO_ENDPOINTS,
  PROJECT_ENDPOINTS,
  SUPPORT_ENDPOINTS,
  SMS_ENDPOINTS,
  FILE_ENDPOINTS,
} from "@/utils/api-endpoints";

/**
 * Utility Types
 */
export interface Collaboration {
  id: string;
  userId1: string;
  userId2: string;
  status: "pending" | "active" | "completed";
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  targetId: string;
  targetType: "influencer" | "brand";
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description?: string;
  items?: any[];
  stats?: any;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: "active" | "completed" | "archived";
  dueDate?: string;
  createdAt: string;
}

/**
 * Utility Service
 */
export class UtilityService {
  // ============= COLLABORATION =============

  /**
   * Send Collaboration Request
   */
  static async sendCollaborationRequest(
    payload: { recipientId: string; message: string }
  ): Promise<APIResponse> {
    return apiClient.post(
      COLLABORATION_ENDPOINTS.SEND_REQUEST,
      payload
    );
  }

  /**
   * Get Collaboration Requests
   */
  static async getCollaborationRequests(): Promise<
    APIResponse<Collaboration[]>
  > {
    return apiClient.get(
      COLLABORATION_ENDPOINTS.GET_REQUESTS
    );
  }

  /**
   * Accept Collaboration Request
   */
  static async acceptCollaborationRequest(
    requestId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      COLLABORATION_ENDPOINTS.ACCEPT_REQUEST(requestId),
      {}
    );
  }

  /**
   * Reject Collaboration Request
   */
  static async rejectCollaborationRequest(
    requestId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      COLLABORATION_ENDPOINTS.REJECT_REQUEST(requestId),
      {}
    );
  }

  /**
   * Get Active Collaborations
   */
  static async getActiveCollaborations(): Promise<
    APIResponse<Collaboration[]>
  > {
    return apiClient.get(
      COLLABORATION_ENDPOINTS.GET_ACTIVE
    );
  }

  /**
   * End Collaboration
   */
  static async endCollaboration(
    collaborationId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      COLLABORATION_ENDPOINTS.END_COLLABORATION(
        collaborationId
      ),
      {}
    );
  }

  /**
   * Get Collaboration Stats
   */
  static async getCollaborationStats(): Promise<APIResponse> {
    return apiClient.get(
      COLLABORATION_ENDPOINTS.GET_STATS
    );
  }

  // ============= FAVORITES =============

  /**
   * Add Campaign to Favorites
   */
  static async addCampaignToFavorites(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      FAVORITES_ENDPOINTS.ADD_CAMPAIGN(campaignId),
      {}
    );
  }

  /**
   * Remove Campaign from Favorites
   */
  static async removeCampaignFromFavorites(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      FAVORITES_ENDPOINTS.REMOVE_CAMPAIGN(campaignId)
    );
  }

  /**
   * Get Favorite Campaigns
   */
  static async getFavoriteCampaigns(): Promise<APIResponse> {
    return apiClient.get(
      FAVORITES_ENDPOINTS.GET_FAVORITE_CAMPAIGNS
    );
  }

  /**
   * Save Influencer
   */
  static async saveInfluencer(
    influencerId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      FAVORITES_ENDPOINTS.SAVE_INFLUENCER(influencerId),
      {}
    );
  }

  /**
   * Unsave Influencer
   */
  static async unsaveInfluencer(
    influencerId: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      FAVORITES_ENDPOINTS.UNSAVE_INFLUENCER(influencerId)
    );
  }

  /**
   * Get Saved Influencers
   */
  static async getSavedInfluencers(): Promise<APIResponse> {
    return apiClient.get(
      FAVORITES_ENDPOINTS.GET_SAVED_INFLUENCERS
    );
  }

  /**
   * Check if Item is Favorited
   */
  static async checkIsFavorited(
    type: "campaign" | "influencer",
    id: string
  ): Promise<APIResponse<{ isFavorited: boolean }>> {
    return apiClient.get(
      FAVORITES_ENDPOINTS.CHECK_IS_FAVORITED(type, id)
    );
  }

  // ============= REVIEWS =============

  /**
   * Review Influencer
   */
  static async reviewInfluencer(
    influencerId: string,
    payload: { rating: number; comment: string }
  ): Promise<APIResponse<Review>> {
    return apiClient.post(
      REVIEWS_ENDPOINTS.REVIEW_INFLUENCER(influencerId),
      payload
    );
  }

  /**
   * Get Influencer Reviews
   */
  static async getInfluencerReviews(
    influencerId: string
  ): Promise<APIResponse<Review[]>> {
    return apiClient.get(
      REVIEWS_ENDPOINTS.GET_INFLUENCER_REVIEWS(influencerId)
    );
  }

  /**
   * Review Brand
   */
  static async reviewBrand(
    brandId: string,
    payload: { rating: number; comment: string }
  ): Promise<APIResponse<Review>> {
    return apiClient.post(
      REVIEWS_ENDPOINTS.REVIEW_BRAND(brandId),
      payload
    );
  }

  /**
   * Get Brand Reviews
   */
  static async getBrandReviews(
    brandId: string
  ): Promise<APIResponse<Review[]>> {
    return apiClient.get(
      REVIEWS_ENDPOINTS.GET_BRAND_REVIEWS(brandId)
    );
  }

  /**
   * Delete Review
   */
  static async deleteReview(reviewId: string): Promise<APIResponse> {
    return apiClient.delete(
      REVIEWS_ENDPOINTS.DELETE_REVIEW(reviewId)
    );
  }

  /**
   * Get My Reviews
   */
  static async getMyReviews(): Promise<APIResponse<Review[]>> {
    return apiClient.get(REVIEWS_ENDPOINTS.GET_MY_REVIEWS);
  }

  // ============= TRENDING =============

  /**
   * Get Trending Influencers
   */
  static async getTrendingInfluencers(): Promise<APIResponse> {
    return apiClient.get(
      TRENDING_ENDPOINTS.GET_INFLUENCERS
    );
  }

  /**
   * Get Trending Campaigns
   */
  static async getTrendingCampaigns(): Promise<APIResponse> {
    return apiClient.get(
      TRENDING_ENDPOINTS.GET_CAMPAIGNS
    );
  }

  /**
   * Get Trending Brands
   */
  static async getTrendingBrands(): Promise<APIResponse> {
    return apiClient.get(TRENDING_ENDPOINTS.GET_BRANDS);
  }

  /**
   * Get Trending Categories
   */
  static async getTrendingCategories(): Promise<APIResponse> {
    return apiClient.get(
      TRENDING_ENDPOINTS.GET_CATEGORIES
    );
  }

  // ============= LOCATION =============

  /**
   * Get Nearby Influencers
   */
  static async getNearbyInfluencers(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<APIResponse> {
    return apiClient.get(
      `${LOCATION_ENDPOINTS.GET_NEARBY_INFLUENCERS}?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
  }

  /**
   * Search Influencers by Location
   */
  static async searchInfluencersByLocation(
    location: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${LOCATION_ENDPOINTS.SEARCH_INFLUENCERS_BY_LOCATION}?location=${location}`
    );
  }

  /**
   * Get Nearby Brands
   */
  static async getNearbyBrands(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<APIResponse> {
    return apiClient.get(
      `${LOCATION_ENDPOINTS.GET_NEARBY_BRANDS}?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
  }

  /**
   * Search Brands by Location
   */
  static async searchBrandsByLocation(
    location: string
  ): Promise<APIResponse> {
    return apiClient.get(
      `${LOCATION_ENDPOINTS.SEARCH_BRANDS_BY_LOCATION}?location=${location}`
    );
  }

  /**
   * Get Nearby Campaigns
   */
  static async getNearbyActiveCampaigns(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<APIResponse> {
    return apiClient.get(
      `${LOCATION_ENDPOINTS.GET_NEARBY_CAMPAIGNS}?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
  }

  /**
   * Update User Location
   */
  static async updateUserLocation(
    latitude: number,
    longitude: number,
    city: string,
    state: string
  ): Promise<APIResponse> {
    return apiClient.post(
      LOCATION_ENDPOINTS.UPDATE_USER_LOCATION,
      { latitude, longitude, city, state }
    );
  }

  /**
   * Get Supported Locations
   */
  static async getSupportedLocations(): Promise<APIResponse> {
    return apiClient.get(
      LOCATION_ENDPOINTS.GET_SUPPORTED_LOCATIONS
    );
  }

  // ============= PORTFOLIO =============

  /**
   * Create Portfolio
   */
  static async createPortfolio(
    payload: Omit<Portfolio, "id" | "createdAt">
  ): Promise<APIResponse<Portfolio>> {
    return apiClient.post(PORTFOLIO_ENDPOINTS.CREATE, payload);
  }

  /**
   * Get All Portfolios
   */
  static async getAllPortfolios(): Promise<
    APIResponse<Portfolio[]>
  > {
    return apiClient.get(PORTFOLIO_ENDPOINTS.GET_ALL);
  }

  /**
   * Get Portfolio by ID
   */
  static async getPortfolioById(
    id: string
  ): Promise<APIResponse<Portfolio>> {
    return apiClient.get(PORTFOLIO_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Update Portfolio
   */
  static async updatePortfolio(
    id: string,
    payload: Partial<Portfolio>
  ): Promise<APIResponse<Portfolio>> {
    return apiClient.put(PORTFOLIO_ENDPOINTS.UPDATE(id), payload);
  }

  /**
   * Delete Portfolio
   */
  static async deletePortfolio(id: string): Promise<APIResponse> {
    return apiClient.delete(PORTFOLIO_ENDPOINTS.DELETE(id));
  }

  /**
   * Get Portfolio Stats
   */
  static async getPortfolioStats(id: string): Promise<APIResponse> {
    return apiClient.get(PORTFOLIO_ENDPOINTS.GET_STATS(id));
  }

  /**
   * Add Portfolio Client
   */
  static async addPortfolioClient(
    id: string,
    clientData: any
  ): Promise<APIResponse> {
    return apiClient.post(
      PORTFOLIO_ENDPOINTS.ADD_CLIENT(id),
      clientData
    );
  }

  // ============= PROJECT =============

  /**
   * Create Project
   */
  static async createProject(
    payload: Omit<Project, "id" | "createdAt">
  ): Promise<APIResponse<Project>> {
    return apiClient.post(PROJECT_ENDPOINTS.CREATE, payload);
  }

  /**
   * Get All Projects
   */
  static async getAllProjects(): Promise<APIResponse<Project[]>> {
    return apiClient.get(PROJECT_ENDPOINTS.GET_ALL);
  }

  /**
   * Get Project Stats
   */
  static async getProjectStats(): Promise<APIResponse> {
    return apiClient.get(PROJECT_ENDPOINTS.GET_STATS);
  }

  /**
   * Get Project by ID
   */
  static async getProjectById(
    id: string
  ): Promise<APIResponse<Project>> {
    return apiClient.get(PROJECT_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Update Project
   */
  static async updateProject(
    id: string,
    payload: Partial<Project>
  ): Promise<APIResponse<Project>> {
    return apiClient.put(PROJECT_ENDPOINTS.UPDATE(id), payload);
  }

  /**
   * Delete Project
   */
  static async deleteProject(id: string): Promise<APIResponse> {
    return apiClient.delete(PROJECT_ENDPOINTS.DELETE(id));
  }

  // ============= SUPPORT =============

  /**
   * Get FAQs
   */
  static async getFAQs(): Promise<APIResponse> {
    return apiClient.get(SUPPORT_ENDPOINTS.GET_FAQS);
  }

  /**
   * Get Supported Languages
   */
  static async getSupportedLanguages(): Promise<APIResponse> {
    return apiClient.get(
      SUPPORT_ENDPOINTS.GET_SUPPORTED_LANGUAGES
    );
  }

  /**
   * Submit Contact Form
   */
  static async submitContactForm(payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<APIResponse> {
    return apiClient.post(
      SUPPORT_ENDPOINTS.SUBMIT_CONTACT_FORM,
      payload
    );
  }

  /**
   * Get Help Articles
   */
  static async getHelpArticles(category: string): Promise<APIResponse> {
    return apiClient.get(
      SUPPORT_ENDPOINTS.GET_HELP_ARTICLES(category)
    );
  }

  // ============= SMS =============

  /**
   * Send OTP
   */
  static async sendOTP(phone: string): Promise<APIResponse> {
    return apiClient.post(SMS_ENDPOINTS.SEND_OTP, { phone });
  }

  /**
   * Send Login OTP
   */
  static async sendLoginOTP(phone: string): Promise<APIResponse> {
    return apiClient.post(SMS_ENDPOINTS.SEND_LOGIN_OTP, {
      phone,
    });
  }

  /**
   * Send Welcome Message
   */
  static async sendWelcomeMessage(
    phone: string,
    userName: string
  ): Promise<APIResponse> {
    return apiClient.post(SMS_ENDPOINTS.SEND_WELCOME, {
      phone,
      userName,
    });
  }

  /**
   * Send Campaign Alert
   */
  static async sendCampaignAlert(
    phone: string,
    campaignName: string
  ): Promise<APIResponse> {
    return apiClient.post(
      SMS_ENDPOINTS.SEND_CAMPAIGN_ALERT,
      { phone, campaignName }
    );
  }

  /**
   * Send Payment Confirmation
   */
  static async sendPaymentConfirmation(
    phone: string,
    amount: number,
    transactionId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      SMS_ENDPOINTS.SEND_PAYMENT_CONFIRMATION,
      { phone, amount, transactionId }
    );
  }

  /**
   * Check SMS Delivery Status
   */
  static async checkSMSStatus(messageId: string): Promise<APIResponse> {
    return apiClient.get(
      SMS_ENDPOINTS.CHECK_DELIVERY_STATUS(messageId)
    );
  }

  // ============= FILES =============

  /**
   * Upload File
   */
  static async uploadFile(file: File, additionalData?: any): Promise<APIResponse> {
    return apiClient.uploadFile(FILE_ENDPOINTS.UPLOAD, file, additionalData);
  }

  /**
   * Delete File
   */
  static async deleteFile(fileId: string): Promise<APIResponse> {
    return apiClient.delete(
      `${FILE_ENDPOINTS.DELETE}?fileId=${fileId}`
    );
  }
}

export default UtilityService;
