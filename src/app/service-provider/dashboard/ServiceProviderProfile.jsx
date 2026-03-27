'use client';

import React, { useEffect, useState } from 'react';
import { Edit2, MapPin, Calendar, MoreHorizontal, Clock, CheckCircle, AlertCircle, BarChart3, AlertCircleIcon } from 'lucide-react';
import { projectApi } from '@/api/project-api';

const ProjectSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const ServiceProviderProfile = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
    pending: 0
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
        const total = projectList.length;
        const active = projectList.filter(p => p.status === 'active').length;
        const completed = projectList.filter(p => p.status === 'completed').length;
        const pending = projectList.filter(p => p.status === 'pending').length;
        const upcoming = projectList.filter(p => p.status === 'upcoming').length;

        setStats({ total, active, upcoming, completed, pending });
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
      title: "Active",
      value: stats.active.toString(),
      icon: <Clock className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Upcoming",
      value: stats.upcoming.toString(),
      icon: <Calendar className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      icon: <AlertCircle className="w-6 h-6 text-emerald-600" />
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
            <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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

        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                SP
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Provider</h1>
                <p className="text-gray-600">Project Manager</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 mb-6">
            Professional project manager specializing in task organization, timeline management, and team coordination. Delivering projects on time with quality and efficiency.
          </p>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Global</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Multiple Years</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Role Type</h3>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <span>Service Provider</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>

          {/* Project Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {loading ? (
              <>
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
              </>
            ) : (
              projectStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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

        {/* Active Projects List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="space-y-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No projects found. Create a new project to get started.
                </div>
              ) : (
                projects
                  .filter(p => p.status === 'active' || p.status === 'in_progress')
                  .slice(0, 5)
                  .map((project, index) => {
                    const progress = project.taskCount > 0
                      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
                      : 0;

                    return (
                      <div
                        key={project.id}
                        className={`flex items-center justify-between p-6 ${
                          index !== projects.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        {/* Project Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {project.title || project.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{project.description}</p>
                        </div>

                        {/* Status and Progress */}
                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-gray-700 font-medium mb-2 capitalize">
                            {project.status}
                          </span>
                          <div className="w-full max-w-xs">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Date and Menu */}
                        <div className="flex-1 flex items-center justify-end space-x-4">
                          <span className="text-gray-600 text-sm">
                            {project.completedTaskCount}/{project.taskCount} tasks
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
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

export default ServiceProviderProfile;
