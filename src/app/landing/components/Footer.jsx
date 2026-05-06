"use client";

import Image from "next/image";
import Link from "next/link";

import LogoIcon from "@/components/Icons/logo";

const footerQuickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact_us", label: "Contact" },
];

const footerOtherLinks = [
  { href: "/term-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/faqs", label: "FAQs" },
];

const socialLinks = [
  { href: "/", icon: "/footer/fb.svg", label: "Facebook" },
  { href: "/", icon: "/footer/ig.svg", label: "Instagram" },
  { href: "/", icon: "/footer/tw.svg", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#141414]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-[120px] lg:py-[40px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.15fr_0.55fr_0.55fr]">
          <div className="col-span-2 max-w-[380px] lg:col-span-1 lg:max-w-[409px]">
            <LogoIcon className="h-auto w-[93px] sm:w-[154px]" />
            <p className="mt-5 text-[14px] leading-[1.6] text-[#9b9b9b] sm:text-[16px]">
              It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with
              desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.
            </p>
          </div>

          <div>
            <h3 className="text-[20px] font-medium leading-[1.2] text-white sm:text-[24px]">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-[14px] leading-[1.2] text-[#9b9b9b] sm:space-y-4 sm:text-[16px]">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition duration-200 hover:text-[#16a34a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[20px] font-medium leading-[1.2] text-white sm:text-[24px]">
              Other Links
            </h3>
            <ul className="mt-5 space-y-3 text-[14px] leading-[1.2] text-[#9b9b9b] sm:space-y-4 sm:text-[16px]">
              {footerOtherLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition duration-200 hover:text-[#16a34a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(22,163,74,1)_52.4%,rgba(0,0,0,1)_100%)]" />

        <div className="mt-8 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[12px] leading-[1.2] text-white sm:text-[16px]">
            © All Rights Reserve At 2026 PHYO TECHNOLOGIES LLP
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/12 text-white transition duration-200 hover:bg-white/16 sm:h-11 sm:w-11"
              >
                <Image
                  src={icon}
                  alt={`${label} icon`}
                  width={40}
                  height={40}
                  className="h-9 w-9 rounded-full sm:h-10 sm:w-10"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
