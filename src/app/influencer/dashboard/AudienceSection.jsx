// components/AudienceSection.jsx
'use client'
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AudienceSection = ({ 
  audienceData = {
    gender: {
      male: 55.1,
      female: 44.9
    },
    age: {
      primary: '25-34 y',
      percentage: 76
    },
    cities: [
      { name: 'Delhi', percentage: 60 },
      { name: 'Hyderabad', percentage: 50 },
      { name: 'Indore', percentage: 40 },
      { name: 'Lucknow', percentage: 30 },
      { name: 'Bangalore', percentage: 20 }
    ],
    countries: [
      { name: 'India', percentage: 60 },
      { name: 'USA', percentage: 50 }
    ]
  }
}) => {
  // Gender chart data
  const genderData = [
    { name: 'Male', value: audienceData.gender.male, color: '#059669' },
    { name: 'Female', value: audienceData.gender.female, color: '#86efac' }
  ];

  // Progress bar component
  const ProgressBar = ({ label, percentage, isFirst = false }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Audience</h2>

        {/* Main Content */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          {/* Top Row - Gender and Age */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gender Section */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Primary audience gender:</h3>
                <div className="mb-4">
                  <div className="text-sm text-gray-700">Male</div>
                  <div className="text-3xl font-light text-green-400">{audienceData.gender.male}%</div>
                </div>
              </div>

              {/* Gender Chart */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Chart Labels */}
                  <div className="absolute top-4 left-4 text-sm">
                    <div className="font-medium text-gray-900">{audienceData.gender.male}%</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-gray-600">Male</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 text-sm">
                    <div className="font-medium text-gray-900">{audienceData.gender.female}%</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span className="text-gray-600">Female</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Age Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Primary audience Age:</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-700">{audienceData.age.primary}</div>
                <div className="text-3xl font-light text-green-400">{audienceData.age.percentage}%</div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Cities and Countries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary City */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Primary City:</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-700">{audienceData.cities[0].name}</div>
                <div className="text-3xl font-light text-green-400">{audienceData.cities[0].percentage}%</div>
              </div>

              {/* Cities Progress Bars */}
              <div className="mt-6">
                {audienceData.cities.map((city, index) => (
                  <ProgressBar 
                    key={city.name}
                    label={city.name}
                    percentage={city.percentage}
                    isFirst={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Primary Country */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Primary Country:</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-700">{audienceData.countries[0].name}</div>
                <div className="text-3xl font-light text-green-400">{audienceData.countries[0].percentage}%</div>
              </div>

              {/* Countries Progress Bars */}
              <div className="mt-6">
                {audienceData.countries.map((country, index) => (
                  <ProgressBar 
                    key={country.name}
                    label={country.name}
                    percentage={country.percentage}
                    isFirst={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceSection;