"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Play, Plus, Search } from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/loginModal";

const milestoneCards = [
  { value: "50K", label: "Authentic Influencers" },
  { value: "15+", label: "Countries Covered" },
  { value: "300+", label: "Brands Trust To Scale Fast" },
  { value: "97.8%", label: "Average TAT Reduced" },
];

const aboutSegmentLines = [
  ["Phyo simplifies influencer", "discover, analysis &"],
  ["compaign launches", "so you", "spend less time"],
  ["planning & more", "time scaling."],
];

const pricingPlans = [
  {
    name: "Bronze",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "Free Forever",
    description:
      "Perfect For Early-Stage Creators, Startups, And Curious Users.",
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
    monthlyPrice: "$19",
    annualPrice: "$194",
    period: "/Month",
    description: "Best For Freelancers, Boutique Agencies, Or Small Teams.",
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
    monthlyPrice: "$79",
    annualPrice: "$806",
    period: "/Month",
    description: "Perfect For Growing Brands And Mid-Size Teams.",
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
    monthlyPrice: "$199",
    annualPrice: "$2030",
    period: "/Month",
    description: "Perfect For Global Agencies Managing Multiple Campaigns.",
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
    quote:
      "Su is absolutely lovely and so down-to-earth. She makes you feel comfortable the moment you walk in and really takes the time to look after her clients.",
    name: "Maria S.",
    location: "London",
  },
  {
    quote:
      "Su is absolutely lovely and so down-to-earth. She makes you feel comfortable the moment you walk in and really takes the time to look after her clients.",
    name: "Maria S.",
    location: "London",
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
  "group relative inline-flex items-center justify-center overflow-hidden rounded-[40px] border border-white bg-transparent text-white transition-all duration-300 before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[39px] ,rgba(255,255,255,0)_72%)] before:opacity-0 hover:border-[#16a34a] hover:shadow-[0_0_0_1px_rgba(22,163,74,0.95),0_0_10px_rgba(22,163,74,0.46)] hover:before:opacity-100";
const pressGreenButtonClass =
  "active:border-[#16a34a] active:bg-[#16a34a] active:text-white";
const pressWhiteButtonClass =
  "active:border-white active:bg-white active:text-[#16a34a]";

function ActionButton({
  href,
  icon,
  children,
  iconPosition = "right",
  widthClass = "w-[180px]",
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`${outlineGlowButtonClass} ${pressWhiteButtonClass} h-12 ${widthClass} text-[16px] ${className}`}
    >
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

function StatCard({ value, label }) {
  return (
    <div className="group relative h-[139px] overflow-hidden rounded-[24px] border border-[#16a34a]/50 bg-black px-5 text-center shadow-[0_0_0_1px_rgba(10,64,28,0.35)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[24px]"
      >
        {/* top-mid runner */}
        <div className="absolute -inset-[135%] [background:conic-gradient(from_27deg,rgba(22,163,74,0)_0deg,rgba(22,163,74,0)_312deg,rgba(22,163,74,0.95)_328deg,rgba(22,163,74,0.18)_336deg,rgba(22,163,74,0)_360deg)] motion-safe:animate-[spin_4.2s_linear_infinite]" />

        {/* bottom-mid runner */}
        <div className="absolute -inset-[135%] [background:conic-gradient(from_207deg,rgba(22,163,74,0)_0deg,rgba(22,163,74,0)_312deg,rgba(22,163,74,0.95)_328deg,rgba(22,163,74,0.18)_336deg,rgba(22,163,74,0)_360deg)] motion-safe:animate-[spin_4.2s_linear_infinite]" />

        {/* inner fill */}
        <div className="absolute inset-px rounded-[23px] bg-black" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center hover:bg-[linear-gradient(90deg,#16a34a_0%,#ddf4e6_100%)] hover:bg-clip-text hover:text-transparent">
        <p className="font-bricolage text-[32px] font-semibold leading-[1.2] text-[#4e4d4d] sm:text-[36px]">
          {value}
        </p>
        <p className="mt-1 text-sm leading-[1.6] text-[#4e4d4d] sm:text-base">
          {label}
        </p>
      </div>
    </div>
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
  const secondaryTextClass = isHighlight
    ? "text-[#d7f4df] group-hover/pricing:text-[#f1fff6] group-focus-within/pricing:text-[#f1fff6] group-active/pricing:text-[#f1fff6]"
    : "text-[#9b9b9b] group-hover/pricing:text-[#d7f4df] group-focus-within/pricing:text-[#d7f4df] group-active/pricing:text-[#f1fff6]";

  return (
    <article
      className={`group/pricing relative isolate min-h-[907px] min-w-[285px] overflow-hidden rounded-[24px] border px-5 pb-6 pt-5 transition-all duration-300 ${
        isHighlight ? "border-[#1ec965]" : "border-white/5"
      } hover:border-[#31d275] hover:shadow-[0_0_0_1px_rgba(34,211,116,0.58),0_14px_34px_rgba(22,163,74,0.32)] focus-within:border-[#31d275] focus-within:shadow-[0_0_0_1px_rgba(34,211,116,0.58),0_14px_34px_rgba(22,163,74,0.32)] active:scale-[0.995]`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[24px] ${
          isHighlight
            ? "bg-[linear-gradient(155deg,#16a34a_0%,#0d7f35_58%,#073618_100%)]"
            : "bg-[linear-gradient(160deg,#151618_0%,#101113_100%)]"
        }`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(160deg,#015620_0%,#0f8b39_52%,#1bad4f_100%)] opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100"
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
          <span className="inline-flex h-7 items-center bg-[#56cf7d] px-4 text-xs font-medium text-[#e6f9ec] [clip-path:polygon(10px_0,100%_0,100%_100%,10px_100%,0_50%)] transition-colors duration-300 group-hover/pricing:bg-white group-hover/pricing:text-[#16a34a] group-focus-within/pricing:bg-white group-focus-within/pricing:text-[#16a34a] group-active/pricing:bg-white group-active/pricing:text-[#16a34a]">
            Most Popular
          </span>
        </div>
      ) : null}

      <div className="relative z-10">
        <h3 className="font-bricolage text-[48px] font-semibold leading-[1.2] text-white">
          {plan.name}
        </h3>

        <div className="mt-3 flex items-end gap-3">
          <p className="font-bricolage text-[48px] font-semibold leading-[1.2] text-white">
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
            className={`h-12 w-full rounded-[40px] border text-[16px] font-medium transition-all duration-300 ${
              isHighlight
                ? "border-white/90 text-white"
                : "border-white text-white"
            } group-hover/pricing:border-[#63e296] group-hover/pricing:bg-[#0d7f35]/95 group-hover/pricing:shadow-[0_0_0_1px_rgba(99,226,150,0.85),0_0_16px_rgba(99,226,150,0.5),inset_0_0_20px_rgba(151,255,197,0.28)] group-focus-within/pricing:border-[#63e296] group-focus-within/pricing:bg-[#0d7f35]/95 group-focus-within/pricing:shadow-[0_0_0_1px_rgba(99,226,150,0.85),0_0_16px_rgba(99,226,150,0.5),inset_0_0_20px_rgba(151,255,197,0.28)] active:scale-[0.99] active:border-[#72eba3] active:bg-[#0a6a2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72eba3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2c1a]`}
          >
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

function FaqItem({ active, answer, onClick, question }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[24px] border border-white/5 px-5 py-5 text-left transition duration-200 ${
        active
          ? "bg-[linear-gradient(120deg,#d4f5e0_0%,#cfe9da_100%)] text-black"
          : "bg-[#181818] text-white hover:border-[#16a34a]/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-bricolage text-[24px] font-medium leading-[1.2] ${
              active ? "text-black" : "text-white"
            }`}
          >
            {question}
          </h3>
          <p
            className={`mt-3 text-[16px] leading-[1.6] ${
              active ? "text-[#4e4d4d]" : "text-[#9b9b9b]"
            }`}
          >
            {answer}
          </p>
        </div>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
            active ? "bg-[#16a34a] text-white" : "bg-white/15 text-white/70"
          }`}
        >
          {active ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </span>
      </div>
    </button>
  );
}

function TestimonialCard({ location, name, quote }) {
  return (
    <article className="relative min-h-[220px] min-w-[580px] overflow-hidden rounded-[23px] bg-[#141414] p-8">
      <div className="absolute left-8 top-5 h-20 w-px bg-[#16a34a]" />
      <p className="max-w-[508px] pl-5 text-[16px] leading-[1.6] text-[#9b9b9b]">
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
          <p className="text-[20px] font-medium leading-[1.4] text-[#16a34a]">
            {name}
          </p>
          <p className="text-[16px] leading-[1.4] text-[#9b9b9b]">{location}</p>
        </div>
      </div>

      <span className="absolute bottom-[-12px] right-5 font-bricolage text-[11rem] leading-none text-[#16a34a]/20">
        ”
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
      <div className="min-w-0 break-words border-t border-[#0f2a16] bg-[#181818] px-3 py-4 text-[12px] leading-[1.45] text-white sm:px-4 sm:py-5 sm:text-[14px] sm:leading-[1.5] lg:px-5 lg:py-6 lg:text-[16px] lg:leading-[1.6]">
        {row.feature}
      </div>
      <div className="flex min-w-0 items-start gap-1.5 border-l border-t border-[#0f2a16] bg-[#181818] px-3 py-4 text-[12px] leading-[1.45] text-[#909090] transition-colors duration-200 hover:bg-[#782626] hover:text-white sm:gap-2 sm:px-4 sm:py-5 sm:text-[14px] sm:leading-[1.5] lg:px-5 lg:py-6 lg:text-[16px] lg:leading-[1.6]">
        <Image
          src={featureAssets.comparisonCross}
          alt=""
          width={12}
          height={12}
          className="mt-1 h-[12px] w-[12px] shrink-0"
        />
        <span className="min-w-0 break-words">{row.other}</span>
      </div>
      <div
        className={`group/phyo flex min-w-0 items-start gap-1.5 border-l border-t border-[#0f2a16] bg-[#181818] px-3 py-4 text-[12px] leading-[1.45] text-[#909090] transition-colors duration-200 hover:text-white sm:gap-2 sm:px-4 sm:py-5 sm:text-[14px] sm:leading-[1.5] lg:px-5 lg:py-6 lg:text-[16px] lg:leading-[1.6] ${phyoHoverBackgroundClass}`}
      >
        <span className="relative mt-1 h-[12px] w-[21px] shrink-0">
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
        <span className="min-w-0 break-words">{row.phyo}</span>
      </div>
    </>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("annual");
  const [activeFaqIndex, setActiveFaqIndex] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  return (
    <main className="bg-black text-white">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1100px]">
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(22,163,74,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.18)_1px,transparent_1px)] [background-size:92px_92px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),rgba(0,0,0,0))]" />
          <div className="absolute left-[1038.57px] top-[-161px] h-[487.04px] w-[380.73px]">
            <div className="absolute left-1/2 top-1/2 -ml-[240px] h-[449px] w-[194px] -translate-x-1/2 -translate-y-1/2 rotate-[27.85deg]">
              <div className="absolute" style={{ inset: "-55.73% -129.14%" }}>
                <img
                  src="/figma/landing/8bf76859d5c6f4da4ac2c1d3f52e99a58e026fce.svg"
                  alt=""
                  aria-hidden="true"
                  className="block h-full w-full max-w-none"
                />
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-[-180px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#0d3b19]/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1440px]">
          <Navbar />

          <section
            id="home"
            className="px-4 pt-16 sm:px-6 lg:px-[120px] lg:pt-20"
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

            <div className="mx-auto mt-10 max-w-[800px]">
              <div className="relative rounded-full p-[2px] shadow-[0_0_30px_rgba(22,163,74,0.18)]">
                <div className="absolute inset-0 rounded-full bg-[#16a34a]/10 blur-xl" />
                <div className="relative flex items-center gap-3 rounded-full border border-[#16a34a] bg-white/[0.08] px-4 py-2 backdrop-blur-md sm:pl-5 sm:pr-[9px]">
                  <span className="min-w-0 flex-1 truncate text-left text-sm leading-[1.6] text-[#9b9b9b] sm:text-[16px]">
                    Search influencers (e.g. i need influencers in Mumbai)...
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenLoginModal}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#16a34a] px-4 py-3 text-sm text-white transition duration-200 hover:bg-[#12803a] sm:px-5 sm:text-[15px] h-[45px]"
                  >
                    <span className="grid h-8 w-8 place-items-center">
                      <Search className="h-5 w-5" />
                    </span>
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {milestoneCards.map((card) => (
                <StatCard
                  key={card.value}
                  value={card.value}
                  label={card.label}
                />
              ))}
            </div>

<div className="mx-auto mt-12 max-w-[1050px] text-center">
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

      <section
        id="features"
        className="mx-auto max-w-[1440px] px-4 pb-6 pt-8 sm:px-6 lg:px-[120px] lg:pb-10 lg:pt-20"
      >
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
            <article className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(115deg,#def6e5_0%,#6f907a_100%)] p-5 md:min-h-[275px]">
              <div className="max-w-[454px] mt-4">
                <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-black">
                  Find Creators{" "}
                  <span className="text-[#16a34a]">In Seconds</span>
                </h3>
                <p className="mt-3 max-w-[460px] text-[16px] leading-[1.6] text-black/70">
                  No more scrolling for hours. Just type your niche, and our AI
                  shows you the best and right influencers in seconds.
                </p>
              </div>

              <div className="absolute right-6 top-5 hidden h-44 w-44 rounded-full bg-[#16a34a]/15 blur-2xl sm:block" />
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

            <article className="relative overflow-hidden rounded-[24px] bg-[#181818] p-5 md:min-h-[275px]">
              <div className="max-w-[454px] mt-4">
                <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
                  Tracking Your Campaigns Live
                </h3>
                <p className="mt-3 max-w-[454px] text-[16px] leading-[1.6] text-[#9b9b9b]">
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

            <article className="relative overflow-hidden rounded-[24px] bg-[#181818] p-5 md:min-h-[275px]">
              <div className="max-w-[454px]">
                <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
                  Fully Managed Campaigns
                </h3>
                <p className="mt-3 max-w-[454px] text-[16px] leading-[1.6] text-[#9b9b9b]">
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

      <section
        id="pricing"
        className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-[120px] lg:py-20"
      >
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

        <div className="mt-10 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`h-12 w-[140px] text-[16px] font-medium ${
                billingCycle === "monthly"
                  ? "inline-flex items-center justify-center rounded-[40px] border border-[#16a34a] bg-[#16a34a] text-white"
                  : `${outlineGlowButtonClass} ${pressGreenButtonClass}`
              }`}
            >
              <span className="relative z-10 leading-[1.2]">Monthly</span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`h-12 w-[200px] ${
                billingCycle === "annual"
                  ? "inline-flex items-center justify-center rounded-[40px] border border-[#16a34a] bg-[#16a34a] text-white"
                  : `${outlineGlowButtonClass} ${pressGreenButtonClass}`
              }`}
            >
              <span className="relative z-10 inline-flex items-center gap-3 leading-[1.2]">
                <span className="text-[16px] font-medium">Annually</span>
                <span
                  className={`inline-flex h-7 w-[83px] items-center justify-center rounded-full text-[12px] font-normal leading-[1.2] ${
                    billingCycle === "annual"
                      ? "bg-white text-[#16a34a]"
                      : "bg-[#3b3b3b] text-[#e3e3e3]"
                  }`}
                >
                  Save 15%
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 flex gap-20 overflow-x-auto pb-2 scrollbar-hide xl:grid xl:grid-cols-4 xl:overflow-visible xl:pb-0 mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              billingCycle={billingCycle}
              plan={plan}
            />
          ))}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[24px] bg-[#181818] px-6 py-10 lg:h-[200px] lg:px-10 lg:py-0">
          <div
            className="pointer-events-none absolute -bottom-12 left-0 hidden text-[15rem] font-semibold leading-none text-white/[0.04] lg:block h-[214px] w-[500px] ml-[50px]"
            style={{
              marginLeft: 0,
            }}
          >
            Phyo
          </div>
          <div className="relative flex h-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[604px]">
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
              className={`${outlineGlowButtonClass} ${pressGreenButtonClass} h-12 w-[245px] text-[16px] font-medium`}
            >
              <span className="relative z-10 leading-[1.2] font-[Inter] text-[16px] font-medium">
                Get In Touch Now
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(112deg,#16a34a_1.18%,#073618_80.36%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-8 h-full w-full opacity-90 lg:-right-10 lg:top-0 lg:w-[72%]">
            <Image
              src="/landing/Group.svg"
              alt=""
              fill
              className="object-contain object-right"
            />
          </div>
        </div>

        <div className="relative w-[1440px] max-h-[600px] px-4 py-14 sm:px-6 lg:px-[120px] lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,516px)_minmax(0,540px)] lg:justify-between">
            <div className="max-w-[516px]">
              <h2 className="font-bricolage text-[34px] font-normal leading-[1.3] text-white sm:text-[36px] sm:leading-[1.35]">
                AI Search. Verified Influencers. Real Results.
              </h2>
              <p className="mt-5 text-[16px] leading-[1.6] text-[#dcdcdc]">
                From discovery to campaign execution everything you need to run
                high-performing influencer campaigns in one platform.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
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
                  href="#faq"
                  widthClass="w-full sm:w-[180px]"
                  iconPosition="left"
                  icon={<Play className="h-[14px] w-[13px] stroke-[1.8]" />}
                >
                  Watch Demo
                </ActionButton>
              </div>
            </div>

            <div className="max-w-[420px] lg:max-w-[664px]">
              <Image
                src="/landing/iPhone_16_Pro.png"
                alt="Phyo product preview for campaign workflow"
                width={540}
                height={845}
                className="mt-[75px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-[120px] lg:py-20"
      >
        <div className="grid gap-10 xl:grid-cols-[590px_570px]">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-bricolage text-[34px] leading-[1.25] text-white sm:text-[36px] sm:leading-[1.4]">
                Frequently Asked{" "}
                <span className="font-semibold text-[#16a34a]">Questions</span>
              </h2>
              <p className="mt-3 max-w-[590px] text-[16px] leading-[1.6] text-[#9b9b9b] [text-transform:capitalize]">
                It was popularised in the 1960s of the release of Letraset
                sheets containing Lorem Ipsum passages, and more recently with
                desktop publishing software like Aldus PageMaker including
                versions of Lorem Ipsum.
              </p>
            </div>

            <div className="rounded-[24px] bg-[linear-gradient(122deg,#16a34a_1.95%,#073618_95.26%)] px-8 py-9">
              <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
                Still Have Questions?
              </h3>
              <p className="mt-4 max-w-[430px] text-[16px] leading-[1.6] text-[#f8f2f2]">
                See how Phyo helps you find the right influencers, track
                campaigns, and scale faster all in one place.
              </p>
              <ActionButton
                href="#home"
                className="mt-8"
                widthClass="w-[180px]"
                iconPosition="left"
                icon={<Play className="h-[14px] w-[13px] stroke-[1.8]" />}
              >
                Watch Demo
              </ActionButton>
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FaqItem
                key={item.question}
                active={activeFaqIndex === index}
                question={item.question}
                answer={item.answer}
                onClick={() =>
                  setActiveFaqIndex((currentIndex) =>
                    currentIndex === index ? -1 : index,
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-[120px] lg:py-20">
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
                  className="min-w-0 break-words bg-[#16a34a] px-3 py-4 text-center font-bricolage text-[16px] font-bold leading-[1.2] text-white sm:px-4 sm:py-5 sm:text-[20px] lg:px-5 lg:py-6 lg:text-[28px]"
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

      <section
        id="testimonials"
        className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-[120px] lg:py-20"
      >
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

        <div className="flex w-[1180px] items-center gap-[20px] mt-5">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              quote={testimonial.quote}
              name={testimonial.name}
              location={testimonial.location}
            />
          ))}
        </div>
      </section>

      <Footer />

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[12px]"
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
    </main>
  );
}
