'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';

export default function AgeChart({ data }) {
  if (!data) return null;

  const chartData = Object.entries(data)
    .map(([age, value]) => ({
      age,
      value: typeof value === 'number' ? value : 0,
    }))
    .sort((a, b) => {
      // Custom sort for age ranges
      const order = ['13-17', '18-24', '25-34', '35-44', '45+'];
      return order.indexOf(a.age) - order.indexOf(b.age);
    });

  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">Age: {payload[0].payload.age}</p>
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
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-2.5 rounded-lg">
          <Users className="text-green-600" size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Age Distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="age" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            label={{ value: '%', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">
            Dominant Age Group:{' '}
          </span>
          <span className="text-green-700 font-bold">
            {chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0])?.age || 'N/A'}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
