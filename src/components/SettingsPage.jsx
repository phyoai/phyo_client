'use client';

import { useState } from 'react';

const SETTINGS = [
  { id: 'sms',      label: 'SMS Alerts',               defaultOn: true  },
  { id: 'email',    label: 'Email Alerts',              defaultOn: true  },
  { id: 'push',     label: 'Push Notifications',        defaultOn: false },
  { id: 'campaign', label: 'Campaign Recommendations',  defaultOn: false },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultOn]))
  );

  const toggle = (id) => setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-[#000201] text-white p-5">
      <div className="rounded-[24px] bg-[#181818] p-[20px] flex flex-col gap-[20px]">

        <h1 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Setting
        </h1>

        <div className="flex flex-col gap-[20px]">
          {SETTINGS.map((setting) => {
            const on = toggles[setting.id];
            return (
              <div
                key={setting.id}
                className="flex items-center justify-between rounded-[8px] bg-[#262525] px-4 h-[40px]"
              >
                <span className="text-[14px] text-[#aaaaaa]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {setting.label}
                </span>
                <button
                  onClick={() => toggle(setting.id)}
                  className={`relative flex h-[24px] w-[60px] items-center rounded-full transition-colors duration-200 px-[4px] ${on ? 'bg-[#16a34a]' : 'bg-[#181818]'}`}
                  aria-label={`Toggle ${setting.label}`}
                >
                  <span
                    className={`h-[16px] w-[16px] rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[36px]' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
