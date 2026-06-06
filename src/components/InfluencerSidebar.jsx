'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from '../app/context/SidebarContext';
import {
  Home4Fill,
  InboxLine,
  CalendarEventLine,
  AccountCircleLine,
  Message3Fill,
  UserLine,
  ListUnordered,
  FileList3Line,
  WalletLine,
  PassExpiredLine,
  CloseCircleLine,
  QuestionLine,
  FileTextLine,
  Settings3Line,
  GlobalLine,
  LogoutBoxRLine,
} from '@phyoofficial/phyo-icon-library';
import { useAuth } from '../app/context/AuthContext';

function ChevronDown({ open }) {
  return (
    <svg
      width="11" height="7" viewBox="0 0 11 7" fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M1 1L5.5 6L10 1" stroke="#9b9b9b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const InfluencerSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isExpanded, sidebarButtonAction } = useSidebar();
  useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(
    pathname.startsWith('/influencer/account')
  );

  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    if (pathname.startsWith('/influencer/account')) setAccountOpen(true);
  }, [pathname]);

  const mainNavItems = [
    { name: 'Home',     href: '/influencer/dashboard', icon: Home4Fill },
    { name: 'Inbox',    href: '/influencer/inbox',     icon: InboxLine, badge: 3 },
    { name: 'Campaign', href: '/influencer/campaigns', icon: CalendarEventLine },
  ];

  const accountSubItems = [
    { name: 'Profile',             href: '/influencer/account',                  icon: UserLine },
    { name: 'My List',             href: '/influencer/account/my-lists',          icon: ListUnordered },
    { name: 'Transactions',        href: '/influencer/account/billing-history',   icon: FileList3Line },
    { name: 'Upgrade Plan',        href: '/influencer/account/upgrade-plan',      icon: WalletLine },
    { name: 'Pause Subscription',  href: '/influencer/account/pause',             icon: PassExpiredLine },
    { name: 'Cancel Subscription', href: '/influencer/account/cancel',            icon: CloseCircleLine },
    { name: 'Help & Support',      href: '/influencer/account/help-support',      icon: QuestionLine },
    { name: 'Terms & Conditions',  href: '/influencer/account/terms-conditions',  icon: FileTextLine },
    { name: 'Privacy Policy',      href: '/influencer/account/privacy-policy',    icon: FileTextLine },
    { name: 'Settings',            href: '/influencer/account/settings',          icon: Settings3Line },
    { name: 'Language',            href: '/influencer/account/language',          icon: GlobalLine },
  ];

  const handleStartNewChat = () => {
    if (sidebarButtonAction) sidebarButtonAction();
    else router.push('/influencer/inbox');
  };

  const handleLogout = () => router.push('/influencer/account/logout');

  const isAccountActive = pathname.startsWith('/influencer/account');

  if (!mounted) {
    return <div className={`h-screen bg-[#181818] fixed left-0 top-0 z-50 ${isExpanded ? 'w-[250px]' : 'w-[72px]'}`} />;
  }

  return (
    <div
      className={`h-screen bg-[#181818] fixed left-0 top-0 flex flex-col z-50 transition-[width] duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'w-[250px]' : 'w-[72px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-[90px] shrink-0">
        <Image
          src="/landing/phyo_logo.svg"
          alt="Phyo"
          width={80}
          height={22}
          priority
          className={`object-contain transition-all duration-300 ${isExpanded ? 'w-[80px]' : 'w-[28px]'}`}
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-[10px] mt-[28px] flex-1 px-[10px] overflow-y-auto scrollbar-hide">

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center h-[40px] rounded-full no-underline hover:bg-white/5 transition-colors ${
                isExpanded ? 'pl-[20px] pr-[12px]' : 'justify-center'
              }`}
            >
              <span className="flex-shrink-0 flex items-center justify-center w-[16px] h-[16px]">
                <Icon width={16} height={16} fill={isActive ? '#16a34a' : '#9b9b9b'} color={isActive ? '#16a34a' : '#9b9b9b'} />
              </span>
              {isExpanded && (
                <span className={`ml-[12px] text-[16px] font-normal capitalize leading-[1.2] whitespace-nowrap flex-1 ${isActive ? 'text-[#16a34a]' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {item.name}
                </span>
              )}
              {item.badge && (
                <span className={`${isExpanded ? 'ml-auto' : 'absolute top-0.5 right-0.5'} bg-[#16a34a] text-white text-[10px] font-semibold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Account — expandable */}
        <button
          onClick={() => {
            if (isExpanded) setAccountOpen((o) => !o);
            else router.push('/influencer/account');
          }}
          className={`relative flex items-center h-[40px] rounded-full hover:bg-white/5 transition-colors w-full ${
            isExpanded ? 'pl-[20px] pr-[12px]' : 'justify-center'
          }`}
        >
          <span className="flex-shrink-0 flex items-center justify-center w-[16px] h-[16px]">
            <AccountCircleLine width={16} height={16} fill={isAccountActive ? '#16a34a' : '#9b9b9b'} color={isAccountActive ? '#16a34a' : '#9b9b9b'} />
          </span>
          {isExpanded && (
            <>
              <span className={`ml-[12px] text-[16px] font-normal capitalize leading-[1.2] whitespace-nowrap flex-1 text-left ${isAccountActive ? 'text-[#16a34a]' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                Account
              </span>
              <ChevronDown open={accountOpen} />
            </>
          )}
        </button>

        {isExpanded && accountOpen && (
          <>
            <div className="h-px bg-white/10 mx-3 my-1" />
            <div className="bg-[#1e1e1e] rounded-[16px] mx-1 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              {accountSubItems.map((sub, idx) => {
                const Icon = sub.icon;
                const isActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    className={`flex items-center gap-[8px] px-[12px] py-[10px] transition-colors hover:bg-white/5 ${idx === 0 ? 'border-b border-white/10' : ''}`}
                  >
                    <span className="shrink-0 w-[28px] h-[28px] flex items-center justify-center">
                      <Icon width={16} height={16} fill={isActive ? '#ffffff' : '#9b9b9b'} color={isActive ? '#ffffff' : '#9b9b9b'} />
                    </span>
                    <span className={`text-[14px] font-normal capitalize leading-[1.2] whitespace-nowrap ${isActive ? 'text-white' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {sub.name}
                    </span>
                  </Link>
                );
              })}

              {(() => {
                const isLogoutActive = pathname.includes('/account/logout');
                return (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-[8px] px-[12px] py-[10px] hover:bg-white/5 transition-colors"
                  >
                    <span className="shrink-0 w-[28px] h-[28px] flex items-center justify-center">
                      <LogoutBoxRLine width={16} height={16} fill={isLogoutActive ? '#ffffff' : '#9b9b9b'} color={isLogoutActive ? '#ffffff' : '#9b9b9b'} />
                    </span>
                    <span className={`text-[14px] font-normal capitalize leading-[1.2] whitespace-nowrap ${isLogoutActive ? 'text-white' : 'text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      Log Out
                    </span>
                  </button>
                );
              })()}
            </div>
            <div className="h-px bg-white/10 mx-3 my-1" />
          </>
        )}
      </nav>

      {/* Start New Chat */}
      <div className="pb-[40px] shrink-0 flex justify-center px-[10px]">
        {isExpanded ? (
          <button
            onClick={handleStartNewChat}
            className="w-full max-w-[200px] h-[40px] bg-[#16a34a] hover:bg-[#15803d] rounded-full text-white text-[16px] font-normal capitalize transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Start New Chat
          </button>
        ) : (
          <button
            onClick={handleStartNewChat}
            className="w-[40px] h-[40px] bg-[#16a34a] hover:bg-[#15803d] rounded-full flex items-center justify-center transition-colors"
          >
            <Message3Fill width={18} height={18} fill="white" color="white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InfluencerSidebar;
