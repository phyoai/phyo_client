import apiClient from './api';
import {
  AdminRequest,
  AdminStats,
  ChangePasswordRequest,
  User,
  PaginationParams
} from './types';

export const adminService = {
  // GET /api/admin/profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/admin/profile');
    return response.data.data;
  },

  // PUT /api/admin/change-password
  changePassword: async (data: ChangePasswordRequest): Promise<any> => {
    const response = await apiClient.put('/admin/change-password', data);
    return response.data;
  },

  // GET /api/admin/requests
  getRequests: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/admin/requests', { params });
    return response.data;
  },

  // PUT /api/admin/requests/:id
  updateRequest: async (id: string, status: 'approved' | 'rejected', remarks?: string): Promise<AdminRequest> => {
    const response = await apiClient.put(`/admin/requests/${id}`, { status, remarks });
    return response.data.data;
  },

  // Approve request
  approveRequest: async (id: string, remarks?: string): Promise<AdminRequest> => {
    return adminService.updateRequest(id, 'approved', remarks);
  },

  // Reject request
  rejectRequest: async (id: string, remarks?: string): Promise<AdminRequest> => {
    return adminService.updateRequest(id, 'rejected', remarks);
  },

  // GET /api/admin/stats
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },

  // GET /api/admin/users
  getUsers: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  // GET /api/admin/influencers
  getInfluencers: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/admin/influencers', { params });
    return response.data;
  },

  // DELETE /api/admin/users/:id
  deleteUser: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // PUT /api/admin/users/:id - Suspend/unsuspend user
  updateUserStatus: async (id: string, status: 'active' | 'suspended'): Promise<any> => {
    const response = await apiClient.put(`/admin/users/${id}`, { status });
    return response.data;
  },

  // GET /api/admin/reports
  getReports: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/admin/reports', { params });
    return response.data;
  }
};
