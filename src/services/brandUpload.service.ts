import apiClient from './api';
import { PaginationParams } from './types';

export const brandUploadService = {
  // POST /api/brand-upload
  uploadBrandAssets: async (file: File, assetType?: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    if (assetType) {
      formData.append('assetType', assetType);
    }

    const response = await apiClient.post('/brand-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // POST /api/brand-upload/multiple
  uploadMultipleBrandAssets: async (files: File[], assetType?: string): Promise<any> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (assetType) {
      formData.append('assetType', assetType);
    }

    const response = await apiClient.post('/brand-upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // GET /api/brand-upload
  getBrandAssets: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/brand-upload', { params });
    return response.data;
  },

  // GET /api/brand-upload/:id
  getBrandAssetById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/brand-upload/${id}`);
    return response.data.data;
  },

  // DELETE /api/brand-upload/:id
  deleteBrandAsset: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/brand-upload/${id}`);
    return response.data;
  },

  // PUT /api/brand-upload/:id
  updateBrandAsset: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/brand-upload/${id}`, data);
    return response.data.data;
  },

  // POST /api/brand-upload/verify
  verifyBrandAsset: async (assetId: string): Promise<any> => {
    const response = await apiClient.post('/brand-upload/verify', { assetId });
    return response.data;
  },

  // GET /api/brand-upload/by-type/:type
  getAssetsByType: async (type: string, params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get(`/brand-upload/by-type/${type}`, { params });
    return response.data;
  }
};
