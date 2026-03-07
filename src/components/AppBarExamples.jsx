'use client'
import React, { useState } from 'react';
import AppBar from './AppBar';

/**
 * AppBar Component Usage Examples
 *
 * The AppBar component supports multiple configurations for different use cases
 */

// Example 1: Basic AppBar with back button
export function BasicAppBar() {
  return (
    <AppBar
      title="Page Title"
      supportingText="Optional subtitle"
      onBack={() => window.history.back()}
    />
  );
}

// Example 2: AppBar with notifications
export function NotificationAppBar() {
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <AppBar
      title="Home"
      supportingText="Welcome back"
      onBack={() => window.history.back()}
      showNotification={true}
      notificationCount={notificationCount}
      onNotificationClick={() => console.log('Open notifications')}
      showMenu={true}
      onMenuClick={() => console.log('Open menu')}
    />
  );
}

// Example 3: AppBar with search
export function SearchAppBar() {
  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  return (
    <AppBar
      title="Influencers"
      supportingText="Search & Discover"
      variant="search"
      searchPlaceholder="Search influencers..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onSearch={() => console.log('Search:', searchValue)}
      onSearchToggle={setShowSearch}
      showNotification={true}
      notificationCount={2}
      onNotificationClick={() => console.log('Open notifications')}
    />
  );
}

// Example 4: AppBar for account/settings page
export function AccountAppBar() {
  return (
    <AppBar
      title="Account"
      onBack={() => window.history.back()}
      showMenu={true}
      onMenuClick={() => console.log('Open account menu')}
    />
  );
}

// Example 5: AppBar for campaigns page
export function CampaignsAppBar() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <AppBar
      title="Campaigns"
      supportingText="Manage your campaigns"
      onBack={() => window.history.back()}
      variant="search"
      searchPlaceholder="Search campaigns..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      showNotification={true}
      notificationCount={5}
      showMenu={true}
      onMenuClick={() => console.log('Open menu')}
    />
  );
}

/**
 * Integration Guide:
 *
 * 1. Basic Usage:
 *    import AppBar from '@/components/AppBar';
 *
 *    <AppBar
 *      title="Page Title"
 *      onBack={() => router.back()}
 *    />
 *
 * 2. With all features:
 *    <AppBar
 *      title="Title"
 *      supportingText="Subtitle"
 *      onBack={handleBack}
 *      variant="search"
 *      searchValue={search}
 *      onSearchChange={setSearch}
 *      onSearch={handleSearch}
 *      showNotification={true}
 *      notificationCount={3}
 *      onNotificationClick={handleNotifications}
 *      showMenu={true}
 *      onMenuClick={handleMenu}
 *    />
 *
 * 3. Props:
 *    - title: string - Main title text
 *    - supportingText: string - Subtitle/supporting text
 *    - onBack: function - Back button callback
 *    - variant: 'default' | 'search' - Display variant
 *    - searchValue: string - Current search value
 *    - onSearchChange: function - Search input change handler
 *    - onSearch: function - Search submit handler
 *    - searchPlaceholder: string - Search placeholder text
 *    - showNotification: boolean - Show notification bell
 *    - notificationCount: number - Badge count on notification
 *    - onNotificationClick: function - Notification click handler
 *    - showMenu: boolean - Show menu icon
 *    - onMenuClick: function - Menu click handler
 */
