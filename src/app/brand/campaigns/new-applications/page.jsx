'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, MoreVertical, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import RejectionModal from '@/components/RejectionModal';
import NewApplicationsSkeleton from '@/components/NewApplicationsSkeleton';
import { campaignApi } from '@/api';

// This is fallback data that won't be used if API returns data
const fallbackApplicationsData = [
  {
    id: 1,
    name: 'Michael Smith',
    username: '@michaelsmith',
    bio: 'An innovative web developer skilled in HTML, CSS, and JavaScript. He thrives on solving complex problems and bringing ideas to life through code.',
    avatar: '/dummyAvatar.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 24,
      instagramFollowers: '222k',
      linkedinFollowers: '50k',
      xFollowers: '70k',
      youtubeSubscribers: '100k'
    },
    pricing: {
      instagram: {
        reel: '$500',
        story: '$200',
        post: '$350',
        carousel: '$400'
      },
      youtube: {
        video: '$1000',
        short: '$300',
        integration: '$800'
      },
      x: {
        post: '$150'
      },
      linkedin: {
        post: '$250'
      }
    },
    socials: {
      instagram: 'https://instagram.com/michaelsmith',
      youtube: 'https://youtube.com/@michaelsmith',
      x: 'https://x.com/michaelsmith',
      linkedin: 'https://linkedin.com/in/michaelsmith',
      website: 'https://michaelsmith.com'
    },
    memberSince: '16 June 2024',
    availabilityStatus: 'Available Now'
  },
  {
    id: 2,
    name: 'Sarah Lee',
    username: '@sarahlee',
    bio: 'A UX researcher dedicated to understanding user behavior and needs. She utilizes qualitative and quantitative methods to inform design decisions.',
    avatar: '/dummyAvatar1.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 18,
      instagramFollowers: '150k',
      linkedinFollowers: '35k',
      xFollowers: '50k',
      youtubeSubscribers: '75k'
    },
    pricing: {
      instagram: {
        reel: '$450',
        story: '$180',
        post: '$320',
        carousel: '$380'
      },
      youtube: {
        video: '$900',
        short: '$280',
        integration: '$750'
      },
      x: {
        post: '$140'
      },
      linkedin: {
        post: '$230'
      }
    },
    socials: {
      instagram: 'https://instagram.com/sarahlee',
      youtube: 'https://youtube.com/@sarahlee',
      x: 'https://x.com/sarahlee',
      linkedin: 'https://linkedin.com/in/sarahlee',
      website: 'https://sarahlee.com'
    },
    memberSince: '10 March 2024',
    availabilityStatus: 'Available Now'
  },
  {
    id: 3,
    name: 'David Chen',
    username: '@davidchen',
    bio: 'A content creator focused on lifestyle, fashion, and wellness. He collaborates with top brands and shares authentic experiences with his engaged audience.',
    avatar: '/dummyAvatar2.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 32,
      instagramFollowers: '280k',
      linkedinFollowers: '60k',
      xFollowers: '85k',
      youtubeSubscribers: '120k'
    },
    pricing: {
      instagram: {
        reel: '$550',
        story: '$220',
        post: '$400',
        carousel: '$460'
      },
      youtube: {
        video: '$1100',
        short: '$320',
        integration: '$880'
      },
      x: {
        post: '$165'
      },
      linkedin: {
        post: '$265'
      }
    },
    socials: {
      instagram: 'https://instagram.com/davidchen',
      youtube: 'https://youtube.com/@davidchen',
      x: 'https://x.com/davidchen',
      linkedin: 'https://linkedin.com/in/davidchen',
      website: 'https://davidchen.com'
    },
    memberSince: '8 April 2024',
    availabilityStatus: 'Available Now'
  }
];

