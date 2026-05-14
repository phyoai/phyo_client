"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

import MenuUnfold4Line from "@/components/Icons/MenuUnfold4Line";
import LogoIcon from "@/components/Icons/logo";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  {href: "/Career", label: "Career" },
  { href: "/contact-us", label: "Contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("menu-open");
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="relative z-[999999] mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-[60px] lg:pt-5">
      <div
        className={`relative isolate rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-md sm:rounded-[40px] lg:rounded-[50px] ${
          isMobileMenuOpen ? "overflow-visible" : "overflow-hidden"
        }`}
      >
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
              className="mobile-menu-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:hidden"
            >
              {isMobileMenuOpen ? (
                <MenuUnfold4Line width={22} height={22} fill="#ffffff" />
              ) : (
                <img src="/landing/Vector.png" alt="menu" width={22} height={22} />
              )}
            </button>
          </div>

          <div className="desktop-nav hidden w-full flex-col items-center gap-4 sm:gap-5 lg:flex lg:w-auto lg:flex-row lg:gap-9">
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

        {isMobileMenuOpen && createPortal(
          <div className="fixed inset-0 z-[2147483647] sm:hidden">
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
              />
              <button
                aria-label="Close menu backdrop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0"
              />
            </div>

            <div className="absolute right-4 top-4 z-[2147483647] h-[408px] w-[280px] overflow-hidden rounded-[24px] bg-[#001a0a] shadow-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_12%,rgba(22,163,74,0.4),rgba(0,26,10,1)_62%)]" />
              <div className="relative h-full px-5 pb-5 pt-5">
                <div className="mb-6 flex items-center justify-between">
                  <LogoIcon className="h-auto w-[92px]" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[22px] leading-none text-white"
                    aria-label="Close menu"
                  >
                    &times;
                  </button>
                </div>

                <nav
                  className="flex flex-col gap-6 text-[20px] leading-[1.2]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`transition ${
                          isActive ? "text-white" : "text-[#9a9a9a] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-6 h-px w-full bg-white/20" />
                <OutlineGlowButton href="/login?expired=true" className="mt-6 h-10 w-full max-w-none">
                  Sign In
                </OutlineGlowButton>
              </div>
            </div>
          </div>
        , document.body)}
      </div>
    </header>
  );
}
