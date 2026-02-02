'use client'
import React, { useState } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RejectionModal from '@/components/RejectionModal';

const applicationsData = [
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
    bio: 'A digital marketer with a focus on brand strategy and social media engagement. He enjoys crafting compelling narratives that resonate with audiences.',
    avatar: '/dummyAvatar1 2.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 32,
      instagramFollowers: '300k',
      linkedinFollowers: '60k',
      xFollowers: '90k',
      youtubeSubscribers: '120k'
    },
    pricing: {
      instagram: {
        reel: '$600',
        story: '$250',
        post: '$450',
        carousel: '$500'
      },
      youtube: {
        video: '$1200',
        short: '$350',
        integration: '$950'
      },
      x: {
        post: '$180'
      },
      linkedin: {
        post: '$280'
      }
    },
    socials: {
      instagram: 'https://instagram.com/davidchen',
      youtube: 'https://youtube.com/@davidchen',
      x: 'https://x.com/davidchen',
      linkedin: 'https://linkedin.com/in/davidchen',
      website: 'https://davidchen.com'
    },
    memberSince: '5 January 2024',
    availabilityStatus: 'Available Now'
  },
  {
    id: 4,
    name: 'Emma Garcia',
    username: '@emmagarcia',
    bio: 'A product manager with a strong background in agile methodologies. She excels at aligning cross-functional teams to deliver exceptional products.',
    avatar: '/dummyAvatar.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 20,
      instagramFollowers: '180k',
      linkedinFollowers: '45k',
      xFollowers: '60k',
      youtubeSubscribers: '85k'
    },
    pricing: {
      instagram: {
        reel: '$480',
        story: '$190',
        post: '$330',
        carousel: '$390'
      },
      youtube: {
        video: '$950',
        short: '$290',
        integration: '$780'
      },
      x: {
        post: '$145'
      },
      linkedin: {
        post: '$240'
      }
    },
    socials: {
      instagram: 'https://instagram.com/emmagarcia',
      youtube: 'https://youtube.com/@emmagarcia',
      x: 'https://x.com/emmagarcia',
      linkedin: 'https://linkedin.com/in/emmagarcia',
      website: 'https://emmagarcia.com'
    },
    memberSince: '22 February 2024',
    availabilityStatus: 'Available Now'
  },
  {
    id: 5,
    name: 'James Brown',
    username: '@jamesbrown',
    bio: 'A content strategist who specializes in creating impactful copy and storytelling. He believes in the power of words to drive engagement and conversion.',
    avatar: '/dummyAvatar1 2.jpg',
    coverImage: '/world-bg.png',
    stats: {
      brandCollaborations: 28,
      instagramFollowers: '250k',
      linkedinFollowers: '55k',
      xFollowers: '80k',
      youtubeSubscribers: '110k'
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
      instagram: 'https://instagram.com/jamesbrown',
      youtube: 'https://youtube.com/@jamesbrown',
      x: 'https://x.com/jamesbrown',
      linkedin: 'https://linkedin.com/in/jamesbrown',
      website: 'https://jamesbrown.com'
    },
    memberSince: '8 April 2024',
    availabilityStatus: 'Available Now'
  }
];

