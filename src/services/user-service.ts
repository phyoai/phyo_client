/**
 * User Service
 * Handles all user profile and account management API calls
 */

import { apiClient, APIResponse } from "./api-client";
import { USER_ENDPOINTS, PROFILE_ENDPOINTS, USER_PROFILE_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * User Types
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  userType: "influencer" | "brand";
  isVerified: boolean;
  accountStatus: "active" | "suspended" | "deactivated";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  profilePicture?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  phoneNumber?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateEmailPayload {
  newEmail: string;
}

export interface UpdatePhonePayload {
  phoneNumber: string;
  country: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  campaignUpdates: boolean;
  messages: boolean;
  systemAlerts: boolean;
}

/**
 * User Service
 */
export class UserService {
  /**
   * Get User Profile
   */
  static async getProfile(): Promise<APIResponse<UserProfile>> {
    return apiClient.get(USER_ENDPOINTS.GET_PROFILE);
  }

  /**
   * Update User Profile
   */
  static async updateProfile(
    payload: UpdateProfilePayload
  ): Promise<APIResponse<UserProfile>> {
    return apiClient.patch(USER_ENDPOINTS.UPDATE_PROFILE, payload);
  }

  /**
   * Get Account Settings
   */
  static async getAccountSettings(): Promise<APIResponse> {
    return apiClient.get(USER_ENDPOINTS.GET_SETTINGS);
  }

  /**
   * Update Notification Preferences
   */
  static async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<APIResponse> {
    return apiClient.patch(
      USER_ENDPOINTS.UPDATE_NOTIFICATION_PREFERENCES,
      preferences
    );
  }

  /**
   * Logout
   */
  static async logout(): Promise<APIResponse> {
    return apiClient.post(USER_ENDPOINTS.LOGOUT, {});
  }

  /**
   * Search Users
   */
  static async searchUsers(query: string): Promise<APIResponse<UserProfile[]>> {
    return apiClient.get(`${USER_ENDPOINTS.SEARCH_USERS}?query=${query}`);
  }

  /**
   * Get User by ID
   */
  static async getUserById(id: string): Promise<APIResponse<UserProfile>> {
    return apiClient.get(USER_ENDPOINTS.GET_USER_BY_ID(id));
  }

  /**
   * List Users (Admin)
   */
  static async listUsers(page?: number, limit?: number): Promise<APIResponse<UserProfile[]>> {
    let url = USER_ENDPOINTS.LIST_USERS;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return apiClient.get(url);
  }

  /**
   * Delete Account
   */
  static async deleteAccount(): Promise<APIResponse> {
    return apiClient.delete(USER_ENDPOINTS.DELETE_ACCOUNT);
  }

  /**
   * Get Full Profile
   */
  static async getFullProfile(): Promise<APIResponse<UserProfile>> {
    return apiClient.get(PROFILE_ENDPOINTS.GET_FULL_PROFILE);
  }

  /**
   * Get Profile Summary
   */
  static async getProfileSummary(): Promise<APIResponse> {
    return apiClient.get(PROFILE_ENDPOINTS.GET_PROFILE_SUMMARY);
  }

  /**
   * Get Verification Status
   */
  static async getVerificationStatus(): Promise<APIResponse> {
    return apiClient.get(PROFILE_ENDPOINTS.GET_VERIFICATION_STATUS);
  }

  /**
   * Update Personal Info
   */
  static async updatePersonalInfo(
    payload: any
  ): Promise<APIResponse> {
    return apiClient.put(
      PROFILE_ENDPOINTS.UPDATE_PERSONAL_INFO,
      payload
    );
  }

  /**
   * Update Professional Info
   */
  static async updateProfessionalInfo(
    payload: any
  ): Promise<APIResponse> {
    return apiClient.put(
      PROFILE_ENDPOINTS.UPDATE_PROFESSIONAL_INFO,
      payload
    );
  }

  /**
   * Update Social Stats
   */
  static async updateSocialStats(
    payload: any
  ): Promise<APIResponse> {
    return apiClient.put(
      PROFILE_ENDPOINTS.UPDATE_SOCIAL_STATS,
      payload
    );
  }

  /**
   * Upload Profile Image
   */
  static async uploadProfileImage(
    file: File
  ): Promise<APIResponse> {
    return apiClient.uploadFile(
      PROFILE_ENDPOINTS.UPLOAD_PROFILE_IMAGE,
      file
    );
  }

  /**
   * Delete Profile Image
   */
  static async deleteProfileImage(): Promise<APIResponse> {
    return apiClient.post(
      PROFILE_ENDPOINTS.DELETE_PROFILE_IMAGE,
      {}
    );
  }

  /**
   * Change Password
   */
  static async changePassword(
    payload: ChangePasswordPayload
  ): Promise<APIResponse> {
    return apiClient.post(
      PROFILE_ENDPOINTS.CHANGE_PASSWORD,
      payload
    );
  }

  /**
   * Update Email
   */
  static async updateEmail(
    payload: UpdateEmailPayload
  ): Promise<APIResponse> {
    return apiClient.put(
      PROFILE_ENDPOINTS.UPDATE_EMAIL,
      payload
    );
  }

  /**
   * Send Email Verification OTP
   */
  static async sendEmailVerificationOTP(): Promise<APIResponse> {
    return apiClient.post(
      PROFILE_ENDPOINTS.SEND_EMAIL_VERIFICATION_OTP,
      {}
    );
  }

  /**
   * Verify Email with OTP
   */
  static async verifyEmailWithOTP(otp: string): Promise<APIResponse> {
    return apiClient.post(
      PROFILE_ENDPOINTS.VERIFY_EMAIL_WITH_OTP,
      { otp }
    );
  }

  /**
   * Update Phone
   */
  static async updatePhone(
    payload: UpdatePhonePayload
  ): Promise<APIResponse> {
    return apiClient.put(
      PROFILE_ENDPOINTS.UPDATE_PHONE,
      payload
    );
  }

  /**
   * User Profile - Get My Profile
   */
  static async getMyProfile(): Promise<APIResponse<UserProfile>> {
    return apiClient.get(USER_PROFILE_ENDPOINTS.GET_MY_PROFILE);
  }

  /**
   * User Profile - Update My Profile
   */
  static async updateMyProfile(
    payload: UpdateProfilePayload
  ): Promise<APIResponse<UserProfile>> {
    return apiClient.put(
      USER_PROFILE_ENDPOINTS.UPDATE_MY_PROFILE,
      payload
    );
  }

  /**
   * User Profile - Upload Avatar
   */
  static async uploadAvatar(file: File): Promise<APIResponse> {
    return apiClient.uploadFile(
      USER_PROFILE_ENDPOINTS.UPLOAD_AVATAR,
      file
    );
  }

  /**
   * User Profile - Update Settings
   */
  static async updateSettings(
    settings: any
  ): Promise<APIResponse> {
    return apiClient.post(
      USER_PROFILE_ENDPOINTS.UPDATE_SETTINGS,
      settings
    );
  }

  /**
   * User Profile - Change Password
   */
  static async changePasswordProfile(
    payload: ChangePasswordPayload
  ): Promise<APIResponse> {
    return apiClient.post(
      USER_PROFILE_ENDPOINTS.CHANGE_PASSWORD,
      payload
    );
  }

  /**
   * User Profile - Verify Email
   */
  static async verifyEmail(): Promise<APIResponse> {
    return apiClient.post(
      USER_PROFILE_ENDPOINTS.VERIFY_EMAIL,
      {}
    );
  }

  /**
   * User Profile - Get Activity Log
   */
  static async getActivityLog(): Promise<APIResponse> {
    return apiClient.get(
      USER_PROFILE_ENDPOINTS.GET_ACTIVITY_LOG
    );
  }

  /**
   * User Profile - Deactivate Account
   */
  static async deactivateAccount(): Promise<APIResponse> {
    return apiClient.post(
      USER_PROFILE_ENDPOINTS.DEACTIVATE_ACCOUNT,
      {}
    );
  }
}

export default UserService;
