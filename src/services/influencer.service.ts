import apiClient from '@/utils/api';

/**
 * Influencer Service - Wrapper around API client
 * Used by feature components (TrendingInfluencers, etc.)
 */
export const influencerService = {
  getInfluencers: async (params = {}) => {
    try {
      const response = await apiClient.get('/influencers', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching influencers:', error.message);
      throw error.response?.data || error;
    }
  },

  getInfluencerById: async (id: string) => {
    const response = await apiClient.get(`/influencers/${id}`);
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
