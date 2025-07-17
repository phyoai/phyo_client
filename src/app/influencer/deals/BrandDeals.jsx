import React from 'react';
import { FileText, Calendar, CheckCircle, Clock, BarChart3, Instagram, Youtube, MoreHorizontal } from 'lucide-react';

const BrandDealsDashboard = () => {
  const metrics = [
    {
      title: "Brand Deals",
      value: "50",
      icon: <FileText className="w-6 h-6 text-emerald-600" />
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
      icon: <Clock className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Total Deals",
      value: "50",
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />
    }
  ];

  const deals = [
    {
      id: 1,
      brand: "Dezignplex",
      description: "E-Commerce website Design",
      status: "Video Posted",
      platforms: ["instagram", "youtube"],
      statusBadge: "Done",
      date: "July, 4, 2025"
    },
    {
      id: 2,
      brand: "Dezignplex", 
      description: "E-Commerce website Design",
      status: "Video Posted",
      platforms: ["instagram"],
      statusBadge: "Done",
      date: "July, 4, 2025"
    },
    {
      id: 3,
      brand: "Dezignplex",
      description: "E-Commerce website Design", 
      status: "Video Posted",
      platforms: ["youtube"],
      statusBadge: "Done",
      date: "July, 4, 2025"
    },
    {
      id: 4,
      brand: "Dezignplex",
      description: "E-Commerce website Design",
      status: "Video Posted", 
      platforms: ["instagram", "youtube"],
      statusBadge: "Done",
      date: "July, 4, 2025"
    }
  ];

  const PlatformIcon = ({ platform }) => {
    if (platform === "instagram") {
      return <Instagram className="w-5 h-5 text-white" />;
    }
    if (platform === "youtube") {
      return <Youtube className="w-5 h-5 text-white" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Brand Deals Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Brand Deals</h1>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    {metric.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Deals History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="space-y-0">
              {deals.map((deal, index) => (
                <div key={deal.id} className={`flex items-center justify-between p-6 ${index !== deals.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  {/* Brand Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{deal.brand}</h3>
                    <p className="text-gray-500 text-sm">{deal.description}</p>
                  </div>
                  
                  {/* Status */}
                  <div className="flex-1 flex justify-center">
                    <span className="text-gray-700 font-medium">{deal.status}</span>
                  </div>
                  
                  {/* Platform Icons */}
                  <div className="flex-1 flex justify-center">
                    <div className="flex space-x-2">
                      {deal.platforms.map((platform, idx) => (
                        <div key={idx} className="bg-emerald-600 p-2 rounded-lg">
                          <PlatformIcon platform={platform} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex-1 flex justify-center">
                    <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {deal.statusBadge}
                    </span>
                  </div>
                  
                  {/* Date and Menu */}
                  <div className="flex-1 flex items-center justify-end space-x-4">
                    <span className="text-gray-600 text-sm">{deal.date}</span>
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

export default BrandDealsDashboard;