import apiClient from './api';
import { campaignService, influencerService } from './index';
import type { PaginationParams } from './types';

/**
 * Dashboard Service
 * Provides role-based API calls for different user types
 */

export const dashboardService = {
  /**
   * Get campaigns based on user role
   * BRAND: Returns their own campaigns
   * INFLUENCER: Returns available campaigns to apply to
   * USER: Returns trending/public campaigns
   */
  getCampaignsByRole: async (role: string, params?: PaginationParams): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          // Get brand's own campaigns
          try {
            return await campaignService.getMyCampaigns(params);
          } catch (error) {
            // If /campaigns/mine fails, fall back to all campaigns
            console.warn('Failed to fetch brand campaigns, falling back to all campaigns:', error);
            return await campaignService.getCampaigns(params);
          }

        case 'INFLUENCER':
          // Get all available campaigns (for influencers to apply to)
          return await campaignService.getCampaigns(params);

        case 'USER':
        default:
          // Get all public campaigns
          return await campaignService.getCampaigns(params);
      }
    } catch (error) {
      console.error('Error fetching campaigns by role:', error);
      // Return empty data instead of throwing to prevent dashboard crash
      return { data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } };
    }
  },

  /**
   * Get influencers based on user role
   * BRAND: Returns influencers they can collaborate with
   * INFLUENCER: Returns other influencers (network)
   * USER: Returns public influencers list
   */
  getInfluencersByRole: async (role: string, params?: PaginationParams): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          // Get recommended influencers for collaboration
          return await influencerService.getInfluencers(params);

        case 'INFLUENCER':
          // Get other influencers in the network
          return await influencerService.getInfluencers(params);

        case 'USER':
        default:
          // Get public influencers list
          return await influencerService.getInfluencers(params);
      }
    } catch (error) {
      console.error('Error fetching influencers by role:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics based on user role
   * BRAND: Their campaign performance stats
   * INFLUENCER: Their profile and application stats
   * USER: General platform stats
   */
  getDashboardStats: async (role: string): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          // Get brand's campaign statistics
          return await apiClient.get('/brand/dashboard/stats');

        case 'INFLUENCER':
          // Get influencer's profile statistics
          return await apiClient.get('/influencer/dashboard/stats');

        case 'USER':
        default:
          // Get general platform statistics
          return await apiClient.get('/dashboard/stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get recommended content based on user role
   * BRAND: Recommended influencers based on previous campaigns
   * INFLUENCER: Recommended campaigns based on their profile
   * USER: Recommended brands and influencers
   */
  getRecommendations: async (role: string, params?: PaginationParams): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          // Get recommended influencers
          return await apiClient.get('/brand/recommendations/influencers', { params });

        case 'INFLUENCER':
          // Get recommended campaigns
          return await apiClient.get('/influencer/recommendations/campaigns', { params });

        case 'USER':
        default:
          // Get recommended content
          return await apiClient.get('/recommendations', { params });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Return empty array instead of throwing to prevent dashboard crash
      return { data: [] };
    }
  },

  /**
   * Get recent activity based on user role
   * BRAND: Recent campaign activity and influencer interactions
   * INFLUENCER: Recent applications and campaign invitations
   * USER: Recent platform activity
   */
  getRecentActivity: async (role: string, params?: PaginationParams): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          // Get brand's recent activity
          return await apiClient.get('/brand/activity', { params });

        case 'INFLUENCER':
          // Get influencer's recent activity
          return await apiClient.get('/influencer/activity', { params });

        case 'USER':
        default:
          // Get recent platform activity
          return await apiClient.get('/activity', { params });
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return { data: [] };
    }
  },

  /**
   * Get notifications based on user role with role-specific filters
   */
  getNotifications: async (role: string, params?: PaginationParams): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          return await apiClient.get('/notifications', {
            params: { ...params, type: 'brand' }
          });

        case 'INFLUENCER':
          return await apiClient.get('/notifications', {
            params: { ...params, type: 'influencer' }
          });

        case 'USER':
        default:
          return await apiClient.get('/notifications', { params });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [] };
    }
  },

  /**
   * Get featured content based on user role
   */
  getFeaturedContent: async (role: string): Promise<any> => {
    try {
      const roleUpper = (role || 'USER').toUpperCase();

      switch (roleUpper) {
        case 'BRAND':
          // Featured influencers for brands
          return await apiClient.get('/featured/influencers');

        case 'INFLUENCER':
          // Featured campaigns for influencers
          return await apiClient.get('/featured/campaigns');

        case 'USER':
        default:
          // Featured content for general users
          return await apiClient.get('/featured');
      }
    } catch (error) {
      console.error('Error fetching featured content:', error);
      return { data: [] };
    }
  }
};
