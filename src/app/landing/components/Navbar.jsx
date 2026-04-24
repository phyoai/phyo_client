"use client";

import Link from "next/link";

import LogoIcon from "@/components/Icons/logo";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#footer", label: "Contact" },
];

const outlineGlowButtonClass =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-[40px] border border-white bg-transparent text-white transition-all duration-300 before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[39px] ,rgba(255,255,255,0)_72%)] before:opacity-0 hover:border-[#16a34a] hover:shadow-[0_0_0_1px_rgba(22,163,74,0.95),0_0_10px_rgba(22,163,74,0.46)] hover:before:opacity-100";
const pressGreenButtonClass =
  "active:border-[#16a34a] active:bg-[#16a34a] active:text-white";

export default function Navbar() {
  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-[60px] lg:pt-5">
      <div className="rounded-[32px] border border-white/5 bg-white/[0.06] backdrop-blur-md sm:rounded-[40px] lg:rounded-[50px]">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-[46px] lg:py-4">
          <Link href="/" aria-label="Phyo Home">
            <LogoIcon className="h-auto w-[110px] sm:w-[124px]" />
          </Link>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-9">
            <nav className="flex flex-wrap items-center gap-4 text-sm text-white sm:gap-6 sm:text-base lg:gap-9">
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

            <Link
              href="/login"
              className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-10 w-[100px] text-[16px]`}
            >
              <span className="relative z-10 leading-[1.2]">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
