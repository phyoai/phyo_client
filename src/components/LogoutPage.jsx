'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';

function getAccountBasePath(pathname) {
  if (pathname?.startsWith('/brand/account')) return '/brand/account';
  if (pathname?.startsWith('/influencer/account')) return '/influencer/account';
  if (pathname?.startsWith('/user/account')) return '/user/account';
  return '/account';
}

export default function LogoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const accountBasePath = useMemo(() => getAccountBasePath(pathname), [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="h-full min-h-0 flex-1 bg-[#000201] flex items-center justify-center p-5" style={{ height: 'calc(100vh - 72px)' }}>
      <div className="w-full max-w-[400px] rounded-[24px] bg-[linear-gradient(180deg,#16a34a_0%,#063618_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="px-5 py-10 text-center flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[4px]">
            <h3 className="text-[24px] font-normal text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              Are you sure you want to log out?
            </h3>
            <p className="text-[16px] leading-[1.6] text-[#e3e3e3]" style={{ fontFamily: 'Inter, sans-serif' }}>
              You will be logged out of your account. You can log back in anytime.
            </p>
          </div>
          <div className="flex gap-[20px]">
            <button
              onClick={() => router.push(accountBasePath)}
              className="flex-1 h-[36px] rounded-full border border-white text-[12px] font-medium text-white transition-colors hover:bg-white/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 h-[36px] rounded-full bg-[#850000] text-[12px] font-medium text-white transition-colors hover:bg-[#6e0000]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
