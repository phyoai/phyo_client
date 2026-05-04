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
      "Your data security is our top priority. We use enterprise-grade encryption, secure servers, and follow industry best practices..",
  },
  {
    question: "Can I Cancel My Subscription Anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time with no hidden fees or penalties. Your account will remain...",
  },
  {
    question: "Can Phyo Actually Help Me Grow My Brand Fast?",
    answer: "Yes! Our platform is designed to accelerate brand growth...",
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
  "mx-auto max-w-[1440px] sm:px-6 lg:px-[120px] mt-[20px]";

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
      className={`group/pricing relative isolate min-h-[907px] min-w-[285px] overflow-hidden rounded-[24px] border px-5 pb-6 pt-5 transition-all duration-300 ${
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
        <div className="absolute right-0 top-7 z-20">
          <img
            src="/landing/most_popular.svg"
            alt="Most Popular"
            className="w-[110px] h-[30px]"
          />
        </div>
      ) : null}

      <div className="relative z-10">
        <h3 className="font-bricolage text-[36px] font-semibold leading-[1.2] text-white">
          {plan.name}
        </h3>

        <div className="mt-3 flex items-end gap-3">
          <p className="font-bricolage text-[36px] font-semibold leading-[1.2] text-white">
            {price}
          </p>
          <p
            className={`pb-1 text-base leading-[1.6] transition-colors duration-300 ${secondaryTextClass}`}
          >
            {plan.period}
          </p>
        </div>

        <p
          className={`mt-3 text-[16px] leading-[1.6] transition-colors duration-300 ${secondaryTextClass}`}
        >
          {plan.description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            className={`${outlineGlowButtonClass} ${pressWhiteFillButtonClass} h-12 w-full text-[16px] focus-visible:outline-none ${pricingButtonSurfaceClass}`}
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

        <div className="mt-10">
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
                  className={`text-[16px] leading-[1.6] transition-colors duration-300 ${secondaryTextClass}`}
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
    <article className="group relative min-h-[220px] w-[min(88vw,360px)] shrink-0 overflow-hidden rounded-[23px] bg-[#141414] p-6 transition-all duration-500 ease-out hover:border-[#16a34a]/35 hover:shadow-[0_18px_42px_rgba(22,163,74,0.16)] hover:bg-[#d1eedd] sm:w-[420px] sm:p-7 lg:min-h-[240px] lg:w-[460px] lg:p-8">
      <div className="absolute left-8 top-[36px] h-20 w-px bg-[#16a34a]" />
      <p className="max-w-[508px] pl-5 text-[16px] leading-[1.6] text-[#9b9b9b] transition-colors duration-500 group-hover:text-black] group-hover:text-[#181818]">
        {quote}
      </p>

      <div className="mt-10 flex items-center gap-3">
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
          <p className="text-[20px] font-medium leading-[1.4] text-[#16a34a] transition-colors duration-500 group-hover:text-black hover:text-[#16a34a]/80">
            {name}
          </p>
          <p className="text-[16px] leading-[1.4] text-[#9b9b9b] transition-colors duration-500 group-hover:text-black">
            {location}
          </p>
        </div>
      </div>

      <span className="absolute bottom-[-12px] right-5 font-bricolage text-[11rem] leading-none text-transparent">
        ”
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-12px] right-5 font-bricolage text-[11rem] leading-none text-[#16a34a]/20"
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
      <div className="flex min-w-0 items-center justify-start border-t border-transparent bg-[#181818] px-3 py-4 text-left text-[12px] leading-[1.45] text-white sm:px-4 sm:py-5 sm:text-[14px] sm:leading-[1.5] lg:px-5 lg:py-6 lg:text-[16px] lg:leading-[1.6]">
        <span className="min-w-0 break-words text-left">{row.feature}</span>
      </div>

      <div className="flex min-w-0 items-center justify-start gap-1.5 border-l border-t border-transparent bg-[#181818] px-3 py-4 text-left text-[12px] leading-[1.45] text-[#909090] transition-colors duration-200 hover:bg-[#782626] hover:text-white sm:gap-2 sm:px-4 sm:py-5 sm:text-[14px] sm:leading-[1.5] lg:px-5 lg:py-6 lg:text-[16px] lg:leading-[1.6]">
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
        className={`group/phyo flex min-w-0 items-center justify-start gap-1.5 border-l border-t border-transparent bg-[#181818] px-3 py-4 text-left text-[12px] leading-[1.45] text-[#909090] transition-colors duration-200 hover:text-white sm:gap-2 sm:px-4 sm:py-5 sm:text-[14px] sm:leading-[1.5] lg:px-5 lg:py-6 lg:text-[16px] lg:leading-[1.6] ${phyoHoverBackgroundClass}`}
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
            className="px-4 pb-10 pt-16 sm:px-6 lg:px-[120px] lg:pt-20"
          >
            <div className="mx-auto max-w-[918px] text-center">
              <h1 className="bg-[linear-gradient(102.272deg,#16a34a_3.4%,#ffffff_58%,#16a34a_97.64%)] bg-clip-text font-bricolage text-[40px] font-normal leading-[1.15] text-transparent sm:text-[48px] lg:text-[56px] lg:leading-[1.2]">
                <span className="block">
                  World&apos;s First AI Powered Influencer
                </span>
                <span className="block">Search Engine</span>
              </h1>

              <p className="mx-auto mt-4 max-w-[720px] text-[15px] leading-[1.2] text-[#9b9b9b] sm:text-base">
                Search Influencers in seconds with Phyo and reach the right
                Audience faster.
              </p>
            </div>

            <form
              className="mx-auto mt-10 max-w-[920px] px-4"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative overflow-hidden rounded-full bg-[linear-gradient(270deg,#16A34A_0%,#FFFFFF_52.88%,#16A34A_100%)] p-[1px] shadow-[0_0_28px_rgba(22,163,74,0.45)]">
                {/* Soft outer glow */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[#16A34A]/25 blur-l" />

                {/* Search box */}
                <div className="relative flex h-[56px] items-center gap-3 rounded-full bg-[#010a04]/90 px-4 py-2 backdrop-blur-md sm:pl-5 sm:pr-[8px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search influencers (e.g. i need influencers in Mumbai)..."
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-left text-sm leading-[1.6] text-white outline-none placeholder:text-[#9B9B9B] sm:text-[14px]"
                  />

                  <button
                    type="submit"
                    className="inline-flex h-[40px] shrink-0 items-center gap-1 rounded-full bg-[#16A34A] px-3 text-sm text-white transition duration-200 hover:bg-[#12803A] sm:px-4"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </form>
            <div className="mx-auto">
              <MilestoneCards />
            </div>

            <div className="mx-auto my-5 max-w-[1050px] text-center">
              {/* public\landing\grid_lines.svg */}

              <div>
                <GridPattern className="absolute h-[519.2px] w-[649px] left-[0rem] mt-10 z-1000" />
              </div>
              <div>
                <GridPattern className="absolute h-[519.2px] w-[649px] left-[930px] mt-10 z-1000" />
              </div>

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
          </section>
        </div>
      </div>

      <section id="features" className={pageSectionClass}>
        <div className="grid gap-5 lg:items-start lg:grid-cols-[340px_minmax(0,1fr)]">
          <article className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#16a34a_0%,#073618_100%)] p-5 lg:sticky lg:top-6 lg:h-[542px] lg:self-start">
            <div className="max-w-[300px]">
              <h2 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
                Launch Smarter Campaigns With AI
              </h2>
              <p className="mt-3 text-[16px] leading-[1.6] text-[#e5e5e5]">
                From finding the right influencers to tracking performance
                everything you need to run high-impact campaigns in one
                platform.
              </p>
            </div>
            <div className="mt-[50px] h-[417px] w-[386px] pr-[66px]">
              <Image
                src="/landing/card_phone1.png"
                alt="Phyo platform features composite preview"
                width={386.109}
                height={417.5}
                className="object-contain"
              />
            </div>
          </article>

          <div className="grid gap-5">
            <article className="group relative overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] md:min-h-[275px]">
              <div className="max-w-[454px]">
                <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover:text-black">
                  Find Creators{" "}
                  <span className="text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    In Seconds
                  </span>
                </h3>
                <p className="mt-3 max-w-[460px] text-[16px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-black/70">
                  No more scrolling for hours. Just type your niche, and our AI
                  shows you the best and right influencers in seconds.
                </p>
              </div>

              <div className="absolute right-6 top-5 hidden h-44 w-44 rounded-full blur-2xl sm:block" />
              <div className="relative mt-8 h-[180px] sm:absolute sm:right-5 sm:top-1/2 sm:mt-0 sm:h-[215px] sm:w-[355px] sm:-translate-y-1/2">
                <Image
                  src="/landing/card_laptop1.png"
                  alt="Creator discovery tablet preview"
                  fill
                  className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.24)] mt-[35px] ml-[21px]"
                  sizes="(min-width: 640px) 355px, 100vw"
                />
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] md:min-h-[275px]">
              <div className="max-w-[454px]">
                <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover:text-black">
                  Tracking Your{" "}
                  <span className="text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    Campaigns Live
                  </span>
                </h3>
                <p className="mt-3 max-w-[454px] text-[16px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-black/70">
                  See clear performance reports and accurate ROI tracking from
                  start to finish.
                </p>
              </div>

              <div className="relative mt-8 h-[220px] sm:absolute sm:right-2 sm:top-1/2 sm:mt-0 sm:h-[378px] sm:w-[309px] sm:-translate-y-1/2">
                <Image
                  src="/landing/card_phone2.png"
                  alt="Campaign tracking phone preview"
                  fill
                  className="object-contain mt-[34px]"
                  sizes="309px"
                />
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[24px] bg-[#181818] p-5 transition-colors duration-300 hover:bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] md:min-h-[275px]">
              <div className="max-w-[454px]">
                <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover:text-black">
                  Fully{" "}
                  <span className="text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    Managed Campaigns
                  </span>
                </h3>
                <p className="mt-3 max-w-[454px] text-[16px] leading-[1.6] text-[#9b9b9b] transition-colors duration-300 group-hover:text-black/70">
                  From Delhi to Dubai, LA to London get access to 300k+ real
                  influencers across 15+ countries and 95+ languages.
                </p>
              </div>

              <div className="relative mt-8 h-[220px] sm:absolute sm:right-4 sm:top-1/2 sm:mt-0 sm:h-[323px] sm:w-[372px] sm:-translate-y-1/2">
                <Image
                  src="/landing/card_phone3.png"
                  alt="Managed campaigns phone preview"
                  fill
                  className="object-contain mt-[28px] ml-[14px]"
                  sizes="372px"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="pricing" className={pageSectionClass}>
        <div className="mx-auto max-w-[900px] text-center pt-[80px]">
          <h2 className="font-bricolage text-[34px] leading-[1.2] text-white sm:text-[36px]">
            Simple Scalable{" "}
            <span className="font-semibold text-[#16a34a]">Powerful</span>
          </h2>
          <p className="mt-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
            From free tools to full-scale execution Phyo&apos;s pricing plans
            are designed to grow with your goals, not limit them.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-12 w-[140px] text-[16px] ${
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
              className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-12 w-[200px] ${
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
              <span className="relative z-10 inline-flex items-center gap-3 leading-[1.2]">
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

        <div className="mx-auto mt-10 flex w-full flex-nowrap gap-[20px] overflow-x-auto pb-2 scrollbar-hide xl:relative xl:left-1/2 xl:w-[1200px] xl:max-w-none xl:-translate-x-1/2 xl:justify-start xl:overflow-visible xl:pb-0">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              billingCycle={billingCycle}
              plan={plan}
            />
          ))}
        </div>

        <div className="mb-[100px]">
          <div className="relative mt-10 min-h-[170px] overflow-hidden rounded-[24px] bg-[#181818] lg:h-[170px] xl:left-1/2 xl:w-[1200px] xl:max-w-none xl:-translate-x-1/2">
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
            <div className="relative flex h-full flex-col justify-center gap-4 px-6 py-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-0">
              <div className="w-full max-w-[604px]">
                <h3 className="font-bricolage text-[32px] leading-[1.2] text-white sm:text-[36px]">
                  Custom Pricing{" "}
                  <span className="font-semibold text-[#16a34a]">For ALL</span>
                </h3>
                <p className="mt-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
                  Powerful Customizable Plans For Agencies Brands, & Enterprise
                  Teams.
                </p>
              </div>

              <button
                type="button"
                className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-12 w-[245px] shrink-0 text-[16px]`}
              >
                <ButtonChrome active_bg_color_class="group-active:bg-[#16A34A]" />
                <span
                  className="relative z-10 font-inter text-[16px] leading-[1.2]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Get In Touch Now
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(112deg,#16a34a_1.18%,#073618_80.36%)] h-[540px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 right-0 w-[44%] bg-[linear-gradient(90deg,rgba(4,88,24,0)_0%,rgba(4,56,21,0.3)_35%,rgba(4,56,21,0.76)_100%)]" />
          <div className="absolute -right-24 top-0 h-full w-[82%] opacity-40 lg:-right-10 lg:w-[58%]">
            <Image
              src="/landing/Group.svg"
              alt=""
              fill
              className="object-contain object-right"
            />
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[560px] w-full max-w-[1440px] items-center px-4 py-12 sm:px-6 lg:min-h-[600px] lg:px-[120px]">
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
              <img
                src="/landing/iPhone_16_Pro.png"
                alt="Phyo product preview for campaign workflow"
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

      <div className=" mt-[100px] mb-[100px]">
        <FaqSection
          sectionClassName={pageSectionClass}
          faqItems={faqItems}
          ctaHref="#home"
        />
      </div>
      <section className={pageSectionClass}>
        <div className="text-center">
          <h2 className="font-bricolage text-[34px] leading-[1.2] text-white sm:text-[36px]">
            Comparison Reveals{" "}
            <span className="text-[#16a34a]">Differences & Similarities.</span>
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] border border-[#16a34a] bg-[#181818]">
          <div>
            <div className="grid grid-cols-3">
              {["Feature", "Other Platform", "Phyo"].map((heading) => (
                <div
                  key={heading}
                  className="min-w-0 break-words bg-[#16a34a] px-3 py-4 text-left font-bricolage text-[16px] font-bold leading-[1.2] text-white sm:px-4 sm:py-5 sm:text-[20px] lg:px-5 lg:py-6 lg:text-[28px]"
                >
                  {heading}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3">
              {comparisonRows.map((row) => (
                <ComparisonRow key={row.feature} row={row} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-[100px] mb-[100px]">
        <section id="testimonials" className={` ${pageSectionClass}`}>
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-bricolage text-[34px] leading-[1.2] text-white sm:text-[36px]">
              Simple Scalable{" "}
              <span className="font-semibold text-[#16a34a]">Powerful</span>
            </h2>
            <p className="mt-4 text-[16px] leading-[1.2] text-[#9b9b9b]">
              From free tools to full-scale execution Phyo&apos;s pricing plans
              are designed to grow with your goals, not limit them.
            </p>
          </div>

          <div className="relative mt-10">
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
