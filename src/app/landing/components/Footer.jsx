"use client";

import Link from "next/link";

import LogoIcon from "@/components/Icons/logo";

const footerQuickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

const footerOtherLinks = [
  { href: "/term-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/faqs", label: "FAQs" },
  { href: "/careers", label: "Careers" },
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
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.55fr_0.55fr_0.8fr]">
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
                    className="transition duration-200 hover:text-[#16a34a]"
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
                    className="transition duration-200 hover:text-[#16a34a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[24px] font-medium leading-[1.2] text-white">
              Get In Touch
            </h3>

            <ul className="mt-5 space-y-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
              <li>PHYO Technologies LLP</li>

              <li>
                <Link
                  href="mailto:hello@phyo.ai"
                  className="flex items-center gap-2 transition duration-200 hover:text-[#16a34a]"
                >
                  <svg
                    viewBox="0 0 26 18.8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0"
                  >
                    <path
                      d="M7 5.8L13 10L19 5.8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 15.4V3.4C1 2.76348 1.25286 2.15303 1.70294 1.70294C2.15303 1.25286 2.76348 1 3.4 1H22.6C23.2365 1 23.847 1.25286 24.2971 1.70294C24.7471 2.15303 25 2.76348 25 3.4V15.4C25 16.0365 24.7471 16.647 24.2971 17.0971C23.847 17.5471 23.2365 17.8 22.6 17.8H3.4C2.76348 17.8 2.15303 17.5471 1.70294 17.0971C1.25286 16.647 1 16.0365 1 15.4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>

                  <span>hello@phyo.ai</span>
                </Link>
              </li>

              <li className="flex items-center gap-2">
  <svg
    viewBox="0 0 18 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 shrink-0"
  >
    <path
      d="M3.30144 0.559061L4.67436 0.139858C5.42645 -0.0903771 6.23536 -0.0349534 6.95016 0.295787C7.66495 0.626527 8.23679 1.20999 8.55898 1.9373L9.62014 4.33309C9.89715 4.95867 9.97429 5.65659 9.84073 6.32894C9.70717 7.00129 9.36963 7.61433 8.87544 8.08203L7.11666 9.7457C7.06528 9.79431 7.03273 9.85997 7.02489 9.93082C6.97313 10.405 7.28959 11.3282 8.02017 12.6121C8.54957 13.5448 9.03074 14.2005 9.43896 14.5671C9.72484 14.8239 9.88131 14.8789 9.94836 14.8597L12.313 14.1252C12.9588 13.9247 13.6502 13.9344 14.2903 14.1528C14.9304 14.3713 15.4871 14.7876 15.8824 15.3434L17.3882 17.4645C17.8466 18.1094 18.059 18.9013 17.9859 19.6931C17.9127 20.4849 17.5591 21.2229 16.9906 21.77L15.9471 22.7733C15.3939 23.3051 14.7144 23.6824 13.9749 23.8685C13.2354 24.0545 12.461 24.043 11.7271 23.835C8.48722 22.9166 5.58257 20.141 2.98027 15.5656C0.375623 10.9842 -0.539652 7.0382 0.305036 3.72638C0.494651 2.98152 0.870066 2.29882 1.3951 1.74406C1.92013 1.18929 2.5759 0.781183 3.30144 0.559061Z"
      fill="currentColor"
    />
  </svg>

  <span className="whitespace-nowrap">
    +91-9315732227, +91 7888509409
  </span>
</li>

              <li className="flex items-start gap-2">
                <svg
                  viewBox="0 0 19.76 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0 h-5 w-5 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.36167 10.1614C4.36167 8.69837 4.94283 7.29532 5.97732 6.26084C7.0118 5.22635 8.41485 4.64519 9.87783 4.64519C11.3408 4.64519 12.7439 5.22635 13.7783 6.26084C14.8128 7.29532 15.394 8.69837 15.394 10.1614C15.394 11.6243 14.8128 13.0274 13.7783 14.0619C12.7439 15.0963 11.3408 15.6775 9.87783 15.6775C8.41485 15.6775 7.0118 15.0963 5.97732 14.0619C4.94283 13.0274 4.36167 11.6243 4.36167 10.1614ZM9.87783 6.38713C8.87685 6.38713 7.91686 6.78477 7.20906 7.49258C6.50125 8.20038 6.10361 9.16037 6.10361 10.1614C6.10361 11.1623 6.50125 12.1223 7.20906 12.8301C7.91686 13.5379 8.87685 13.9356 9.87783 13.9356C10.8788 13.9356 11.8388 13.5379 12.5466 12.8301C13.2544 12.1223 13.652 11.1623 13.652 10.1614C13.652 9.16037 13.2544 8.20038 12.5466 7.49258C11.8388 6.78477 10.8788 6.38713 9.87783 6.38713Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.0352167 8.83399C0.234235 6.42659 1.33101 4.18198 3.10789 2.54557C4.88478 0.909151 7.21192 0.000529297 9.62753 0H10.1292C12.5448 0.000529297 14.872 0.909151 16.6489 2.54557C18.4257 4.18198 19.5225 6.42659 19.7215 8.83399C19.9429 11.5158 19.1144 14.1788 17.4105 16.2616L11.8444 23.068C11.6062 23.3593 11.3063 23.594 10.9663 23.7552C10.6262 23.9164 10.2547 24 9.87837 24C9.50208 24 9.1305 23.9164 8.79048 23.7552C8.45046 23.594 8.1505 23.3593 7.9123 23.068L2.3462 16.2616C0.642383 14.1788 -0.186165 11.5158 0.0352167 8.83399ZM9.62753 1.74195C7.6494 1.74278 5.74383 2.48709 4.28882 3.82723C2.83382 5.16737 1.93566 7.00543 1.77252 8.97683C1.5882 11.2087 2.27769 13.425 3.69563 15.1584L9.26172 21.9659C9.33655 22.0575 9.4308 22.1313 9.53765 22.182C9.6445 22.2327 9.76128 22.259 9.87953 22.259C9.99779 22.259 10.1146 22.2327 10.2214 22.182C10.3283 22.1313 10.4225 22.0575 10.4973 21.9659L16.0634 15.1584C17.4806 13.4246 18.1692 11.2084 17.9842 8.97683C17.8211 7.00523 16.9227 5.167 15.4675 3.82683C14.0122 2.48667 12.1064 1.74249 10.1281 1.74195H9.62753Z"
                    fill="currentColor"
                  />
                </svg>

                <span>
                  India And United Arab Of Emirates
                  <br />
                  (Global Operations)
                </span>
              </li>
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
                <img
                  src={Icon}
                  alt={`${label} icon`}
                  className="h-10 w-10 hover:bg-[#16a34a] hover:rounded-full"
                />
              </Link>
            ))}
            <Link
              href="/"
              aria-label="YouTube"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-white transition duration-200 hover:bg-white/14"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
                <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.12" />
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="white" fillOpacity="0" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}