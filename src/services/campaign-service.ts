/**
 * Campaign Service
 * Handles all campaign-related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import {
  CAMPAIGN_ENDPOINTS,
  CAMPAIGN_MANAGEMENT_ENDPOINTS,
  CAMPAIGN_STATUS_ENDPOINTS,
  ADVANCED_CAMPAIGN_ENDPOINTS,
} from "@/utils/api-endpoints";

/**
 * Campaign Types
 */
export interface Campaign {
  id: string;
  title: string;
  description: string;
  brand: string;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  budget: number;
  startDate: string;
  endDate: string;
  influencerCount: number;
  category: string;
  deliverables?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  category: string;
  targetAudience?: string;
  deliverables?: string[];
}

export interface UpdateCampaignPayload {
  title?: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
}

export interface Milestone {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  deliverables?: string[];
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

/**
 * Campaign Service
 */
export class CampaignService {
  /**
   * Create Campaign
   */
  static async createCampaign(
    payload: CreateCampaignPayload
  ): Promise<APIResponse<Campaign>> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.CREATE,
      payload
    );
  }

  /**
   * Get All Campaigns
   */
  static async getAllCampaigns(): Promise<
    APIResponse<Campaign[]>
  > {
    return apiClient.get(CAMPAIGN_ENDPOINTS.GET_ALL);
  }

  /**
   * Get My Campaigns
   */
  static async getMyCampaigns(): Promise<
    APIResponse<Campaign[]>
  > {
    return apiClient.get(
      CAMPAIGN_ENDPOINTS.GET_MY_CAMPAIGNS
    );
  }

  /**
   * Get Campaign by ID
   */
  static async getCampaignById(
    id: string
  ): Promise<APIResponse<Campaign>> {
    return apiClient.get(CAMPAIGN_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Update Campaign
   */
  static async updateCampaign(
    id: string,
    payload: UpdateCampaignPayload
  ): Promise<APIResponse<Campaign>> {
    return apiClient.patch(
      CAMPAIGN_ENDPOINTS.UPDATE(id),
      payload
    );
  }

  /**
   * Delete Campaign
   */
  static async deleteCampaign(id: string): Promise<APIResponse> {
    return apiClient.delete(CAMPAIGN_ENDPOINTS.DELETE(id));
  }

  /**
   * Apply to Campaign
   */
  static async applyToCampaign(
    campaignId: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.APPLY(campaignId),
      payload
    );
  }

  /**
   * Select Influencer for Campaign
   */
  static async selectInfluencer(
    campaignId: string,
    payload: { influencerId: string; amount: number }
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.SELECT_INFLUENCER(campaignId),
      payload
    );
  }

  /**
   * Get Campaign Deliverables
   */
  static async getDeliverables(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_ENDPOINTS.GET_DELIVERABLES(campaignId)
    );
  }

  /**
   * Add Deliverable
   */
  static async addDeliverable(
    campaignId: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.ADD_DELIVERABLE(campaignId),
      payload
    );
  }

  /**
   * Get Campaign Applications
   */
  static async getApplications(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_ENDPOINTS.GET_APPLICATIONS(campaignId)
    );
  }

  /**
   * Accept Application
   */
  static async acceptApplication(
    campaignId: string,
    applicationId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.ACCEPT_APPLICATION(
        campaignId,
        applicationId
      ),
      {}
    );
  }

  /**
   * Reject Application
   */
  static async rejectApplication(
    campaignId: string,
    applicationId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.REJECT_APPLICATION(
        campaignId,
        applicationId
      ),
      {}
    );
  }

  /**
   * Send Counter Offer
   */
  static async sendCounterOffer(
    campaignId: string,
    payload: { influencerId: string; amount: number }
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.SEND_COUNTER_OFFER(campaignId),
      payload
    );
  }

  /**
   * Get Negotiation Details
   */
  static async getNegotiationDetails(
    campaignId: string,
    influencerId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_ENDPOINTS.GET_NEGOTIATION_DETAILS(
        campaignId,
        influencerId
      )
    );
  }

  /**
   * Accept Counter Offer
   */
  static async acceptCounterOffer(
    campaignId: string,
    influencerId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.ACCEPT_COUNTER_OFFER(
        campaignId,
        influencerId
      ),
      {}
    );
  }

  /**
   * Reject Counter Offer
   */
  static async rejectCounterOffer(
    campaignId: string,
    influencerId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.REJECT_COUNTER_OFFER(
        campaignId,
        influencerId
      ),
      {}
    );
  }

  /**
   * Get Negotiation Timeline
   */
  static async getNegotiationTimeline(
    campaignId: string,
    influencerId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_ENDPOINTS.GET_NEGOTIATION_TIMELINE(
        campaignId,
        influencerId
      )
    );
  }

  /**
   * Boost Campaign
   */
  static async boostCampaign(
    campaignId: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_ENDPOINTS.BOOST_CAMPAIGN(campaignId),
      payload
    );
  }

  /**
   * Get Boost Recommendations
   */
  static async getBoostRecommendations(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_ENDPOINTS.GET_BOOST_RECOMMENDATIONS(campaignId)
    );
  }

  /**
   * Campaign Management - Add Milestone
   */
  static async addMilestone(
    campaignId: string,
    payload: Omit<Milestone, "id" | "campaignId">
  ): Promise<APIResponse<Milestone>> {
    return apiClient.post(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.ADD_MILESTONE(campaignId),
      payload
    );
  }

  /**
   * Campaign Management - Get Milestones
   */
  static async getMilestones(
    campaignId: string
  ): Promise<APIResponse<Milestone[]>> {
    return apiClient.get(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.GET_MILESTONES(campaignId)
    );
  }

  /**
   * Campaign Management - Update Milestone Status
   */
  static async updateMilestoneStatus(
    campaignId: string,
    milestoneId: string,
    status: string
  ): Promise<APIResponse> {
    return apiClient.patch(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.UPDATE_MILESTONE_STATUS(
        campaignId,
        milestoneId
      ),
      { status }
    );
  }

  /**
   * Campaign Management - Update Budget
   */
  static async updateBudget(
    campaignId: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.UPDATE_BUDGET(campaignId),
      payload
    );
  }

  /**
   * Campaign Management - Get Budget Overview
   */
  static async getBudgetOverview(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.GET_BUDGET_OVERVIEW(
        campaignId
      )
    );
  }

  /**
   * Campaign Management - Add Team Member
   */
  static async addTeamMember(
    campaignId: string,
    payload: any
  ): Promise<APIResponse<TeamMember>> {
    return apiClient.post(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.ADD_TEAM_MEMBER(
        campaignId
      ),
      payload
    );
  }

  /**
   * Campaign Management - Get Team Members
   */
  static async getTeamMembers(
    campaignId: string
  ): Promise<APIResponse<TeamMember[]>> {
    return apiClient.get(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.GET_TEAM_MEMBERS(
        campaignId
      )
    );
  }

  /**
   * Campaign Management - Remove Team Member
   */
  static async removeTeamMember(
    campaignId: string,
    memberId: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.REMOVE_TEAM_MEMBER(
        campaignId,
        memberId
      )
    );
  }

  /**
   * Campaign Management - Get Performance
   */
  static async getCampaignPerformance(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_MANAGEMENT_ENDPOINTS.GET_PERFORMANCE(campaignId)
    );
  }

  /**
   * Campaign Status - Update Status
   */
  static async updateCampaignStatus(
    campaignId: string,
    status: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_STATUS_ENDPOINTS.UPDATE_STATUS(campaignId),
      { status }
    );
  }

  /**
   * Campaign Status - Get Status History
   */
  static async getStatusHistory(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      CAMPAIGN_STATUS_ENDPOINTS.GET_STATUS_HISTORY(campaignId)
    );
  }

  /**
   * Campaign Status - Pause Campaign
   */
  static async pauseCampaign(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_STATUS_ENDPOINTS.PAUSE_CAMPAIGN(campaignId),
      {}
    );
  }

  /**
   * Campaign Status - Resume Campaign
   */
  static async resumeCampaign(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_STATUS_ENDPOINTS.RESUME_CAMPAIGN(campaignId),
      {}
    );
  }

  /**
   * Campaign Status - Cancel Campaign
   */
  static async cancelCampaign(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_STATUS_ENDPOINTS.CANCEL_CAMPAIGN(campaignId),
      {}
    );
  }

  /**
   * Campaign Status - Extend Campaign
   */
  static async extendCampaign(
    campaignId: string,
    days: number
  ): Promise<APIResponse> {
    return apiClient.post(
      CAMPAIGN_STATUS_ENDPOINTS.EXTEND_CAMPAIGN(campaignId),
      { days }
    );
  }

  /**
   * Advanced Campaign - Schedule Campaign
   */
  static async scheduleCampaign(
    campaignId: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.post(
      ADVANCED_CAMPAIGN_ENDPOINTS.SCHEDULE(campaignId),
      payload
    );
  }

  /**
   * Advanced Campaign - Clone Campaign
   */
  static async cloneCampaign(
    campaignId: string,
    payload?: any
  ): Promise<APIResponse<Campaign>> {
    return apiClient.post(
      ADVANCED_CAMPAIGN_ENDPOINTS.CLONE(campaignId),
      payload || {}
    );
  }

  /**
   * Advanced Campaign - Get Detailed Report
   */
  static async getDetailedReport(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      ADVANCED_CAMPAIGN_ENDPOINTS.GET_DETAILED_REPORT(
        campaignId
      )
    );
  }

  /**
   * Advanced Campaign - Add Influencer Feedback
   */
  static async addInfluencerFeedback(
    campaignId: string,
    influencerId: string,
    feedback: string
  ): Promise<APIResponse> {
    return apiClient.post(
      ADVANCED_CAMPAIGN_ENDPOINTS.ADD_INFLUENCER_FEEDBACK(
        campaignId,
        influencerId
      ),
      { feedback }
    );
  }

  /**
   * Advanced Campaign - Get Influencer Feedback
   */
  static async getInfluencerFeedback(
    campaignId: string
  ): Promise<APIResponse> {
    return apiClient.get(
      ADVANCED_CAMPAIGN_ENDPOINTS.GET_INFLUENCER_FEEDBACK(
        campaignId
      )
    );
  }

  /**
   * Advanced Campaign - Export Data
   */
  static async exportCampaignData(
    campaignId: string,
    format: "csv" | "pdf" | "excel"
  ): Promise<APIResponse> {
    return apiClient.post(
      ADVANCED_CAMPAIGN_ENDPOINTS.EXPORT_DATA(campaignId),
      { format }
    );
  }
}

export default CampaignService;
