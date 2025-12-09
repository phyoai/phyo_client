"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAPI, authUtils } from '../../utils/api';

// Custom Image Component using Next.js Image
const ProfileImage = ({ src, alt, name, className }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to process image URL through proxy
  const getCorsProxyUrl = (url) => {
    if (!url) return '';
    
    // Google Translate proxy method
    let p = url?.split("/") || [""];
    let t = '';
    for (let i = 0; i < p.length; i++) {
      if (i == 2) {
        t += p[i].replaceAll('-', '--').replaceAll('.', '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
      } else {
        if (i != p.length - 1) {
          t += p[i] + '/';
        } else {
          t += p[i];
        }
      }
    }
    return encodeURI(t);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback to initials if image fails or no src
  if (imageError || !src) {
    return (
      <div className={`${className} bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg border-2 border-gray-200`}>
        {getInitials(name)}
      </div>
    );
  }

  const imageUrl = getCorsProxyUrl(src || "https://instagram.fmad19-2.fna.fbcdn.net/v/t51.2885-19/350624574_796732218766635_3766412963048210668_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_ht=instagram.fmad19-2.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2QFLIS5hs2NQ7ce0bZnzUdc9qfgCXcIVP_k-K1UIW8PFPTXmN6Dn9eX15F0PtHT6vRw&_nc_ohc=7XZ9iUF4f-sQ7kNvwEmlFEC&_nc_gid=LkyQUJkfM5nc2ICE5e4SKQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfTuCn4EvoRgsyZkjFReEyqgSmZHwyCt_Z18aX2SefgeZA&oe=687E3F1B&_nc_sid=8b3546");

  return (
    <div className="relative">
      <Image
        src={imageUrl}
        alt={alt}
        width={80}
        height={80}
        className={`${className} border-2 border-gray-200 object-cover`}
        onError={handleImageError}
        unoptimized={true} // Required for external images with proxy
        priority={false}
      />
    </div>
  );
};

const Hero = () => {
  // State for responsive background
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Load from localStorage if available
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Add shimmer animation to global styles
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Check authentication and restore previous search on mount
  React.useEffect(() => {
    setIsAuthenticated(authUtils.isAuthenticated());
    
    // Restore previous search results from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedResults = localStorage.getItem('landing_search_results');
        const savedPrompt = localStorage.getItem('landing_search_prompt');
      
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults);
          if (Array.isArray(parsedResults) && parsedResults.length > 0) {
            setResults(parsedResults);
          }
        }
        
        if (savedPrompt) {
          setPrompt(savedPrompt);
        }
      } catch (err) {
        console.error('Error restoring search results:', err);
      }
    }
  }, []);

  // Handle responsive background
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const data = await searchAPI.askSearch(prompt);
      
      if (data.success && Array.isArray(data.data)) {
        // Show only top 3 results
        const topResults = data.data.slice(0, 3);
        setResults(topResults);
        
        // Save to localStorage for persistence
        localStorage.setItem('landing_search_results', JSON.stringify(topResults));
        localStorage.setItem('landing_search_prompt', prompt);
      } else {
        setResults([]);
        // Check if error is about credits/free searches
        if (data.upgradeRequired || data.error?.includes('free searches') || data.error?.includes('credits')) {
          setError(data.error || "No free searches remaining. Please upgrade your plan for more credits.");
        } else {
          setError(data.error || "No influencers found for your query.");
        }
        // Clear localStorage if no results
        localStorage.removeItem('landing_search_results');
        localStorage.removeItem('landing_search_prompt');
      }
    } catch (err) {
      console.error('Search error:', err);
      // Check if the error response contains credit/upgrade information
      if (err.upgradeRequired || err.message?.includes('free searches') || err.message?.includes('credits')) {
        setError(err.message || "No free searches remaining. Please upgrade your plan for more credits.");
      } else {
        setError(err.message || "Failed to fetch influencers. Please try again.");
      }
      setResults([]);
      // Clear localStorage on error
      localStorage.removeItem('landing_search_results');
      localStorage.removeItem('landing_search_prompt');
    }
    
    setLoading(false);
  };

  const handleInput = (e) => {
    setPrompt(e.target.value);
    if (e.key === 'Enter') handleSearch();
  };

  const handleClearResults = () => {
    setResults([]);
    setPrompt("");
    setError(null);
    
    // Clear from localStorage
    localStorage.removeItem('landing_search_results');
    localStorage.removeItem('landing_search_prompt');
  };

  const handleInfluencerClick = (username) => {
    // Store results in localStorage
    localStorage.setItem('influencer_search_results', JSON.stringify(results));
    // Navigate to details page
    router.push(`/influencer-details/${username}`);
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count?.toString() || '0';
  };

  const formatEngagement = (engagement) => {
    if (!engagement) return 'N/A';
    // avg_engagement is already a percentage value (e.g., 1.09 = 1.09%)
    return engagement.toFixed(2) + '%';
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <motion.div
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Profile Image Skeleton */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" 
               style={{ 
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 1.5s infinite'
               }}
          />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
          {/* Name Skeleton */}
          <div className="mb-3">
            <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-2 w-3/4 mx-auto sm:mx-0 animate-pulse"
                 style={{ 
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 1.5s infinite'
                 }}
            />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 mx-auto sm:mx-0 animate-pulse"
                 style={{ 
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 1.5s infinite'
                 }}
            />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2 w-3/4 animate-pulse"
                     style={{ 
                       backgroundSize: '200% 100%',
                       animation: 'shimmer 1.5s infinite',
                       animationDelay: `${i * 0.1}s`
                     }}
                />
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse"
                     style={{ 
                       backgroundSize: '200% 100%',
                       animation: 'shimmer 1.5s infinite',
                       animationDelay: `${i * 0.1}s`
                     }}
                />
              </div>
            ))}
          </div>

          {/* Biography Skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-pulse"
                 style={{ 
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 1.5s infinite'
                 }}
            />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse"
                 style={{ 
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 1.5s infinite'
                 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Login Modal Component
  const LoginModal = () => (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600">Please login to use the AI search feature and discover influencers.</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Login to Continue
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const searchBarVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const featureImageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.6
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative flex flex-col items-center justify-start sm:justify-center px-0 sm:px-6 py-4 sm:py-0 overflow-x-hidden w-full max-w-full box-border"
      style={{
        backgroundImage: `url(${isMobile ? '/Phone.png' : '/landing/hero_bg1.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'scroll'
      }}
    >
      {/* Login Modal */}
      <LoginModal />
      
      {/* White fade overlay for entire bottom section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-20"></div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto mt-16 sm:mt-20 lg:mt-[95px] text-center w-full overflow-x-hidden px-0 sm:px-2 box-border"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1 
  className="font-medium text-3xl sm:text-4xl md:text-5xl mt-10 lg:text-8xl xl:text-8xl 2xl:text-[92px] text-white leading-tight mb-4 sm:mb-6 px-2 break-words"
  variants={titleVariants}
>
  World's First AI Powered<br className="hidden sm:block" />
  <span className="sm:hidden"> </span>Influencer Search Engine
</motion.h1>

{/* Subtitle */}
<motion.p 
  className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed"
  variants={itemVariants}
