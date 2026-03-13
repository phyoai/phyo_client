import apiClient from './api';
import { InfluencerRequest, CreateInfluencerRequestRequest, PaginationParams } from './types';

export const influencerRequestService = {
  // POST /api/influencer-requests
  createRequest: async (data: CreateInfluencerRequestRequest): Promise<InfluencerRequest> => {
    const response = await apiClient.post('/influencer-requests', data);
    return response.data.data;
  },

  // GET /api/influencer-requests
  getRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/influencer-requests', { params });
    return response.data;
  },

  // GET /api/influencer-requests/sent
  getSentRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/influencer-requests/sent', { params });
    return response.data;
  },

  // GET /api/influencer-requests/received
  getReceivedRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/influencer-requests/received', { params });
    return response.data;
  },

  // GET /api/influencer-requests/:id
  getRequestById: async (id: string): Promise<InfluencerRequest> => {
    const response = await apiClient.get(`/influencer-requests/${id}`);
    return response.data.data;
  },

  // PUT /api/influencer-requests/:id
  updateRequest: async (id: string, data: Partial<CreateInfluencerRequestRequest>): Promise<InfluencerRequest> => {
    const response = await apiClient.put(`/influencer-requests/${id}`, data);
    return response.data.data;
  },

  // PUT /api/influencer-requests/:id/accept
  acceptRequest: async (id: string): Promise<InfluencerRequest> => {
    const response = await apiClient.put(`/influencer-requests/${id}/accept`, {});
    return response.data.data;
  },

  // PUT /api/influencer-requests/:id/reject
  rejectRequest: async (id: string, reason?: string): Promise<InfluencerRequest> => {
    const response = await apiClient.put(`/influencer-requests/${id}/reject`, { reason });
    return response.data.data;
  },

  // DELETE /api/influencer-requests/:id
  deleteRequest: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/influencer-requests/${id}`);
    return response.data;
  },

  // GET /api/influencer-requests/pending/count
  getPendingCount: async (): Promise<number> => {
    const response = await apiClient.get('/influencer-requests/pending/count');
    return response.data.data?.count || 0;
  },

  // GET /api/influencer-requests/filter
  filterRequests: async (filters: any, params?: PaginationParams): Promise<any> => {
    const response = await apiClient.post('/influencer-requests/filter', filters, { params });
    return response.data;
  },

  // POST /api/influencer-requests/bulk-action
  bulkAction: async (requestIds: string[], action: 'accept' | 'reject'): Promise<any> => {
    const response = await apiClient.post('/influencer-requests/bulk-action', {
      requestIds,
      action
    });
    return response.data;
  }
};
