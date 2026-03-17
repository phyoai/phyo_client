'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftLine } from '@phyoofficial/phyo-icon-library'

const NewApplicationsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for all applicants
  const allApplicants = [
    {
      id: 1,
      name: 'Michael Smith',
      avatar: 'MS',
      avatarColor: 'bg-green-500',
      description: 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex problems and bringing ideas t...',
      email: 'michael.smith@email.com',
      portfolio: 'https://michaelsmith.dev',
      followers: 45000,
      engagement: '4.8%',
      engagement_type: 'instagram',
      bio: 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex problems and bringing ideas to life. With a passion for clean code and user-centric design, Michael brings both technical expertise and creative thinking to every project.',
      campaigns: 12,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Sarah Lee',
      avatar: 'SL',
      avatarColor: 'bg-red-500',
      description: 'A UX researcher dedicated to understanding user behavior and needs. She utilizes qualitative and quantitative methods to infor...',
      email: 'sarah.lee@email.com',
      portfolio: 'https://sarahlee.design',
      followers: 32000,
      engagement: '5.2%',
      engagement_type: 'twitter',
      bio: 'A UX researcher dedicated to understanding user behavior and needs. She utilizes qualitative and quantitative methods to inform strategic design decisions. Sarah excels at translating complex user insights into actionable design improvements.',
      campaigns: 8,
      rating: 4.9,
    },
    {
      id: 3,
      name: 'David Chen',
      avatar: 'DC',
      avatarColor: 'bg-teal-500',
      description: 'A digital marketer with a focus on brand strategy and social media engagement. He enjoys crafting compelling narratives that r...',
      email: 'david.chen@email.com',
      portfolio: 'https://davidchen.marketing',
      followers: 58000,
      engagement: '6.1%',
      engagement_type: 'instagram',
      bio: 'A digital marketer with a focus on brand strategy and social media engagement. He enjoys crafting compelling narratives that resonate with audiences. David brings both data-driven insights and creative storytelling to every campaign.',
      campaigns: 24,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Emma Garcia',
      avatar: 'EG',
      avatarColor: 'bg-red-400',
      description: 'A product manager with a strong background in agile methodologies. She excels at aligning cross-functional teams to deliver e...',
      email: 'emma.garcia@email.com',
      portfolio: 'https://emmagarcia.tech',
      followers: 27000,
      engagement: '3.9%',
      engagement_type: 'linkedin',
      bio: 'A product manager with a strong background in agile methodologies. She excels at aligning cross-functional teams to deliver excellent results. Emma combines strategic thinking with hands-on execution to drive product success.',
      campaigns: 15,
      rating: 4.6,
    },
  ]

  useEffect(() => {
    const applicantParam = searchParams.get('applicant')
    if (applicantParam) {
      try {
        const applicant = JSON.parse(decodeURIComponent(applicantParam))
        // Merge with full data
        const fullApplicant = allApplicants.find(a => a.id === applicant.id) || applicant
        setSelectedApplicant(fullApplicant)
      } catch (err) {
        console.error('Failed to parse applicant data:', err)
      }
    }
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full max-w-[1280px] min-w-[1024px] pt-6 bg-white dark:bg-[#121212] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeftLine size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold">New Applications</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Applicants List */}
        <div className="lg:col-span-1">
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {allApplicants.map((applicant) => (
              <div
                key={applicant.id}
                onClick={() => setSelectedApplicant(applicant)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedApplicant?.id === applicant.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${applicant.avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{applicant.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {applicant.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {applicant.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applicant Details */}
        <div className="lg:col-span-2">
          {selectedApplicant ? (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header with Avatar and Basic Info */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className={`w-20 h-20 rounded-full ${selectedApplicant.avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-2xl">{selectedApplicant.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedApplicant.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {selectedApplicant.email}
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {(selectedApplicant.followers / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedApplicant.engagement}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                        <p className="text-lg font-semibold text-yellow-500">
                          ⭐ {selectedApplicant.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Campaigns</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedApplicant.campaigns}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {selectedApplicant.bio}
                </p>
              </div>

              {/* Details Grid */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Primary Platform</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {selectedApplicant.engagement_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Portfolio</p>
                    <a
                      href={selectedApplicant.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate"
                    >
                      View Portfolio
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 flex gap-3">
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Accept Application
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Reject Application
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 p-12 flex items-center justify-center min-h-[500px]">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Select an applicant from the list to view their details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewApplicationsPage
