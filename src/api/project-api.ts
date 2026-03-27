/**
 * Project API Utility Functions
 * Provides typed wrapper functions for project and task management
 *
 * Usage:
 * import { projectApi } from '@/api/project-api';
 * const projects = await projectApi.getProjects({ page: 1, limit: 20 });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Project & Task Types
 */
export interface ITask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  completedAt?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  id: string;
  serviceProviderId: string;
  campaignId?: string;
  title: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget?: number;
  deliverables?: string[];
  tasks: ITask[];
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectsResponse {
  data: IProject[];
  pagination: IPagination;
}

export interface ITasksResponse {
  data: ITask[];
  pagination: IPagination;
}

const defaultPagination: IPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/**
 * Project API service
 * Handles all project and task management operations
 */
export const projectApi = {
  /**
   * Get all projects for the service provider
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated projects
   *
   * @example
   * const result = await projectApi.getProjects({ page: 1, limit: 20 });
   */
  getProjects: async (
    params?: Partial<{ page: number; limit: number; status: string }>
  ): Promise<{ projects: IProject[]; pagination: IPagination }> => {
    try {
      const response = await api.get<IApiResponse<IProjectsResponse>>(
        '/projects',
        { params }
      );

      const payload = response.data?.data;
      return {
        projects: (payload?.data ?? []) as IProject[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch projects';
      console.error('Error in getProjects:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get a specific project
   *
   * @param projectId - The project ID
   * @returns Promise resolving to project details
   *
   * @example
   * const project = await projectApi.getProject('proj_123');
   */
  getProject: async (projectId: string): Promise<IProject> => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }

      const response = await api.get<IApiResponse<IProject>>(
        `/projects/${projectId.trim()}`
      );

      if (!response.data.data) {
        throw new Error('Project not found');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch project';
      console.error('Error in getProject:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Create a new project
   *
   * @param projectData - Project creation payload
   * @returns Promise resolving to created project
   *
   * @example
   * const project = await projectApi.createProject({ title: 'New Project', ... });
   */
  createProject: async (projectData: Partial<IProject>): Promise<IProject> => {
    try {
      if (!projectData.title) {
        throw new Error('Project title is required');
      }

      const response = await api.post<IApiResponse<IProject>>(
        '/projects',
        projectData
      );

      if (!response.data.data) {
        throw new Error('Failed to create project');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create project';
      console.error('Error in createProject:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Update a project
   *
   * @param projectId - The project ID
   * @param updateData - Project update payload
   * @returns Promise resolving to updated project
   *
   * @example
   * const project = await projectApi.updateProject('proj_123', { status: 'completed' });
   */
  updateProject: async (
    projectId: string,
    updateData: Partial<IProject>
  ): Promise<IProject> => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }

      const response = await api.patch<IApiResponse<IProject>>(
        `/projects/${projectId.trim()}`,
        updateData
      );

      if (!response.data.data) {
        throw new Error('Failed to update project');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update project';
      console.error('Error in updateProject:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a project
   *
   * @param projectId - The project ID to delete
   * @returns Promise resolving to deletion response
   *
   * @example
   * await projectApi.deleteProject('proj_123');
   */
  deleteProject: async (projectId: string): Promise<{ message: string }> => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }

      const response = await api.delete<IApiResponse<{ message: string }>>(
        `/projects/${projectId.trim()}`
      );

      return response.data?.data ?? { message: 'Project deleted' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete project';
      console.error('Error in deleteProject:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get tasks in a project
   *
   * @param projectId - The project ID
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated tasks
   *
   * @example
   * const result = await projectApi.getTasks('proj_123', { page: 1, limit: 50 });
   */
  getTasks: async (
    projectId: string,
    params?: Partial<{ page: number; limit: number; status: string }>
  ): Promise<{ tasks: ITask[]; pagination: IPagination }> => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }

      const response = await api.get<IApiResponse<ITasksResponse>>(
        `/projects/${projectId.trim()}/tasks`,
        { params }
      );

      const payload = response.data?.data;
      return {
        tasks: (payload?.data ?? []) as ITask[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch tasks';
      console.error('Error in getTasks:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Create a task in a project
   *
   * @param projectId - The project ID
   * @param taskData - Task creation payload
   * @returns Promise resolving to created task
   *
   * @example
   * const task = await projectApi.createTask('proj_123', { title: 'New Task', ... });
   */
  createTask: async (projectId: string, taskData: Partial<ITask>): Promise<ITask> => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }
      if (!taskData.title) {
        throw new Error('Task title is required');
      }

      const response = await api.post<IApiResponse<ITask>>(
        `/projects/${projectId.trim()}/tasks`,
        taskData
      );

      if (!response.data.data) {
        throw new Error('Failed to create task');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create task';
      console.error('Error in createTask:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Update a task
   *
   * @param taskId - The task ID
   * @param updateData - Task update payload
   * @returns Promise resolving to updated task
   *
   * @example
   * const task = await projectApi.updateTask('task_123', { status: 'completed' });
   */
  updateTask: async (taskId: string, updateData: Partial<ITask>): Promise<ITask> => {
    try {
      if (!taskId || typeof taskId !== 'string') {
        throw new Error('Invalid task ID');
      }

      const response = await api.patch<IApiResponse<ITask>>(
        `/tasks/${taskId.trim()}`,
        updateData
      );

      if (!response.data.data) {
        throw new Error('Failed to update task');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update task';
      console.error('Error in updateTask:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a task
   *
   * @param taskId - The task ID to delete
   * @returns Promise resolving to deletion response
   *
   * @example
   * await projectApi.deleteTask('task_123');
   */
  deleteTask: async (taskId: string): Promise<{ message: string }> => {
    try {
      if (!taskId || typeof taskId !== 'string') {
        throw new Error('Invalid task ID');
      }

      const response = await api.delete<IApiResponse<{ message: string }>>(
        `/tasks/${taskId.trim()}`
      );

      return response.data?.data ?? { message: 'Task deleted' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete task';
      console.error('Error in deleteTask:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};

export default projectApi;
