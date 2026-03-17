'use client';

import React, { useEffect, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Projects Dashboard Page (TIER 3)
 * Displays project statistics, status breakdown, and project list
 * - Stats cards: total projects, in progress, completed, avg progress
 * - Status breakdown pie chart equivalent
 * - Project list with filters
 * - Create project button
 */
const ProjectsPage = () => {
  const router = useRouter();
  const {
    projects,
    projectStats,
    loading,
    error,
    fetchProjects,
    fetchStats,
    updateFilters,
  } = useProjects();

  const [filters, setFilters] = useState({ status: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchProjects(filters.status, page);
  }, [filters.status, page]);

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status });
    setPage(1);
    updateFilters({ status });
  };

  const handleCreateProject = () => {
    router.push('/service-provider/projects/create');
  };

  if (loading && !projects.length) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-neutral-text mt-2">Manage your projects and track progress</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleCreateProject}
        >
          + New Project
        </Button>
      </div>

      {/* Stats Cards */}
      {projectStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {projectStats.totalProjects}
              </div>
              <div className="text-sm text-blue-700 mt-1">Total Projects</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {projectStats.inProgressProjects}
              </div>
              <div className="text-sm text-green-700 mt-1">In Progress</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {projectStats.completedProjects}
              </div>
              <div className="text-sm text-purple-700 mt-1">Completed</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">
                {projectStats.averageProgress.toFixed(0)}%
              </div>
              <div className="text-sm text-amber-700 mt-1">Avg Progress</div>
            </div>
          </Card>
        </div>
      )}

      {/* Status Breakdown */}
      {projectStats && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {projectStats.statusBreakdown.notStarted}
              </div>
              <div className="text-xs text-red-700 mt-1">Not Started</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {projectStats.statusBreakdown.inProgress}
              </div>
              <div className="text-xs text-yellow-700 mt-1">In Progress</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {projectStats.statusBreakdown.completed}
              </div>
              <div className="text-xs text-blue-700 mt-1">Completed</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {projectStats.statusBreakdown.onHold}
              </div>
              <div className="text-xs text-gray-700 mt-1">On Hold</div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <h3 className="font-semibold mb-3">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {['', 'Not Started', 'In Progress', 'Completed', 'On Hold'].map(
            (status) => (
              <Button
                key={status}
                variant={filters.status === status ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleStatusFilter(status)}
              >
                {status || 'All'}
              </Button>
            )
          )}
        </div>
      </Card>

      {/* Project List */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Projects List</h2>
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-text">No projects found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/service-provider/projects/${project._id}`}
              >
                <div className="p-4 border border-neutral-muted rounded-lg hover:bg-neutral-muted/50 cursor-pointer transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-neutral-text mt-1">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                          {project.status}
                        </span>
                        <span className="text-xs text-neutral-text">
                          {project.progressPercentage || 0}% complete
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-neutral-text">
                        {new Date(project.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-neutral-muted rounded-full h-2">
                    <div
                      className="bg-brand-base h-2 rounded-full transition-all"
                      style={{ width: `${project.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectsPage;
