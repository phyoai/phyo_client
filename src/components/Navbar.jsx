 "use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({ token }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src={"/logo.png"} alt='logo' height={80} width={80} />
            </Link>
          </div>

          {/* Desktop Links */}
          {/* <div className="hidden md:flex space-x-8">
            <Link href="/">
              <p className="text-gray-700 hover:text-[color:var(--dark-green)]">Home</p>
            </Link>
            <Link href="/">
              <p className="text-gray-700 hover:text-[color:var(--dark-green)]">About</p>
            </Link>
            <Link href="/">
              <p className="text-gray-700 hover:text-[color:var(--dark-green)]">Services</p>
            </Link>
            <Link href="/">
              <p className="text-gray-700 hover:text-[color:var(--dark-green)]">Contact</p>
            </Link>
          </div> */}

          {/* Desktop Buttons */}
          {token ? "" : <div className="hidden md:flex space-x-4">
            <Link href="/login">
              <p className="px-4 py-2 rounded-full border border-[color:var(--dark-green)] text-[color:var(--dark-green)] ">
                Login
              </p>
            </Link>
            <Link href="/signup">
              <p className="px-4 py-2 rounded-full bg-[color:var(--dark-green)] text-white">
                Sign Up
              </p>
            </Link>
          </div>}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-[3px]">
          <div className="ml-auto mt-0 mr-0 h-full w-[280px] overflow-hidden rounded-l-[24px] bg-[#001a0a] shadow-2xl relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_45%,_rgba(22,163,74,0.45),_transparent_60%)]" />
            <div className="relative px-5 pt-5 pb-5">
            <div className="mb-8 flex items-center justify-between">
              <Image src={"/logo.png"} alt='logo' height={24} width={92} />
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-[34px] leading-none"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            <div className="mobile-nav-panel px-0 pb-0 pt-0">
              <nav className="mobile-nav-links flex flex-col gap-3 text-white">
                <Link className="mobile-nav-link active" href="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link className="mobile-nav-link" href="/about" onClick={() => setIsOpen(false)}>About</Link>
                <Link className="mobile-nav-link" href="/testimonials" onClick={() => setIsOpen(false)}>Testimonials</Link>
                <Link className="mobile-nav-link" href="/Career" onClick={() => setIsOpen(false)}>Careers</Link>
                <Link className="mobile-nav-link" href="/contact-us" onClick={() => setIsOpen(false)}>Contact</Link>
              </nav>
            </div>

            {token ? "" : <div className="mt-9">
              <div className="mb-7 h-px w-full bg-white/20" />
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <p className="mobile-signin w-full rounded-full border border-white py-2.5 text-center text-white leading-[1.2] font-normal">
                  Sign In
                </p>
              </Link>
            </div>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

