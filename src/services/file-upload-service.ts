/**
 * File Upload Service
 * Handles file uploads to AWS S3
 */

import { apiClient, APIResponse } from "./api-client";
import { FILE_ENDPOINTS } from "@/utils/api-endpoints";

export interface IUploadResponse {
  url: string;
  key: string;
  bucket: string;
  fileName?: string;
  fileSize?: number;
}

export class FileUploadService {
  /**
   * Upload file to S3
   */
  static async uploadFile(
    file: File
  ): Promise<APIResponse<IUploadResponse>> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post(FILE_ENDPOINTS.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<APIResponse<IUploadResponse>>;
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(
    fileKey: string
  ): Promise<APIResponse<{ message: string }>> {
    return apiClient.delete(
      `${FILE_ENDPOINTS.DELETE}/${fileKey}`
    ) as Promise<APIResponse<{ message: string }>>;
  }
}
