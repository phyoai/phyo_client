'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Globe } from 'lucide-react';

const LANGUAGE_NAMES = {
  'en': 'English',
  'hindi': 'Hindi',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'ru': 'Russian',
  'af': 'Afrikaans',
  'ro': 'Romanian',
  'sw': 'Swahili',
};

export default function LanguageChart({ data }) {
  if (!data) return null;

  const chartData = Object.entries(data)
    .map(([code, value]) => ({
      name: LANGUAGE_NAMES[code] || code.toUpperCase(),
      code,
      value: typeof value === 'number' ? value : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Show top 5

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

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

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-2.5 rounded-lg">
          <Globe className="text-indigo-600" size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Language Distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Language List */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div
            key={item.code}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
