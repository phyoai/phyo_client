'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/AppBar';
import { useGoBack } from '@/hooks/useGoBack';

export default function NotificationPreferencesAll() {
  const router = useRouter();
  const goBack = useGoBack();
  const [preferences, setPreferences] = useState({
    smsAlerts: true,
    emailAlerts: true,
    pushNotifications: true,
    campaignRecommendations: true,
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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

  return (
    <div className="w-full h-full flex flex-col bg-neutral-base">
      <AppBar
        title="Notification preferences"
        onBack={() => router.back()}
        showMenu={true}
        onMenuClick={() => console.log('Open menu')}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-9 py-4">
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