// Actual page component - uses useSearchParams
const NewApplicationsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams?.get('campaignId') || null;

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch campaign applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!campaignId) {
          const campaignsResponse = await campaignApi.getBrandCampaigns(
            {},
            { page: 1, limit: 1 }
          );

          if (campaignsResponse.campaigns.length === 0) {
            setApplications([]);
            setIsLoading(false);
            return;
          }

          const firstCampaignId = campaignsResponse.campaigns[0].id;
          const response = await campaignApi.getCampaignApplications(
            firstCampaignId,
            { page, limit: 10 }
          );
          setApplications(response.applications || []);
          setPagination(response.pagination);
        } else {
          const response = await campaignApi.getCampaignApplications(
            campaignId,
            { page, limit: 10 }
          );
          setApplications(response.applications || []);
          setPagination(response.pagination);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err?.message || 'Failed to load applications');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [campaignId, page]);

  const handleBack = () => {
    router.push('/brand/campaigns');
  };

  const handlePortfolioClick = (application) => {
    setSelectedApplication(application);
    setActiveTab('info');
  };

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = async (reason) => {
    if (!selectedApplication || !campaignId) return;

    try {
      setActionLoading(selectedApplication.id);
      await campaignApi.rejectApplication(
        campaignId,
        selectedApplication.id,
        reason
      );

      setApplications(applications.filter(app => app.id !== selectedApplication.id));
      setShowRejectionModal(false);
      setSelectedApplication(null);

      console.log('Application rejected successfully');
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError(err?.message || 'Failed to reject application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication || !campaignId) return;

    try {
      setActionLoading(selectedApplication.id);
      await campaignApi.acceptApplication(
        campaignId,
        selectedApplication.id
      );

      setApplications(applications.filter(app => app.id !== selectedApplication.id));
      setSelectedApplication(null);

      console.log('Application accepted successfully');
    } catch (err) {
      console.error('Error accepting application:', err);
      setError(err?.message || 'Failed to accept application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollLeft > 0);
  };

  const handlePrevPage = () => {
    if (pagination?.currentPage > 1) {
      setPage(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.currentPage < pagination?.totalPages) {
      setPage(pagination.currentPage + 1);
    }
  };

  if (isLoading && applications.length === 0) {
    return <NewApplicationsSkeleton />;
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-[#e5e5e5] dark:border-[#2a2a2a] flex items-center justify-between px-8 py-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-[#333] dark:text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">New Applications</h1>
            <p className="text-sm text-[#666] dark:text-[#999]">{applications.length} creators applied</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Applications List */}
        <div className="w-1/3 border-r border-[#e5e5e5] dark:border-[#2a2a2a] overflow-y-auto bg-white dark:bg-[#1a1a1a]">
          {error && (
            <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">{error}</h3>
              </div>
            </div>
          )}

          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
              <div className="text-center">
                <p className="text-[#666] dark:text-[#999]">No applications yet</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#e5e5e5] dark:divide-[#2a2a2a]">
              {applications.map((application) => (
                <div
                  key={application.id}
                  onClick={() => handlePortfolioClick(application)}
                  className={`p-4 cursor-pointer transition-all hover:bg-[#f9f9f9] dark:hover:bg-[#252525] ${
                    selectedApplication?.id === application.id
                      ? 'bg-[#f0f0f0] dark:bg-[#2a2a2a] border-l-4 border-[#5B21B6]'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={application.avatar || '/dummyAvatar.jpg'}
                      alt={application.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1a1a1a] dark:text-white truncate">{application.name}</h3>
                      <p className="text-sm text-[#666] dark:text-[#999] truncate">{application.username}</p>
                      <p className="text-xs text-[#999] dark:text-[#666] mt-1">Applied recently</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-[#e5e5e5] dark:border-[#2a2a2a] p-4 flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 rounded-lg bg-[#f0f0f0] dark:bg-[#2a2a2a] text-sm font-medium disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-[#666] dark:text-[#999]">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 rounded-lg bg-[#f0f0f0] dark:bg-[#2a2a2a] text-sm font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedApplication ? (
          <div className="flex-1 overflow-y-auto bg-white dark:bg-[#121212]">
            <div className="sticky top-0 z-20 bg-white dark:bg-[#1a1a1a] border-b border-[#e5e5e5] dark:border-[#2a2a2a]">
              <div className="flex items-center justify-between p-6">
                <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white">{selectedApplication.name}</h2>
                <button className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] rounded-lg">
                  <MoreVertical size={20} className="text-[#666] dark:text-[#999]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
                {['info', 'portfolio', 'pricing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'text-[#5B21B6] border-b-2 border-[#5B21B6]'
                        : 'text-[#666] dark:text-[#999] border-b-2 border-transparent'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-2">Profile Picture</h3>
                    <Image
                      src={selectedApplication.avatar || '/dummyAvatar.jpg'}
                      alt={selectedApplication.name}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-2">Bio</h3>
                    <p className="text-[#666] dark:text-[#999]">{selectedApplication.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#999] dark:text-[#666]">Member Since</p>
                      <p className="font-semibold text-[#1a1a1a] dark:text-white">{selectedApplication.memberSince}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#999] dark:text-[#666]">Status</p>
                      <p className="font-semibold text-[#1a1a1a] dark:text-white">{selectedApplication.availabilityStatus}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-3">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedApplication.stats).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-4 bg-[#f9f9f9] dark:bg-[#2a2a2a] rounded-lg"
                        >
                          <p className="text-sm text-[#999] dark:text-[#666] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-semibold text-[#1a1a1a] dark:text-white mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-3">Social Links</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedApplication.socials).map(([platform, link]) => (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 bg-[#f9f9f9] dark:bg-[#2a2a2a] rounded-lg hover:bg-[#e5e5e5] dark:hover:bg-[#3a3a3a] text-[#5B21B6] text-sm transition-colors capitalize"
                        >
                          {platform}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="text-center py-12">
                  <p className="text-[#666] dark:text-[#999]">Portfolio content coming soon</p>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  {Object.entries(selectedApplication.pricing).map(([platform, rates]) => (
                    <div key={platform}>
                      <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-3 capitalize">{platform}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {typeof rates === 'object'
                          ? Object.entries(rates).map(([service, price]) => (
                              <div key={service} className="p-3 bg-[#f9f9f9] dark:bg-[#2a2a2a] rounded-lg">
                                <p className="text-sm text-[#666] dark:text-[#999] capitalize">{service}</p>
                                <p className="font-semibold text-[#1a1a1a] dark:text-white">{price}</p>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-[#e5e5e5] dark:border-[#2a2a2a] p-6 flex gap-4">
              <button
                onClick={handleReject}
                disabled={actionLoading === selectedApplication?.id}
                className="flex-1 px-6 py-3 border-2 border-[#e5e5e5] dark:border-[#2a2a2a] rounded-lg font-medium text-[#666] dark:text-[#999] hover:bg-[#f9f9f9] dark:hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedApplication?.id ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading === selectedApplication?.id}
                className="flex-1 px-6 py-3 bg-[#5B21B6] text-white rounded-lg font-medium hover:bg-[#4a1b94] transition-colors disabled:opacity-50"
              >
                {actionLoading === selectedApplication?.id ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#121212]">
            <p className="text-[#999] dark:text-[#666]">Select an application to view details</p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleRejectConfirm}
        creatorName={selectedApplication?.name}
      />
    </div>
  );
};

// Wrapper component with Suspense boundary to handle useSearchParams
export default function NewApplicationsPage() {
  return (
    <Suspense fallback={<NewApplicationsSkeleton />}>
      <NewApplicationsPageContent />
    </Suspense>
  );
}
