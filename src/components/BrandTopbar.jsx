'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from '../app/context/SidebarContext';
import secureAuthStorage from '../utils/secure-auth';
import { MenuFill, MenuUnfold4Line } from '@phyoofficial/phyo-icon-library';

const PAGE_TITLES = {
  // ── Brand ──────────────────────────────────────────────────────────
  '/brand/dashboard':                          { title: 'Welcome!',              subtitle: 'Search & Discover popular creators' },
  '/brand/inbox':                              { title: 'Inbox',                 subtitle: 'Your messages and invitations' },
  '/brand/campaigns':                          { title: 'Campaigns',             subtitle: 'Manage your campaigns' },
  '/brand/campaigns/all-campaigns':            { title: 'All Campaigns',         subtitle: 'Browse your active campaigns' },
  '/brand/campaigns/all-drafts':               { title: 'Draft Campaigns',       subtitle: 'Your saved drafts' },
  '/brand/campaigns/new-applications':         { title: 'New Applications',      subtitle: 'Influencers who applied' },
  '/brand/notifications':                      { title: 'Notifications',         subtitle: 'Your latest updates' },
  '/brand/account':                            { title: 'Account',               subtitle: 'Manage your profile and settings' },
  '/brand/account/my-lists':                   { title: 'My Lists',              subtitle: 'Your saved influencer lists' },
  '/brand/account/billing-history':            { title: 'Transactions',          subtitle: 'Your billing history' },
  '/brand/account/upgrade-plan':               { title: 'Upgrade Plan',          subtitle: 'Choose the right plan for you' },
  '/brand/account/help-support':               { title: 'Help & Support',        subtitle: 'Get help with your account' },
  '/brand/account/settings':                   { title: 'Settings',              subtitle: 'App settings and preferences' },
  '/brand/account/language':                   { title: 'Language',              subtitle: 'App language preferences' },
  '/brand/account/terms-conditions':           { title: 'Terms & Conditions',    subtitle: '' },
  '/brand/account/privacy-policy':             { title: 'Privacy Policy',        subtitle: '' },
  '/brand/account/logout':                     { title: 'Log Out',               subtitle: '' },
  '/brand/account/pause':                      { title: 'Pause Subscription',    subtitle: '' },
  '/brand/account/cancel':                     { title: 'Cancel Subscription',   subtitle: '' },

  // ── User ───────────────────────────────────────────────────────────
  '/user/dashboard':                           { title: 'Welcome!',              subtitle: 'Search & Discover popular creators' },
  '/user/inbox':                               { title: 'Inbox',                 subtitle: 'Your messages and invitations' },
  '/user/campaigns':                           { title: 'Campaigns',             subtitle: 'Manage your campaigns' },
  '/user/campaigns/all-campaigns':             { title: 'All Campaigns',         subtitle: 'Browse your active campaigns' },
  '/user/campaigns/all-drafts':                { title: 'Draft Campaigns',       subtitle: 'Your saved drafts' },
  '/user/campaigns/new-applications':          { title: 'New Applications',      subtitle: 'Influencers who applied' },
  '/user/notifications':                       { title: 'Notifications',         subtitle: 'Your latest updates' },
  '/user/account':                             { title: 'Account',               subtitle: 'Manage your profile and settings' },
  '/user/account/my-lists':                    { title: 'My Lists',              subtitle: 'Your saved influencer lists' },
  '/user/account/billing-history':             { title: 'Transactions',          subtitle: 'Your billing history' },
  '/user/account/upgrade-plan':                { title: 'Upgrade Plan',          subtitle: 'Choose the right plan for you' },
  '/user/account/help-support':                { title: 'Help & Support',        subtitle: 'Get help with your account' },
  '/user/account/settings':                    { title: 'Settings',              subtitle: 'App settings and preferences' },
  '/user/account/language':                    { title: 'Language',              subtitle: 'App language preferences' },
  '/user/account/terms-conditions':            { title: 'Terms & Conditions',    subtitle: '' },
  '/user/account/privacy-policy':              { title: 'Privacy Policy',        subtitle: '' },
  '/user/account/logout':                      { title: 'Log Out',               subtitle: '' },
  '/user/account/pause':                       { title: 'Pause Subscription',    subtitle: '' },
  '/user/account/cancel':                      { title: 'Cancel Subscription',   subtitle: '' },

  // ── Influencer ─────────────────────────────────────────────────────
  '/influencer/dashboard':                     { title: 'Welcome!',              subtitle: 'Search & Discover popular creators' },
  '/influencer/inbox':                         { title: 'Inbox',                 subtitle: 'Your messages and invitations' },
  '/influencer/campaigns':                     { title: 'Campaigns',             subtitle: 'Manage your campaigns' },
  '/influencer/campaigns/all-campaigns':       { title: 'All Campaigns',         subtitle: 'Browse your active campaigns' },
  '/influencer/campaigns/all-drafts':          { title: 'Draft Campaigns',       subtitle: 'Your saved drafts' },
  '/influencer/campaigns/new-applications':    { title: 'New Applications',      subtitle: 'Influencers who applied' },
  '/influencer/notifications':                 { title: 'Notifications',         subtitle: 'Your latest updates' },
  '/influencer/account':                       { title: 'Account',               subtitle: 'Manage your profile and settings' },
  '/influencer/account/my-lists':              { title: 'My Lists',              subtitle: 'Your saved influencer lists' },
  '/influencer/account/billing-history':       { title: 'Transactions',          subtitle: 'Your billing history' },
  '/influencer/account/upgrade-plan':          { title: 'Upgrade Plan',          subtitle: 'Choose the right plan for you' },
  '/influencer/account/help-support':          { title: 'Help & Support',        subtitle: 'Get help with your account' },
  '/influencer/account/settings':              { title: 'Settings',              subtitle: 'App settings and preferences' },
  '/influencer/account/language':              { title: 'Language',              subtitle: 'App language preferences' },
  '/influencer/account/terms-conditions':      { title: 'Terms & Conditions',    subtitle: '' },
  '/influencer/account/privacy-policy':        { title: 'Privacy Policy',        subtitle: '' },
  '/influencer/account/logout':                { title: 'Log Out',               subtitle: '' },
  '/influencer/account/pause':                 { title: 'Pause Subscription',    subtitle: '' },
  '/influencer/account/cancel':                { title: 'Cancel Subscription',   subtitle: '' },
};

