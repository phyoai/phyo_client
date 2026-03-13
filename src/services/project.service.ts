import apiClient from './api';
import { Project, CreateProjectRequest, ProjectStats, PaginationParams } from './types';

export const projectService = {
  // POST /api/projects
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/projects', data);
    return response.data.data;
  },

  // GET /api/projects
  getProjects: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },

  // GET /api/projects/stats
  getProjectStats: async (): Promise<ProjectStats> => {
    const response = await apiClient.get('/projects/stats');
    return response.data.data;
  },

  // GET /api/projects/:id
  getProjectById: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data.data;
  },

  // PUT /api/projects/:id
  updateProject: async (id: string, data: Partial<CreateProjectRequest>): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/projects/:id
  deleteProject: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  // Bulk operations
  deleteMultipleProjects: async (projectIds: string[]): Promise<any> => {
    const response = await apiClient.post('/projects/delete-multiple', { projectIds });
    return response.data;
  }
};
