import React from 'react';
import { Edit2, MapPin, Calendar, Upload } from 'lucide-react';

const PortfolioComponent = () => {
  const webDesignProjects = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop",
      title: "E-commerce Platform",
      category: "Web Design"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      title: "Premium Website",
      category: "UX Design"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      title: "Business Dashboard",
      category: "UI Design"
    }
  ];

  const appDesignProjects = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=400&fit=crop",
      title: "Daily Task App",
      category: "Mobile App"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=400&fit=crop",
      title: "Social Network",
      category: "Mobile App"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=200&h=400&fit=crop",
      title: "Fitness App",
      category: "Mobile App"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=400&fit=crop",
      title: "Health Tracker",
      category: "Mobile App"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=400&fit=crop",
      title: "Analytics App",
      category: "Mobile App"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=400&fit=crop",
      title: "Calculator",
      category: "Mobile App"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=200&h=400&fit=crop",
      title: "Prototyping",
      category: "Mobile App",
      highlight: true
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=400&fit=crop",
      title: "E-commerce App",
      category: "Mobile App"
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=400&fit=crop",
      title: "Shopping Cart",
      category: "Mobile App"
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
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
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

        {/* Web Design Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Web Design</h2>
            <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
              <Upload className="w-4 h-4" />
              <span>Upload Portfolio</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {webDesignProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Design Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">App Design</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {appDesignProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
                {project.highlight && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                    Prototyping
                  </div>
                )}
                <div className="aspect-[9/16] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{project.title}</h3>
                  <p className="text-gray-600 text-xs">{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioComponent;