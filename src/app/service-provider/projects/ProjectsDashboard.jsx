import React from 'react';
import { FileText, Calendar, CheckCircle, Clock, BarChart3, MoreHorizontal } from 'lucide-react';

const ProjectsDashboard = () => {
  const projectStats = [
    {
      title: "In Progress",
      value: "50",
      icon: <FileText className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Upcoming",
      value: "50", 
      icon: <FileText className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Completed",
      value: "50",
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Pending",
      value: "50",
      icon: <Clock className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Total Project",
      value: "50",
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />
    }
  ];

  const workProgress = [
    {
      id: 1,
      project: "Dezignplex",
      description: "E-Commerce website Design",
      status: "Complete",
      progress: 80,
      date: "July, 4, 2025"
    },
    {
      id: 2,
      project: "Dezignplex",
      description: "E-Commerce website Design",
      status: "Complete",
      progress: 80,
      date: "July, 4, 2025"
    },
    {
      id: 3,
      project: "Dezignplex",
      description: "E-Commerce website Design",
      status: "Complete",
      progress: 80,
      date: "July, 4, 2025"
    },
    {
      id: 4,
      project: "Dezignplex",
      description: "E-Commerce website Design",
      status: "Complete",
      progress: 80,
      date: "July, 4, 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Projects Header and Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
          
          {/* Project Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {projectStats.map((stat, index) => (
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
            ))}
          </div>
        </div>

        {/* Our Work Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Our Work Progress</h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="space-y-0">
              {workProgress.map((work, index) => (
                <div key={work.id} className={`p-6 ${index !== workProgress.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Project Info */}
                    <div className="col-span-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{work.project}</h3>
                      <p className="text-gray-500 text-sm">{work.description}</p>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-2">
                      <span className="text-gray-700 font-medium">{work.status}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${work.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm font-medium">{work.progress}%</span>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className="col-span-2">
                      <span className="text-gray-600 text-sm">{work.date}</span>
                    </div>
                    
                    {/* Menu */}
                    <div className="col-span-1 flex justify-end">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;