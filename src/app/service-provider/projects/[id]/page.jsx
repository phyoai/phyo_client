'use client';

import React, { useEffect, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProjectForm from '@/components/projects/ProjectForm';

/**
 * Project Detail Page (TIER 3)
 * Shows full project view with edit/delete capabilities
 */
const ProjectDetailPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const {
    selectedProject,
    loading,
    error,
    fetchProjectById,
    removeProject,
  } = useProjects();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProjectById(id);
  }, [id]);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await removeProject(id);
    router.push('/service-provider/projects');
  };

  if (loading && !selectedProject) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-6 text-center">
        <p className="text-neutral-text">Project not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
          <p className="text-neutral-text mt-2">{selectedProject.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <ProjectForm
          projectId={id}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Project Details */}
      {!isEditing && (
        <>
          <Card>
            <h2 className="text-lg font-semibold mb-6">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-neutral-text">Status</label>
                <div className="text-lg font-semibold mt-1 px-3 py-1 bg-blue-50 text-blue-700 rounded inline-block">
                  {selectedProject.status}
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-text">Progress</label>
                <div className="text-lg font-semibold mt-1">
                  {selectedProject.progressPercentage || 0}%
                </div>
                <div className="w-full bg-neutral-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-brand-base h-2 rounded-full"
                    style={{ width: `${selectedProject.progressPercentage || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-text">Start Date</label>
                <div className="text-lg font-semibold mt-1">
                  {new Date(selectedProject.date).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-text">Last Updated</label>
                <div className="text-lg font-semibold mt-1">
                  {new Date(selectedProject.updatedAt || selectedProject.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <Card className="border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Project</h3>
              <p className="text-neutral-text mb-6">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  onClick={() => handleDelete()}
                  className="text-red-600"
                >
                  Confirm Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetailPage;
