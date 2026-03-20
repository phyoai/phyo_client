/**
 * Brand Service
 * Handles all brand-related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import { BRAND_ENDPOINTS, BRAND_REQUEST_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * Brand Types
 */
export interface Brand {
  id: string;
  name: string;
  email: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
  followers?: number;
  campaigns?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSignupPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  industry?: string;
}

export interface UpdateBrandPayload {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface BrandRequest {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  industry?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

/**
 * Brand Service
 */
export class BrandService {
  /**
   * Brand Signup
   */
  static async signup(payload: BrandSignupPayload): Promise<APIResponse> {
    return apiClient.post(BRAND_ENDPOINTS.SIGNUP, payload);
  }

  /**
   * Get Brand Profile
   */
  static async getProfile(): Promise<APIResponse<Brand>> {
    return apiClient.get(BRAND_ENDPOINTS.GET_PROFILE);
  }

  /**
   * Update Brand Profile
   */
  static async updateProfile(
    payload: UpdateBrandPayload
  ): Promise<APIResponse<Brand>> {
    return apiClient.put(BRAND_ENDPOINTS.UPDATE_PROFILE, payload);
  }

  /**
   * Change Brand Password
   */
  static async changePassword(
    payload: ChangePasswordPayload
  ): Promise<APIResponse> {
    return apiClient.put(BRAND_ENDPOINTS.CHANGE_PASSWORD, payload);
  }

  /**
   * Logout
   */
  static async logout(): Promise<APIResponse> {
    return apiClient.post(BRAND_ENDPOINTS.LOGOUT, {});
  }

  /**
   * Update Notification Preferences
   */
  static async updateNotificationPreferences(
    preferences: any
  ): Promise<APIResponse> {
    return apiClient.patch(
      BRAND_ENDPOINTS.UPDATE_NOTIFICATION_PREFERENCES,
      preferences
    );
  }

  /**
   * Deactivate Account
   */
  static async deactivateAccount(): Promise<APIResponse> {
    return apiClient.delete(BRAND_ENDPOINTS.DEACTIVATE_ACCOUNT);
  }

  /**
   * Get All Brands
   */
  static async getAllBrands(): Promise<APIResponse<Brand[]>> {
    return apiClient.get(BRAND_ENDPOINTS.GET_ALL);
  }

  /**
   * Get Brand by ID
   */
  static async getBrandById(id: string): Promise<APIResponse<Brand>> {
    return apiClient.get(BRAND_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get Brand Campaigns
   */
  static async getBrandCampaigns(id: string): Promise<APIResponse> {
    return apiClient.get(BRAND_ENDPOINTS.GET_CAMPAIGNS(id));
  }

  /**
   * Get Brand Stats
   */
  static async getBrandStats(id: string): Promise<APIResponse> {
    return apiClient.get(BRAND_ENDPOINTS.GET_STATS(id));
  }

  /**
   * Update Brand by ID
   */
  static async updateBrandById(
    id: string,
    payload: UpdateBrandPayload
  ): Promise<APIResponse<Brand>> {
    return apiClient.put(
      BRAND_ENDPOINTS.UPDATE_BY_ID(id),
      payload
    );
  }

  /**
   * List Brands (Admin)
   */
  static async listBrands(): Promise<APIResponse<Brand[]>> {
    return apiClient.get(BRAND_ENDPOINTS.LIST_BRANDS);
  }

  /**
   * Create Brand Request
   */
  static async createBrandRequest(
    payload: Omit<BrandRequest, "id" | "status" | "createdAt" | "updatedAt">
  ): Promise<APIResponse<BrandRequest>> {
    return apiClient.post(BRAND_REQUEST_ENDPOINTS.CREATE, payload);
  }

  /**
   * Get All Brand Requests (Admin)
   */
  static async getAllBrandRequests(): Promise<
    APIResponse<BrandRequest[]>
  > {
    return apiClient.get(BRAND_REQUEST_ENDPOINTS.GET_ALL);
  }

  /**
   * Get Brand Request by ID (Admin)
   */
  static async getBrandRequestById(
    id: string
  ): Promise<APIResponse<BrandRequest>> {
    return apiClient.get(BRAND_REQUEST_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get Brand Request by Email
   */
  static async getBrandRequestByEmail(
    email: string
  ): Promise<APIResponse<BrandRequest>> {
    return apiClient.get(
      `${BRAND_REQUEST_ENDPOINTS.GET_BY_EMAIL}?email=${email}`
    );
  }

  /**
   * Update Brand Request (Admin)
   */
  static async updateBrandRequest(
    id: string,
    payload: any
  ): Promise<APIResponse> {
    return apiClient.patch(
      BRAND_REQUEST_ENDPOINTS.UPDATE(id),
      payload
    );
  }

  /**
   * Approve Brand Request (Admin)
   */
  static async approveBrandRequest(id: string): Promise<APIResponse> {
    return apiClient.patch(
      BRAND_REQUEST_ENDPOINTS.APPROVE(id),
      {}
    );
  }

  /**
   * Reject Brand Request (Admin)
   */
  static async rejectBrandRequest(id: string): Promise<APIResponse> {
    return apiClient.patch(
      BRAND_REQUEST_ENDPOINTS.REJECT(id),
      {}
    );
  }

  /**
   * Delete Brand Request (Admin)
   */
  static async deleteBrandRequest(id: string): Promise<APIResponse> {
    return apiClient.delete(BRAND_REQUEST_ENDPOINTS.DELETE(id));
  }

  /**
   * Search Brand Requests (Admin)
   */
  static async searchBrandRequests(query: string): Promise<APIResponse> {
    return apiClient.get(
      `${BRAND_REQUEST_ENDPOINTS.SEARCH}?query=${query}`
    );
  }

  /**
   * Get Brand Request Stats (Admin)
   */
  static async getBrandRequestStats(): Promise<APIResponse> {
    return apiClient.get(BRAND_REQUEST_ENDPOINTS.GET_STATS);
  }
}

export default BrandService;
