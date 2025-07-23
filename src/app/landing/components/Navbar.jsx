import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto mr-4" />
  
      </div>
      {/* Dummy Page Links */}
      <ul className="flex space-x-8">
        <li><Link href="/brand/signup" className="text-white hover:text-blue-300 font-medium transition-colors">Brand</Link></li>
        <li><Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors">Influencers</Link></li>
        <li><Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors">AGENCY</Link></li>
        <li><Link href="#" className="text-white hover:text-blue-300 font-medium transition-colors">CONTACT</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;