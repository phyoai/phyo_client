import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
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
          <div className="hidden md:flex space-x-4">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
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
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link href="/">
              <p className="block text-gray-700 hover:text-[color:var(--dark-green)]">Home</p>
            </Link>
            <Link href="/">
              <p className="block text-gray-700 hover:text-[color:var(--dark-green)]">About</p>
            </Link>
            <Link href="/">
              <p className="block text-gray-700 hover:text-[color:var(--dark-green)]">Services</p>
            </Link>
            <Link href="/">
              <p className="block text-gray-700 hover:text-[color:var(--dark-green)]">Contact</p>
            </Link>
            <div className="flex space-x-4">
              <Link href="/">
                <p className="w-full px-4 py-2 rounded-full border border-[color:var(--dark-green)] text-[color:var(--dark-green)] text-center hover:bg-[color:var(--dark-green)] hover:text-white">
                  Login
                </p>
              </Link>
              <Link href="/">
                <p className="w-full px-4 py-2 rounded-full bg-[color:var(--dark-green)] text-white text-center hover:bg-blue-600">
                  Sign Up
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
