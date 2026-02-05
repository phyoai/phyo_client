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
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    // Cover image (271px) + Profile section (~350px) = ~620px
    setIsScrolled(scrollTop > 550);
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
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedApplication ? (
            <div className="flex flex-col h-full">
              {/* Scrollable Top Section */}
              <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
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
                <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                  {/* Compact Header - Only visible when scrolled */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-100 ${
                      isScrolled ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <h2 className={`text-lg font-semibold text-[#242527] transition-all duration-300 ${
                          isScrolled ? 'translate-y-0' : '-translate-y-2'
                        }`}>
                          {selectedApplication.name}
                        </h2>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 bg-[#02b523] text-white rounded-full text-xs font-medium transition-all duration-300 delay-75 ${
                          isScrolled ? 'translate-y-0 scale-100' : '-translate-y-2 scale-95'
                        }`}>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          Available Now
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300 delay-100 hover:scale-110 ${
                          isScrolled ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                        }`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#242527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#242527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300 delay-150 hover:scale-110 ${
                          isScrolled ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                        }`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M8 9H16M8 13H12M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" stroke="#242527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`flex-1 pb-4 text-sm font-semibold border-b-2 transition-colors ${
                        activeTab === 'info'
                          ? 'border-[#43573b] text-[#43573b]'
                          : 'border-transparent text-[#808080] hover:text-[#242527]'
                      }`}
                    >
                      Info
                    </button>
                    <button
                      onClick={() => setActiveTab('best-works')}
                      className={`flex-1 pb-4 text-sm font-semibold border-b-2 transition-colors ${
                        activeTab === 'best-works'
                          ? 'border-[#43573b] text-[#43573b]'
                          : 'border-transparent text-[#808080] hover:text-[#242527]'
                      }`}
                    >
                      Best Works
                    </button>
                    <button
                      onClick={() => setActiveTab('collaborations')}
                      className={`flex-1 pb-4 text-sm font-semibold border-b-2 transition-colors ${
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
                <div className="px-4 py-4 pb-32">
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="py-4">
                      <h3 className="text-base font-semibold text-[#505152] mb-3">Stats</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base text-[#505152]">Brand Collaborations</span>
                          <span className="text-base font-semibold text-[#242527]">{selectedApplication.stats.brandCollaborations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-[#505152]">Instagram Followers</span>
                          <span className="text-base font-semibold text-[#242527]">{selectedApplication.stats.instagramFollowers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-[#505152]">LinkedIn Followers</span>
                          <span className="text-base font-semibold text-[#242527]">{selectedApplication.stats.linkedinFollowers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-[#505152]">X Followers</span>
                          <span className="text-base font-semibold text-[#242527]">{selectedApplication.stats.xFollowers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-[#505152]">Youtube Subscribers</span>
                          <span className="text-base font-semibold text-[#242527]">{selectedApplication.stats.youtubeSubscribers}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Deliverables */}
                    <div className="py-4">
                      <h3 className="text-base font-semibold text-[#505152] mb-3">Pricing & Deliverables</h3>
                      <div className="space-y-4">
                        {/* Instagram */}
                        <div className="border border-[rgba(36,37,39,0.12)] rounded-xl overflow-hidden">
                          <div className="flex items-center px-6 py-3 bg-white">
                            <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#242527"/>
                            </svg>
                            <span className="text-base font-semibold text-[#242527]">Instagram</span>
                          </div>
                          <div className="border-t border-[rgba(36,37,39,0.12)]">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(36,37,39,0.12)]">
                              <span className="text-base font-semibold text-[#242527]">Feed Post</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.instagram.post}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(36,37,39,0.12)]">
                              <span className="text-base font-semibold text-[#242527]">Reel (30-60s)</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.instagram.reel}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(36,37,39,0.12)]">
                              <span className="text-base font-semibold text-[#242527]">Story (3 frames)</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.instagram.story}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-base font-semibold text-[#242527]">Carousel</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.instagram.carousel}</span>
                            </div>
                          </div>
                        </div>

                        {/* YouTube */}
                        <div className="border border-[rgba(36,37,39,0.12)] rounded-xl overflow-hidden w-[375px]">
                          <div className="flex items-center px-6 py-3 bg-white">
                            <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="none">
                              <path d="M19.606 6.995C19.53 6.697 19.314 6.472 19.067 6.403C18.63 6.28 16.5 6 12 6C7.5 6 5.37 6.28 4.933 6.403C4.686 6.472 4.47 6.697 4.394 6.995C4.285 7.419 4 9.196 4 12C4 14.804 4.285 16.581 4.394 17.005C4.47 17.303 4.686 17.528 4.933 17.597C5.37 17.72 7.5 18 12 18C16.5 18 18.63 17.72 19.067 17.597C19.314 17.528 19.53 17.303 19.606 17.005C19.715 16.581 20 14.804 20 12C20 9.196 19.715 7.419 19.606 6.995ZM10 15V9L15 12L10 15Z" fill="#242527"/>
                            </svg>
                            <span className="text-base font-semibold text-[#242527]">Youtube</span>
                          </div>
                          <div className="border-t border-[rgba(36,37,39,0.12)]">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(36,37,39,0.12)]">
                              <span className="text-base font-semibold text-[#242527]">Dedicated Video</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.youtube.video}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(36,37,39,0.12)]">
                              <span className="text-base font-semibold text-[#242527]">Integrated Mention</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.youtube.integration}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-base font-semibold text-[#242527]">Short</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.youtube.short}</span>
                            </div>
                          </div>
                        </div>

                        {/* X (Twitter) */}
                        <div className="border border-[rgba(36,37,39,0.12)] rounded-xl overflow-hidden w-[375px]">
                          <div className="flex items-center px-6 py-3 bg-white">
                            <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="none">
                              <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="#242527"/>
                            </svg>
                            <span className="text-base font-semibold text-[#242527]">X (twitter)</span>
                          </div>
                          <div className="border-t border-[rgba(36,37,39,0.12)]">
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-base font-semibold text-[#242527]">Single Post</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.x.post}</span>
                            </div>
                          </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="border border-[rgba(36,37,39,0.12)] rounded-xl overflow-hidden w-[375px]">
                          <div className="flex items-center px-6 py-3 bg-white">
                            <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="none">
                              <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="#242527"/>
                            </svg>
                            <span className="text-base font-semibold text-[#242527]">Linkedin</span>
                          </div>
                          <div className="border-t border-[rgba(36,37,39,0.12)]">
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-base font-semibold text-[#242527]">Single Post</span>
                              <span className="text-base font-semibold text-[#242527]">{selectedApplication.pricing.linkedin.post}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Socials */}
                    <div>
                      <h3 className="text-base font-semibold text-[#505152] mb-3">Socials</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedApplication.socials).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-base font-semibold text-[#242527] capitalize">{platform}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M6 18L18 6M18 6H10M18 6V14" stroke="#808080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Other Info */}
                    <div className="pt-4">
                      <p className="text-base font-semibold text-[#505152] mb-4">Member Since: {selectedApplication.memberSince}</p>
                      <button className="text-base text-[#505152] hover:text-[#242527]">Report</button>
                    </div>
                  </div>
                )}

                {activeTab === 'best-works' && (
                  <div className="space-y-4 py-4">
                    {/* Card 1 */}
                    <div className="relative border-2 border-white rounded-xl overflow-hidden flex flex-col justify-between p-4 h-[240px]">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/world-bg.png')" }}
                      />
                      <div className="absolute inset-0 bg-[rgba(36,37,39,0.24)]" />
                      <div className="absolute inset-0 backdrop-blur-[2px]" />
                      
                      <div className="relative flex gap-3 items-start">
                        <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-semibold text-[#b3c8f3]">AB</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#fdf9ef] mb-1 leading-7">
                            Realme Campaign
                          </h3>
                          <p className="text-base text-[#fdf9ef] leading-6">
                            Realme15 Pro
                          </p>
                        </div>
                      </div>
                      
                      {/* <button className="relative border border-[#43573b] rounded-full px-4 py-2 flex items-center justify-center gap-1 w-[104px] bg-transparent hover:bg-[#43573b] transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 14.1667C12.3012 14.1667 14.1667 12.3012 14.1667 10C14.1667 7.69885 12.3012 5.83334 10 5.83334C7.69885 5.83334 5.83334 7.69885 5.83334 10C5.83334 12.3012 7.69885 14.1667 10 14.1667Z" stroke="#43573b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
                          <path d="M10 1.66666V3.33332M10 16.6667V18.3333M3.33334 10H1.66667M18.3333 10H16.6667M15.8333 15.8333L14.6417 14.6417M15.8333 4.16666L14.6417 5.35832M4.16667 15.8333L5.35834 14.6417M4.16667 4.16666L5.35834 5.35832" stroke="#43573b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
                        </svg>
                        <span className="text-sm font-medium text-[#43573b] group-hover:text-white">View</span>
                      </button> */}
                    </div>

                    {/* Card 2 */}
                    <div className="relative border-2 border-white rounded-xl overflow-hidden flex flex-col justify-between p-4 h-[240px]">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/world-bg.png')" }}
                      />
                      <div className="absolute inset-0 bg-[rgba(36,37,39,0.24)]" />
                      <div className="absolute inset-0 backdrop-blur-[2px]" />
                      
                      <div className="relative flex gap-3 items-start">
                        <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-semibold text-[#b3c8f3]">NK</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#fdf9ef] mb-1 leading-7">
                            Nike Air Max
                          </h3>
                          <p className="text-base text-[#fdf9ef] leading-6">
                            Shoe Campaign
                          </p>
                        </div>
                      </div>
                      
                      {/* <button className="relative border border-[#43573b] rounded-full px-4 py-2 flex items-center justify-center gap-1 w-[104px] bg-transparent hover:bg-[#43573b] transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 14.1667C12.3012 14.1667 14.1667 12.3012 14.1667 10C14.1667 7.69885 12.3012 5.83334 10 5.83334C7.69885 5.83334 5.83334 7.69885 5.83334 10C5.83334 12.3012 7.69885 14.1667 10 14.1667Z" stroke="#43573b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
                          <path d="M10 1.66666V3.33332M10 16.6667V18.3333M3.33334 10H1.66667M18.3333 10H16.6667M15.8333 15.8333L14.6417 14.6417M15.8333 4.16666L14.6417 5.35832M4.16667 15.8333L5.35834 14.6417M4.16667 4.16666L5.35834 5.35832" stroke="#43573b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
                        </svg>
                        <span className="text-sm font-medium text-[#43573b] group-hover:text-white">View</span>
                      </button> */}
                    </div>

                    {/* Card 3 */}
                    <div className="relative border-2 border-white rounded-xl overflow-hidden flex flex-col justify-between p-4 h-[240px]">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/world-bg.png')" }}
                      />
                      <div className="absolute inset-0 bg-[rgba(36,37,39,0.24)]" />
                      <div className="absolute inset-0 backdrop-blur-[2px]" />
                      
                      <div className="relative flex gap-3 items-start">
                        <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-semibold text-[#b3c8f3]">AP</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#fdf9ef] mb-1 leading-7">
                            Apple Watch
                          </h3>
                          <p className="text-base text-[#fdf9ef] leading-6">
                            Series 9 Launch
                          </p>
                        </div>
                      </div>
                      
                      {/* <button className="relative border border-[#43573b] rounded-full px-4 py-2 flex items-center justify-center gap-1 w-[104px] bg-transparent hover:bg-[#43573b] transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 14.1667C12.3012 14.1667 14.1667 12.3012 14.1667 10C14.1667 7.69885 12.3012 5.83334 10 5.83334C7.69885 5.83334 5.83334 7.69885 5.83334 10C5.83334 12.3012 7.69885 14.1667 10 14.1667Z" stroke="#43573b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
                          <path d="M10 1.66666V3.33332M10 16.6667V18.3333M3.33334 10H1.66667M18.3333 10H16.6667M15.8333 15.8333L14.6417 14.6417M15.8333 4.16666L14.6417 5.35832M4.16667 15.8333L5.35834 14.6417M4.16667 4.16666L5.35834 5.35832" stroke="#43573b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
                        </svg>
                        <span className="text-sm font-medium text-[#43573b] group-hover:text-white">View</span>
                      </button> */}
                    </div>
                  </div>
                )}

                {activeTab === 'collaborations' && (
                  <div className="space-y-4 py-4">
                    {/* Collaboration Card 1 */}
                    <div className="bg-[#f0f0f0] border-2 border-white rounded-xl p-4 flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-semibold text-[#b3c8f3]">ED</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-[#242527] mb-1 leading-7">
                          EcoDrive
                        </h3>
                        <p className="text-base text-[#333] leading-6">
                          A sustainable driving experience platform connecting users with eco-friendly vehicles.
                        </p>
                      </div>
                    </div>

                    {/* Collaboration Card 2 */}
                    <div className="bg-[#f0f0f0] border-2 border-white rounded-xl p-4 flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-semibold text-[#b3c8f3]">FT</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-[#242527] mb-1 leading-7">
                          FitTrack
                        </h3>
                        <p className="text-base text-[#333] leading-6">
                          Your personal fitness companion that helps you track workouts and achieve your health goals.
                        </p>
                      </div>
                    </div>

                    {/* Collaboration Card 3 */}
                    <div className="bg-[#f0f0f0] border-2 border-white rounded-xl p-4 flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-semibold text-[#b3c8f3]">TC</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-[#242527] mb-1 leading-7">
                          TechConnect
                        </h3>
                        <p className="text-base text-[#333] leading-6">
                          Bridging the gap between technology enthusiasts and cutting-edge innovations in the digital world.
                        </p>
                      </div>
                    </div>

                    {/* Collaboration Card 4 */}
                    <div className="bg-[#f0f0f0] border-2 border-white rounded-xl p-4 flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0b4fd9] flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-semibold text-[#b3c8f3]">GS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-[#242527] mb-1 leading-7">
                          GreenSpace
                        </h3>
                        <p className="text-base text-[#333] leading-6">
                          Creating urban gardens and promoting sustainable living through community-driven environmental initiatives.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              </div>

              {/* Sticky Action Buttons */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-white shrink-0">
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
