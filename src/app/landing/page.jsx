"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Play, Search } from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/loginModal";
import LandingHeroBackground from "@/components/shared/LandingHeroBackground";
import MilestoneCards from "@/components/shared/MilestoneCards";
import GridPattern from "@/components/shared/gridLines";
import FaqSection from "@/components/shared/FaqSection";

const aboutSegmentLines = [
  ["Phyo simplifies influencer", "discover, analysis &"],
  ["compaign launches", "so you", "spend less time"],
  ["planning & more", "time scaling."],
];

const pricingPlans = [
  {
    name: "Bronze",
    monthlyPrice: "Rs.0",
    annualPrice: "Rs.0",
    period: "Free Forever",
    description:
      "Perfect for early-stage creators, startups, and curious users.",
    buttonLabel: "Start Free",
    note: "Free Forever, No Credit Card Required.",
    featuresTitle: "Free Plan Includes",
    features: [
      "10 Credits/Month",
      "5 Influencer Searches",
      "Creator Insights (Basic)",
      "Access To All Supported Platforms",
      "Limited AI Report Access (Preview Mode)",
      "Credit Validity: 45 Days",
    ],
  },
  {
    name: "Silver",
    monthlyPrice: "Rs. 1,900",
    annualPrice: "Rs. 1,425",
    period: "/ Month",
    description: "Best for freelancers, boutique agencies, or small teams.",
    buttonLabel: "Start Free",
    note: "Billed Annually.",
    featuresTitle: "Silver Plan Includes",
    highlight: true,
    features: [
      "50 Credits/Month",
      "10 Advanced Searches",
      "4 Campaign Reports",
      "Creator Insights (Advanced)",
      "AI-Powered Report Analyzer",
      "Add Up To 2 Team Members",
      "Historical Data Access (Up To 3 Months)",
      "Access To All Platforms",
      "Email Support",
    ],
  },
  {
    name: "Gold",
    monthlyPrice: "Rs. 7,900",
    annualPrice: "Rs. 5,925",
    period: "/ Month",
    description: "Perfect for growing brands and mid-size teams.",
    buttonLabel: "Start Free",
    note: "Billed Annually.",
    featuresTitle: "Gold Plan Includes",
    features: [
      "250 Credits/Month",
      "20 Deep Searches",
      "10 AI-Powered Campaign Reports",
      "Dedicated Chat Support",
      "AI Optimizes Campaigns",
      "Unlimited Users",
      "Historical Data (Up To 6 Months)",
      "Exportable Analytics (CSV/PDF)",
      "AI Smart Creators, Niche, Region, Top",
      "Multi-Platform Aggregated Creator Profiles",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: "Rs. 19,900",
    annualPrice: "Rs. 14,925",
    period: "/ Month",
    description: "Perfect for global agencies managing multiple campaigns.",
    buttonLabel: "Start Free",
    note: "Billed Annually.",
    featuresTitle: "Premium Plan Includes",
    features: [
      "Unlimited Credits/Month",
      "100 Smart Searches",
      "AI Competitor Analysis (Track 5 Competitors)",
      "Trend Analyzer (5 Trends/Month)",
      "Campaign Auto-Optimization Insights",
      "Reusable Campaign Templates",
      "Dedicated Account Workspace",
      "Priority Access To New Features",
      "Team Analytics Dashboard",
      "Global Creator Index Access",
      "24/7 Priority Support",
    ],
  },
];

const faqItems = [
  {
    question: "How Do Credits Work?",
    answer:
      "Credits are used all around Phyo for transparent usage and maximum flexibility.",
  },
  {
    question: "Can I Try Phyo Before Subscribing?",
    answer:
      "Yes, we offer a free trial period where you can explore all features and see how Phyo can help grow your brand before committing to a subscription.",
  },
  {
    question: "How Secure Is My Data On Phyo?",
    answer:
      "Your data security is our top priority. We use enterprise-grade encryption, secure servers, and follow industry best practices and compliance standards to protect your information at all times.  ",
  },
  {
    question: "Can I Cancel My Subscription Anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time with no hidden fees or penalties. Your account will remain active until the end of your current billing cycle.",
  },
  {
    question: "Can Phyo Actually Help Me Grow My Brand Fast?",
    answer: "Yes! Our platform is designed to accelerate brand growth and help you reach the right audience faster with AI-powered influencer discovery and campaign optimization.",
  },
];

const comparisonRows = [
  {
    feature: "Turnaround Time",
    other: "1-2 Days For Campaign Completion",
    phyo: "30-Minute Campaign Setup And Execution",
  },
  {
    feature: "Data Sources",
    other: "Outdated Or Estimated Data",
    phyo: "Real-Time Data Via Meta & Google Partnerships",
  },
  {
    feature: "Influencer Analytics",
    other: "Basic Follower/Engagement Metrics",
    phyo: "In-Depth Analytics (ROI, Virality, Content Affinity)",
  },
  {
    feature: "Content Affinity Insights",
    other: "Not Available",
    phyo: "Analyzes Audience Preferences For Content Types",
  },
  {
    feature: "AI Matchmaking",
    other: "Manual Searches Or Basic Filters",
    phyo: "AI-Driven Recommendations Based On Brands",
  },
  {
    feature: "Influencer Database",
    other: "Limited Creators (Under 50k)",
    phyo: "300,000+ Vetted Influencers Globally",
  },
  {
    feature: "Global Reach",
    other: "Limited To Local Markets",
    phyo: "Influencers Across 15+ Countries",
  },
  {
    feature: "Performance Estimation",
    other: "No Predictive Tools",
    phyo: "Predicts Campaign Success With AI",
  },
  {
    feature: "Campaign Reports",
    other: "Basic Engagement Summaries",
    phyo: "Detailed Reports (ROI, Audience Sentiment, Platform-Wise Sharing)",
  },
  {
    feature: "Language Support",
    other: "Limited To Major Languages",
    phyo: "Supports 95+ Languages For Global Campaigns",
  },
];

const testimonials = [
  {
    id: "ava",
    quote:
      "Phyo cut our creator discovery time from days to minutes. The AI recommendations were strong enough that our shortlist was ready in a single review.",
    name: "Ava M.",
    location: "New York",
  },
  {
    quote:
      "We used to bounce between spreadsheets, screenshots, and DMs. Now the whole campaign workflow feels cleaner and much easier to manage.",
    id: "jordan",
    name: "Jordan T.",
    location: "Toronto",
  },
  {
    quote:
      "The audience-fit signals helped us avoid weak matches early. That alone saved budget and made our first campaign feel much more intentional.",
    id: "priya",
    name: "Priya R.",
    location: "Mumbai",
  },
  {
    quote:
      "Reporting used to be a scramble at the end of every launch. With Phyo, performance, creator activity, and campaign status all stay in one place.",
    id: "daniel",
    name: "Daniel K.",
    location: "Sydney",
  },
  {
    quote:
      "For a lean team, Phyo feels like adding an operations layer without hiring one. Search, vetting, and campaign coordination are all noticeably faster.",
    id: "nina",
    name: "Nina C.",
    location: "Singapore",
  },
];

const featureAssets = {
  testimonialAvatar:
    "/figma/landing/3b6ba158a5108cf82e25ea2b14ff7977c8903884.png",
  comparisonCross:
    "/figma/landing/fc9e8f00a2a89958e0040fb1cb78db4aa3549fd8.svg",
  comparisonTickGreen:
    "/figma/landing/bae2a9c6970d69a580a6a135df5ed2d3bb15c823.svg",
  comparisonTickWhite:
    "/figma/landing/cffcd5467ab8634bf137a0b477db90f28ff68e8a.svg",
};

const outlineGlowButtonClass =
  "group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615]";
const pressGreenButtonClass = "active:bg-[#16A34A] active:text-white";
const pressWhiteFillButtonClass = "active:!bg-white active:text-[#16A34A]";
const pageSectionClass =
  "mx-auto mt-5 w-full px-4 sm:px-6 lg:max-w-[1440px] lg:px-[120px]";

function ButtonChrome({
  button_bg_color,
  active_bg_color_class = "",
  hide_border = false,
} = {}) {
  const buttonBaseColorClass = button_bg_color ?? "bg-[#141615]";
  const buttonGlowColorClass = button_bg_color ?? "";

  return (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[40px] bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] p-[2px] blur-[2px] ${
          hide_border
            ? "opacity-0"
            : "opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-active:opacity-0"
        }`}
      >
        <span
          className={`block h-full w-full rounded-[inherit] ${buttonGlowColorClass} ${active_bg_color_class}`}
        />
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[40px] ${
          hide_border
            ? "bg-transparent p-0"
            : "bg-white p-px transition-all duration-300 ease-out group-hover:bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] group-hover:p-[2px] group-active:bg-transparent group-active:p-0"
        }`}
      >
        <span
          className={`block h-full w-full rounded-[inherit] ${buttonBaseColorClass} ${active_bg_color_class}`}
        />
      </span>
    </>
  );
}

