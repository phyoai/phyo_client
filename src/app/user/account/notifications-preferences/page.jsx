'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/ui/AppBar';
import { useGoBack } from '@/hooks/useGoBack';
import apiClient from '@/utils/api';

export default function NotificationPreferencesAll() {
  const router = useRouter();
  const goBack = useGoBack();
  const [preferences, setPreferences] = useState({
    smsAlerts: false,
    emailAlerts: false,
    pushNotifications: false,
    campaignRecommendations: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notification-settings');
      const settings = response.data.data;

      setPreferences({
        smsAlerts: settings.sms?.urgent || false,
        emailAlerts: settings.email?.campaigns || false,
        pushNotifications: settings.push?.campaigns || false,
        campaignRecommendations: settings.email?.promotions || false,
      });
    } catch (err) {
      console.error('Error fetching notification settings:', err);
      setError('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = async (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    setPreferences(newPreferences);

    try {
      // Send updates to API
      if (key === 'smsAlerts') {
        await apiClient.patch('/notification-settings/sms', { urgent: newPreferences[key] });
      } else if (key === 'emailAlerts') {
        await apiClient.patch('/notification-settings/email', { campaigns: newPreferences[key] });
      } else if (key === 'pushNotifications') {
        await apiClient.patch('/notification-settings/push', { campaigns: newPreferences[key] });
      } else if (key === 'campaignRecommendations') {
        await apiClient.patch('/notification-settings/email', { promotions: newPreferences[key] });
      }
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Failed to update settings');
      // Revert the change on error
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const PreferenceItem = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between pl-4 pr-4 py-3">
      <span className="text-base font-semibold text-[#242527]">{label}</span>
      <button
        onClick={onToggle}
        className="relative inline-flex items-center"
      >
        <div className={`w-11 h-8 rounded-full transition-colors flex items-center px-1 ${enabled ? 'bg-[#3d4f36]' : 'bg-gray-300'}`}>
          <div className={`w-6 h-6 bg-neutral-base rounded-full transition-transform ${enabled ? 'translate-x-3' : 'translate-x-0'}`}></div>
        </div>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col bg-neutral-base">
        <AppBar
          title="Notification preferences"
          onBack={() => router.back()}
          showMenu={true}
          onMenuClick={() => console.log('Open menu')}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-base">
      <AppBar
        title="Notification preferences"
        onBack={() => router.back()}
        showMenu={true}
        onMenuClick={() => console.log('Open menu')}
      />

      {error && (
        <div className="mx-3 mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-9 py-3 sm:py-4">
        <div className="w-full">
          <PreferenceItem
            label="SMS Alerts"
            enabled={preferences.smsAlerts}
            onToggle={() => togglePreference('smsAlerts')}
          />
          <PreferenceItem
            label="Email Alerts"
            enabled={preferences.emailAlerts}
            onToggle={() => togglePreference('emailAlerts')}
          />
          <PreferenceItem
            label="Push Notifications"
            enabled={preferences.pushNotifications}
            onToggle={() => togglePreference('pushNotifications')}
          />
          <PreferenceItem
            label="Campaign Recomendations"
            enabled={preferences.campaignRecommendations}
            onToggle={() => togglePreference('campaignRecommendations')}
          />
        </div>
      </div>
    </div>
  );
}
