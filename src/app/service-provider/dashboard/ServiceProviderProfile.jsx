import React from 'react';
import { Edit2, MapPin, Calendar, MoreHorizontal, FileText, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

const ServiceProviderProfile = () => {
  const projectStats = [
    {
      title: "In Progress",
      value: "50",
      icon: <Clock className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Upcoming",
      value: "50", 
      icon: <Calendar className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Completed",
      value: "50",
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Pending",
      value: "50",
      icon: <AlertCircle className="w-6 h-6 text-emerald-600" />
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
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                alt="Aarav Mehta"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aarav Mehta</h1>
                <p className="text-gray-600">UI/UX Designer</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">9.7k</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">17.1</div>
                <div className="text-sm text-gray-600">View rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">27.4</div>
                <div className="text-sm text-gray-600">Engagement rate</div>
              </div>
              <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 mb-6">
            UI/UX design focuses on creating user-friendly and visually appealing interfaces. UI deals with look and layout, while UX ensures a seamless, enjoyable experience for users by enhancing usability and satisfaction.
          </p>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>London, UK</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>3 - 7 Years</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Role Type</h3>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <span>Freelancer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
          
          {/* Project Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {projectStats.map((stat, index) => (
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
            ))}
          </div>
        </div>

        {/* Our Work Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Our Work Progress</h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="space-y-0">
              {workProgress.map((work, index) => (
                <div key={work.id} className={`flex items-center justify-between p-6 ${index !== workProgress.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  {/* Project Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{work.project}</h3>
                    <p className="text-gray-500 text-sm">{work.description}</p>
                  </div>
                  
                  {/* Status and Progress */}
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-gray-700 font-medium mb-2">{work.status}</span>
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{work.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${work.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Date and Menu */}
                  <div className="flex-1 flex items-center justify-end space-x-4">
                    <span className="text-gray-600 text-sm">{work.date}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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

export default ServiceProviderProfile;