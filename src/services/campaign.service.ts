import apiClient from './api';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest, CampaignInfluencer, PaginationParams } from './types';

export const campaignService = {
  // POST /api/campaigns
  createCampaign: async (data: CreateCampaignRequest): Promise<Campaign> => {
    const response = await apiClient.post('/campaigns', data);
    return response.data.data;
  },

  // GET /api/campaigns
  getCampaigns: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/campaigns', { params });
    return response.data;
  },

  // GET /api/campaigns/mine
  getMyCampaigns: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/campaigns/mine', { params });
    return response.data;
  },

  // GET /api/campaigns/:id
  getCampaignById: async (id: string): Promise<Campaign> => {
    const response = await apiClient.get(`/campaigns/${id}`);
    return response.data.data;
  },

  // PUT /api/campaigns/:id
  updateCampaign: async (id: string, data: UpdateCampaignRequest): Promise<Campaign> => {
    const response = await apiClient.put(`/campaigns/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/campaigns/:id
  deleteCampaign: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
  },

  // POST /api/campaigns/:id/influencers - Apply to campaign
  applyToCampaign: async (id: string, applicationData?: any): Promise<any> => {
    const response = await apiClient.post(`/campaigns/${id}/influencers`, applicationData || {});
    return response.data;
  },

  // PUT /api/campaigns/:id/influencers - Select influencer
  selectInfluencer: async (campaignId: string, influencerId: string): Promise<any> => {
    const response = await apiClient.put(`/campaigns/${campaignId}/influencers`, {
      influencerId
    });
    return response.data;
  },

  // DELETE /api/campaigns/:id/influencers - Reject influencer
  rejectInfluencer: async (campaignId: string, influencerId: string): Promise<any> => {
    const response = await apiClient.delete(`/campaigns/${campaignId}/influencers`, {
      data: { influencerId }
    });
    return response.data;
  },

  // Get campaign influencers
  getCampaignInfluencers: async (campaignId: string): Promise<CampaignInfluencer[]> => {
    const response = await apiClient.get(`/campaigns/${campaignId}/influencers-list`);
    return response.data.data;
  }
};
