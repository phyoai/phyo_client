'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal, MessageCircle, AlertCircle, Plus } from 'lucide-react';
import { projectApi } from '@/api/project-api';

const TaskSkeleton = () => (
  <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-32 mb-3"></div>
    <div className="h-2 bg-gray-200 rounded w-16 mb-4"></div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
  </div>
);

const TaskCard = ({ task, onStatusChange, projectId }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusOptions = ['to-do', 'in-progress', 'in-review', 'completed'];
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'high priority':
        return 'bg-red-50 text-red-600';
      case 'medium':
        return 'bg-yellow-50 text-yellow-600';
      case 'low':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{task.title || task.name}</h3>
          {task.description && (
            <p className="text-gray-500 text-xs line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(task.id, status);
                    setShowStatusMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  {status.replace('-', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {task.priority && (
        <div className="mb-3">
          <span className={`inline-block ${getPriorityColor(task.priority)} text-xs px-2 py-1 rounded`}>
            {task.priority}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
              {task.assignee[0]?.toUpperCase()}
            </div>
          )}
          {task.dueDate && (
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ projectId = null }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        if (projectId) {
          // Fetch tasks for specific project
          const response = await projectApi.getTasks(projectId);
          setTasks(response.tasks || response.data || []);
        } else {
          // Fetch all tasks from all projects
          const response = await projectApi.getProjects();
          const allProjects = response.projects || [];
          let allTasks = [];

          for (const project of allProjects) {
            try {
              const tasksResponse = await projectApi.getTasks(project.id);
              allTasks = [...allTasks, ...(tasksResponse.tasks || tasksResponse.data || [])];
            } catch (err) {
              console.error(`Failed to fetch tasks for project ${project.id}:`, err);
            }
          }

          setTasks(allTasks);
        }
      } catch (err) {
        setError(err?.message || 'Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [projectId]);

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      setActionLoading(true);
      await projectApi.updateTask(task.projectId || projectId, taskId, {
        ...task,
        status: newStatus
      });

      // Update local state
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      setError(err?.message || 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Group tasks by status
  const columns = [
    { id: 'to-do', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'in-review', title: 'In Review', color: 'bg-yellow-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(t => (t.status || 'to-do').toLowerCase() === status.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tasks Board</h1>
          <p className="text-gray-600 mt-2">Manage your project tasks by status</p>
        </div>

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

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <div key={column.id} className={`${column.color} rounded-lg p-4`}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-gray-900">{column.title}</h2>
                    <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                      {loading ? '...' : columnTasks.length}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tasks Column */}
                <div className="space-y-0">
                  {loading ? (
                    <>
                      <TaskSkeleton />
                      <TaskSkeleton />
                    </>
                  ) : columnTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No tasks</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        projectId={projectId}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && tasks.length === 0 && !error && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No tasks yet</p>
            <p className="text-gray-500 text-sm mt-2">Create a new task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
