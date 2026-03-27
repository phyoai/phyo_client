'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, AlertCircle, Edit2, Share2 } from 'lucide-react';
import { projectApi } from '@/api/project-api';
import KanbanBoard from '../../clients/KanbanBoard';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectApi.getProject(projectId);
        setProject(response.project || response.data);
      } catch (err) {
        setError(err?.message || 'Failed to load project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                {error ? (
                  <h1 className="text-2xl font-bold text-gray-900">Project Not Found</h1>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {project?.title || project?.name || 'Project'}
                    </h1>
                    {project?.description && (
                      <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {!error && (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </div>

          {/* Project Stats */}
          {!error && project && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Status</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {project.status || 'active'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Progress</p>
                <p className="font-semibold text-gray-900">
                  {project.taskCount > 0
                    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Tasks</p>
                <p className="font-semibold text-gray-900">
                  {project.completedTaskCount}/{project.taskCount}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Created</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Unable to Load Project</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {!error && <KanbanBoard projectId={projectId} />}
    </div>
  );
}
