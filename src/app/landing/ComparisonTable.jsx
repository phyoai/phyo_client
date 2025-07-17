import React from 'react';

const ComparisonTable = () => {
  const comparisonData = [
    {
      feature: "Turnaround Time",
      others: "1-2 days for campaign completion",
      phyo: "30-minute campaign setup and execution"
    },
    {
      feature: "Data Sources",
      others: "Outdated or estimated data",
      phyo: "Real-time data via Meta & Google partnerships"
    },
    {
      feature: "Influencer Analytics",
      others: "Basic follower/engagement metrics",
      phyo: "In-depth analytics (ROI, virality, content affinity)"
    },
    {
      feature: "Content Affinity Insights",
      others: "Not available",
      phyo: "Analyzes audience preferences for content types"
    },
    {
      feature: "AI Matchmaking",
      others: "Manual searches or basic filters",
      phyo: "AI-driven recommendations based on brands"
    },
    {
      feature: "Influencer Database",
      others: "Limited creators (under 50k)",
      phyo: "300,000+ vetted influencers globally"
    },
    {
      feature: "Global Reach",
      others: "Limited to local markets",
      phyo: "Influencers across 15+ countries"
    },
    {
      feature: "Performance Estimation",
      others: "No predictive tools",
      phyo: "Predicts campaign success with AI"
    },
    {
      feature: "Campaign Reports",
      others: "Basic engagement summaries",
      phyo: "Detailed reports (ROI, audience sentiment, platform-wise sharing)"
    },
    {
      feature: "Language Support",
      others: "Limited to major languages",
      phyo: "Supports 95+ languages for global campaigns"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Comparison
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            Comparison Reveals
            <br />
            Differences And Similarities.
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-md shadow-xl overflow-hidden border border-gray-100">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-green-50">
            <div className="p-6 font-bold text-lg text-gray-900 border-r border-gray-200">
              Feature
            </div>
            <div className="p-6 font-bold text-lg text-center text-gray-700 border-r border-gray-200 bg-green-100">
              Other Platforms
            </div>
            <div className="p-6 font-bold text-lg text-center text-gray-900 bg-green-200">
              Phyo
            </div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <div className="p-6 font-semibold text-gray-900 border-r border-gray-200">
                {row.feature}
              </div>
              <div className="p-6 text-center text-gray-600 border-r border-gray-200 bg-green-50/50">
                {row.others}
              </div>
              <div className="p-6 text-center text-gray-800 font-medium bg-green-100/50">
                {row.phyo}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ComparisonTable;