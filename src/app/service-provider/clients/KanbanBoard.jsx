import React from 'react';
import { MoreHorizontal, MessageCircle } from 'lucide-react';

const KanbanBoard = () => {
  const columns = [
    {
      title: "Upcoming",
      count: 2,
      color: "bg-gray-100",
      tasks: [
        {
          id: 1,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 2,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        }
      ]
    },
    {
      title: "In Progress",
      count: 3,
      color: "bg-blue-100",
      tasks: [
        {
          id: 3,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 4,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 5,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        }
      ]
    },
    {
      title: "Pending",
      count: 1,
      color: "bg-yellow-100",
      tasks: [
        {
          id: 6,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        }
      ]
    },
    {
      title: "Complete",
      count: 5,
      color: "bg-green-100",
      tasks: [
        {
          id: 7,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 8,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 9,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 10,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        },
        {
          id: 11,
          title: "Icon design",
          subtitle: "Dot.shm",
          priority: "High priority",
          description: "Please make a design according to the available brief",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          date: "May 1-3",
          comments: 4
        }
      ]
    }
  ];

  const TaskCard = ({ task }) => (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h3>
          <p className="text-gray-500 text-xs">{task.subtitle}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-3">
        <span className="inline-block bg-red-50 text-red-600 text-xs px-2 py-1 rounded">
          {task.priority}
        </span>
      </div>
      
      <p className="text-gray-600 text-xs mb-4 leading-relaxed">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src={task.avatar} 
            alt="User avatar" 
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-gray-500 text-xs">{task.date}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-gray-400">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{task.comments}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column, index) => (
            <div key={index} className={`${column.color} rounded-lg p-4`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-gray-900">{column.title}</h2>
                  <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full">
                    {column.count}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              {/* Task Cards */}
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;