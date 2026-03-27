/**
 * Notification API Utility Functions
 * Provides typed wrapper functions for notification-related API operations
 *
 * Usage:
 * import { notificationApi } from '@/api/notification-api';
 * const notifications = await notificationApi.getNotifications({ page: 1, limit: 20 });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Notification Types
 */
export interface INotification {
  id: string;
  userId: string;
  type: 'campaign' | 'application' | 'message' | 'system' | 'payment';
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityType?: string; // 'campaign', 'influencer', 'brand'
  relatedEntityId?: string;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationResponse {
  data: INotification[];
  pagination: IPagination;
}

const defaultPagination: IPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/**
 * Notification API service
 * Handles all notification-related operations
 */
export const notificationApi = {
  /**
   * Get all notifications for the current user
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated notifications
   *
   * @example
   * const result = await notificationApi.getNotifications({ page: 1, limit: 20 });
   */
  getNotifications: async (
    params?: Partial<{ page: number; limit: number; type: string; unreadOnly: boolean }>
  ): Promise<{ notifications: INotification[]; pagination: IPagination }> => {
    try {
      const response = await api.get<IApiResponse<INotificationResponse>>(
        '/notifications',
        { params }
      );

      const payload = response.data?.data;
      return {
        notifications: (payload?.data ?? []) as INotification[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch notifications';
      console.error('Error in getNotifications:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get unread notification count
   *
   * @returns Promise resolving to unread count
   *
   * @example
   * const count = await notificationApi.getUnreadCount();
   */
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get<IApiResponse<{ count: number }>>(
        '/notifications/unread-count'
      );

      return response.data?.data?.count ?? 0;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch unread count';
      console.error('Error in getUnreadCount:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Mark a notification as read
   *
   * @param notificationId - The notification ID to mark as read
   * @returns Promise resolving to updated notification
   *
   * @example
   * await notificationApi.markAsRead('notif_123');
   */
  markAsRead: async (notificationId: string): Promise<INotification> => {
    try {
      if (!notificationId || typeof notificationId !== 'string') {
        throw new Error('Invalid notification ID');
      }

      const response = await api.patch<IApiResponse<INotification>>(
        `/notifications/${notificationId.trim()}/read`,
        {}
      );

      if (!response.data.data) {
        throw new Error('Failed to mark notification as read');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to mark as read';
      console.error('Error in markAsRead:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Mark all notifications as read
   *
   * @returns Promise resolving to count of marked notifications
   *
   * @example
   * const count = await notificationApi.markAllAsRead();
   */
  markAllAsRead: async (): Promise<number> => {
    try {
      const response = await api.patch<IApiResponse<{ count: number }>>(
        '/notifications/mark-all-read',
        {}
      );

      return response.data?.data?.count ?? 0;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to mark all as read';
      console.error('Error in markAllAsRead:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a notification
   *
   * @param notificationId - The notification ID to delete
   * @returns Promise resolving to deletion response
   *
   * @example
   * await notificationApi.deleteNotification('notif_123');
   */
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    try {
      if (!notificationId || typeof notificationId !== 'string') {
        throw new Error('Invalid notification ID');
      }

      const response = await api.delete<IApiResponse<{ message: string }>>(
        `/notifications/${notificationId.trim()}`
      );

      return response.data?.data ?? { message: 'Notification deleted' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete notification';
      console.error('Error in deleteNotification:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete all notifications
   *
   * @returns Promise resolving to deletion response
   *
   * @example
   * await notificationApi.deleteAllNotifications();
   */
  deleteAllNotifications: async (): Promise<{ message: string; count: number }> => {
    try {
      const response = await api.delete<IApiResponse<{ message: string; count: number }>>(
        '/notifications/clear-all'
      );

      return response.data?.data ?? { message: 'All notifications deleted', count: 0 };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete notifications';
      console.error('Error in deleteAllNotifications:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};

export default notificationApi;