function getRole(pathname) {
  if (pathname.startsWith('/brand/')) return 'brand';
  if (pathname.startsWith('/user/')) return 'user';
  if (pathname.startsWith('/influencer/')) return 'influencer';
  return 'brand';
}

const BrandTopbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isExpanded, setIsExpanded } = useSidebar();
  const userData = secureAuthStorage.getUserData();

  const matched = Object.entries(PAGE_TITLES).find(
    ([path]) => pathname === path || pathname.startsWith(path + '/')
  );
  const { title, subtitle } = matched?.[1] ?? { title: 'Dashboard', subtitle: '' };

  const initials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const role = getRole(pathname);

  return (
    <div className="h-[72px] bg-[#181818] flex items-center px-5 gap-4 flex-shrink-0 rounded-b-[24px] border-b border-white/5">
      {/* Hamburger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        {isExpanded
          ? <MenuUnfold4Line width={22} height={22} fill="#9b9b9b" />
          : <MenuFill width={22} height={22} fill="#9b9b9b" />
        }
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xl font-semibold leading-tight truncate" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-[#9b9b9b] text-sm leading-tight truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.push(`/${role}/notifications`)}
          className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-[#c9c9c9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div
          onClick={() => router.push(`/${role}/account`)}
          className="w-9 h-9 rounded-full bg-[#16a34a] flex items-center justify-center overflow-hidden cursor-pointer ring-2 ring-[#16a34a]/20 flex-shrink-0"
        >
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
      </div>
    </div>
  );
};

export default BrandTopbar;
