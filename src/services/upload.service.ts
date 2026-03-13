import apiClient from './api';
import { UploadResponse, PaginationParams } from './types';

export const uploadService = {
  // POST /api/upload - Upload file
  uploadFile: async (file: File, fileType?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (fileType) {
      formData.append('fileType', fileType);
    }

    const response = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // POST /api/upload/multiple - Upload multiple files
  uploadMultipleFiles: async (files: File[], fileType?: string): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (fileType) {
      formData.append('fileType', fileType);
    }

    const response = await apiClient.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // DELETE /api/upload/:id - Delete file
  deleteFile: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/upload/${id}`);
    return response.data;
  },

  // DELETE /api/upload/key/:key - Delete file by key
  deleteFileByKey: async (key: string): Promise<any> => {
    const response = await apiClient.delete(`/upload/key/${key}`);
    return response.data;
  },

  // GET /api/upload - Get upload history
  getUploadHistory: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/upload', { params });
    return response.data;
  },

  // POST /api/upload/image - Upload image with compression
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // POST /api/upload/video - Upload video
  uploadVideo: async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      }
    });
    return response.data.data;
  }
};