const NewApplicationsPage = () => {
  const router = useRouter();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

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

  const handleRejectConfirm = (reason) => {
    // TODO: Implement reject logic with reason
    console.log('Reject application:', selectedApplication?.id, 'Reason:', reason);
    setShowRejectionModal(false);
    // You can add additional logic here like showing a success message
    // or navigating away after rejection
  };

  const handleApprove = () => {
    // TODO: Implement approve logic
    console.log('Approve application:', selectedApplication?.id);
  };

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      {/* App Bar */}
      <div className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-100 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-xl font-semibold text-[#242527] flex-1 px-2">
          New Applications
        </h1>

        <button
          type="button"
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-8 overflow-hidden px-9 py-4">
        {/* Applications List */}
        <div className="flex flex-col w-full max-w-[450px] overflow-y-auto">
          {applicationsData.map((application) => (
            <div
              key={application.id}
              className="bg-white flex items-center py-3 border-b border-gray-100"
            >
              {/* Avatar */}
              <div className="flex items-center px-4 py-1.5 shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-green-500">
                  <Image
                    src={application.avatar}
                    alt={application.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pr-4 py-3 min-w-0">
                <h3 className="text-base font-semibold text-[#242527] truncate">
                  {application.name}
                </h3>
                <p className="text-sm text-[#808080] line-clamp-2">
                  {application.bio}
                </p>
              </div>

              {/* Portfolio Button */}
              <div className="flex items-center px-4 py-3.5 shrink-0">
                <button
                  onClick={() => handlePortfolioClick(application)}
                  className="px-4 py-2 border border-[#43573b] text-[#43573b] rounded-full text-sm font-medium hover:bg-[#43573b] hover:text-white transition-colors"
                >
                  portfolio
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 shrink-0" />

        {/* Portfolio Panel */}
        <div className="flex-1 overflow-y-auto">
          {selectedApplication ? (
            <div className="flex flex-col h-full">
              {/* Cover Image */}
              <div className="relative h-[271px] w-full overflow-hidden bg-gradient-to-r from-orange-400 via-yellow-500 to-pink-500">
                <Image
                  src={selectedApplication.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover opacity-80"
                />
              </div>

              {/* Profile Section */}
              <div className="relative -mt-24 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                    <Image
                      src={selectedApplication.avatar}
                      alt={selectedApplication.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-3xl font-bold text-[#242527]">
                      {selectedApplication.name}
                    </h2>
                    <p className="text-base text-[#808080] mt-1">
                      {selectedApplication.username}
                    </p>
                    
                    <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-[#02b523] text-white rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-white rounded-full" />
                      {selectedApplication.availabilityStatus}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mt-6">
                    <button className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#242527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#242527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-[#242527]">Profile</span>
                    </button>
                    <button className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M8 9H16M8 13H12M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" stroke="#242527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-[#242527]">Message</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-8 px-8">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'info'
                        ? 'border-[#43573b] text-[#43573b]'
                        : 'border-transparent text-[#808080] hover:text-[#242527]'
                    }`}
                  >
                    Info
                  </button>
                  <button
                    onClick={() => setActiveTab('best-works')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'best-works'
                        ? 'border-[#43573b] text-[#43573b]'
                        : 'border-transparent text-[#808080] hover:text-[#242527]'
                    }`}
                  >
                    Best Works
                  </button>
                  <button
                    onClick={() => setActiveTab('collaborations')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'collaborations'
                        ? 'border-[#43573b] text-[#43573b]'
                        : 'border-transparent text-[#808080] hover:text-[#242527]'
                    }`}
                  >
                    Collaborations
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {activeTab === 'info' && (
                  <div className="space-y-8">
                    {/* Stats */}
                    <div>
                      <h3 className="text-base font-semibold text-[#242527] mb-4">Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#242527]">Brand Collaborations</span>
                          <span className="text-sm font-semibold text-[#242527]">{selectedApplication.stats.brandCollaborations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#242527]">Instagram Followers</span>
                          <span className="text-sm font-semibold text-[#242527]">{selectedApplication.stats.instagramFollowers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#242527]">LinkedIn Followers</span>
                          <span className="text-sm font-semibold text-[#242527]">{selectedApplication.stats.linkedinFollowers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#242527]">X Followers</span>
                          <span className="text-sm font-semibold text-[#242527]">{selectedApplication.stats.xFollowers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#242527]">Youtube Subscribers</span>
                          <span className="text-sm font-semibold text-[#242527]">{selectedApplication.stats.youtubeSubscribers}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Deliverables */}
                    <div>
                      <h3 className="text-base font-semibold text-[#242527] mb-4">Pricing & Deliverables</h3>
                      
                      {/* Instagram */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#242527] mb-3 px-4 py-2 bg-gray-50 rounded-lg">Instagram</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Reel</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.instagram.reel}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Story</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.instagram.story}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Post</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.instagram.post}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Carousel</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.instagram.carousel}</span>
                          </div>
                        </div>
                      </div>

                      {/* YouTube */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#242527] mb-3 px-4 py-2 bg-gray-50 rounded-lg">Youtube</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Video</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.youtube.video}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Short</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.youtube.short}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Integration</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.youtube.integration}</span>
                          </div>
                        </div>
                      </div>

                      {/* X (Twitter) */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#242527] mb-3 px-4 py-2 bg-gray-50 rounded-lg">X (twitter)</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Post</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.x.post}</span>
                          </div>
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#242527] mb-3 px-4 py-2 bg-gray-50 rounded-lg">linkedin</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#808080]">Post</span>
                            <span className="text-sm font-medium text-[#242527]">{selectedApplication.pricing.linkedin.post}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Socials */}
                    <div>
                      <h3 className="text-base font-semibold text-[#242527] mb-4">Socials</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedApplication.socials).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm text-[#242527] capitalize">{platform}</span>
                            <svg className="ml-auto" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 15L15 5M15 5H9M15 5V11" stroke="#808080" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Other Info */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-[#242527] mb-3">Member Since: {selectedApplication.memberSince}</p>
                      <button className="text-sm text-red-600 hover:text-red-700">Report</button>
                    </div>
                  </div>
                )}

                {activeTab === 'best-works' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Best works will be displayed here</p>
                  </div>
                )}

                {activeTab === 'collaborations' && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Past collaborations will be displayed here</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-white sticky bottom-0">
                <button
                  onClick={handleReject}
                  className="flex-1 px-6 py-3 border border-[#43573b] text-[#43573b] rounded-full font-semibold hover:bg-[#43573b] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.67"/>
                    <path d="M13 7L7 13M7 7L13 13" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round"/>
                  </svg>
                  reject
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 px-6 py-3 bg-[#43573b] text-white rounded-full font-semibold hover:bg-[#3a4a32] transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.67"/>
                    <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approve
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-[#f0f0f0] rounded-lg">
              <div className="text-center">
                <Image
                  src="/logo.png"
                  alt="Phyo Logo"
                  width={286}
                  height={74}
                  className="mb-4 opacity-50"
                />
                <p className="text-lg font-semibold text-[#808080]">
                  A PyroMedia Product
                </p>
              </div>
            </div>
          )}
        </div>
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

export default NewApplicationsPage;
