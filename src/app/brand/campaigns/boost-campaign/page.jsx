'use client'
import React, { useState } from 'react';
import { ArrowLeftLine, MoreLine, LineChartLine, UserLine, Clock, AlertCircle } from '@phyoofficial/phyo-icon-library';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Card from '@/components/Card';

export default function BoostCampaign() {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const recommendations = [
    {
      id: 1,
      title: 'Supercharge Campaign',
      description: 'Amplify reach and engagement with advanced boost options',
      badge: 'RECOMMENDED',
      badgeColor: 'bg-green-100 text-green-700',
      cardColor: 'bg-green-700',
      icon: '⚡'
    },
    {
      id: 2,
      title: 'Increase Budget',
      description: 'Allocate more funds to reach a wider audience',
      metric: '+50% reach',
      metricColor: 'text-green-600',
      label: 'Current Budget',
      current: '$50,000',
      rounded: 'Boosted',
      boosted: '$75,000',
      icon: '💰'
    },
    {
      id: 3,
      title: 'Add More Influencers',
      description: 'Collaborate with additional creators',
      metric: '+167% coverage',
      metricColor: 'text-blue-600',
      label: 'Current',
      current: '15',
      rounded: 'Rounded',
      boosted: '25',
      icon: '👥'
    },
    {
      id: 4,
      title: 'Extend Duration',
      description: 'Run campaign for additional 15 days',
      metric: '+250% exposure',
      metricColor: 'text-orange-600',
      label: 'Current',
      current: '30 days',
      rounded: 'Rounded',
      boosted: '45 days',
      icon: '⏱️'
    }
  ];

  const toggleOption = (id) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(optionId => optionId !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-base flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-base border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <IconButton
            icon={ArrowLeftLine}
            size="md"
            variant="default"
            className="-ml-2"
          />
          <h1 className="text-lg font-semibold text-gray-900">Boost Campaign</h1>
        </div>
        <IconButton
          icon={MoreLine}
          size="md"
          variant="default"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Supercharge Campaign - Featured Card */}
          <div className="bg-green-700 rounded-3xl p-6 text-white mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                ⚡
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1">Supercharge Campaign</h3>
                <p className="text-sm text-green-100">Amplify reach and engagement with advanced boost options</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
                RECOMMENDED
              </span>
              <span className="text-xs text-green-100">Based on campaign performance</span>
            </div>
          </div>

          {/* Option Cards */}
          {recommendations.slice(1).map((option) => (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                selectedOptions.includes(option.id)
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-neutral-base'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-1 ${
                  selectedOptions.includes(option.id)
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300'
                }`}>
                  {selectedOptions.includes(option.id) && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                    <span className={`text-xs font-bold whitespace-nowrap flex-shrink-0 ${option.metricColor}`}>
                      {option.metric}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="flex gap-8 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{option.label}</p>
                      <p className="font-semibold text-gray-900">{option.current}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{option.rounded}</p>
                      <p className="font-semibold text-gray-900">{option.boosted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-base border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="outlined"
            size="lg"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
          >
            Boost Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}