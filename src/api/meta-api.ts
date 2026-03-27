/**
 * Meta/Facebook API Utility Functions
 * Provides typed wrapper functions for Meta and Facebook integration
 *
 * Usage:
 * import { metaApi } from '@/api/meta-api';
 * const accounts = await metaApi.getConnectedAccounts();
 */

import api from '@/utils/api';
import { IApiResponse } from '@/types';

/**
 * Meta/Facebook Types
 */
export interface IFacebookAccount {
  id: string;
  accountId: string;
  accountName: string;
  email: string;
  accessToken: string;
  tokenExpiresAt?: string;
  isConnected: boolean;
  connectedAt: string;
  businessId?: string;
  pages?: Array<{ id: string; name: string; followers: number }>;
}

export interface IFacebookMetric {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  purchases: number;
  conversionValue: number;
  cpc: number;
  cpm: number;
  ctr: number;
  roas: number;
  lastSyncedAt: string;
}

export interface IFacebookInsight {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  purchases: number;
  conversionValue: number;
  engagement: number;
  reach: number;
  videoViews?: number;
}

export interface ISyncHistory {
  id: string;
  accountId: string;
  campaignId?: string;
  syncedAt: string;
  status: 'success' | 'failed' | 'pending';
  recordsImported: number;
  errorMessage?: string;
}

export interface IMetaDashboard {
  connectedAccounts: number;
  totalImpressions: number;
  totalSpend: number;
  totalPurchases: number;
  averageROAS: number;
  lastSyncedAt?: string;
  syncStatus: 'syncing' | 'synced' | 'error';
}

/**
 * Meta API service
 * Handles all Meta/Facebook integration operations
 */
