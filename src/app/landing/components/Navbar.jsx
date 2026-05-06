"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoIcon from "@/components/Icons/logo";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact_us", label: "Contact" },
];

function MobileMenuIcon({ isOpen }) {
  const lineClassName =
    "absolute right-0 h-1 rounded-full bg-white transition-all duration-200 ease-out";

  return (
    <span aria-hidden className="relative block h-6 w-8">
      <span
        className={`${lineClassName} ${
          isOpen
            ? "top-1/2 w-8 -translate-y-1/2 rotate-45"
            : "top-0 w-8"
        }`}
      />
      <span
        className={`${lineClassName} top-1/2 -translate-y-1/2 ${
          isOpen ? "w-0 opacity-0" : "w-[22px]"
        }`}
      />
      <span
        className={`${lineClassName} ${
          isOpen
            ? "bottom-1/2 w-8 translate-y-1/2 -rotate-45"
            : "bottom-0 w-8"
        }`}
      />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-[60px] lg:pt-5">
      <div className="relative lg:hidden">
        {isMobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[2px]"
          />
        ) : null}

        <div className="relative z-[130] h-[60px] rounded-[50px] bg-white/[0.06] px-4 backdrop-blur-[16px]">
          <div className="flex h-full items-center justify-between gap-4">
            <Link href="/" aria-label="Phyo Home" className="shrink-0">
              <LogoIcon className="h-auto w-[116px]" />
            </Link>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="landing-mobile-navigation"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/[0.08]"
            >
              <MobileMenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>

          <div
            id="landing-mobile-navigation"
            aria-hidden={!isMobileMenuOpen}
            className={`absolute left-0 right-0 top-full z-[130] mt-3 origin-top rounded-[30px] border border-white/10 bg-[#0d0d0d]/95 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-[20px] transition-all duration-200 ease-out ${
              isMobileMenuOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-3 opacity-0"
            }`}
          >
            <nav
              className="flex flex-col gap-2 text-base font-normal text-white"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-[20px] px-4 py-3 transition duration-200 hover:bg-white/[0.06] hover:text-[#bde7c8]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <OutlineGlowButton
              href="/login?expired=true"
              tabIndex={isMobileMenuOpen ? 0 : -1}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 h-11 w-full"
            >
              Sign In
            </OutlineGlowButton>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="relative isolate overflow-hidden rounded-[50px] border border-white/10 bg-white/[0.04] backdrop-blur-md">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.92)_0%,rgba(20,20,20,0.8)_24%,rgba(22,163,74,0.22)_56%,rgba(20,20,20,0.65)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(45%_160%_at_72%_50%,rgba(22,163,74,0.34)_0%,rgba(22,163,74,0.1)_45%,rgba(0,0,0,0)_80%)]" />
          </div>

          <div className="relative z-10 flex min-h-[80px] items-center justify-between gap-4 px-[46px]">
            <Link href="/" aria-label="Phyo Home" className="shrink-0">
              <LogoIcon className="h-auto w-[124px]" />
            </Link>

            <div className="flex items-center gap-9">
              <nav
                className="font-inter flex items-center gap-9 text-base font-normal text-white"
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
                className="h-10 w-[120px]"
              >
                Sign In
              </OutlineGlowButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
