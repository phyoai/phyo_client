import apiClient from './api';
import { BrandRequest, CreateBrandRequestRequest, PaginationParams } from './types';

export const brandRequestService = {
  // POST /api/brand-requests
  createRequest: async (data: CreateBrandRequestRequest): Promise<BrandRequest> => {
    const response = await apiClient.post('/brand-requests', data);
    return response.data.data;
  },

  // GET /api/brand-requests
  getRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/brand-requests', { params });
    return response.data;
  },

  // GET /api/brand-requests/sent
  getSentRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/brand-requests/sent', { params });
    return response.data;
  },

  // GET /api/brand-requests/received
  getReceivedRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/brand-requests/received', { params });
    return response.data;
  },

  // GET /api/brand-requests/:id
  getRequestById: async (id: string): Promise<BrandRequest> => {
    const response = await apiClient.get(`/brand-requests/${id}`);
    return response.data.data;
  },

  // PUT /api/brand-requests/:id
  updateRequest: async (id: string, data: Partial<CreateBrandRequestRequest>): Promise<BrandRequest> => {
    const response = await apiClient.put(`/brand-requests/${id}`, data);
    return response.data.data;
  },

  // PUT /api/brand-requests/:id/accept
  acceptRequest: async (id: string): Promise<BrandRequest> => {
    const response = await apiClient.put(`/brand-requests/${id}/accept`, {});
    return response.data.data;
  },

  // PUT /api/brand-requests/:id/reject
  rejectRequest: async (id: string, reason?: string): Promise<BrandRequest> => {
    const response = await apiClient.put(`/brand-requests/${id}/reject`, { reason });
    return response.data.data;
  },

  // DELETE /api/brand-requests/:id
  deleteRequest: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/brand-requests/${id}`);
    return response.data;
  },

  // GET /api/brand-requests/pending/count
  getPendingCount: async (): Promise<number> => {
    const response = await apiClient.get('/brand-requests/pending/count');
    return response.data.data?.count || 0;
  },

  // GET /api/brand-requests/filter
  filterRequests: async (filters: any, params?: PaginationParams): Promise<any> => {
    const response = await apiClient.post('/brand-requests/filter', filters, { params });
    return response.data;
  },

  // POST /api/brand-requests/bulk-action
  bulkAction: async (requestIds: string[], action: 'accept' | 'reject'): Promise<any> => {
    const response = await apiClient.post('/brand-requests/bulk-action', {
      requestIds,
      action
    });
    return response.data;
  }
};
