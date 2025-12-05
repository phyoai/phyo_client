'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, Globe } from 'lucide-react';

export default function LocationChart({ data, title, type = 'country' }) {
  if (!data) return null;

  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Show top 5

  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-gray-600">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const Icon = type === 'country' ? Globe : MapPin;
  const iconBg = type === 'country' ? 'bg-purple-100' : 'bg-orange-100';
  const iconColor = type === 'country' ? 'text-purple-600' : 'text-orange-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className={`bg-gradient-to-br ${type === 'country' ? 'from-purple-50 to-purple-100' : 'from-orange-50 to-orange-100'} p-2.5 rounded-lg`}>
          <Icon className={iconColor} size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            width={80}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
          <Bar 
            dataKey="value" 
            radius={[0, 8, 8, 0]}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Top location highlight */}
      {chartData.length > 0 && (
        <div className={`mt-4 p-3 ${type === 'country' ? 'bg-purple-50' : 'bg-orange-50'} rounded-lg`}>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Top {type === 'country' ? 'Country' : 'City'}:{' '}</span>
            <span className={`${type === 'country' ? 'text-purple-700' : 'text-orange-700'} font-bold`}>
              {chartData[0].name} ({chartData[0].value.toFixed(1)}%)
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );
}
