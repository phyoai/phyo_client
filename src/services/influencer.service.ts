import apiClient from './api';
import {
  Influencer,
  CreateInfluencerRequest,
  InfluencerSearchRequest,
  InfluencerSearchResponse,
  PaginationParams
} from './types';

export const influencerService = {
  // POST /api/influencers
  createInfluencer: async (data: CreateInfluencerRequest): Promise<Influencer> => {
    const response = await apiClient.post('/influencers', data);
    return response.data.data;
  },

  // GET /api/influencers
  getInfluencers: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/influencers', { params });
    return response.data;
  },

  // GET /api/influencers/search - General search
  searchInfluencers: async (query: string, params?: any): Promise<InfluencerSearchResponse> => {
    const response = await apiClient.get('/influencers/search', {
      params: { query, ...params }
    });
    return response.data.data;
  },

  // GET /api/influencers/search-by-name
  searchByName: async (name: string, params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/influencers/search-by-name', {
      params: { name, ...params }
    });
    return response.data;
  },

  // GET /api/influencers/search-by-username
  searchByUsername: async (username: string, params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/influencers/search-by-username', {
      params: { username, ...params }
    });
    return response.data;
  },

  // POST /api/influencers/advanced-search
  advancedSearch: async (filters: InfluencerSearchRequest): Promise<InfluencerSearchResponse> => {
    const response = await apiClient.post('/influencers/advanced-search', filters);
    return response.data.data;
  },

  // GET /api/influencers/:id
  getInfluencerById: async (id: string): Promise<Influencer> => {
    const response = await apiClient.get(`/influencers/${id}`);
    return response.data.data;
  },

  // GET /api/influencers/:username - Get by username
  getByUsername: async (username: string): Promise<Influencer> => {
    const response = await apiClient.get(`/influencers/${username}`);
    return response.data.data;
  },

  // PUT /api/influencers/:id
  updateInfluencer: async (id: string, data: Partial<CreateInfluencerRequest>): Promise<Influencer> => {
    const response = await apiClient.put(`/influencers/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/influencers/:id
  deleteInfluencer: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/influencers/${id}`);
    return response.data;
  },

  // GET /api/influencers/:id/statistics
  getInfluencerStats: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/influencers/${id}/statistics`);
    return response.data.data;
  },

  // GET /api/influencers/:id/analytics
  getInfluencerAnalytics: async (id: string, period?: string): Promise<any> => {
    const response = await apiClient.get(`/influencers/${id}/analytics`, {
      params: { period }
    });
    return response.data.data;
  },

  // POST /api/influencers/:id/rate - Rate influencer
  rateInfluencer: async (id: string, rating: number, review?: string): Promise<any> => {
    const response = await apiClient.post(`/influencers/${id}/rate`, { rating, review });
    return response.data;
  }
};
