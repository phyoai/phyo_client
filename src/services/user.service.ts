import apiClient from './api';
import { User, UserProfile, UpdateProfileRequest, UserSearchResponse, ChangePasswordRequest } from './types';

export const userService = {
  // GET /api/users/:id
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },

  // GET /api/users/profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/users/profile');
    return response.data.data;
  },

  // PUT /api/users/profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put('/users/profile', data);
    return response.data.data;
  },

  // GET /api/users/search
  searchUsers: async (query: string, page: number = 1, limit: number = 10): Promise<any> => {
    const response = await apiClient.get('/users/search', {
      params: { query, page, limit }
    });
    return response.data;
  },

  // DELETE /api/users/account
  deleteAccount: async (): Promise<any> => {
    const response = await apiClient.delete('/users/account');
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<any> => {
    const response = await apiClient.put('/users/change-password', data);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/users/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
