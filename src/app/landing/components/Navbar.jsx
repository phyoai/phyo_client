'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoIcon from '../../../components/Icons/logo'
import { authUtils, authAPI } from '../../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState({
    brandRegistrationStatus: 'NONE',
    influencerRegistrationStatus: 'NONE',
    userType: null
  });
  const router = useRouter();
  const { getUserType } = useAuth();
  const [userType, setUserType] = useState(null);

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = authUtils.isAuthenticated();
      
      if (hasToken) {
        // Validate token
        const isValid = await authUtils.validateToken();
        setIsAuthenticated(isValid);
        
        if (!isValid) {
          // Token is invalid/expired, clear everything
          setUserType(null);
          setRegistrationStatus({
            brandRegistrationStatus: 'NONE',
            influencerRegistrationStatus: 'NONE',
            userType: null
          });
          console.log('Token expired or invalid in Navbar. User logged out.');
          return;
        }
        
        const type = getUserType();
        setUserType(type);
        
        // Fetch registration status
        try {
          const statusData = await authAPI.getRegistrationStatus();
          if (statusData.success) {
            setRegistrationStatus(statusData.data);
          }
        } catch (error) {
          console.error('Error fetching registration status:', error);
          // If this fails with 403, the interceptor will handle logout
        }
      } else {
        setIsAuthenticated(false);
        setUserType(null);
        setRegistrationStatus({
          brandRegistrationStatus: 'NONE',
          influencerRegistrationStatus: 'NONE',
          userType: null
        });
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (login/logout events)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab auth changes
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, [getUserType]);

  const handleDashboardClick = () => {
    // Check which type of user is approved and redirect accordingly
    if (registrationStatus.brandRegistrationStatus === 'APPROVED') {
      router.push('/brand/dashboard');
    } else if (registrationStatus.influencerRegistrationStatus === 'APPROVED') {
      router.push('/influencer/dashboard');
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    setRegistrationStatus({
      brandRegistrationStatus: 'NONE',
      influencerRegistrationStatus: 'NONE',
      userType: null
    });
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle brand registration click
  const handleBrandClick = (e) => {
    if (!isAuthenticated) {
      // Not logged in, allow navigation to signup
      return;
    }

    const { brandRegistrationStatus, influencerRegistrationStatus } = registrationStatus;

    // Check if already applied for influencer
    if (influencerRegistrationStatus === 'PENDING') {
      e.preventDefault();
      setStatusMessage('You have already applied for Influencer registration. Please wait for approval or cancel your current application before applying as a Brand.');
      setShowStatusModal(true);
      return;
    }

    if (influencerRegistrationStatus === 'APPROVED') {
      e.preventDefault();
      setStatusMessage('You are already registered as an Influencer. You cannot register as both Brand and Influencer.');
      setShowStatusModal(true);
      return;
    }

    // Check brand registration status
    if (brandRegistrationStatus === 'PENDING') {
      e.preventDefault();
      setStatusMessage('Your Brand registration is pending approval. We will notify you once it has been reviewed.');
      setShowStatusModal(true);
      return;
    }

    if (brandRegistrationStatus === 'APPROVED') {
      e.preventDefault();
      setStatusMessage('Your Brand account is already approved! You can access your dashboard.');
      setShowStatusModal(true);
      return;
    }

    if (brandRegistrationStatus === 'DECLINED') {
      e.preventDefault();
      setStatusMessage('Your previous Brand registration was declined. Please contact support for more information.');
      setShowStatusModal(true);
      return;
    }

    // If NONE, allow navigation to signup
  };

  // Handle influencer registration click
  const handleInfluencerClick = (e) => {
    if (!isAuthenticated) {
      // Not logged in, allow navigation to signup
      return;
    }

    const { brandRegistrationStatus, influencerRegistrationStatus } = registrationStatus;

    // Check if already applied for brand
    if (brandRegistrationStatus === 'PENDING') {
      e.preventDefault();
      setStatusMessage('You have already applied for Brand registration. Please wait for approval or cancel your current application before applying as an Influencer.');
      setShowStatusModal(true);
      return;
    }

    if (brandRegistrationStatus === 'APPROVED') {
      e.preventDefault();
      setStatusMessage('You are already registered as a Brand. You cannot register as both Brand and Influencer.');
      setShowStatusModal(true);
      return;
    }

    // Check influencer registration status
    if (influencerRegistrationStatus === 'PENDING') {
      e.preventDefault();
      setStatusMessage('Your Influencer registration is pending approval. We will notify you once it has been reviewed.');
      setShowStatusModal(true);
      return;
    }

    if (influencerRegistrationStatus === 'APPROVED') {
      e.preventDefault();
      setStatusMessage('Your Influencer account is already approved! You can access your dashboard.');
      setShowStatusModal(true);
      return;
    }

    if (influencerRegistrationStatus === 'REJECTED') {
      e.preventDefault();
      setStatusMessage('Your previous Influencer registration was rejected. Please contact support for more information.');
      setShowStatusModal(true);
      return;
    }

    // If NONE, allow navigation to signup
  };

  // Check if buttons should be shown
  const shouldShowRegistrationButtons = () => {
    if (!isAuthenticated) return false;

    const { brandRegistrationStatus, influencerRegistrationStatus } = registrationStatus;

    // Hide buttons if any registration already approved
    if (brandRegistrationStatus === 'APPROVED' || influencerRegistrationStatus === 'APPROVED') {
      return false;
    }

    // Only show for base USER accounts
    if (!userType || userType === 'user' || userType === 'USER') {
      return true;
    }

    return false;
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
      <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4" style={{ zIndex: 40 }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          {/* <img src="/logo_white.png" alt="Logo" className="h-8 sm:h-10 w-auto mr-2 sm:mr-4" /> */}
          <LogoIcon />
        </div>

        {/* Desktop Navigation - Centered */}
        {/* <ul className="hidden md:flex space-x-6 lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <li>
            <Link href="/brand/login" className="text-white hover:text-blue-300 font-medium transition-colors text-sm lg:text-base">
              Brand
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors text-sm lg:text-base">
              Influencers
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors text-sm lg:text-base">
              Agency
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors text-sm lg:text-base">
              Contact
            </Link>
          </li>
        </ul> */}

        {/* Sign In Button and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          {/* Sign In/Dashboard Button - Desktop */}
          {!isAuthenticated ? (
            <Link 
              href="/login" 
              className="hidden md:inline-flex border border-white text-white hover:bg-white hover:text-black font-medium px-4 py-2 rounded-full transition-colors text-sm lg:text-base"
            >
              Sign In
            </Link>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              {/* Show upgrade buttons for users who haven't upgraded */}
              {shouldShowRegistrationButtons() && (
                <>
                  <Link 
                    href="/brand/signup" 
                    onClick={handleBrandClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full transition-colors text-sm lg:text-base"
                  >
                    Join as Brand
                  </Link>
                  <Link 
                    href="/influencer/signup" 
                    onClick={handleInfluencerClick}
                    className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-medium px-4 py-2 rounded-full transition-colors text-sm lg:text-base"
                  >
                    Join as Influencer
                  </Link>
                </>
              )}
              
              {(registrationStatus.brandRegistrationStatus === 'APPROVED' || registrationStatus.influencerRegistrationStatus === 'APPROVED') && (
                <button
                  onClick={handleDashboardClick}
                  className="border border-white text-white hover:bg-white hover:text-black font-medium px-4 py-2 rounded-full transition-colors text-sm lg:text-base"
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-black hover:bg-gray-200 font-medium px-4 py-2 rounded-full transition-colors text-sm lg:text-base"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-blue-300 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="bg-black/20 backdrop-blur-lg rounded-lg mx-4 p-4">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/brand/signup"
                  className="block text-white hover:text-blue-300 font-medium transition-colors py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Brand
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block text-white hover:text-blue-300 font-medium transition-colors py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Influencers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block text-white hover:text-blue-300 font-medium transition-colors py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agency
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block text-white hover:text-blue-300 font-medium transition-colors py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              {!isAuthenticated ? (
                <li>
                  <Link
                    href="/login"
                    className="block border border-white text-white hover:bg-white hover:text-black font-medium transition-colors py-2 px-4 rounded-full text-base text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              ) : (
                <>
                  {/* Show upgrade buttons for users who haven't upgraded */}
                  {shouldShowRegistrationButtons() && (
                    <>
                      <li>
                        <Link
                          href="/brand/signup"
                          onClick={handleBrandClick}
                          className="block bg-green-600 hover:bg-green-700 text-white font-medium transition-colors py-2 px-4 rounded-full text-base text-center"
                        >
                          Join as Brand
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/influencer/signup"
                          onClick={handleInfluencerClick}
                          className="block border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-medium transition-colors py-2 px-4 rounded-full text-base text-center"
                        >
                          Join as Influencer
                        </Link>
                      </li>
                    </>
                  )}
                  
                  {(registrationStatus.brandRegistrationStatus === 'APPROVED' || registrationStatus.influencerRegistrationStatus === 'APPROVED') && (
                    <li>
                      <button
                        className="block w-full border border-white text-white hover:bg-white hover:text-black font-medium transition-colors py-2 px-4 rounded-full text-base text-center"
                        onClick={() => {
                          handleDashboardClick();
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </button>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-white text-black hover:bg-gray-200 font-medium transition-colors py-2 px-4 rounded-full text-base text-center"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
      </nav>

      {/* Status Modal - Outside nav for proper positioning */}
      {showStatusModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowStatusModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-yellow-100 mb-4">
                <svg className="h-7 w-7 text-yellow-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Registration Status</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{statusMessage}</p>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;