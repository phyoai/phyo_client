import apiClient from '@/utils/api';

/**
 * Campaign Service - Wrapper around API client
 * Used by feature components (TopCampaigns, CategoryCampaigns, etc.)
 */
export const campaignService = {
  getCampaigns: async (params = {}) => {
    try {
      const response = await apiClient.get('/campaigns', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching campaigns:', error.message);
      // Return graceful fallback for plan restrictions and other errors
      throw error.response?.data || error;
    }
  },

  getCampaignById: async (id: string) => {
    const response = await apiClient.get(`/campaigns/${id}`);
    return response.data;
  },

  createCampaign: async (data: any) => {
    const response = await apiClient.post('/campaigns', data);
    return response.data;
  },

  updateCampaign: async (id: string, data: any) => {
    const response = await apiClient.patch(`/campaigns/${id}`, data);
    return response.data;
  },

  deleteCampaign: async (id: string) => {
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
  },

  searchCampaigns: async (query: string, params = {}) => {
    const response = await apiClient.get('/campaigns/search', {
      params: { q: query, ...params }
    });
    return response.data;
  }
};

export default campaignService;
