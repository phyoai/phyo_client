'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftLine } from '@phyoofficial/phyo-icon-library'
import apiClient from '@/utils/api'

const NewApplicationsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaignId')
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allApplicants, setAllApplicants] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (campaignId) {
      fetchApplications(campaignId)
    } else {
      setIsLoading(false)
    }
  }, [campaignId])

  const fetchApplications = async (id) => {
    try {
      const response = await apiClient.get(`/campaigns/${id}/applications`)
      const applications = response.data.data || []
      // Transform API response to match component structure
      const transformedApplicants = applications.map((app, idx) => ({
        id: app.id || app._id,
        name: app.name || app.username || 'Unknown',
        avatar: (app.name || app.username || 'U').substring(0, 2).toUpperCase(),
        avatarColor: ['bg-green-500', 'bg-red-500', 'bg-teal-500', 'bg-red-400'][idx % 4],
        description: app.bio || app.description || 'No description',
        email: app.email || 'N/A',
        portfolio: app.website || 'N/A',
        followers: app.instagramFollowers || app.youtubeFollowers || 0,
        engagement: '4.8%',
        engagement_type: 'instagram',
        bio: app.bio || app.description || '',
        campaigns: 0,
        rating: 4.8,
      }))
      setAllApplicants(transformedApplicants)
      if (transformedApplicants.length > 0) {
        setSelectedApplicant(transformedApplicants[0])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setAllApplicants([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedApplicant || !campaignId) return

    setActionLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const influencerId = selectedApplicant.id
      const response = await apiClient.patch(
        `/campaigns/${campaignId}/applications/${influencerId}/approve`
      )

      if (response.data.success) {
        setSuccessMessage(`Application approved successfully!`)

        // Update local state to reflect the change
        const updatedApplicants = allApplicants.filter(app => app.id !== influencerId)
        setAllApplicants(updatedApplicants)
        setSelectedApplicant(updatedApplicants.length > 0 ? updatedApplicants[0] : null)

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error approving application:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to approve application')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectClick = () => {
    setShowRejectionModal(true)
  }

  const handleRejectConfirm = async () => {
    if (!selectedApplicant || !campaignId) return

    setActionLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const influencerId = selectedApplicant.id
      const response = await apiClient.patch(
        `/campaigns/${campaignId}/applications/${influencerId}/reject`,
        { reason: rejectionReason || 'Not specified' }
      )

      if (response.data.success) {
        setSuccessMessage(`Application rejected successfully!`)
        setShowRejectionModal(false)
        setRejectionReason('')

        // Update local state to reflect the change
        const updatedApplicants = allApplicants.filter(app => app.id !== influencerId)
        setAllApplicants(updatedApplicants)
        setSelectedApplicant(updatedApplicants.length > 0 ? updatedApplicants[0] : null)

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error rejecting application:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to reject application')
    } finally {
      setActionLoading(false)
    }
  }

  // Fallback mock data if no campaign ID provided
  const mockApplicants = [
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

  // Use fetched applicants if available, otherwise use mock data
  const displayApplicants = allApplicants.length > 0 ? allApplicants : mockApplicants

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
            {displayApplicants.map((applicant) => (
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
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Processing...' : 'Accept Application'}
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Processing...' : 'Reject Application'}
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

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Application
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Please provide a reason for rejecting this application (optional):
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#121212] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false)
                  setRejectionReason('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewApplicationsPage
