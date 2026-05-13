"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import MenuFill from "@/components/Icons/MenuFill";
import MenuUnfold4Line from "@/components/Icons/MenuUnfold4Line";
import LogoIcon from "@/components/Icons/logo";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  {href: "/Career", label: "Career" },
  { href: "/contact-us", label: "Contact" },
];; 

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-[60px] lg:pt-5">
      <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-md sm:rounded-[40px] lg:rounded-[50px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.92)_0%,rgba(20,20,20,0.8)_24%,rgba(22,163,74,0.22)_56%,rgba(20,20,20,0.65)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(45%_160%_at_72%_50%,rgba(22,163,74,0.34)_0%,rgba(22,163,74,0.1)_45%,rgba(0,0,0,0)_80%)]" />
        </div>

        <div className="relative z-10 flex min-h-[80px] flex-col items-center justify-center gap-5 px-5 py-5 text-center sm:px-8 sm:py-6 lg:flex-row lg:justify-between lg:gap-4 lg:px-[46px] lg:py-0 lg:text-left">
          <div className="navbar-top flex w-full items-center justify-between lg:w-auto lg:justify-start">
            <Link href="/" aria-label="Phyo Home" className="shrink-0">
              <LogoIcon className="h-auto w-[110px] sm:w-[124px]" />
            </Link>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="mobile-menu-toggle hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <MenuUnfold4Line width={22} height={22} fill="#ffffff" />
              ) : (
                <MenuFill width={22} height={22} fill="#ffffff" />
              )}
            </button>
          </div>

          <div className="desktop-nav flex w-full flex-col items-center gap-4 sm:gap-5 lg:w-auto lg:flex-row lg:gap-9">
            <nav
              className="font-inter flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-normal text-white sm:gap-x-6 sm:text-base lg:justify-start lg:gap-9"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {navItems.map((item) => {

                const isActive = pathname === item.href;
                return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition duration-200 hover:text-[#bde7c8] ${
                  isActive 
                  ? "text-white drop-shadow-[0_0_10_rgba(255,255,255,0.18)]"
                  : "text-[#9b9b9b]"
                }`}
                >
                  {item.label}
                </Link>
              );
            })}
            </nav>

            <OutlineGlowButton
              href="/login?expired=true"
              className="h-10 w-full max-w-[220px] sm:w-[120px]"
            >
              Sign In
            </OutlineGlowButton>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mobile-nav-panel hidden border-t border-white/10 px-5 pb-5 pt-3">
            <nav
              className="mobile-nav-links flex flex-col gap-3 font-inter text-[15px] font-normal text-white"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3 transition duration-200 hover:bg-white/10 hover:text-[#bde7c8]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <OutlineGlowButton
              href="/login?expired=true"
              className="mobile-signin mt-4 h-10 w-full max-w-none"
            >
              Sign In
            </OutlineGlowButton>
          </div>
        ) : null}

        <style>{`
          @media (max-width: 639px) {
            .mobile-menu-toggle {
              display: inline-flex;
            }

            .desktop-nav {
              display: none;
            }

            .mobile-nav-panel {
              display: block;
            }

            .navbar-top {
              gap: 0.75rem;
            }

            .mobile-nav-links {
              font-size: 14px;
            }

            .mobile-signin {
              max-width: none;
            }
          }
        `}</style>
      </div>
    </header>
  );
}
