import apiClient from './api';
import {
  MetaOAuthResponse,
  MetaStatus,
  AdAccount,
  CampaignInsights,
  PageInsights
} from './types';

export const metaService = {
  // GET /api/meta/oauth/url
  getOAuthUrl: async (): Promise<MetaOAuthResponse> => {
    const response = await apiClient.get('/meta/oauth/url');
    return response.data.data;
  },

  // GET /api/meta/oauth/callback
  handleOAuthCallback: async (code: string, state: string): Promise<any> => {
    const response = await apiClient.get('/meta/oauth/callback', {
      params: { code, state }
    });
    return response.data;
  },

  // GET /api/meta/status
  getStatus: async (): Promise<MetaStatus> => {
    const response = await apiClient.get('/meta/status');
    return response.data.data;
  },

  // GET /api/meta/ad-accounts
  getAdAccounts: async (): Promise<AdAccount[]> => {
    const response = await apiClient.get('/meta/ad-accounts');
    return response.data.data;
  },

  // DELETE /api/meta/disconnect
  disconnect: async (): Promise<any> => {
    const response = await apiClient.delete('/meta/disconnect');
    return response.data;
  },

  // GET /api/meta/campaigns/:adAccountId
  getCampaigns: async (adAccountId: string): Promise<any> => {
    const response = await apiClient.get(`/meta/campaigns/${adAccountId}`);
    return response.data.data;
  },

  // GET /api/meta/ad-account/:adAccountId
  getAdAccountDetails: async (adAccountId: string): Promise<AdAccount> => {
    const response = await apiClient.get(`/meta/ad-account/${adAccountId}`);
    return response.data.data;
  },

  // GET /api/meta/page-insights
  getPageInsights: async (pageId?: string): Promise<PageInsights> => {
    const response = await apiClient.get('/meta/page-insights', {
      params: { pageId }
    });
    return response.data.data;
  },

  // GET /api/meta/campaign-insights/:campaignId
  getCampaignInsights: async (campaignId: string): Promise<CampaignInsights> => {
    const response = await apiClient.get(`/meta/campaign-insights/${campaignId}`);
    return response.data.data;
  },

  // GET /api/meta/connected-pages
  getConnectedPages: async (): Promise<any[]> => {
    const response = await apiClient.get('/meta/connected-pages');
    return response.data.data;
  },

  // POST /api/meta/verify-token
  verifyToken: async (token: string): Promise<any> => {
    const response = await apiClient.post('/meta/verify-token', { token });
    return response.data;
  }
};
