'use client';

import React, { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * Project Form Component (TIER 3)
 * Reusable form for creating/editing projects
 * Handles: name, description, status, progress %, dates
 */
const ProjectForm = ({ projectId, onSuccess, onCancel }) => {
  const {
    selectedProject,
    loading,
    error,
    fetchProjectById,
    createNewProject,
    updateExistingProject,
  } = useProjects();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Not Started',
    progressPercentage: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedProject && projectId) {
      setFormData({
        name: selectedProject.name || '',
        description: selectedProject.description || '',
        status: selectedProject.status || 'Not Started',
        progressPercentage: selectedProject.progressPercentage || 0,
        date: selectedProject.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      });
    }
  }, [selectedProject, projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progressPercentage' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Project name is required');
      return;
    }

    try {
      if (projectId) {
        await updateExistingProject(projectId, formData);
      } else {
        await createNewProject(formData);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setFormError(err.message || 'Failed to save project');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">
        {projectId ? 'Edit Project' : 'Create New Project'}
      </h2>

      {(formError || error) && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
            rows={4}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </div>

        {/* Progress */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Progress: {formData.progressPercentage}%
          </label>
          <input
            type="range"
            name="progressPercentage"
            min="0"
            max="100"
            value={formData.progressPercentage}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saving...' : projectId ? 'Update Project' : 'Create Project'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ProjectForm;
