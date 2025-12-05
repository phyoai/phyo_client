'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EngagementCard({ avgEngagement, followers, demographics }) {
  if (!avgEngagement) return null;

  // Calculate estimated engagement metrics
  const estimatedLikes = Math.round((followers * avgEngagement) / 100);
  const estimatedComments = Math.round(estimatedLikes * 0.05); // Rough estimate
  const estimatedShares = Math.round(estimatedLikes * 0.02); // Rough estimate

  // Determine engagement level
  let engagementLevel = 'Excellent';
  let engagementColor = 'text-green-600';
  let engagementBg = 'bg-green-100';
  let barColor = '#10B981';
  
  if (avgEngagement < 1) {
    engagementLevel = 'Low';
    engagementColor = 'text-red-600';
    engagementBg = 'bg-red-100';
    barColor = '#EF4444';
  } else if (avgEngagement < 3) {
    engagementLevel = 'Good';
    engagementColor = 'text-blue-600';
    engagementBg = 'bg-blue-100';
    barColor = '#3B82F6';
  } else if (avgEngagement < 6) {
    engagementLevel = 'Very Good';
    engagementColor = 'text-purple-600';
    engagementBg = 'bg-purple-100';
    barColor = '#8B5CF6';
  }

  // Sample data for trend (you can replace with actual historical data if available)
  const trendData = [
    { month: 'Jan', rate: avgEngagement * 0.9 },
    { month: 'Feb', rate: avgEngagement * 0.95 },
    { month: 'Mar', rate: avgEngagement * 1.05 },
    { month: 'Apr', rate: avgEngagement * 0.98 },
    { month: 'May', rate: avgEngagement },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600">{payload[0].payload.month}</p>
          <p className="font-bold text-gray-800">{payload[0].value.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className={`bg-gradient-to-br ${engagementBg.replace('bg-', 'from-')}-50 ${engagementBg.replace('bg-', 'to-')}-100 p-2.5 rounded-lg`}>
          <TrendingUp className={engagementColor} size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Engagement Rate</h3>
          <p className="text-xs text-gray-500">Average interaction rate</p>
        </div>
      </div>

      {/* Engagement Percentage */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className={`inline-block ${engagementBg} px-6 py-4 rounded-2xl`}
        >
          <p className="text-sm text-gray-600 mb-1">Current Engagement</p>
          <p className={`text-5xl font-bold ${engagementColor}`}>
            {avgEngagement.toFixed(2)}%
          </p>
          <p className={`text-sm font-semibold ${engagementColor} mt-2`}>
            {engagementLevel}
          </p>
        </motion.div>
      </div>

      {/* Engagement Trend Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke={barColor}
              strokeWidth={3}
              dot={{ fill: barColor, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Estimated Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Heart size={18} />}
          label="Est. Likes"
          value={formatNumber(estimatedLikes)}
          color="bg-red-50 text-red-600"
        />
        <MetricCard
          icon={<MessageCircle size={18} />}
          label="Est. Comments"
          value={formatNumber(estimatedComments)}
          color="bg-blue-50 text-blue-600"
        />
        <MetricCard
          icon={<Share2 size={18} />}
          label="Est. Shares"
          value={formatNumber(estimatedShares)}
          color="bg-green-50 text-green-600"
        />
        <MetricCard
          icon={<Eye size={18} />}
          label="Est. Reach"
          value={formatNumber(estimatedLikes * 3)}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Formula:</strong> Engagement Rate = (Likes + Comments) / Followers × 100
        </p>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} rounded-xl p-3 flex flex-col items-center justify-center`}
    >
      <div className="mb-1">{icon}</div>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </motion.div>
  );
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
