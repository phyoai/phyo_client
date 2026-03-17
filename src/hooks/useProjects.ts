'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  setFilters,
  selectProject,
  clearProjects,
} from '@/store/slices/projectSlice';

export const useProjects = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.project);

  // State
  const { projects, selectedProject, projectStats, loading, error, filters, pagination } = state;

  // Actions
  const fetchProjects = useCallback(
    (status?: string, page = 1, limit = 10) => {
      return dispatch(getProjects({ status, page, limit }) as any);
    },
    [dispatch]
  );

  const fetchProjectById = useCallback(
    (id: string) => {
      return dispatch(getProjectById(id) as any);
    },
    [dispatch]
  );

  const createNewProject = useCallback(
    (projectData: {
      name: string;
      description: string;
      progressPercentage?: number;
      date?: string;
      status?: string;
    }) => {
      return dispatch(createProject(projectData) as any);
    },
    [dispatch]
  );

  const updateExistingProject = useCallback(
    (id: string, projectData: any) => {
      return dispatch(updateProject({ id, projectData }) as any);
    },
    [dispatch]
  );

  const removeProject = useCallback(
    (id: string) => {
      return dispatch(deleteProject(id) as any);
    },
    [dispatch]
  );

  const fetchStats = useCallback(() => {
    return dispatch(getProjectStats() as any);
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters) as any);
    },
    [dispatch]
  );

  const selectNewProject = useCallback(
    (project) => {
      dispatch(selectProject(project) as any);
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearProjects() as any);
  }, [dispatch]);

  return {
    // State
    projects,
    selectedProject,
    projectStats,
    loading,
    error,
    filters,
    pagination,

    // Actions
    fetchProjects,
    fetchProjectById,
    createNewProject,
    updateExistingProject,
    removeProject,
    fetchStats,
    updateFilters,
    selectNewProject,
    clearAll,
  };
};
