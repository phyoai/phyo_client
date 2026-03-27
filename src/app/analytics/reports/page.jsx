'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Download, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { analyticsApi } from '@/api/analytics-api';

const ReportSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
  </div>
);

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentQuarter = Math.ceil(currentMonth / 3);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter);
  const [selectedReport, setSelectedReport] = useState(null);

  const availableYears = [currentYear - 1, currentYear];

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        period: reportType,
        year: selectedYear
      };

      if (reportType === 'monthly') {
        params.month = selectedMonth;
      } else {
        params.quarter = selectedQuarter;
      }

      const report = await analyticsApi.getPeriodReport(params);
      setSelectedReport(report);
    } catch (err) {
      setError(err?.message || 'Failed to generate report');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedReport) return;

    try {
      const result = await analyticsApi.exportAnalytics({
        type: reportType === 'monthly' ? 'monthly' : 'quarterly',
        format: 'pdf',
        startDate: selectedReport.startDate,
        endDate: selectedReport.endDate
      });

      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
    } catch (err) {
      setError('Failed to export report');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/analytics/dashboard" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and view periodic analytics reports</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Report Generator */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Generate Report</h2>

          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Report Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="monthly"
                    checked={reportType === 'monthly'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Monthly Report</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="quarterly"
                    checked={reportType === 'quarterly'}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Quarterly Report</span>
                </label>
              </div>
            </div>

            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {reportType === 'monthly' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map((month, idx) => (
                      <option key={idx} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quarter</label>
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Q1 (Jan - Mar)</option>
                    <option value={2}>Q2 (Apr - Jun)</option>
                    <option value={3}>Q3 (Jul - Sep)</option>
                    <option value={4}>Q4 (Oct - Dec)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Report Display */}
        {selectedReport ? (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.period} Report</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {new Date(selectedReport.startDate).toLocaleDateString()} - {new Date(selectedReport.endDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.metrics.totalCampaigns}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Influencers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.metrics.totalInfluencers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Reach</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(selectedReport.metrics.totalReach)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Engagement</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(selectedReport.metrics.totalEngagement)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${(selectedReport.metrics.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average ROI</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{((selectedReport.metrics.averageROI || 0) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Top Campaigns */}
            {selectedReport.topCampaigns && selectedReport.topCampaigns.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Campaigns</h3>
                <div className="space-y-3">
                  {selectedReport.topCampaigns.map((campaign, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{idx + 1}. {campaign.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Reach: {formatNumber(campaign.reach)}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-600 dark:text-green-400">{(campaign.roi * 100).toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">ROI</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Influencers */}
            {selectedReport.topInfluencers && selectedReport.topInfluencers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Influencers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.topInfluencers.map((influencer, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{idx + 1}. {influencer.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{influencer.niche}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {(influencer.engagementRate * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends */}
            {selectedReport.trends && selectedReport.trends.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trends</h3>
                <div className="space-y-4">
                  {selectedReport.trends.map((trend, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{trend.title}</p>
                        <span className={`text-sm font-medium ${trend.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {trend.change >= 0 ? '+' : ''}{trend.change}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{trend.data?.length || 0} data points</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Generate a report to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}
