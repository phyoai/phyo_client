/**
 * Notification Service
 * Handles all notification-related API calls
 */

import { apiClient, APIResponse } from "./api-client";
import {
  NOTIFICATION_ENDPOINTS,
  NOTIFICATION_SETTINGS_ENDPOINTS,
} from "@/utils/api-endpoints";

/**
 * Notification Types
 */
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationFrequency: "instant" | "daily" | "weekly";
  campaignUpdates: boolean;
  campaignInvites: boolean;
  messages: boolean;
  payments: boolean;
  systemAlerts: boolean;
}

export interface UpdateNotificationSettingsPayload {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  notificationFrequency?: "instant" | "daily" | "weekly";
  campaignUpdates?: boolean;
  campaignInvites?: boolean;
  messages?: boolean;
  payments?: boolean;
  systemAlerts?: boolean;
}

/**
 * Notification Service
 */
export class NotificationService {
  /**
   * Get All Notifications
   */
  static async getNotifications(
    page?: number,
    limit?: number
  ): Promise<APIResponse<Notification[]>> {
    let url = NOTIFICATION_ENDPOINTS.GET_ALL;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return apiClient.get(url);
  }

  /**
   * Get Unread Notification Count
   */
  static async getUnreadCount(): Promise<
    APIResponse<{ count: number }>
  > {
    return apiClient.get(
      NOTIFICATION_ENDPOINTS.GET_UNREAD_COUNT
    );
  }

  /**
   * Mark Single Notification as Read
   */
  static async markAsRead(
    notificationId: string
  ): Promise<APIResponse> {
    return apiClient.patch(
      NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId),
      {}
    );
  }

  /**
   * Mark All Notifications as Read
   */
  static async markAllAsRead(): Promise<APIResponse> {
    return apiClient.patch(
      NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ,
      {}
    );
  }

  /**
   * Delete Notification
   */
  static async deleteNotification(
    notificationId: string
  ): Promise<APIResponse> {
    return apiClient.delete(
      NOTIFICATION_ENDPOINTS.DELETE(notificationId)
    );
  }

  /**
   * Clear All Read Notifications
   */
  static async clearAllRead(): Promise<APIResponse> {
    return apiClient.delete(
      NOTIFICATION_ENDPOINTS.CLEAR_ALL_READ
    );
  }

  /**
   * Get Notification Settings
   */
  static async getNotificationSettings(): Promise<
    APIResponse<NotificationSettings>
  > {
    return apiClient.get(
      NOTIFICATION_SETTINGS_ENDPOINTS.GET_ALL
    );
  }

  /**
   * Update Email Notifications
   */
  static async updateEmailNotifications(
    enabled: boolean
  ): Promise<APIResponse> {
    return apiClient.put(
      NOTIFICATION_SETTINGS_ENDPOINTS.UPDATE_EMAIL,
      { enabled }
    );
  }

  /**
   * Update Push Notifications
   */
  static async updatePushNotifications(
    enabled: boolean
  ): Promise<APIResponse> {
    return apiClient.put(
      NOTIFICATION_SETTINGS_ENDPOINTS.UPDATE_PUSH,
      { enabled }
    );
  }

  /**
   * Update SMS Notifications
   */
  static async updateSmsNotifications(
    enabled: boolean
  ): Promise<APIResponse> {
    return apiClient.put(
      NOTIFICATION_SETTINGS_ENDPOINTS.UPDATE_SMS,
      { enabled }
    );
  }

  /**
   * Update Notification Frequency
   */
  static async updateNotificationFrequency(
    frequency: "instant" | "daily" | "weekly"
  ): Promise<APIResponse> {
    return apiClient.put(
      NOTIFICATION_SETTINGS_ENDPOINTS.UPDATE_FREQUENCY,
      { frequency }
    );
  }

  /**
   * Disable All Notifications
   */
  static async disableAllNotifications(): Promise<APIResponse> {
    return apiClient.post(
      NOTIFICATION_SETTINGS_ENDPOINTS.DISABLE_ALL,
      {}
    );
  }

  /**
   * Enable All Notifications
   */
  static async enableAllNotifications(): Promise<APIResponse> {
    return apiClient.post(
      NOTIFICATION_SETTINGS_ENDPOINTS.ENABLE_ALL,
      {}
    );
  }

  /**
   * Get Notification Preferences
   */
  static async getNotificationPreferences(): Promise<
    APIResponse<NotificationSettings>
  > {
    return apiClient.get(
      NOTIFICATION_SETTINGS_ENDPOINTS.GET_PREFERENCES
    );
  }

  /**
   * Update Full Notification Settings
   */
  static async updateNotificationSettings(
    payload: UpdateNotificationSettingsPayload
  ): Promise<APIResponse<NotificationSettings>> {
    // Find the best endpoint to use
    return apiClient.put(
      NOTIFICATION_SETTINGS_ENDPOINTS.UPDATE_FREQUENCY,
      payload
    );
  }
}

export default NotificationService;
