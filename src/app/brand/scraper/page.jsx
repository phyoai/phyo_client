'use client'
import React, { useState } from 'react';
import { Download, Play, Pause } from 'lucide-react';
import {
  scrapeInfluencerData,
  exportToCSV,
  exportToJSON,
  saveToLocalStorage,
  loadFromLocalStorage
} from '@/utils/scraperUtils';

export default function ScraperPage() {
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  const [error, setError] = useState('');

  // Scraper settings
  const [settings, setSettings] = useState({
    totalPages: 5,
    delayBetweenRequests: 1000,
    platform: 'instagram',
    location: '',
    language: '',
    creatorType: '',
    sortBy: 'followers',
    sortOrder: 'desc'
  });

  const handleStartScraping = async () => {
    setScraping(true);
    setError('');
    setProgress('Starting scrape...');

    try {
      const result = await scrapeInfluencerData({
        totalPages: parseInt(settings.totalPages),
        delayBetweenRequests: parseInt(settings.delayBetweenRequests),
        filters: {
          platform: settings.platform,
          location: settings.location,
          language: settings.language,
          creatorType: settings.creatorType,
          sortBy: settings.sortBy,
          sortOrder: settings.sortOrder,
          pricePerCreator: 10000000000
        },
        onProgress: setProgress
      });

      setScrapedData(result);

      if (result.success) {
        setProgress(`✓ Successfully scraped ${result.totalInfluencers} influencers!`);
        // Auto-save to localStorage
        saveToLocalStorage(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      setProgress('Scraping failed');
    } finally {
      setScraping(false);
    }
  };

  const handleExportCSV = () => {
    if (scrapedData?.allInfluencers) {
      exportToCSV(scrapedData.allInfluencers, `influencers_${new Date().getTime()}.csv`);
    }
  };

  const handleExportJSON = () => {
    if (scrapedData) {
      exportToJSON(scrapedData, `influencers_${new Date().getTime()}.json`);
    }
  };

  const handleLoadFromStorage = () => {
    const data = loadFromLocalStorage();
    if (data) {
      setScrapedData(data);
      setProgress(`Loaded ${data.totalInfluencers} influencers from storage`);
    } else {
      setError('No saved data found in storage');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Influencer Data Scraper</h1>
          <p className="text-gray-600">Collect influencer data from the API and export it</p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Scraper Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pages to Scrape
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.totalPages}
                onChange={(e) => setSettings({...settings, totalPages: e.target.value})}
                disabled={scraping}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#43573b] disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">Each page has ~20 results</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Between Requests (ms)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                step="100"
                value={settings.delayBetweenRequests}
                onChange={(e) => setSettings({...settings, delayBetweenRequests: e.target.value})}
                disabled={scraping}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#43573b] disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">Prevents rate limiting</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={settings.platform}
                onChange={(e) => setSettings({...settings, platform: e.target.value})}
                disabled={scraping}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#43573b] disabled:opacity-50"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creator Type
              </label>
              <select
                value={settings.creatorType}
                onChange={(e) => setSettings({...settings, creatorType: e.target.value})}
                disabled={scraping}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#43573b] disabled:opacity-50"
              >
                <option value="">All Types</option>
                <option value="mega">Mega (1M+)</option>
                <option value="macro">Macro (100K-1M)</option>
                <option value="micro">Micro (10K-100K)</option>
                <option value="nano">Nano (1K-10K)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., India, US"
                value={settings.location}
                onChange={(e) => setSettings({...settings, location: e.target.value})}
                disabled={scraping}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#43573b] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                type="text"
                placeholder="e.g., English"
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                disabled={scraping}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#43573b] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleStartScraping}
              disabled={scraping}
              className="flex items-center gap-2 px-6 py-3 bg-[#43573b] text-white rounded-lg hover:bg-[#374829] disabled:opacity-50 transition-colors font-medium"
            >
              <Play className="h-5 w-5" />
              {scraping ? 'Scraping...' : 'Start Scraping'}
            </button>

            <button
              onClick={handleLoadFromStorage}
              disabled={scraping}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium"
            >
              Load from Storage
            </button>
          </div>
        </div>

        {/* Progress/Status */}
        {progress && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <p className="text-blue-700 font-medium">{progress}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Results Summary */}
        {scrapedData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-gray-600 text-sm font-medium">Total Influencers</p>
              <p className="text-3xl font-bold text-[#43573b] mt-2">
                {scrapedData.totalInfluencers}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-gray-600 text-sm font-medium">Pages Scraped</p>
              <p className="text-3xl font-bold text-[#43573b] mt-2">
                {scrapedData.pageData.length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-gray-600 text-sm font-medium">Scraped At</p>
              <p className="text-sm text-gray-700 mt-2">
                {new Date(scrapedData.scrapedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {scrapedData && scrapedData.allInfluencers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Export Data</h2>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5" />
                Export as CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5" />
                Export as JSON
              </button>
            </div>
          </div>
        )}

        {/* Data Preview Table */}
        {scrapedData && scrapedData.allInfluencers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Data Preview (First 10)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Followers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Engagement</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scrapedData.allInfluencers.slice(0, 10).map((influencer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{influencer.name}</td>
                      <td className="px-4 py-3 text-sm">{influencer.platform}</td>
                      <td className="px-4 py-3 text-sm">{influencer.followers}</td>
                      <td className="px-4 py-3 text-sm">{influencer.engagement_rate}</td>
                      <td className="px-4 py-3 text-sm">{influencer.primary_category?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
