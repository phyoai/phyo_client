"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

import LogoIcon from "@/components/Icons/logo";

const footerQuickLinks = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#footer", label: "Contact" },
];

const footerOtherLinks = [
  { href: "/", label: "Terms & Conditions" },
  { href: "/", label: "Privacy Policy" },
  { href: "#faq", label: "FAQs" },
];

const socialLinks = [
  { href: "/", icon: '/footer/fb.svg', label: "Facebook" },
  { href: "/", icon: '/footer/ig.svg', label: "Instagram" },
  { href: "/", icon: '/footer/tw.svg', label: "Twitter" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#141414]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-[120px] lg:py-[40px]">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.55fr_0.55fr]">
          <div className="max-w-[409px]">
            <LogoIcon className="h-auto w-[154px]" />
            <p className="mt-5 text-[16px] leading-[1.6] text-[#9b9b9b] [text-transform:capitalize]">
              It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with
              desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.
            </p>
          </div>

          <div>
            <h3 className="text-[24px] font-medium leading-[1.2] text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[24px] font-medium leading-[1.2] text-white">
              Other Links
            </h3>
            <ul className="mt-5 space-y-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
              {footerOtherLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[linear-gradient(90deg,rgba(22,163,74,0.05)_0%,rgba(22,163,74,0.55)_45%,rgba(255,255,255,0.06)_100%)]" />

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[16px] leading-[1.2] text-white">
            ©All Rights Reserve At 2026 PHYO TECHNOLOGIES LLP
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-white transition duration-200 hover:bg-white/14"
              >
                <img src={Icon} alt={`${label} icon`} className="h-10 w-10" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
