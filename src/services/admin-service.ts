/**
 * Admin Service
 * Handles all admin panel API calls
 */

import { apiClient, APIResponse } from "./api-client";
import { ADMIN_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * Admin Types
 */
export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  permissions: string[];
  createdAt: string;
}

export interface AdminRequest {
  id: string;
  type: "brand" | "influencer";
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AdminStatistics {
  totalUsers: number;
  totalBrands: number;
  totalInfluencers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalTransactions: number;
  totalRevenue: number;
  pendingRequests: number;
  approvedRequests: number;
}

/**
 * Admin Service
 */
export class AdminService {
  /**
   * Get Admin Profile
   */
  static async getProfile(): Promise<APIResponse<AdminProfile>> {
    return apiClient.get(ADMIN_ENDPOINTS.GET_PROFILE);
  }

  /**
   * Change Admin Password
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<APIResponse> {
    return apiClient.put(
      ADMIN_ENDPOINTS.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
  }

  /**
   * Get Brand Requests
   */
  static async getBrandRequests(
    page?: number,
    limit?: number
  ): Promise<APIResponse<AdminRequest[]>> {
    let url = ADMIN_ENDPOINTS.GET_BRAND_REQUESTS;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return apiClient.get(url);
  }

  /**
   * Get Single Brand Request
   */
  static async getSingleBrandRequest(
    id: string
  ): Promise<APIResponse<AdminRequest>> {
    return apiClient.get(
      ADMIN_ENDPOINTS.GET_SINGLE_BRAND_REQUEST(id)
    );
  }

  /**
   * Get Influencer Requests
   */
  static async getInfluencerRequests(
    page?: number,
    limit?: number
  ): Promise<APIResponse<AdminRequest[]>> {
    let url = ADMIN_ENDPOINTS.GET_INFLUENCER_REQUESTS;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return apiClient.get(url);
  }

  /**
   * Get Single Influencer Request
   */
  static async getSingleInfluencerRequest(
    id: string
  ): Promise<APIResponse<AdminRequest>> {
    return apiClient.get(
      ADMIN_ENDPOINTS.GET_SINGLE_INFLUENCER_REQUEST(id)
    );
  }

  /**
   * Approve Request
   */
  static async approveRequest(id: string): Promise<APIResponse> {
    return apiClient.put(
      ADMIN_ENDPOINTS.APPROVE_REQUEST(id),
      {}
    );
  }

  /**
   * Reject Request
   */
  static async rejectRequest(
    id: string,
    reason?: string
  ): Promise<APIResponse> {
    return apiClient.put(
      ADMIN_ENDPOINTS.REJECT_REQUEST(id),
      { reason }
    );
  }

  /**
   * Get Statistics
   */
  static async getStatistics(): Promise<
    APIResponse<AdminStatistics>
  > {
    return apiClient.get(ADMIN_ENDPOINTS.GET_STATISTICS);
  }

  /**
   * Get Help Categories
   */
  static async getHelpCategories(): Promise<
    APIResponse<string[]>
  > {
    return apiClient.get(
      ADMIN_ENDPOINTS.GET_HELP_CATEGORIES
    );
  }

  /**
   * Legacy - List Requests
   */
  static async listRequests(): Promise<APIResponse<AdminRequest[]>> {
    return apiClient.get(ADMIN_ENDPOINTS.LIST_REQUESTS);
  }

  /**
   * Legacy - Approve Brand Request
   */
  static async approveBrandRequest(id: string): Promise<APIResponse> {
    return apiClient.put(
      ADMIN_ENDPOINTS.APPROVE_BRAND_REQUEST(id),
      {}
    );
  }

  /**
   * Create Admin
   */
  static async createAdmin(payload: {
    email: string;
    name: string;
    password: string;
    role: "admin" | "super_admin";
  }): Promise<APIResponse<AdminProfile>> {
    return apiClient.post(ADMIN_ENDPOINTS.CREATE_ADMIN, payload);
  }

  /**
   * List Admins
   */
  static async listAdmins(): Promise<APIResponse<AdminProfile[]>> {
    return apiClient.get(ADMIN_ENDPOINTS.LIST_ADMINS);
  }
}

export default AdminService;