export const metaApi = {
  /**
   * Connect Facebook account via OAuth
   *
   * @param oauthCode - OAuth code from Facebook login flow
   * @returns Promise resolving to connected account info
   *
   * @example
   * const account = await metaApi.connectFacebook('oauthCode123');
   */
  connectFacebook: async (oauthCode: string): Promise<IFacebookAccount> => {
    try {
      if (!oauthCode || typeof oauthCode !== 'string') {
        throw new Error('Invalid OAuth code');
      }

      const response = await api.post<IApiResponse<IFacebookAccount>>(
        '/meta/connect',
        { oauthCode }
      );

      return response.data?.data || {
        id: '',
        accountId: '',
        accountName: '',
        email: '',
        accessToken: '',
        isConnected: false,
        connectedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to connect Facebook account';
      console.error('Error in connectFacebook:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Disconnect Facebook account
   *
   * @param accountId - Facebook account ID
   * @returns Promise resolving to disconnection confirmation
   *
   * @example
   * await metaApi.disconnectFacebook('fb_acc_123');
   */
  disconnectFacebook: async (accountId: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/meta/disconnect/${accountId.trim()}`
      );

      return response.data?.data || { success: true, message: 'Account disconnected' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to disconnect Facebook account';
      console.error('Error in disconnectFacebook:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get all connected Facebook accounts
   *
   * @returns Promise resolving to list of connected accounts
   *
   * @example
   * const accounts = await metaApi.getConnectedAccounts();
   */
  getConnectedAccounts: async (): Promise<IFacebookAccount[]> => {
    try {
      const response = await api.get<IApiResponse<IFacebookAccount[]>>(
        '/meta/accounts'
      );

      return response.data?.data || [];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch connected accounts';
      console.error('Error in getConnectedAccounts:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Sync Facebook campaign metrics
   *
   * @param campaignId - Campaign ID to sync metrics for
   * @param accountId - Facebook account ID
   * @returns Promise resolving to sync status
   *
   * @example
   * const result = await metaApi.syncFacebookMetrics('camp_123', 'fb_acc_123');
   */
  syncFacebookMetrics: async (
    campaignId: string,
    accountId?: string
  ): Promise<{ success: boolean; syncedRecords: number; message: string }> => {
    try {
      if (!campaignId || typeof campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; syncedRecords: number; message: string }>>(
        `/meta/sync/${campaignId.trim()}`,
        { accountId }
      );

      return response.data?.data || { success: true, syncedRecords: 0, message: 'Sync initiated' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to sync metrics';
      console.error('Error in syncFacebookMetrics:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get Facebook campaign metrics
   *
   * @param params - Campaign ID and date range parameters
   * @returns Promise resolving to Facebook metrics
   *
   * @example
   * const metrics = await metaApi.getFacebookMetrics({
   *   campaignId: 'camp_123',
   *   startDate: '2026-01-01',
   *   endDate: '2026-03-31'
   * });
   */
  getFacebookMetrics: async (
    params: {
      campaignId: string;
      startDate?: string;
      endDate?: string;
      accountId?: string;
    }
  ): Promise<IFacebookMetric[]> => {
    try {
      if (!params.campaignId || typeof params.campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      const response = await api.get<IApiResponse<IFacebookMetric[]>>(
        `/meta/metrics/${params.campaignId.trim()}`,
        { params: { ...params, campaignId: undefined } }
      );

      return response.data?.data || [];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch Facebook metrics';
      console.error('Error in getFacebookMetrics:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get Facebook campaign insights over time
   *
   * @param params - Campaign ID and date range parameters
   * @returns Promise resolving to insight trends
   *
   * @example
   * const insights = await metaApi.getFacebookInsights({
   *   campaignId: 'camp_123',
   *   startDate: '2026-01-01',
   *   endDate: '2026-03-31'
   * });
   */
  getFacebookInsights: async (
    params: {
      campaignId: string;
      startDate?: string;
      endDate?: string;
      granularity?: 'daily' | 'weekly' | 'monthly';
    }
  ): Promise<IFacebookInsight[]> => {
    try {
      if (!params.campaignId || typeof params.campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      const response = await api.get<IApiResponse<IFacebookInsight[]>>(
        `/meta/insights/${params.campaignId.trim()}`,
        { params: { ...params, campaignId: undefined } }
      );

      return response.data?.data || [];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch Facebook insights';
      console.error('Error in getFacebookInsights:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get sync history for campaigns
   *
   * @param accountId - Facebook account ID
   * @returns Promise resolving to sync history records
   *
   * @example
   * const history = await metaApi.getSyncHistory('fb_acc_123');
   */
  getSyncHistory: async (accountId?: string): Promise<ISyncHistory[]> => {
    try {
      const response = await api.get<IApiResponse<ISyncHistory[]>>(
        '/meta/sync-history',
        { params: accountId ? { accountId } : undefined }
      );

      return response.data?.data || [];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch sync history';
      console.error('Error in getSyncHistory:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get Meta integration dashboard overview
   *
   * @returns Promise resolving to dashboard metrics
   *
   * @example
   * const dashboard = await metaApi.getMetaDashboard();
   */
  getMetaDashboard: async (): Promise<IMetaDashboard> => {
    try {
      const response = await api.get<IApiResponse<IMetaDashboard>>(
        '/meta/dashboard'
      );

      return response.data?.data || {
        connectedAccounts: 0,
        totalImpressions: 0,
        totalSpend: 0,
        totalPurchases: 0,
        averageROAS: 0,
        syncStatus: 'synced',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch Meta dashboard';
      console.error('Error in getMetaDashboard:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Update Facebook account sync settings
   *
   * @param accountId - Facebook account ID
   * @param settings - Sync settings to update
   * @returns Promise resolving to updated settings
   *
   * @example
   * await metaApi.updateSyncSettings('fb_acc_123', {
   *   autoSync: true,
   *   syncInterval: 'hourly'
   * });
   */
  updateSyncSettings: async (
    accountId: string,
    settings: {
      autoSync?: boolean;
      syncInterval?: 'hourly' | 'daily' | 'weekly';
    }
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!accountId || typeof accountId !== 'string') {
        throw new Error('Invalid account ID');
      }

      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        `/meta/settings/${accountId.trim()}`,
        settings
      );

      return response.data?.data || { success: true, message: 'Settings updated' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update sync settings';
      console.error('Error in updateSyncSettings:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};
