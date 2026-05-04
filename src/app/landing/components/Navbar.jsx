"use client";

import Link from "next/link";

import LogoIcon from "@/components/Icons/logo";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact_us", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-[60px] lg:pt-5">
      <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-md sm:rounded-[40px] lg:rounded-[50px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.92)_0%,rgba(20,20,20,0.8)_24%,rgba(22,163,74,0.22)_56%,rgba(20,20,20,0.65)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(45%_160%_at_72%_50%,rgba(22,163,74,0.34)_0%,rgba(22,163,74,0.1)_45%,rgba(0,0,0,0)_80%)]" />
        </div>

        <div className="relative z-10 flex min-h-[80px] flex-col items-center justify-center gap-5 px-5 py-5 text-center sm:px-8 sm:py-6 lg:flex-row lg:justify-between lg:gap-4 lg:px-[46px] lg:py-0 lg:text-left">
          <Link href="/" aria-label="Phyo Home" className="shrink-0">
            <LogoIcon className="h-auto w-[110px] sm:w-[124px]" />
          </Link>

          <div className="flex w-full flex-col items-center gap-4 sm:gap-5 lg:w-auto lg:flex-row lg:gap-9">
            <nav
              className="font-inter flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-normal text-white sm:gap-x-6 sm:text-base lg:justify-start lg:gap-9"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition duration-200 hover:text-[#bde7c8]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <OutlineGlowButton
              href="/login?expired=true"
              className="h-10 w-full max-w-[220px] sm:w-[120px]"
            >
              Sign In
            </OutlineGlowButton>
          </div>
        </div>
      </div>
    </header>
  );
}
