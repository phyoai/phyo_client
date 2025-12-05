'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users } from 'lucide-react';

export default function GenderChart({ data }) {
  if (!data) return null;

  const chartData = [
    { name: 'Male', value: data.male || 0, color: '#3B82F6' },
    { name: 'Female', value: data.female || 0, color: '#EC4899' },
    { name: 'Unknown', value: data.unknown || 0, color: '#9CA3AF' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 rounded-lg">
          <Users className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Gender Distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend with stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="text-center p-3 rounded-lg"
            style={{ backgroundColor: `${item.color}15` }}
          >
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: item.color }}
            ></div>
            <p className="text-xs text-gray-600 font-medium">{item.name}</p>
            <p className="text-lg font-bold" style={{ color: item.color }}>
              {item.value.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
