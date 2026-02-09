'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical } from 'lucide-react';

export default function NotificationPreferences() {
  const router = useRouter();
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
          <div className={`w-6 h-6 bg-white rounded-full transition-transform ${enabled ? 'translate-x-3' : 'translate-x-0'}`}></div>
        </div>
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* App Bar */}
      <div className="flex items-center justify-between px-1 py-2 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#242527]" />
        </button>
        
        <h1 className="flex-1 text-xl font-semibold text-[#242527] px-2">
          Notification preferences
        </h1>
        
        <button className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-6 h-6 text-[#242527]" />
        </button>
      </div>

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