>
  Search Influencers in Seconds with Phyo and Reach<br className="hidden sm:block" />
  <span className="sm:hidden"> </span>the Right Audience Faster.
</motion.p>

        {/* Search Bar */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-12 sm:mb-20 px-4 sm:px-2"
          variants={searchBarVariants}
        >
          <div className="flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full shadow-2xl overflow-hidden w-full max-w-full">
            <input
              type="text"
              placeholder="Describe the influencers you need (e.g. I need influencers in mumbai )"
              className="flex-1 px-4 sm:px-8 py-4 sm:py-2 text-base sm:text-lg text-gray-700 placeholder-gray-400 outline-none w-full min-w-0"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleInput}
            />
            <motion.button
              className="bg-green-500 hover:bg-green-600 transition-colors duration-200 p-4 sm:p-6 m-2 rounded-full w-full sm:w-auto flex items-center justify-center px-4 sm:px-6"
              onClick={results.length > 0 ? handleClearResults : handleSearch}
              disabled={loading}
              aria-label={results.length > 0 ? "Clear results" : "Search"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <motion.svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </motion.svg>
              ) : results.length > 0 ? (
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
              <span className="ml-2 sm:hidden text-white font-medium">
                {loading ? 'Searching...' : results.length > 0 ? 'Clear' : 'Search'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading Skeleton Cards */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 sm:gap-6 px-4 sm:px-2 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-white mb-2 sm:mb-4 font-medium text-lg flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching for influencers...
              </motion.div>
              
              {/* Show 2 skeleton cards */}
              {[1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          )}
          
          {/* Error State */}
          {error && !loading && (
            <motion.div 
              className="max-w-4xl mx-auto mb-8 px-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`rounded-2xl shadow-2xl p-5 sm:p-6 ${
                error.includes('free searches') || error.includes('credits') || error.includes('upgrade')
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {error.includes('free searches') || error.includes('credits') || error.includes('upgrade') ? (
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                      {error.includes('free searches') || error.includes('credits') || error.includes('upgrade')
                        ? '🚀 Upgrade Required'
                        : 'Search Error'}
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                      {error}
                    </p>
                    {(error.includes('free searches') || error.includes('credits') || error.includes('upgrade')) && (
                      <motion.button
                        onClick={() => {
                          setError(null); // Close the error notification
                          setTimeout(() => {
                            const pricingSection = document.getElementById('pricing-section');
                            if (pricingSection) {
                              pricingSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start',
                                inline: 'nearest'
                              });
                            } else {
                              // Fallback: try to scroll by finding the section another way
                              console.warn('Pricing section not found, trying fallback...');
                              window.scrollTo({
                                top: document.documentElement.scrollHeight * 0.6,
                                behavior: 'smooth'
                              });
                            }
                          }, 100);
                        }}
                        className="mt-4 bg-white text-orange-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Pricing Plans
                      </motion.button>
                    )}
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                    aria-label="Close notification"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Influencer search results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div 
              className="max-w-6xl mx-auto mb-10 flex flex-col gap-4 sm:gap-6 px-4 sm:px-2 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-white mb-2 sm:mb-4 font-medium text-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Top {results.length} Influencer{results.length > 1 ? 's' : ''} Found
              </motion.div>
              
              {results.map((influencer, index) => (
                <motion.div
                  key={influencer.username || index}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-3xl mx-auto cursor-pointer hover:shadow-2xl transition-shadow"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  layout
                  onClick={() => handleInfluencerClick(influencer.username)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <ProfileImage
                        src={influencer.profile_pic_url}
                        alt={influencer.profile_name || influencer.username}
                        name={influencer.profile_name || influencer.username}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
                      />
                      {/* Verified Badge */}
                      {influencer.is_verified && (
                        <motion.div 
                          className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                      {/* Name */}
                      <div className="mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                          {influencer.profile_name || influencer.username}
                        </h3>
                        <p className="text-sm text-gray-500">@{influencer.username}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {/* Followers */}
                        <motion.div 
                          className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-3 sm:p-4"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span className="text-xs text-gray-600 font-medium">Followers</span>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {formatFollowers(influencer.followers)}
                          </div>
                        </motion.div>

                        {/* Following */}
                        <motion.div 
                          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            <span className="text-xs text-gray-600 font-medium">Following</span>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {formatFollowers(influencer.following)}
                          </div>
                        </motion.div>

                        {/* Posts */}
                        <motion.div 
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-600 font-medium">Posts</span>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {influencer.posts_count || 0}
                          </div>
                        </motion.div>

                        {/* Engagement */}
                        <motion.div 
                          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 sm:p-4"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            <span className="text-xs text-gray-600 font-medium">Engagement</span>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {formatEngagement(influencer.avg_engagement)}
                          </div>
                        </motion.div>
                      </div>

                      {/* Biography */}
                      {influencer.biography && (
                        <p className="text-gray-600 text-sm mt-4 line-clamp-2 leading-relaxed">
                          {influencer.biography}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Image */}
        <AnimatePresence>
          {results.length === 0 && !loading && (
            <motion.div 
              className="max-w-[1100px] mx-auto px-8 sm:px-2"
              variants={featureImageVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src="/landing/hero_feature.png"
                  alt="Phyo AI Influencer Search Platform Preview"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-2xl max-w-full"
                  priority={true}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default Hero;