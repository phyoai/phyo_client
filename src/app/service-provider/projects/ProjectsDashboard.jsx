'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Calendar, CheckCircle, Clock, BarChart3, MoreHorizontal, AlertCircle } from 'lucide-react';
import { projectApi } from '@/api/project-api';

const ProjectStatSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const ProjectRowSkeleton = () => (
  <div className="p-6 border-b border-gray-100 animate-pulse">
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <div className="h-5 bg-gray-200 rounded mb-2 w-40"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="col-span-2">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="col-span-4">
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="col-span-2">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="col-span-1">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const ProjectsDashboard = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    inProgress: 0,
    upcoming: 0,
    completed: 0,
    pending: 0,
    total: 0
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectApi.getProjects();
        const projectList = response.projects || [];
        setProjects(projectList);

        // Calculate stats
        const inProgress = projectList.filter(p => p.status === 'active' || p.status === 'in_progress').length;
        const upcoming = projectList.filter(p => p.status === 'upcoming').length;
        const completed = projectList.filter(p => p.status === 'completed').length;
        const pending = projectList.filter(p => p.status === 'pending').length;
        const total = projectList.length;

        setStats({ inProgress, upcoming, completed, pending, total });
      } catch (err) {
        setError(err?.message || 'Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const projectStats = [
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      icon: <FileText className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Upcoming",
      value: stats.upcoming.toString(),
      icon: <FileText className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      icon: <Clock className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Total Projects",
      value: stats.total.toString(),
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Projects Header and Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>

          {/* Project Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading ? (
              <>
                <ProjectStatSkeleton />
                <ProjectStatSkeleton />
                <ProjectStatSkeleton />
                <ProjectStatSkeleton />
                <ProjectStatSkeleton />
              </>
            ) : (
              projectStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="space-y-0">
              {loading ? (
                <>
                  <ProjectRowSkeleton />
                  <ProjectRowSkeleton />
                  <ProjectRowSkeleton />
                </>
              ) : projects.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No projects found. Create a new project to get started.
                </div>
              ) : (
                projects.map((project, index) => {
                  const progress = project.taskCount > 0
                    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
                    : 0;

                  return (
                    <div
                      key={project.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        index !== projects.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      onClick={() => router.push(`/service-provider/projects/${project.id}`)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Project Info */}
                        <div className="col-span-3">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {project.title || project.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{project.description || 'No description'}</p>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            project.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'active' || project.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : project.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="col-span-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm font-medium">{progress}%</span>
                          </div>
                        </div>

                        {/* Task Count */}
                        <div className="col-span-2">
                          <span className="text-gray-600 text-sm">
                            {project.completedTaskCount}/{project.taskCount} tasks
                          </span>
                        </div>

                        {/* Menu */}
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
