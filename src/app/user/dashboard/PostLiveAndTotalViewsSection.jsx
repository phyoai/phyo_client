// components/PostLiveAndTotalViewsSection.jsx
"use client";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { MoreHorizontal, ChevronDown, TrendingUp } from "lucide-react";

const PostLiveAndTotalViewsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Employee Structure Data
  const employeeData = [
    { name: "Views", value: 65, color: "#059669" },
    { name: "Like", value: 45, color: "#34d399" },
    { name: "Comments", value: 30, color: "#6ee7b7" },
  ];

  // Total percentage calculation
  const totalPercentage = employeeData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // Views Chart Data
  const viewsData = [
    { day: "Mon", views: 2000 },
    { day: "Tue", views: 1800 },
    { day: "Wed", views: 2800 },
    { day: "Thu", views: 2000 },
    { day: "Fri", views: 3200 },
    { day: "Sat", views: 2800 },
    { day: "Sun", views: 2400 },
  ];

  const periods = ["Year", "Month", "Week", "Day"];

  // Custom tooltip for views chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-sm font-medium text-gray-900">
            {payload[0].value.toLocaleString()} views
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#F5F3EE] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 bg-white p-4 rounded-3xl">
            Post Live
          </h2>
          <h2 className="text-2xl font-bold text-gray-900 bg-white p-4 rounded-3xl">
            Total Views
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className=" rounded-3xl bg-white p-8">
            {/* Employee Structure Card */}
            <div className="bg-[#F3F2EB] rounded-3xl p-6 border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Employee Structure
                </h3>
                <button className="text-white rotate-90 hover:text-gray-600 bg-black p-1  rounded-lg">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Pie Chart */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={employeeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {employeeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Total</div>
                      <div className="text-2xl font-bold text-gray-900">
                        100%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {employeeData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className=" rounded-3xl bg-white p-8">
            {/* Total Views Card */}
            <div className="bg-[#F3F2EB] rounded-3xl p-6 border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Views</h3>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {selectedPeriod}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {periods.map((period) => (
                        <button
                          key={period}
                          onClick={() => {
                            setSelectedPeriod(period);
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Growth Indicator */}
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +24.00%
                </span>
              </div>

              {/* Views Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient
                        id="viewsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#059669"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#059669"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(value) => `${value / 1000}K`}
                      domain={[0, 4000]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#059669"
                      strokeWidth={2}
                      fill="url(#viewsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLiveAndTotalViewsSection;

