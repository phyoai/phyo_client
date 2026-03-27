'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

/**
 * Mobile-Optimized Header Component
 * Responsive header with mobile menu, touch-friendly interactions
 * Touch targets: 44x44px minimum
 */
export default function MobileHeader({
  title = 'Phyo',
  showMenu = true,
  menuItems = [],
  onMenuItemClick = null,
}) {
  const { isMobile, isTouch } = useMobileOptimization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo/Title - Touch friendly size */}
        <Link
          href="/"
          className="flex items-center gap-2 h-11 min-h-[44px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 px-2"
        >
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </Link>

        {/* Mobile menu button - 44x44px touch target */}
        {showMenu && isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && isMobile && (
        <nav
          id="mobile-menu"
          className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
        >
          <ul className="space-y-1 p-4">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  onClick={() => {
                    onMenuItemClick?.(item);
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
