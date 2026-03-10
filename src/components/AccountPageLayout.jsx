'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { useGoBack } from '@/hooks/useGoBack';
import { colors } from '@/config/colors';
import AppBar from './AppBar';
import AccountMenuItems from './Account/AccountMenuItems';
import {
  UserCircleFill,
  MoonLine,
  TranslateLine,
  ArrowRightSLine,
} from '@phyoofficial/phyo-icon-library';

const SettingMenuItem = ({ icon: Icon, label, description, onClick, isDanger = false, hasToggle = false, isActive = false }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 cursor-pointer ${
        isDanger ? 'hover:bg-semantic-error/10' : 'hover:bg-neutral-muted'
      }`}
      style={{
        backgroundColor: isDanger ? 'transparent' : 'transparent',
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.1)' : colors.accent.base,
          }}
        >
          <Icon
            width={20}
            height={20}
            fill={isDanger ? colors.semantic.error.bold : colors.brand.icon}
          />
        </div>
        <div className="flex-1">
          <p
            className="font-medium text-sm"
            style={{
              color: isDanger ? colors.semantic.error.bold : colors.text.neutral.base,
            }}
          >
            {label}
          </p>
          {description && (
            <p className="text-xs" style={{ color: colors.neutral.inverse.muted }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {hasToggle ? (
        <div className="relative w-12 h-6 bg-neutral-muted rounded-full" style={{ backgroundColor: isActive ? colors.brand.base : colors.neutral.muted }}>
          <div
            className="absolute top-1 w-5 h-5 bg-neutral-base rounded-full transition-all duration-300"
            style={{
              left: isActive ? '22px' : '2px',
              backgroundColor: colors.ui.white,
            }}
          />
        </div>
      ) : (
        <ArrowRightSLine width={20} height={20} fill={colors.neutral.inverse.muted} />
      )}
    </div>
  );
};

export default function AccountPageLayout() {
  const router = useRouter();
  const goBack = useGoBack();
  const { darkMode, toggleDarkMode } = useTheme();

  const additionalMenuItems = [
    { icon: MoonLine, label: 'Dark Theme', description: null, hasToggle: true, isActive: darkMode },
    { icon: TranslateLine, label: 'App Language', description: 'English (Default Language)' },
  ];

  return (
    <>
      <AppBar
        title="Account"
        onBack={() => router.back()}
        showMenu={true}
        onMenuClick={() => console.log('Open account menu')}
      />
      <div className="max-w-2xl mx-auto p-8">

      {/* User Profile Section */}
      <div
        className="p-6 rounded-lg mb-8 flex items-center justify-between"
        style={{ backgroundColor: colors.accent.base }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: colors.brand.icon }}
          >
            J
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: colors.brand.text }}>
              Jazzleen
            </h2>
            <p className="text-sm" style={{ color: colors.neutral.inverse.muted }}>
              Pro
            </p>
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: colors.brand.base,
            color: colors.ui.white,
          }}
        >
          PRO
        </div>
      </div>

        {/* Settings Menu - Role-based Account Pages */}
        <div className="space-y-2 mb-4">
          <AccountMenuItems onItemClick={() => {}} />
        </div>

        {/* Additional Settings */}
        <div className="space-y-2">
          {additionalMenuItems.map((item, index) => (
            <SettingMenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              description={item.description}
              isDanger={item.isDanger}
              hasToggle={item.hasToggle}
              isActive={item.isActive}
              onClick={() => {
                if (item.label === 'Dark Theme') {
                  toggleDarkMode();
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
