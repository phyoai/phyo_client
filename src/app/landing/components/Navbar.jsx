'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoIcon from '../../../components/Icons/logo'
import { authUtils } from '../../../utils/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authUtils.isAuthenticated());
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
  }, []);

  const handleLogout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
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
              <Link 
                href="/brand/dashboard" 
                className="border border-white text-white hover:bg-white hover:text-black font-medium px-4 py-2 rounded-full transition-colors text-sm lg:text-base"
              >
                Dashboard
              </Link>
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
                  <li>
                    <Link
                      href="/brand/dashboard"
                      className="block border border-white text-white hover:bg-white hover:text-black font-medium transition-colors py-2 px-4 rounded-full text-base text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
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
  );
};

export default Navbar;