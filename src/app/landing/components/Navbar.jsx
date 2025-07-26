import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img src="/logo_white.png" alt="Logo" className="h-8 sm:h-10 w-auto mr-2 sm:mr-4" />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 lg:space-x-8">
          <li>
            <Link href="/brand/signup" className="text-white hover:text-blue-300 font-medium transition-colors text-sm lg:text-base">
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
              AGENCY
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors text-sm lg:text-base">
              CONTACT
            </Link>
          </li>
        </ul>

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
                  AGENCY
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="block text-white hover:text-blue-300 font-medium transition-colors py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;