function ActionButton({
  href,
  icon,
  children,
  iconPosition = "right",
  widthClass = "w-[180px]",
  className = "",
  button_bg_color = "bg-[#11813a]",
}) {
  return (
    <Link
      href={href}
      className={`${outlineGlowButtonClass} ${pressWhiteFillButtonClass} h-12 ${widthClass} !bg-[#16a34a] text-[16px] hover:!bg-[#16a34a] ${className}`}
    >
      <ButtonChrome
        button_bg_color={button_bg_color}
        active_bg_color_class="group-active:bg-white"
      />
      <span
        className={`relative z-10 inline-flex items-center gap-3 ${
          iconPosition === "left" ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {icon ? (
          <span className="inline-flex items-center justify-center">
            {icon}
          </span>
        ) : null}
        <span className="leading-[1.2]">{children}</span>
      </span>
    </Link>
  );
}

function PricingCard({ billingCycle, plan }) {
  const price =
    billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const billingNote =
    plan.monthlyPrice === "$0"
      ? plan.note
      : billingCycle === "annual"
        ? "Billed Annually."
        : "Billed Monthly.";
  const isHighlight = Boolean(plan.highlight);
  const pricingCardGradientClass =
    "bg-[linear-gradient(180deg,#16A34A_0%,#073618_100%)]";
  const pricingCardHoverGradientClass =
    "bg-[linear-gradient(0deg,#16A34A_0%,#073618_100%)]";
  const pricingButtonHoverFillClass =
    "group-hover/pricing:bg-[#0d622c] group-focus-within/pricing:bg-[#094820] group-active/pricing:bg-[#fff]";
  const pricingButtonHoverSurfaceClass =
    "group-hover/pricing:!bg-[#094820] group-focus-within/pricing:!bg-[#094820] group-active/pricing:!bg-[#094820]";
  const secondaryTextClass = isHighlight
    ? "text-[#d7f4df] group-hover/pricing:text-[#f1fff6] group-focus-within/pricing:text-[#f1fff6] group-active/pricing:text-[#f1fff6]"
    : "text-[#9b9b9b] group-hover/pricing:text-[#d7f4df] group-focus-within/pricing:text-[#d7f4df] group-active/pricing:text-[#f1fff6]";
  const pricingButtonBgClass = isHighlight
    ? `bg-[#16a34a] ${pricingButtonHoverFillClass}`
    : `bg-[#141615] ${pricingButtonHoverFillClass}`;
  const pricingButtonSurfaceClass = isHighlight
    ? `!bg-[#138e40] ${pricingButtonHoverSurfaceClass}`
    : pricingButtonHoverSurfaceClass;

  return (
    <article
      className={`group/pricing relative isolate min-h-[711px] w-[285px] shrink-0 overflow-hidden rounded-[24px] border px-5 pb-6 pt-5 transition-all duration-300 lg:min-h-[907px] ${
        isHighlight
          ? "border-[#16a34a] shadow-[0_0_0_1px_rgba(22,163,74,0.4)]"
          : "border-white/5"
      } hover:border-[#31d275] hover:shadow-[0_0_0_1px_rgba(34,211,116,0.58),0_14px_34px_rgba(22,163,74,0.32)] focus-within:border-[#31d275] focus-within:shadow-[0_0_0_1px_rgba(34,211,116,0.58),0_14px_34px_rgba(22,163,74,0.32)] active:scale-[0.995]`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[24px] ${
          isHighlight
            ? pricingCardGradientClass
            : "bg-[linear-gradient(160deg,#151618_0%,#101113_100%)]"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[24px] ${pricingCardHoverGradientClass} opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100`}
      />
      <Image
        aria-hidden
        src="/landing/pricing_card_hover.svg"
        alt=""
        width={285}
        height={300}
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100"
      />

      {plan.highlight ? (
        <div className="absolute right-0 top-5 z-20 lg:top-7">
          <Image
            src="/landing/most_popular.svg"
            alt="Most Popular"
            width={110}
            height={30}
            className="h-7 w-[103px] lg:h-[30px] lg:w-[110px]"
          />
        </div>
      ) : null}

      <div className="relative z-10">
        <h3 className="font-bricolage text-[20px] font-semibold leading-[1.2] text-white lg:text-[36px]">
          {plan.name}
        </h3>

        <div className="mt-3 flex items-end gap-2 lg:gap-3">
          <p className="font-bricolage text-[32px] font-semibold leading-[1.2] text-white lg:text-[36px]">
            {price}
          </p>
          <p
            className={`pb-1 text-[14px] leading-[1.6] transition-colors duration-300 lg:text-base ${secondaryTextClass}`}
          >
            {plan.period}
          </p>
        </div>

        <p
          className={`mt-3 text-[14px] leading-[1.6] transition-colors duration-300 lg:text-[16px] ${secondaryTextClass}`}
        >
          {plan.description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            className={`${outlineGlowButtonClass} ${pressWhiteFillButtonClass} h-10 w-full text-[14px] focus-visible:outline-none lg:h-12 lg:text-[16px] ${pricingButtonSurfaceClass}`}
          >
            <ButtonChrome
              button_bg_color={pricingButtonBgClass}
              active_bg_color_class="group-active:bg-white"
            />
            <span className="relative z-10 leading-[1.2]">
              {plan.buttonLabel}
            </span>
          </button>
          <p
            className={`text-center text-xs leading-[1.6] transition-colors duration-300 ${secondaryTextClass}`}
          >
            {billingNote}
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          <h4 className="font-bricolage text-[20px] font-semibold leading-[1.2] text-white">
            {plan.featuresTitle}
          </h4>
          <ul className="mt-4 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="relative mt-[7.5px] h-[12px] w-[21px] shrink-0">
                  <Image
                    src={
                      isHighlight
                        ? "/landing/double-tick-white.svg"
                        : "/landing/double-tick.svg"
                    }
                    alt=""
                    width={21}
                    height={12}
                    className={`absolute inset-0 h-[12px] w-[21px] transition-opacity duration-300 ${
                      isHighlight
                        ? "opacity-100"
                        : "opacity-100 group-hover/pricing:opacity-0 group-focus-within/pricing:opacity-0 group-active/pricing:opacity-0"
                    }`}
                  />
                  {!isHighlight ? (
                    <Image
                      src="/landing/double-tick-white.svg"
                      alt=""
                      width={21}
                      height={12}
                      className="absolute inset-0 h-[12px] w-[21px] opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100"
                    />
                  ) : null}
                </span>
                <span
                  className={`text-[14px] leading-[1.6] transition-colors duration-300 lg:text-[16px] ${secondaryTextClass}`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function TestimonialCard({ location, name, quote }) {
  return (
    <article className="group relative min-h-[200px] w-[360px] shrink-0 overflow-hidden rounded-[24px] bg-[#141414] p-5 transition-all duration-500 ease-out hover:border-[#16a34a]/35 hover:shadow-[0_18px_42px_rgba(22,163,74,0.16)] hover:bg-[#d1eedd] sm:p-7 lg:min-h-[240px] lg:w-[460px] lg:p-8">
      <div className="absolute left-6 top-7 h-20 w-px bg-[#16a34a] lg:left-8 lg:top-[36px]" />
      <p className="max-w-[308px] pl-4 text-[14px] leading-[1.6] text-[#9b9b9b] transition-colors duration-500 group-hover:text-[#181818] sm:max-w-[508px] sm:pl-5 sm:text-[16px]">
        {quote}
      </p>

      <div className="mt-8 flex items-center gap-3 lg:mt-10">
        <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full">
          <Image
            alt={`${name} testimonial profile`}
            fill
            src={featureAssets.testimonialAvatar}
            className="object-cover"
            sizes="60px"
          />
        </div>
        <div>
          <p className="text-[20px] font-medium leading-[1.4] text-[#16a34a] transition-colors duration-500 group-hover:text-black">
            {name}
          </p>
          <p className="text-[14px] leading-[1.4] text-[#9b9b9b] transition-colors duration-500 group-hover:text-black sm:text-[16px]">
            {location}
          </p>
        </div>
      </div>

      <span className="absolute bottom-[-12px] right-5 font-bricolage text-[11rem] leading-none text-transparent">
        ”
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-10px] right-4 font-bricolage text-[7rem] leading-none text-[#16a34a]/20 sm:bottom-[-12px] sm:right-5 sm:text-[11rem]"
      >
        &rdquo;
      </span>
    </article>
  );
}

function ComparisonRow({ row }) {
  const phyoHoverBackgroundClass =
    row.feature === "Content Affinity Insights"
      ? "hover:bg-[rgba(22,163,74,0.4)]"
      : "hover:bg-[#1b5330]";

  return (
    <>
      <div className="flex min-w-0 items-center justify-start border-t border-transparent bg-[#181818] px-4 py-5 text-left text-[14px] leading-[1.6] text-white lg:px-5 lg:py-6 lg:text-[16px]">
        <span className="min-w-0 break-words text-left">{row.feature}</span>
      </div>

      <div className="flex min-w-0 items-center justify-start gap-2 border-l border-t border-transparent bg-[#181818] px-4 py-5 text-left text-[14px] leading-[1.6] text-[#909090] transition-colors duration-200 hover:bg-[#782626] hover:text-white lg:px-5 lg:py-6 lg:text-[16px]">
        <Image
          src={featureAssets.comparisonCross}
          alt=""
          width={12}
          height={12}
          className="h-[12px] w-[12px] shrink-0"
        />

        <span className="min-w-0 break-words text-left">{row.other}</span>
      </div>

      <div
        className={`group/phyo flex min-w-0 items-center justify-start gap-2 border-l border-t border-transparent bg-[#181818] px-4 py-5 text-left text-[14px] leading-[1.6] text-[#909090] transition-colors duration-200 hover:text-white lg:px-5 lg:py-6 lg:text-[16px] ${phyoHoverBackgroundClass}`}
      >
        <span className="relative h-[12px] w-[21px] shrink-0">
          <Image
            src={featureAssets.comparisonTickGreen}
            alt=""
            width={21}
            height={12}
            className="absolute inset-0 h-[12px] w-[21px] opacity-100 transition-opacity duration-200 group-hover/phyo:opacity-0"
          />

          <Image
            src={featureAssets.comparisonTickWhite}
            alt=""
            width={21}
            height={12}
            className="absolute inset-0 h-[12px] w-[21px] opacity-0 transition-opacity duration-200 group-hover/phyo:opacity-100"
          />
        </span>

        <span className="min-w-0 break-words text-left">{row.phyo}</span>
      </div>
    </>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("annual");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginContinue = () => {
    setShowLoginModal(false);
    router.push("/login");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleOpenLoginModal();
  };

  return (
    <main
      className="bg-black font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="relative isolate overflow-hidden">
        <LandingHeroBackground />

        <div className="relative mx-auto max-w-[1440px]">
          <Navbar />

          <section
            id="home"
            className="px-4 pb-8 pt-8 sm:px-6 sm:pb-10 lg:px-[120px] lg:pt-20"
          >
            <div className="mx-auto max-w-[380px] text-center sm:max-w-[918px]">
              <h1 className="bg-[linear-gradient(102.272deg,#16a34a_3.4%,#ffffff_58%,#16a34a_97.64%)] bg-clip-text font-bricolage text-[36px] font-normal leading-[1.2] text-transparent sm:text-[48px] lg:text-[56px] lg:leading-[1.2]">
                <span className="block">
                  World&apos;s First AI Powered Influencer
                </span>
                <span className="block">Search Engine</span>
              </h1>

              <p className="mx-auto mt-4 max-w-[380px] text-[14px] leading-[1.6] text-[#9b9b9b] sm:max-w-[720px] sm:text-base">
                Search Influencers in Seconds with Phyo and Reach the Right
                Audience Faster.
              </p>
            </div>

            <form
              className="mx-auto mt-6 max-w-[380px] px-0 sm:mt-10 sm:max-w-[1120px] sm:px-4"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative overflow-hidden rounded-full bg-[linear-gradient(270deg,#16A34A_0%,#FFFFFF_52.88%,#16A34A_100%)] p-[0.8px] shadow-[0_0_28px_rgba(22,163,74,0.45)]">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[#16A34A]/25 blur-l" />

                <div className="relative flex h-[60px] items-center gap-3 rounded-full bg-[#010a04]/90 px-4 py-2 backdrop-blur-[12px] transition-colors duration-200 focus-within:bg-[#010a04]/90 sm:h-[72px] sm:px-5 sm:pl-6 sm:pr-[10px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search influencers (e.g. i need influencers in mumbai)..."
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-left text-[15px] leading-[1.2] text-white outline-none placeholder:text-[16px] placeholder:text-[#9B9B9B] sm:text-[15px]"
                  />

                  <button
                    type="submit"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white transition duration-200 hover:bg-[#12803A] sm:h-[48px] sm:w-[115px] sm:gap-2 sm:px-2 sm:text-base"
                  >
                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="mx-auto mt-8">
              <MilestoneCards />
            </div>

            <div className="relative mx-auto mt-8 max-w-[1050px] text-center">
              <GridPattern className="absolute left-0 top-8 hidden h-[519.2px] w-[649px] lg:block" />
              <GridPattern className="absolute left-[930px] top-8 hidden h-[519.2px] w-[649px] lg:block" />

              <p
                className="mx-auto max-w-[380px] text-center text-[23px] leading-[1.32] text-[#9b9b9b] lg:hidden"
                style={{ fontFamily: "'Bell MT', Georgia, serif" }}
              >
                Phyo simplifies influencer discover, analysis & campaign
                launches so you spend less time planning & more time scaling.
              </p>

              <div className="hidden lg:block">
              {aboutSegmentLines.map((line, lineIndex) => (
                <p
                  key={`about-line-${lineIndex}`}
                  className="font-bricolage text-[32px] font-normal leading-[1.2] sm:text-[40px] lg:text-[48px] lg:leading-[1.32]"
                >
                  {line.map((segment, segmentIndex) => {
                    const text = `${segment}${segmentIndex < line.length - 1 ? " " : ""}`;

                    return (
                      <span
                        key={`${lineIndex}-${segment}-${segmentIndex}`}
                        className="group relative inline-block px-1"
                      >
                        {/* Keeps original space/width */}
                        <span className="invisible">{text}</span>

                        {/* Normal text */}
                        <span className="absolute inset-0 text-[#565656] transition-opacity duration-300 ease-in-out group-hover:opacity-0">
                          {text}
                        </span>

                        {/* Gradient hover text */}
                        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#16a34a_0%,#ddf4e6_100%)] bg-clip-text text-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                          {text}
                        </span>
                      </span>
                    );
                  })}
                </p>
              ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="features" className={pageSectionClass}>
        <div className="grid gap-5 lg:items-start lg:grid-cols-[340px_minmax(0,1fr)]">
          <article className="relative h-[468px] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#16a34a_0%,#073618_100%)] p-5 lg:sticky lg:top-6 lg:h-[542px] lg:self-start">
            <div className="max-w-[340px]">
              <h2 className="font-bricolage text-[20px] font-medium leading-[1.2] text-white lg:text-[24px]">
                Launch Smarter Campaigns With AI
              </h2>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#e5e5e5] lg:text-[16px]">
                From finding the right influencers to tracking performance
                everything you need to run high-impact campaigns in one
                platform.
              </p>
            </div>
            <div className="-ml-5 mt-9 h-[324px] w-[380px] lg:mt-[50px] lg:h-[417px] lg:w-[386px] lg:pr-[66px]">
              <Image
                src="/landing/card_phone1.png"
                alt="Phyo platform features composite preview"
                width={386.109}
                height={417.5}
                className="h-full w-full object-contain"
              />
            </div>
          </article>

          <div className="grid gap-5">
            <article className="group relative min-h-[320px] overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] lg:min-h-[275px]">
              <div className="max-w-[340px]">
                <h3 className="font-bricolage text-[20px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover:text-black lg:text-[24px]">
                  Find Creators{" "}
                  <span className="text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    In Seconds
                  </span>
                </h3>
                <p className="mt-3 max-w-[340px] text-[14px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-black/70 lg:max-w-[460px] lg:text-[16px]">
                  No more scrolling for hours. Just type your niche, and our AI
                  shows you the best and right influencers in seconds.
                </p>
              </div>

              <div className="absolute right-6 top-5 hidden h-44 w-44 rounded-full blur-2xl lg:block" />
              <div className="relative mx-auto mt-6 h-[178px] w-[294px] lg:absolute lg:right-5 lg:top-1/2 lg:mt-0 lg:h-[215px] lg:w-[355px] lg:-translate-y-1/2">
                <Image
                  src="/landing/card_laptop1.png"
                  alt="Creator discovery tablet preview"
                  fill
                  className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.24)] lg:mt-[35px] lg:ml-[21px]"
                  sizes="(min-width: 1024px) 355px, 294px"
                />
              </div>
            </article>

            <article className="group relative min-h-[320px] overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] lg:min-h-[275px]">
              <div className="max-w-[340px]">
                <h3 className="font-bricolage text-[20px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover:text-black lg:text-[24px]">
                  Tracking Your{" "}
                  <span className="text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    Campaigns Live
                  </span>
                </h3>
                <p className="mt-3 max-w-[340px] text-[14px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-black/70 lg:max-w-[454px] lg:text-[16px]">
                  See clear performance reports and accurate ROI tracking from
                  start to finish.
                </p>
              </div>

              <div className="relative mx-auto mt-6 h-[252px] w-[272px] lg:absolute lg:right-2 lg:top-1/2 lg:mt-0 lg:h-[378px] lg:w-[309px] lg:-translate-y-1/2">
                <Image
                  src="/landing/card_phone2.png"
                  alt="Campaign tracking phone preview"
                  fill
                  className="object-contain lg:mt-[34px]"
                  sizes="(min-width: 1024px) 309px, 272px"
                />
              </div>
            </article>

            <article className="group relative min-h-[320px] overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] lg:min-h-[275px]">
              <div className="max-w-[340px]">
                <h3 className="font-bricolage text-[20px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover:text-black lg:text-[24px]">
                  Fully{" "}
                  <span className="text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    Managed Campaigns
                  </span>
                </h3>
                <p className="mt-3 max-w-[340px] text-[14px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-black/70 lg:max-w-[454px] lg:text-[16px]">
                  From Delhi to Dubai, LA to London get access to 300k+ real
                  influencers across 15+ countries and 95+ languages.
                </p>
              </div>

              <div className="relative mx-auto mt-6 h-[252px] w-[290px] lg:absolute lg:right-4 lg:top-1/2 lg:mt-0 lg:h-[323px] lg:w-[372px] lg:-translate-y-1/2">
                <Image
                  src="/landing/card_phone3.png"
                  alt="Managed campaigns phone preview"
                  fill
                  className="object-contain lg:mt-[28px] lg:ml-[14px]"
                  sizes="(min-width: 1024px) 372px, 290px"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="pricing" className={pageSectionClass}>
        <div className="mx-auto max-w-[327px] pt-8 text-center sm:max-w-[900px] lg:pt-[80px]">
          <h2 className="font-bricolage text-[20px] leading-[1.2] text-white sm:text-[36px]">
            Simple Scalable{" "}
            <span className="font-semibold text-[#16a34a]">Powerful</span>
          </h2>
          <p className="mt-4 text-[14px] leading-[1.6] text-[#9b9b9b] sm:text-[16px] sm:leading-[1.2]">
            From free tools to full-scale execution Phyo&apos;s pricing plans
            are designed to grow with your goals, not limit them.
          </p>
        </div>

        <div className="mt-6 flex justify-center sm:mt-10">
          <div className="flex w-[312px] items-center justify-center gap-3 sm:w-auto sm:flex-wrap sm:gap-5">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-10 w-[120px] text-[16px] sm:h-12 sm:w-[140px] ${
                billingCycle === "monthly"
                  ? "!bg-[#159b46] hover:!bg-[#159b46]"
                  : ""
              }`}
            >
              <ButtonChrome
                button_bg_color={
                  billingCycle === "monthly" ? "bg-[#159b46]" : undefined
                }
                hide_border={billingCycle === "monthly"}
              />
              <span className="relative z-10 leading-[1.2]">Monthly</span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              aria-pressed={billingCycle === "annual"}
              className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-10 w-[180px] sm:h-12 sm:w-[200px] ${
                billingCycle === "annual"
                  ? "!bg-[#159b46] hover:!bg-[#159b46]"
                  : ""
              }`}
            >
              <ButtonChrome
                button_bg_color={
                  billingCycle === "annual" ? "bg-[#159b46]" : undefined
                }
                hide_border={billingCycle === "annual"}
              />
              <span className="relative z-10 inline-flex items-center gap-2 leading-[1.2] sm:gap-3">
                <span className="text-[16px]">Annually</span>
                <span
                  className={`inline-flex h-7 w-[83px] items-center justify-center rounded-full text-[12px] font-normal leading-[1.2] ${
                    billingCycle === "annual"
                      ? "bg-[#fff] text-[#16a34a]"
                      : "bg-[#3b3b3b] text-[#e3e3e3]"
                  }`}
                >
                  Save 25%
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="-mx-4 mt-6 flex w-auto flex-nowrap gap-5 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-auto sm:mt-10 sm:w-full sm:px-0 xl:relative xl:left-1/2 xl:w-[1200px] xl:max-w-none xl:-translate-x-1/2 xl:justify-start xl:overflow-visible xl:pb-0">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              billingCycle={billingCycle}
              plan={plan}
            />
          ))}
        </div>

        <div className="mb-16 lg:mb-[100px]">
          <div className="relative mt-8 min-h-[220px] overflow-hidden rounded-[24px] bg-[#181818] lg:mt-10 lg:min-h-[170px] lg:h-[170px] xl:left-1/2 xl:w-[1200px] xl:max-w-none xl:-translate-x-1/2">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden opacity-[1] lg:block"
            >
              <div className="absolute left-[586.72px] top-[93.56px] h-[225px] w-[200.247px]">
                <Image
                  src="/figma/488070c5e4feeacbe70331ccd64a0c4e3af2546a.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute left-[396.46px] top-[98.48px] h-[240.52px] w-[171.247px]">
                <Image
                  src="/figma/00251846303279791b91faec36ea50edc8f62cab.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute left-[204.63px] top-[38px] h-[246.146px] w-[174.06px]">
                <Image
                  src="/figma/bf907aa5f0e6e1ff12ad16ebfe908152d575c593.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute left-0 top-[38px] h-[246.146px] w-[174.06px]">
                <Image
                  src="/figma/1dffafc9921ed3ef97ca4b7cf666e6d6bcf16e2f.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <Image
              aria-hidden
              src="/landing/phyo.png"
              alt=""
              width={379}
              height={148}
              className="pointer-events-none absolute bottom-0 right-0 h-auto w-[379px] opacity-[0.14] lg:hidden"
            />
            <div className="relative flex h-full flex-col justify-center gap-4 px-5 py-5 sm:px-10 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-0">
              <div className="w-full max-w-[340px] lg:max-w-[604px]">
                <h3 className="font-bricolage text-[20px] leading-[1.2] text-white sm:text-[36px]">
                  Custom Pricing{" "}
                  <span className="font-semibold text-[#16a34a]">For ALL</span>
                </h3>
                <p className="mt-4 text-[14px] leading-[1.6] text-[#9b9b9b] sm:text-[16px] sm:leading-[1.2]">
                  Powerful Customizable Plans For Agencies Brands, & Enterprise
                  Teams.
                </p>
              </div>

              <button
                type="button"
                className={`${outlineGlowButtonClass} ${pressGreenButtonClass} mt-2 h-10 w-[245px] shrink-0 text-[14px] sm:h-12 sm:text-[16px]`}
              >
                <ButtonChrome active_bg_color_class="group-active:bg-[#16A34A]" />
                <span
                  className="relative z-10 font-inter text-[14px] leading-[1.2] sm:text-[16px]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Get In Touch Now
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(112deg,#16a34a_1.18%,#073618_80.36%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 right-0 hidden w-[44%] bg-[linear-gradient(90deg,rgba(4,88,24,0)_0%,rgba(4,56,21,0.3)_35%,rgba(4,56,21,0.76)_100%)] lg:block" />
          <div className="absolute -right-10 top-0 h-full w-full opacity-40 lg:-right-10 lg:w-[58%]">
            <Image
              src="/landing/Group.svg"
              alt=""
              fill
              className="object-contain object-right"
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-[412px] px-4 py-10 lg:hidden">
          <div className="relative min-h-[560px] overflow-hidden">
            <div className="max-w-[341px]">
              <h2 className="font-bricolage text-[20px] font-normal leading-[1.4] text-white">
                <span className="block">AI Search. Verified Influencers.</span>
                <span className="block">Real Results.</span>
              </h2>
              <p className="mt-4 max-w-[341px] text-[14px] leading-[1.6] text-[#dcdcdc]">
                From discovery to campaign execution everything you need to run
                high-performing influencer campaigns in one platform.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <ActionButton
                  href="/signup"
                  widthClass="w-[240px]"
                  className="h-10"
                  iconPosition="right"
                  icon={
                    <ArrowRight className="h-[14px] w-[14px] stroke-[1.8]" />
                  }
                >
                  Start With Free Trial
                </ActionButton>
                <ActionButton
                  href="/contact_us"
                  widthClass="w-[180px]"
                  className="h-10"
                  iconPosition="left"
                  icon={<Play className="h-[14px] w-[13px] stroke-[1.8]" />}
                >
                  Watch Demo
                </ActionButton>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-22px] left-[52%] w-[340px] -translate-x-1/2">
              <Image
                src="/landing/iPhone_16_Pro.png"
                alt="Phyo product preview for campaign workflow"
                width={340}
                height={282}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        <div className="relative mx-auto hidden min-h-[560px] w-full max-w-[1440px] items-center px-4 py-12 sm:px-6 lg:flex lg:min-h-[600px] lg:px-[120px]">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)]">
            <div className="max-w-[620px] mb-[54px]">
              <h2 className="font-bricolage text-[34px] font-normal leading-[1.3] text-white sm:text-[36px] sm:leading-[1.35]">
                <span className="block">AI Search. Verified Influencers.</span>
                <span className="block">Real Results.</span>
              </h2>
              <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-[#dcdcdc]">
                From discovery to campaign execution everything you need to run
                high-performing influencer campaigns in one platform.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ActionButton
                  href="/signup"
                  widthClass="w-full sm:w-[240px]"
                  iconPosition="right"
                  icon={
                    <ArrowRight className="h-[14px] w-[14px] stroke-[1.8]" />
                  }
                >
                  Start With Free Trial
                </ActionButton>
                <ActionButton
                  href="/contact_us"
                  widthClass="w-full sm:w-[180px]"
                  iconPosition="left"
                  icon={<Play className="h-[14px] w-[13px] stroke-[1.8]" />}
                >
                  Watch Demo
                </ActionButton>
              </div>
            </div>

            <div
              className="relative flex justify-end lg:-mb-[162px] w-[600px] h-[480px] overflow-hidden"
              style={{ marginBottom: "0px" }}
            >
              <Image
                src="/landing/iPhone_16_Pro.png"
                alt="Phyo product preview for campaign workflow"
                width={780}
                height={550}
                className="h-auto w-full w-[780px] mr-[48px]"
              />
              {/* <Image
                src="/landing/iPhone_16_Pro.png"
                alt="Phyo product preview for campaign workflow"
                width={664}
                height={550}
                sizes="(min-width: 1024px) 720px, 92vw"
                className="h-auto w-full max-w-[780px] translate-x-[18px] sm:translate-x-[34px] lg:max-w-[830px] lg:translate-x-[62px]"
                priority
                style={{
                  width:'530px'
                }}
              /> */}
            </div>
          </div>
        </div>
      </section>

      <div className="mb-16 mt-16 lg:mb-[100px] lg:mt-[100px]">
        <FaqSection
          sectionClassName={pageSectionClass}
          faqItems={faqItems}
          ctaHref="#home"
        />
      </div>
      <section className={pageSectionClass}>
        <div className="text-center">
          <h2 className="font-bricolage text-[20px] leading-[1.4] text-white sm:text-[36px]">
            Comparison Reveals{" "}
            <span className="text-[#16a34a]">Differences & Similarities.</span>
          </h2>
        </div>

        <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-10 sm:px-0">
          <div className="w-[840px] overflow-hidden rounded-[24px] border border-[#16a34a] bg-[#181818] lg:w-auto">
            <div className="grid grid-cols-[280px_280px_280px] lg:grid-cols-3">
              {["Feature", "Other Platform", "Phyo"].map((heading) => (
                <div
                  key={heading}
                  className="min-w-0 break-words bg-[#16a34a] px-4 py-5 text-left font-bricolage text-[20px] font-bold leading-[1.2] text-white lg:px-5 lg:py-6 lg:text-[28px]"
                >
                  {heading}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[280px_280px_280px] lg:grid-cols-3">
              {comparisonRows.map((row) => (
                <ComparisonRow key={row.feature} row={row} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mb-16 mt-16 lg:mb-[100px] lg:mt-[100px]">
        <section id="testimonials" className={` ${pageSectionClass}`}>
          <div className="mx-auto max-w-[380px] text-center sm:max-w-[900px]">
            <h2 className="font-bricolage text-[20px] leading-[1.2] text-white sm:text-[36px]">
              Simple Scalable{" "}
              <span className="font-semibold text-[#16a34a]">Powerful</span>
            </h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-[#9b9b9b] sm:text-[16px] sm:leading-[1.2]">
              From free tools to full-scale execution Phyo&apos;s pricing plans
              are designed to grow with your goals, not limit them.
            </p>
          </div>

          <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:hidden">
            {testimonials.map((testimonial) => (
              <div key={`${testimonial.id}-mobile`} className="snap-start">
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  location={testimonial.location}
                />
              </div>
            ))}
          </div>

          <div className="relative mt-10 hidden lg:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black via-black/85 to-transparent sm:w-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black via-black/85 to-transparent sm:w-20" />

            <div className="overflow-hidden">
              <div
                className="testimonial-carousel-track flex w-max [transform:translate3d(0,0,0)] hover:[animation-play-state:paused]"
                style={{ "--testimonial-carousel-duration": "34s" }}
              >
                {[0, 1].map((trackIndex) => (
                  <div
                    key={`testimonial-track-${trackIndex}`}
                    className="flex shrink-0 gap-5 pr-5"
                    aria-hidden={trackIndex === 1}
                  >
                    {testimonials.map((testimonial) => (
                      <TestimonialCard
                        key={`${testimonial.id}-${trackIndex}`}
                        quote={testimonial.quote}
                        name={testimonial.name}
                        location={testimonial.location}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Login required"
          onClick={handleCloseLoginModal}
        >
          <div
            className="max-h-[95vh] overflow-auto rounded-[1px]"
            onClick={(event) => event.stopPropagation()}
          >
            <LoginModal
              onLogin={handleLoginContinue}
              onLater={handleCloseLoginModal}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes testimonial-carousel-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .testimonial-carousel-track {
          animation: testimonial-carousel-scroll
            var(--testimonial-carousel-duration, 34s) linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-carousel-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
