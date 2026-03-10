'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRoleContext } from '@/app/context/RoleContext';
import { useAccountPages } from '@/hooks/useAccountPages';
import {
  AccountCircleFill,
  ListUnordered,
  FileList3Line,
  WalletLine,
  RocketLine,
  PauseCircleLine,
  DeleteBin2Line,
  Notification2Line,
  QuestionLine
} from '@phyoofficial/phyo-icon-library';

// Icon map
const ICON_MAP = {
  AccountCircleFill, // Used for user profile
  ListUnordered,
  FileList3Line,
  WalletLine,
  RocketLine,
  PauseCircleLine,
  DeleteBin2Line,
  Notification2Line,
  QuestionLine,
};

/**
 * Component to render account menu items based on user role
 * This component dynamically displays account pages the user has access to
 * Can be used in dropdown menus or full-page layouts
 */
export default function AccountMenuItems({ onItemClick, isCompact = false }) {
  const router = useRouter();
  const { role } = useRoleContext();
  const { visiblePages } = useAccountPages();

  const handleNavigate = (pagePath) => {
    const fullPath = `/${role}/account/${pagePath}`;
    router.push(fullPath);
    onItemClick?.();
  };

  if (isCompact) {
    // Compact dropdown style
    return (
      <>
        {visiblePages.map((page) => {
          const IconComponent = ICON_MAP[page.icon];

          return (
            <button
              key={page.id}
              className="w-full"
              onClick={() => handleNavigate(page.path)}
              title={page.description}
            >
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                {IconComponent && <IconComponent className="w-5 h-5" />}
                <span className="text-base font-semibold">{page.name}</span>
              </div>
            </button>
          );
        })}
      </>
    );
  }

  // Full page style - returns fragment with menu items
  return (
    <>
      {visiblePages.map((page) => {
        const IconComponent = ICON_MAP[page.icon];

        return (
          <button
            key={page.id}
            onClick={() => handleNavigate(page.path)}
            title={page.description}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 rounded-lg bg-gray-100">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{page.name}</p>
                  {page.description && (
                    <p className="text-xs text-gray-500">{page.description}</p>
                  )}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        );
      })}
    </>
  );
}
