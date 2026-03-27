/**
 * Admin API Utility Functions
 * Provides typed wrapper functions for admin operations: approvals, users, and system management
 *
 * Usage:
 * import { adminApi } from '@/api/admin-api';
 * const approvals = await adminApi.getApprovals({ status: 'pending', page: 1, limit: 20 });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Admin Types
 */
export interface IBrandApprovalRequest {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  email: string;
  phone?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface IInfluencerApprovalRequest {
  id: string;
  influencerId: string;
  influencerName: string;
  profilePicture?: string;
  email: string;
  niche: string;
  followers: number;
  engagementRate: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface IApproval {
  id: string;
  requestType: 'brand' | 'influencer';
  requestId: string;
  requestData: IBrandApprovalRequest | IInfluencerApprovalRequest;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'super_admin';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface IBlockedUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'brand' | 'influencer' | 'service_provider';
  reason: string;
  blockedAt: string;
  blockedBy: string;
  unblockDate?: string;
}

export interface IApprovalsResponse {
  data: IApproval[];
  pagination: IPagination;
  summary: {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
}

export interface IUsersResponse {
  data: IAdminUser[];
  pagination: IPagination;
}

export interface ISystemStats {
  totalUsers: number;
  totalBrands: number;
  totalInfluencers: number;
  totalServiceProviders: number;
  blockedUsers: number;
  pendingApprovals: number;
  activeProjects: number;
  totalRevenue: number;
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
 * Admin API service
 * Handles all admin operations
 */
export const adminApi = {
  /**
   * Get pending and completed approvals
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated approvals
   *
   * @example
   * const result = await adminApi.getApprovals({ status: 'pending', page: 1, limit: 20 });
   */
  getApprovals: async (
    params?: Partial<{ status: string; type: string; page: number; limit: number }>
  ): Promise<{ approvals: IApproval[]; pagination: IPagination; summary: any }> => {
    try {
      const response = await api.get<IApiResponse<IApprovalsResponse>>(
        '/admin/approvals',
        { params }
      );

      const payload = response.data?.data;
      return {
        approvals: (payload?.data ?? []) as IApproval[],
        pagination: payload?.pagination ?? defaultPagination,
        summary: payload?.summary ?? { pendingCount: 0, approvedCount: 0, rejectedCount: 0 },
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch approvals';
      console.error('Error in getApprovals:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Approve a brand request
   *
   * @param requestId - The approval request ID
   * @returns Promise resolving to approval confirmation
   *
   * @example
   * await adminApi.approveBrand('req_123');
   */
  approveBrand: async (requestId: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!requestId || typeof requestId !== 'string') {
        throw new Error('Invalid request ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/admin/approvals/brand/${requestId.trim()}/approve`
      );

      return response.data?.data || { success: true, message: 'Brand approved' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to approve brand';
      console.error('Error in approveBrand:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Reject a brand request
   *
   * @param requestId - The approval request ID
   * @param reason - Reason for rejection
   * @returns Promise resolving to rejection confirmation
   *
   * @example
   * await adminApi.rejectBrand('req_123', 'Incomplete documentation');
   */
  rejectBrand: async (
    requestId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!requestId || typeof requestId !== 'string') {
        throw new Error('Invalid request ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/admin/approvals/brand/${requestId.trim()}/reject`,
        { reason }
      );

      return response.data?.data || { success: true, message: 'Brand rejected' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to reject brand';
      console.error('Error in rejectBrand:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Approve an influencer request
   *
   * @param requestId - The approval request ID
   * @returns Promise resolving to approval confirmation
   *
   * @example
   * await adminApi.approveInfluencer('req_456');
   */
  approveInfluencer: async (requestId: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!requestId || typeof requestId !== 'string') {
        throw new Error('Invalid request ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/admin/approvals/influencer/${requestId.trim()}/approve`
      );

      return response.data?.data || { success: true, message: 'Influencer approved' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to approve influencer';
      console.error('Error in approveInfluencer:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Reject an influencer request
   *
   * @param requestId - The approval request ID
   * @param reason - Reason for rejection
   * @returns Promise resolving to rejection confirmation
   *
   * @example
   * await adminApi.rejectInfluencer('req_456', 'Low engagement rate');
   */
  rejectInfluencer: async (
    requestId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!requestId || typeof requestId !== 'string') {
        throw new Error('Invalid request ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/admin/approvals/influencer/${requestId.trim()}/reject`,
        { reason }
      );

      return response.data?.data || { success: true, message: 'Influencer rejected' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to reject influencer';
      console.error('Error in rejectInfluencer:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get all users with optional filtering
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated users
   *
   * @example
   * const result = await adminApi.getUsers({ role: 'brand', page: 1, limit: 20 });
   */
  getUsers: async (
    params?: Partial<{ role: string; isActive: boolean; page: number; limit: number }>
  ): Promise<{ users: IAdminUser[]; pagination: IPagination }> => {
    try {
      const response = await api.get<IApiResponse<IUsersResponse>>(
        '/admin/users',
        { params }
      );

      const payload = response.data?.data;
      return {
        users: (payload?.data ?? []) as IAdminUser[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch users';
      console.error('Error in getUsers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Block a user
   *
   * @param userId - The user ID to block
   * @param reason - Reason for blocking
   * @returns Promise resolving to block confirmation
   *
   * @example
   * await adminApi.blockUser('user_789', 'Suspicious activity');
   */
  blockUser: async (userId: string, reason: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/admin/users/${userId.trim()}/block`,
        { reason }
      );

      return response.data?.data || { success: true, message: 'User blocked' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to block user';
      console.error('Error in blockUser:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Unblock a user
   *
   * @param userId - The user ID to unblock
   * @returns Promise resolving to unblock confirmation
   *
   * @example
   * await adminApi.unblockUser('user_789');
   */
  unblockUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/admin/users/${userId.trim()}/unblock`
      );

      return response.data?.data || { success: true, message: 'User unblocked' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to unblock user';
      console.error('Error in unblockUser:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get system stats and metrics
   *
   * @returns Promise resolving to system statistics
   *
   * @example
   * const stats = await adminApi.getSystemStats();
   */
  getSystemStats: async (): Promise<ISystemStats> => {
    try {
      const response = await api.get<IApiResponse<ISystemStats>>(
        '/admin/stats'
      );

      return response.data?.data || {
        totalUsers: 0,
        totalBrands: 0,
        totalInfluencers: 0,
        totalServiceProviders: 0,
        blockedUsers: 0,
        pendingApprovals: 0,
        activeProjects: 0,
        totalRevenue: 0,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch system stats';
      console.error('Error in getSystemStats:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};
