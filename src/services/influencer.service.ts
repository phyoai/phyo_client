import apiClient from '@/utils/api';
import { INFLUENCER_PUBLIC_ENDPOINTS as INFLUENCER_ENDPOINTS } from '@/utils/api-endpoints';

/**
 * Influencer Service - Wrapper around API client
 * Used by feature components (TrendingInfluencers, etc.)
 * PUBLIC endpoints - No authentication required
 */
export const influencerService = {
  getInfluencers: async (params = {}) => {
    try {
      const response = await apiClient.get(INFLUENCER_ENDPOINTS.GET_INFLUENCERS, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching influencers:', error.message);
      throw error.response?.data || error;
    }
  },

  getInfluencerById: async (id: string) => {
    const response = await apiClient.get(INFLUENCER_ENDPOINTS.GET_INFLUENCER_BY_ID(id));
    return response.data;
  },

  searchInfluencers: async (query: string, params = {}) => {
    const response = await apiClient.get('/influencers/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  advancedSearch: async (params = {}) => {
    try {
      const response = await apiClient.get('/influencers', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error in advanced search:', error.message);
      throw error.response?.data || error;
    }
  },

  getTrendingInfluencers: async (params = {}) => {
    const response = await apiClient.get('/influencers', {
      params: { sortBy: 'engagement', sortOrder: 'desc', ...params }
    });
    return response.data;
  }
};

export default influencerService;
