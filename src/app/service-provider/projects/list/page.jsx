'use client';

import React, { useEffect, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Project List Page (TIER 3)
 * Sortable/filterable table view of projects with pagination
 */
const ProjectListPage = () => {
  const {
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
  } = useProjects();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects('', currentPage);
  }, [currentPage]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return (b.progressPercentage || 0) - (a.progressPercentage || 0);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">All Projects</h1>
        <p className="text-neutral-text mt-2">View and manage all projects</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-muted">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Progress</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && !sortedProjects.length ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-neutral-text">
                    Loading...
                  </td>
                </tr>
              ) : sortedProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-neutral-text">
                    No projects found
                  </td>
                </tr>
              ) : (
                sortedProjects.map(project => (
                  <tr key={project._id} className="border-b border-neutral-muted hover:bg-neutral-muted/30 transition">
                    <td className="py-3 px-4">
                      <Link href={`/service-provider/projects/${project._id}`}>
                        <div className="font-medium hover:text-brand-base cursor-pointer">
                          {project.name}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-neutral-muted rounded-full h-2">
                          <div
                            className="bg-brand-base h-2 rounded-full"
                            style={{ width: `${project.progressPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{project.progressPercentage || 0}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-text">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/service-provider/projects/${project._id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-text">
              Page {currentPage} of {Math.ceil(pagination.total / pagination.limit)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectListPage;
