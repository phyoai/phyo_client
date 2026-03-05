'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, Mic, MoreVertical, MessageSquare, UserPlus, Info, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookmarkLine, InstagramFill, InstagramLine, Message3Line, TwitterXLine, UserAddLine, YoutubeFill, FacebookFill, FacebookCircleFill } from '@phyoofficial/phyo-icon-library';

export default function InfluencerSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [invitedInfluencers, setInvitedInfluencers] = useState(new Set());
  const searchInputRef = useRef(null);
  const topBarMoreMenuRef = useRef(null);

  // Modal states
  const [showTopBarMoreMenu, setShowTopBarMoreMenu] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Handle search action
  const handleSearch = () => {
    setShowResults(false);
    setIsSearching(true);
    setSelectedInfluencer(null);
    setTimeout(() => {
      setShowResults(true);
    }, 2000);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const fullText = finalTranscript + interimTranscript;
          setVoiceText(fullText);
          finalTranscriptRef.current = fullText;

          // Clear existing timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Set new timer - if no speech for 2 seconds, stop recording
          silenceTimerRef.current = setTimeout(() => {
            if (finalTranscriptRef.current.trim()) {
              recognitionInstance.stop();
            }
          }, 2000);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          
          // Clear the timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          
          // Auto-fill search bar when recognition ends
          const textToFill = finalTranscriptRef.current.trim();
          if (textToFill) {
            setSearchQuery(textToFill);
            setShowVoiceModal(false);
            setVoiceText('');
            finalTranscriptRef.current = '';
            
            // Trigger search after a brief delay
            setTimeout(() => {
              setShowResults(false);
              setIsSearching(true);
              setSelectedInfluencer(null);
              setTimeout(() => {
                setShowResults(true);
              }, 2000);
            }, 300);
          }
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  // Start searching animation on mount
  useEffect(() => {
    setTimeout(() => {
      setIsSearching(true);
      // Show results after 2 seconds of "searching"
      setTimeout(() => {
        setShowResults(true);
      }, 2000);
    }, 300);
  }, []);

  // Close top bar menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (topBarMoreMenuRef.current && !topBarMoreMenuRef.current.contains(event.target)) {
        setShowTopBarMoreMenu(false);
      }
    }
    if (showTopBarMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTopBarMoreMenu]);

  // Handle back button
  const handleBackClick = () => {
    setIsSearching(false);
    setShowResults(false);
    setSelectedInfluencer(null);
    setTimeout(() => {
      router.push('/brand/dashboard');
    }, 300);
  };

  // Handle influencer card click
  const handleInfluencerClick = (influencer) => {
    setSelectedInfluencer(influencer);
  };

  // Handle invite influencer
  const handleInviteInfluencer = (influencerId) => {
    setInvitedInfluencers(new Set([...invitedInfluencers, influencerId]));
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    setShowVoiceModal(true);
    setVoiceText('');
    finalTranscriptRef.current = '';
    
    if (recognition) {
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  // Toggle listening (start/stop)
  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      // Stop listening and fill search bar
      recognition.stop();
      setIsListening(false);
      
      // Clear any pending timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      // Fill search bar and close modal after a brief delay
      setTimeout(() => {
        const textToFill = finalTranscriptRef.current.trim() || voiceText.trim();
        if (textToFill) {
          setSearchQuery(textToFill);
          setShowVoiceModal(false);
          setVoiceText('');
          finalTranscriptRef.current = '';
          
          // Trigger search
          setTimeout(() => {
            handleSearch();
          }, 300);
        } else {
          setShowVoiceModal(false);
          setVoiceText('');
          finalTranscriptRef.current = '';
        }
      }, 200);
    } else {
      // Start listening
      setVoiceText('');
      finalTranscriptRef.current = '';
      setIsListening(true);
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Close voice modal
  const closeVoiceModal = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
    
    // Clear timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    setShowVoiceModal(false);
    setIsListening(false);
    setVoiceText('');
    finalTranscriptRef.current = '';
  };

  return (
    <>
      {/* Custom CSS for smooth animations */}
      <style jsx global>{`
        @keyframes searchFadeIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes filterDropdownIn {
          from {
            transform: translateY(-10px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes filterDropdownOut {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(-10px) scale(0.95);
            opacity: 0;
          }
        }
        
        .search-fade-in {
          animation: searchFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .filter-dropdown-enter {
          animation: filterDropdownIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: top right;
        }
        
        .filter-dropdown-exit {
          animation: filterDropdownOut 0.15s cubic-bezier(0.4, 0, 1, 1) forwards;
          transform-origin: top right;
        }
        
        /* Hide scrollbar for all elements */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        *::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Top Bar with centered search */}
        <div className="relative z-40 bg-white px-6 py-3 flex items-center gap-4 search-fade-in">
          {/* Back Button - Fixed width */}
          <button 
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Search Bar - Centered, grows to fill space */}
          <div className="flex-1 flex justify-center gap-4">
            <div className="relative w-full max-w-[720px]">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Find a lifestyle influencers for my business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-6 pr-12 py-3 bg-[#F0F0F0] rounded-full border-none focus:outline-none text-base text-gray-600"
                autoFocus
              />
              <button 
                onClick={handleSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-[#808080]" />
              </button>
            </div>
             <button 
              onClick={handleVoiceSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Mic className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Right Actions - Fixed width */}
          <div className="flex items-center gap-1">
           <div className="relative" ref={topBarMoreMenuRef}>
            <button 
              onClick={() => setShowTopBarMoreMenu(!showTopBarMoreMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-700" />
            </button>
            
            {/* Top Bar Filter Menu */}
            {showTopBarMoreMenu && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] py-4 z-50 filter-dropdown-enter">
                {/* Region */}
                <div className="px-4 mb-4">
                  <label className="block text-sm font-medium text-[#242527] mb-2">Region</label>
                  <div className="bg-[#f0f0f0] border-2 border-[#e6e6e6] rounded-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-[#808080]">india</span>
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Category */}
                <div className="px-4 mb-4">
                  <label className="block text-sm font-medium text-[#242527] mb-2">Category</label>
                  <div className="bg-[#f0f0f0] border-2 border-[#e6e6e6] rounded-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-[#808080]">Comedy, Life</span>
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Platform */}
                <div className="px-4 mb-4">
                  <label className="block text-sm font-medium text-[#242527] mb-2">Platform</label>
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {['Label', 'Label', 'Label', 'Label', 'Label'].map((label, idx) => (
                      <button key={idx} className="px-3 py-1 bg-[#fbfcfa] border border-[#f4f6f1] rounded-lg text-sm text-[#242527] whitespace-nowrap">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Audience */}
                <div className="px-4">
                  <label className="block text-sm font-medium text-[#242527] mb-2">Audience</label>
                  <div className="bg-[#f0f0f0] border-2 border-[#e6e6e6] rounded-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-[#808080]">18-24, 25-35</span>
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
           </div>
          </div>
        </div>

        {/* Voice Search Modal */}
        {showVoiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={closeVoiceModal}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-[500px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <h2 className="text-2xl font-semibold text-[#242527] mb-8">Speak</h2>
              
              {/* Mic Button with Animation */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={toggleListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening 
                      ? 'bg-[#43573b] animate-pulse shadow-lg' 
                      : 'bg-[#43573b] hover:bg-[#374829] shadow-lg'
                  }`}
                >
                  <Mic className="h-8 w-8 text-white" />
                </button>
              </div>
              
              {/* Transcript Text */}
              <p className="text-base text-[#333] text-center min-h-[60px]">
                {voiceText || (isListening ? 'Listening...' : '')}
              </p>
              
              {/* Browser Support Warning */}
              {!recognition && (
                <p className="text-xs text-red-500 text-center mt-4">
                  Speech recognition is not supported in your browser. Please use Chrome or Edge.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Search Results Container or Loading State */}
        {!showResults ? (
          <div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)]">
            <div 
              className={`flex flex-col items-center justify-center transition-all duration-700 ${
                isSearching ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              {/* Mascot Image */}
              <div className="mb-6 relative">
                
                {/* Fallback mascot */}
                <div className="w-[187px] h-[279px] hidden items-center justify-center">
                  <Search className="w-24 h-24 text-teal-600 animate-pulse" />
                </div>
              </div>
              <img
                  src="/assets/searching_look.svg"
                  alt="Searching"
                  className="w-[187px] h-[279px] object-contain relative z-10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              {/* Finding Results Text */}
              <p className="text-[#808080] text-sm font-medium leading-[20px] tracking-[0.2px] whitespace-nowrap">
                finding results...
              </p>
            </div>
          </div>
        ) : (
          /* Search Results Container */
          <div className="flex gap-2 sm:gap-4 px-3 sm:px-6 lg:px-9 h-[calc(100vh-96px)]">
            {/* Left Column - Results List */}
            <div className="flex flex-col gap-2 overflow-y-auto w-full lg:w-[604px] shrink-0 pr-2">
              {/* Influencer Card 1 */}
              <InfluencerCard
                name="Campaign Chacha"
                bio="Lifestyle & Entertainment"
                avatarColor="#016fff"
                socials={[
                  { icon: <YoutubeFill size={16} />, count: '22.5k', bgColor: 'bg-[#43573b]' },
                  { icon: <InstagramFill size={16} />, count: '22.5k', bgColor: 'bg-[#43573b]' },
                  { icon: <TwitterXLine size={16} />, count: '22.5k', bgColor: 'bg-gray-600' }
                ]}
                influencerData={{
                  id: 1,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                }}
                isInvited={invitedInfluencers.has(1)}
                onInvite={() => handleInviteInfluencer(1)}
                onMessage={(data) => {
                  router.push(`/brand/chat/${data.id}?name=${encodeURIComponent(data.name)}`);
                }}
                onClick={() => handleInfluencerClick({
                  id: 1,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                })}
              />
              
              {/* Influencer Card 2 */}
              <InfluencerCard
                name="Campaign Chacha"
                bio="Creator & Influencer"
                avatarColor="#016fff"
                socials={[
                  { icon: <YoutubeFill size={16} />, count: '22.5k', bgColor: 'bg-[#43573b]' },
                  { icon: <InstagramFill size={16} />, count: '22.5k', bgColor: 'bg-[#43573b]' },
                  { icon: <TwitterXLine size={16} />, count: '22.5k', bgColor: 'bg-gray-600' }
                ]}
                influencerData={{
                  id: 2,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                }}
                isInvited={invitedInfluencers.has(2)}
                onInvite={() => handleInviteInfluencer(2)}
                onMessage={(data) => {
                  router.push(`/brand/chat/${data.id}?name=${encodeURIComponent(data.name)}`);
                }}
                onClick={() => handleInfluencerClick({
                  id: 2,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                })}
              />
              
              {/* Influencer Card 3 */}
              <InfluencerCard
                name="Campaign Chacha"
                bio="Digital Content Creator"
                avatarColor="#016fff"
                socials={[
                  { icon: <YoutubeFill size={16} />, count: '22.5k', bgColor: 'bg-[#43573b]' },
                  { icon: <InstagramFill size={16} />, count: '22.5k', bgColor: 'bg-[#43573b]' },
                  { icon: <TwitterXLine size={16} />, count: '22.5k', bgColor: 'bg-gray-600' }
                ]}
                influencerData={{
                  id: 3,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                }}
                isInvited={invitedInfluencers.has(3)}
                onInvite={() => handleInviteInfluencer(3)}
                onMessage={(data) => {
                  router.push(`/brand/chat/${data.id}?name=${encodeURIComponent(data.name)}`);
                }}
                onClick={() => handleInfluencerClick({
                  id: 3,
                  name: "Dadi Cool",
                  username: "@dadi_cool",
                  followers: "22.4k",
                  following: "2.1k",
                  posts: "145",
                  location: "Delhi, India",
                  age: "34",
                  about: "A calm, composed elder figure with soft curls and a thoughtful demeanor. Protocol represents wisdom and acts as a grounding presence. Ideal for adding a mature balance to the set.",
                  likes: "9.2K",
                  views: "9.2K"
                })}
              />
              
              {/* Upgrade Banner */}
              <div className="flex items-center bg-[#e7edfb] rounded-xl px-3 py-2 gap-3">
                <Info className="h-6 w-6 text-[#0b4fd9] shrink-0" />
                <div className="flex items-center flex-1 gap-3">
                  <p className="text-sm text-[#242527] flex-1">
                    You have reached your limit. Upgrade plan for more.
                  </p>
                  <button className="bg-[#0b4fd9] text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-[#0a45c2] transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Influencer Profile or Empty State */}
            <div className="hidden lg:flex lg:flex-1 lg:m-1 lg:shadow-[0_0_20px_rgba(0,0,0,0.1)] lg:rounded-lg min-w-0 overflow-hidden">
              {selectedInfluencer ? (
                <InfluencerProfile influencer={selectedInfluencer} isInvited={invitedInfluencers.has(selectedInfluencer.id)} onInvite={() => handleInviteInfluencer(selectedInfluencer.id)} />
              ) : (
                <div className="w-full h-full bg-[#F0F0F0] rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                  <div className="w-[200px] h-[52px] sm:w-[250px] sm:h-[64px] lg:w-[286px] lg:h-[74px] mb-1">
                    <img
                      src="/assets/phyo_logo_new.svg"
                      alt="Phyo Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[#808080] text-base sm:text-lg font-semibold text-center">
                    A PyroMedia Product
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Influencer Card Component
function InfluencerCard({ name, bio, avatarColor, socials, onClick, onMessage, influencerData, isInvited, onInvite }) {
  const [showToast, setShowToast] = useState(false);

  const handleInvite = (e) => {
    e.stopPropagation();
    onInvite();
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      {/* Toast Notification - Fixed positioning */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex justify-center">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
            <span>Invite sent</span>
          </div>
        </div>
      )}

      <div className="relative">

      <div
        onClick={onClick}
        className="bg-white border border-gray-200 rounded-3xl p-6 m-1 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      >
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full shrink-0"
            style={{ backgroundColor: avatarColor }}
          />

          {/* Name and Bio */}
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-[#242527]">
              {name}
            </h3>
            <p className="text-sm text-[#666]">
              {bio}
            </p>

            {/* Social Stats */}
            {socials && (
              <div className="flex gap-4">
                {socials?.map((social, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded flex items-center justify-center text-black text-xs font-bold`}>
                      {social.icon}
                    </div>
                    <span className="text-sm font-medium text-[#242527]">{social.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessage && onMessage(influencerData);
            }}
            className="flex items-center gap-2 px-6 py-2 border border-[#333] rounded-full text-[#333] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Message3Line className="h-5 w-5" />
            message
          </button>
          <button
            onClick={handleInvite}
            className={`flex items-center gap-2 px-6 py-2 border rounded-full text-sm font-medium transition-colors ${
              isInvited
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-[#333] text-[#333] hover:bg-gray-50'
            }`}
          >
            {isInvited ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                invited
              </>
            ) : (
              <>
                <UserAddLine className="h-5 w-5" />
                invite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

// Influencer Profile Component (Right Side Panel)
function InfluencerProfile({ influencer, isInvited, onInvite }) {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const moreMenuRef = useRef(null);

  const handleInvite = () => {
    onInvite();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  // Sample lists data
  const [savedLists, setSavedLists] = useState([
    { id: 1, name: 'Favorties', initials: 'AB', color: '#0066ff' },
    { id: 2, name: 'Campaign 1', initials: 'AB', color: '#0066ff' }
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleSaveToList = (listId) => {
    // Handle saving to list
    console.log('Saving to list:', listId);
    setShowSaveModal(false);
  };

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: savedLists.length + 1,
        name: newListName,
        initials: 'AB',
        color: '#0066ff'
      };
      setSavedLists([...savedLists, newList]);
      setNewListName('');
      setShowNewListModal(false);
      setShowSaveModal(true);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex justify-center">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
            <span>Invite sent</span>
          </div>
        </div>
      )}

      <div className="w-full h-full relative rounded-lg overflow-y-auto">
      {/* Yellow Background - Sticky at top */}
      <div className="sticky top-0 bg-yellow-400 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] z-0">
        {/* Profile Image - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-2 sm:pt-4 md:pt-6 lg:pt-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-lg">
            {/* Placeholder for profile image */}
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400"></div>
          </div>
        </div>
        
        {/* Top Action Buttons - Overlaid */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSaveModal(true)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
            >
              <BookmarkLine className="h-5 w-5" />
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              
              {/* More Menu Dropdown */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button 
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Report functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Report
                  </button>
                  <button 
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Not interested functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Not interested
                  </button>
                  <button 
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Share functionality
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save to List Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={() => setShowSaveModal(false)}>
          <div className="bg-white rounded-3xl shadow-xl w-[480px]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <h3 className="text-lg font-semibold text-[#242527]">Save to...</h3>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              {savedLists.map((list) => (
                <div key={list.id} className="flex items-center px-4 py-3 hover:bg-gray-50">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4"
                    style={{ backgroundColor: list.color }}
                  >
                    {list.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#242527]">{list.name}</p>
                  </div>
                  <button 
                    onClick={() => handleSaveToList(list.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <BookmarkLine className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* New List Button */}
            <div className="px-4 pb-4">
              <button 
                onClick={() => {
                  setShowSaveModal(false);
                  setShowNewListModal(true);
                }}
                className="w-full bg-[#dae3d1] text-[#43573b] py-3 rounded-full font-semibold hover:bg-[#c9d9ba] transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                New List
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={() => setShowNewListModal(false)}>
          <div className="bg-[#f0f0f0] rounded-lg p-6 w-[400px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#242527] mb-4">New List</h3>
            
            <input
              type="text"
              placeholder="Placeholder"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNewList()}
              className="w-full bg-[#f0f0f0] border-2 border-[#e6e6e6] rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:border-[#43573b]"
              autoFocus
            />
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNewListModal(false);
                  setNewListName('');
                }}
                className="px-6 py-2 border border-[#43573b] text-[#43573b] rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewList}
                className="px-6 py-2 bg-[#43573b] text-white rounded-lg font-medium hover:bg-[#374829] transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content - White card that scrolls over yellow background */}
      <div className="relative bg-white rounded-t-3xl -mt-3 sm:-mt-4 md:-mt-6 lg:-mt-8 z-10 shadow-lg">
        <div className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 pb-24 sm:pb-28">
          {/* Username and Name */}
          <div className="mb-4 sm:mb-6">
            <p className="text-[#808080] text-sm sm:text-base font-semibold leading-6 tracking-[0.24px] mb-1">{influencer.username}</p>
            <h2 className="text-[#242527] text-2xl sm:text-3xl md:text-4xl font-bold leading-[32px] sm:leading-[40px] md:leading-[48px] tracking-[-0.32px]">{influencer.name}</h2>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <FacebookCircleFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.followers}</span>
            </div>
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <InstagramFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.following}</span>
            </div>
            <div className="bg-[#0b4fd9] hover:bg-[#0a45bf] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors">
              <YoutubeFill className="w-5 h-5 text-white" />
              <span className="text-white text-sm sm:text-base font-semibold leading-6 tracking-[0.24px]">{influencer.posts}</span>
            </div>
          </div>

          {/* Location and Age */}
          <div className="grid grid-cols-2 sm:flex sm:gap-5 gap-3 mb-4 sm:mb-6">
            <div className="flex-1">
              <p className="text-[#242527] text-base sm:text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">Location</p>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8.66667C8.73638 8.66667 9.33333 8.06971 9.33333 7.33333C9.33333 6.59695 8.73638 6 8 6C7.26362 6 6.66667 6.59695 6.66667 7.33333C6.66667 8.06971 7.26362 8.66667 8 8.66667Z" fill="#ff4f4f"/>
                  <path d="M8 1.33333C6.23189 1.33333 4.66667 2.89856 4.66667 4.66667C4.66667 7.33333 8 12 8 12C8 12 11.3333 7.33333 11.3333 4.66667C11.3333 2.89856 9.76811 1.33333 8 1.33333Z" stroke="#ff4f4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[#808080] text-base leading-6">{influencer.location}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#242527] text-base sm:text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">Age</p>
              <span className="text-[#808080] text-sm sm:text-base leading-6">{influencer.age}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-[#242527] text-base sm:text-xl font-semibold leading-7 tracking-[-0.14px] mb-1">About</h3>
            <p className="text-[#808080] text-sm sm:text-base leading-6 text-justify">
              {influencer.about}
            </p>
          </div>

          {/* Interactions Section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-[#242527] text-base sm:text-xl font-semibold leading-7 tracking-[-0.14px] mb-3">Interactions</h3>
            
            {/* Likes and Views Graphs */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto mb-4 sm:mb-6">
              {/* Likes Graph */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 min-w-[280px] sm:min-w-[320px] lg:min-w-[340px] flex-shrink-0">
                <div className="mb-2">
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.likes} Likes</p>
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11 8L8 5L5 8" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 11L8 8L5 11" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[#067635] font-medium">24%</span>
                    <span className="text-[#808080]">vs</span>
                    <span className="text-[#808080]">last month</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex flex-col justify-between text-[#333] text-xs py-2">
                    <span>10K</span>
                    <span>8K</span>
                    <span>4K</span>
                    <span>2K</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 relative h-[217px]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 352 217" preserveAspectRatio="none">
                      <path d="M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955" stroke="#43573b" strokeWidth="2" fill="none"/>
                      <path d="M0 126.089L58.9259 95.5895L117.852 47.5895L176.778 79.5895L235.704 71.5895L294.63 103.589L353.556 2.58955V217H0V126.089Z" fill="#43573b" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between text-[#333] text-xs text-center mt-2 pl-6">
                  <span className="w-[60px]">July</span>
                  <span className="w-[60px]">Aug</span>
                  <span className="w-[60px]">Sep</span>
                  <span className="w-[60px]">Oct</span>
                  <span className="w-[60px]">Nov</span>
                  <span className="w-[60px]">Dec</span>
                </div>
              </div>

              {/* Views Graph */}
              <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 min-w-[280px] sm:min-w-[320px] lg:min-w-[340px] flex-shrink-0">
                <div className="mb-2">
                  <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px]">{influencer.views} views</p>
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M11 8L8 5L5 8" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 11L8 8L5 11" stroke="#067635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[#067635] font-medium">24%</span>
                    <span className="text-[#808080]">vs</span>
                    <span className="text-[#808080]">last month</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex flex-col justify-between text-[#333] text-xs py-2">
                    <span>10K</span>
                    <span>8K</span>
                    <span>4K</span>
                    <span>2K</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 relative h-[217px]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 352 217" preserveAspectRatio="none">
                      <path d="M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8" stroke="#43573b" strokeWidth="2" fill="none"/>
                      <path d="M0 134L58.9259 103.5L117.852 55.5L176.778 87.5L235.704 79.5L294.63 111.5L353.802 8V217H0V134Z" fill="#43573b" fillOpacity="0.2"/>
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between text-[#333] text-xs text-center mt-2 pl-6">
                  <span className="w-[60px]">July</span>
                  <span className="w-[60px]">Aug</span>
                  <span className="w-[60px]">Sep</span>
                  <span className="w-[60px]">Oct</span>
                  <span className="w-[60px]">Nov</span>
                  <span className="w-[60px]">Dec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-[#242527] text-base sm:text-xl font-semibold leading-7 tracking-[-0.14px] mb-3">Audience Insights</h3>
            
            {/* Age Group */}
            <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 mb-3">
              <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-2">Age Group</p>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[#333] text-xs py-2 text-right" style={{ minWidth: '32px' }}>
                  <span>100%</span>
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                  <span>0%</span>
                </div>
                <div className="flex-1 flex items-end justify-around gap-[6px] pb-1" style={{ height: '150px' }}>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '99px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '75px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '84px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '45px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '72px' }}></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-end min-w-[24px] max-w-[32px]">
                    <div className="w-full bg-[#43573b] rounded-t-lg" style={{ height: '60px' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-around text-[#333] text-xs text-center mt-2 pl-8 gap-[6px]">
                <span className="flex-1 min-w-[24px] max-w-[32px]">12-18</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">19-24</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">24-34</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">35-50</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">50-65</span>
                <span className="flex-1 min-w-[24px] max-w-[32px]">65+</span>
              </div>
            </div>

            {/* Gender */}
            <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2 mb-3">
              <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-2">Gender</p>
              <div className="flex items-center justify-center py-4">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#9ba194" strokeWidth="20"/>
                  <circle cx="75" cy="75" r="65" fill="none" stroke="#43573b" strokeWidth="20" 
                    strokeDasharray="245 408" strokeDashoffset="0" transform="rotate(-90 75 75)"/>
                </svg>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#43573b]"></div>
                  <span className="text-[#333] text-xs">Male</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#9ba194]"></div>
                  <span className="text-[#333] text-xs">Female</span>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white border-[0.5px] border-[#e6e6e6] rounded-xl p-2">
              <p className="text-[#242527] text-base font-semibold leading-6 tracking-[0.24px] mb-2">Top Locations</p>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[#333] text-xs py-2 text-right" style={{ minWidth: '32px' }}>
                  <span>100%</span>
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                  <span>0%</span>
                </div>
                <div className="flex-1 flex items-end justify-around gap-[6px] pb-1" style={{ height: '150px' }}>
                  {/* In */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '105px' }}></div>
                  </div>
                  {/* DL */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '95px' }}></div>
                  </div>
                  {/* USA */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '78px' }}></div>
                  </div>
                  {/* NY */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '95px' }}></div>
                  </div>
                  {/* UK */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '72px' }}></div>
                  </div>
                  {/* Lon */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '53px' }}></div>
                  </div>
                  {/* UAE */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#43573b] rounded-t-lg" style={{ height: '68px' }}></div>
                  </div>
                  {/* Dub */}
                  <div className="flex items-end justify-center" style={{ minWidth: '24px' }}>
                    <div className="w-8 bg-[#9ba194] rounded-t-lg" style={{ height: '78px' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-around text-[#333] text-xs text-center mt-2 pl-8 gap-[6px]">
                <span style={{ minWidth: '24px' }}>In</span>
                <span style={{ minWidth: '24px' }}>DL</span>
                <span style={{ minWidth: '24px' }}>USA</span>
                <span style={{ minWidth: '24px' }}>NY</span>
                <span style={{ minWidth: '24px' }}>UK</span>
                <span style={{ minWidth: '24px' }}>Lon</span>
                <span style={{ minWidth: '24px' }}>UAE</span>
                <span style={{ minWidth: '24px' }}>Dub</span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#43573b]"></div>
                  <span className="text-[#333] text-xs">Top Countries</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#9ba194]"></div>
                  <span className="text-[#333] text-xs">Top Cities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Influencers */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-[#242527] text-base sm:text-xl font-semibold leading-7 tracking-[-0.14px] mb-3">Similar Influencers</h3>

            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {/* Similar Influencer Card 1 */}
              <div className="bg-[#f0f0f0] border-2 border-white rounded-xl overflow-hidden min-w-[240px] sm:min-w-[300px] lg:min-w-[340px] flex-shrink-0">
                <p className="text-[#808080] text-xs px-4 pt-2">Health & Lifestyle</p>
                <div className="aspect-[375/216] bg-gradient-to-br from-orange-200 to-pink-200"></div>
                <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#008490] rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] truncate">Emily Johnson</p>
                    <p className="text-[#333] text-base">22.4K follower</p>
                  </div>
                </div>
              </div>
              
              {/* Similar Influencer Card 2 */}
              <div className="bg-[#f0f0f0] border-2 border-white rounded-xl overflow-hidden min-w-[240px] sm:min-w-[300px] lg:min-w-[340px] flex-shrink-0">
                <p className="text-[#808080] text-xs px-4 pt-2">Health & Lifestyle</p>
                <div className="aspect-[375/216] bg-gradient-to-br from-blue-200 to-purple-200"></div>
                <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#008490] rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#242527] text-xl font-semibold leading-7 tracking-[-0.14px] truncate">Emily Johnson</p>
                    <p className="text-[#333] text-base">22.4K follower</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page indicators */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-[#242527]"></div>
              <div className="w-2 h-2 rounded-full bg-[#e6e6e6]"></div>
              <div className="w-2 h-2 rounded-full bg-[#e6e6e6]"></div>
              <div className="w-2 h-2 rounded-full bg-[#e6e6e6]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Sticky at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-1 sm:gap-2 md:gap-3">
          <button
            onClick={handleInvite}
            className={`flex-1 flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-colors tracking-[0.24px] ${
              isInvited
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-[#dae3d1] text-[#43573b] hover:bg-[#c9d9ba]'
            }`}
          >
            {isInvited ? (
              <>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span className="hidden md:inline">Invited</span>
                <span className="md:hidden">Invited</span>
              </>
            ) : (
              <>
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline">Invite</span>
                <span className="md:hidden">Invite</span>
              </>
            )}
          </button>
          <button
            onClick={() => router.push(`/brand/chat/${influencer.id}?name=${encodeURIComponent(influencer.name)}`)}
            className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 bg-[#43573b] rounded-full text-white text-xs sm:text-sm md:text-base font-semibold hover:bg-[#374829] transition-colors tracking-[0.24px]"
          >
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Send Message</span>
            <span className="md:hidden">Message</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

