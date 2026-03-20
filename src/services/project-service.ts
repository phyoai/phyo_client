/**
 * Project Service
 * Handles service provider project management
 */

import { apiClient, APIResponse } from "./api-client";
import { PROJECT_ENDPOINTS } from "@/utils/api-endpoints";

export interface IProject {
  _id: string;
  userId: string;
  name: string;
  description: string;
  progressPercentage: number;
  status: "In Progress" | "Completed" | "On Hold";
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  progressPercentage: number;
  date: string;
  status: string;
}

export interface UpdateProjectPayload {
  progressPercentage?: number;
  status?: string;
  description?: string;
}

export interface ProjectStats {
  totalProjects: number;
  averageProgress: number;
  statusBreakdown: Record<string, number>;
}

export class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(
    payload: CreateProjectPayload
  ): Promise<APIResponse<IProject>> {
    return apiClient.post(PROJECT_ENDPOINTS.CREATE, payload);
  }

  /**
   * Get all projects
   */
  static async getProjects(
    filters?: { status?: string },
    page = 1,
    limit = 10
  ): Promise<APIResponse<{ data: IProject[]; pagination: any }>> {
    return apiClient.get(PROJECT_ENDPOINTS.GET_ALL, {
      params: { ...filters, page, limit },
    });
  }

  /**
   * Get specific project
   */
  static async getProjectById(
    projectId: string
  ): Promise<APIResponse<IProject>> {
    return apiClient.get(PROJECT_ENDPOINTS.GET_BY_ID(projectId));
  }

  /**
   * Update project
   */
  static async updateProject(
    projectId: string,
    payload: UpdateProjectPayload
  ): Promise<APIResponse<IProject>> {
    return apiClient.put(PROJECT_ENDPOINTS.UPDATE(projectId), payload);
  }

  /**
   * Delete project
   */
  static async deleteProject(
    projectId: string
  ): Promise<APIResponse<{ message: string }>> {
    return apiClient.delete(PROJECT_ENDPOINTS.DELETE(projectId));
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(): Promise<APIResponse<ProjectStats>> {
    return apiClient.get(PROJECT_ENDPOINTS.GET_STATS);
  }
}
