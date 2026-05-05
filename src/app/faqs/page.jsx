"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Play, Plus } from "lucide-react";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";

const lastUpdated = "4 May 2026";

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

const DEFAULT_FAQ_INTRO =
  "It was popularised in the 1960s of the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const DEFAULT_CTA_DESCRIPTION =
  "See how Phyo helps you find the right influencers, track campaigns, and scale faster all in one place.";

const outlineGlowButtonClass =
  "group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615]";
const pressWhiteFillButtonClass = "active:!bg-white active:text-[#16A34A]";

const pageSectionClass =
  "mx-auto max-w-[1440px] sm:px-6 lg:px-[120px] mt-[20px]";
const heroSectionClass = "mx-auto max-w-[1440px] sm:px-6 lg:px-[120px]";

function GridBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundPosition: "center top",
          backgroundSize: "96px 96px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-80px] top-[-180px] h-[420px] w-[420px] rounded-full bg-[#16a34a]/20 blur-[120px] sm:right-[60px] sm:top-[-160px] sm:h-[520px] sm:w-[520px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[linear-gradient(180deg,rgba(5,5,5,0.75)_0%,rgba(5,5,5,0.25)_58%,rgba(5,5,5,0)_100%)]"
      />
    </>
  );
}

function FaqItemCard({
  active,
  question,
  answer,
  onClick,
  triggerRef,
  contentRef,
}) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] transition-all duration-300 ease-in-out ${
        active ? "bg-[#D7F5DF] text-[#07140B]" : "bg-[#181818] text-white"
      }`}
    >
      <button
        type="button"
        ref={triggerRef}
        onClick={onClick}
        className="flex min-h-[64px] w-full items-center justify-between gap-5 px-6 py-5 text-left"
      >
        <span
          className={`font-bricolage text-[22px] font-semibold leading-[1.35] transition-colors duration-300 ${
            active ? "text-[#07140B]" : "text-white"
          }`}
        >
          {question}
        </span>

        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[18px] leading-none transition-all duration-300 ${
            active ? "bg-[#16A34A] text-white" : "bg-[#2B2B2B] text-white"
          }`}
        >
          {active ? (
            <Minus aria-hidden className="h-[15px] w-[15px] stroke-[2.2]" />
          ) : (
            <Plus aria-hidden className="h-[15px] w-[15px] stroke-[2.2]" />
          )}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            ref={contentRef}
            className={`max-w-[560px] px-6 pb-6 text-[16px] leading-[1.75] transition-colors duration-300 ${
              active ? "text-[#425046]" : "text-[#9b9b9b]"
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function ButtonChrome({
  buttonBgColor = "bg-[#11813a]",
  activeBgColorClass = "group-active:bg-white",
}) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[40px] bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] p-[2px] blur-[2px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-active:opacity-0"
      >
        <span
          className={`block h-full w-full rounded-[inherit] ${buttonBgColor} ${activeBgColorClass}`}
        />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[40px] bg-white p-px transition-all duration-300 ease-out group-hover:bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] group-hover:p-[2px] group-active:bg-transparent group-active:p-0"
      >
        <span
          className={`block h-full w-full rounded-[inherit] ${buttonBgColor} ${activeBgColorClass}`}
        />
      </span>
    </>
  );
}

function FaqActionButton({
  href,
  children,
  widthClass = "w-[180px]",
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`${outlineGlowButtonClass} ${pressWhiteFillButtonClass} h-12 ${widthClass} !bg-[#16a34a] text-[16px] hover:!bg-[#16a34a] ${className}`}
    >
      <ButtonChrome />
      <span className="relative z-10 inline-flex items-center gap-3">
        <span className="inline-flex items-center justify-center">
          <Play className="h-[14px] w-[13px] stroke-[1.8]" />
        </span>
        <span className="leading-[1.2]">{children}</span>
      </span>
    </Link>
  );
}

export default function FaqPage() {
  const [activeFaqIndex, setActiveFaqIndex] = useState(1);
  const [faqListMinHeight, setFaqListMinHeight] = useState(0);
  const faqTriggerRefs = useRef([]);
  const faqContentRefs = useRef([]);

  useLayoutEffect(() => {
    const measureFaqListMinHeight = () => {
      if (faqItems.length === 0) {
        setFaqListMinHeight(0);
        return;
      }

      const triggerNodes = faqTriggerRefs.current.slice(0, faqItems.length);
      const contentNodes = faqContentRefs.current.slice(0, faqItems.length);

      if (
        triggerNodes.length !== faqItems.length ||
        contentNodes.length !== faqItems.length ||
        triggerNodes.some((node) => !node) ||
        contentNodes.some((node) => !node)
      ) {
        return;
      }

      const verticalGap = 12 * Math.max(faqItems.length - 1, 0);
      const collapsedHeight = triggerNodes.reduce(
        (totalHeight, node) => totalHeight + node.offsetHeight,
        0,
      );
      const tallestAnswerHeight = contentNodes.reduce(
        (maxHeight, node) => Math.max(maxHeight, node.scrollHeight),
        0,
      );
      const nextMinHeight =
        collapsedHeight + tallestAnswerHeight + verticalGap;

      setFaqListMinHeight((currentHeight) =>
        currentHeight === nextMinHeight ? currentHeight : nextMinHeight,
      );
    };

    measureFaqListMinHeight();

    const animationFrameId = window.requestAnimationFrame(
      measureFaqListMinHeight,
    );
    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        measureFaqListMinHeight();
      });

      [...faqTriggerRefs.current, ...faqContentRefs.current].forEach((node) => {
        if (node) {
          resizeObserver.observe(node);
        }
      });
    }

    window.addEventListener("resize", measureFaqListMinHeight);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureFaqListMinHeight);
    };
  }, []);

  return (
    <main
      className="relative isolate min-h-screen bg-[#050505] font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GridBackground />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="pt-12 sm:pt-16 lg:pt-20">
          <section className={heroSectionClass}>
            <div className="px-4">
              <h1
                className="inline-block w-fit bg-clip-text font-bricolage text-[40px] font-normal leading-[1.2] text-transparent sm:text-[48px] lg:text-[56px]"
                style={{
                  fontVariationSettings: "'opsz' 14, 'wdth' 100",
                  backgroundImage:
                    "linear-gradient(102.272deg, #16A34A 3.4%, #FFFFFF 58%, #16A34A 97.64%)",
                }}
              >
                Frequently Asked Questions
              </h1>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#9b9b9b]">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </section>

          <div className="mt-[100px] mb-[100px]">
            <section id="faq" className={pageSectionClass}>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
                <div className="mb-1 flex flex-col gap-7 lg:max-w-[590px] lg:self-stretch">
                  <div>
                    <h2 className="font-bricolage text-[34px] leading-[1.25] text-white sm:text-[36px] sm:leading-[1.4]">
                      Frequently Asked{" "}
                      <span className="font-semibold text-[#16a34a]">
                        Questions
                      </span>
                    </h2>
                    <p className="mt-3 max-w-[590px] text-[16px] leading-[1.6] text-[#9b9b9b] [text-transform:capitalize]">
                      {DEFAULT_FAQ_INTRO}
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-[linear-gradient(122deg,#16a34a_1.95%,#073618_95.26%)] px-8 py-9 lg:sticky lg:top-6 lg:self-start">
                    <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
                      Still Have Questions?
                    </h3>
                    <p className="mt-4 max-w-[430px] text-[16px] leading-[1.6] text-[#f8f2f2]">
                      {DEFAULT_CTA_DESCRIPTION}
                    </p>
                    <FaqActionButton href="#home" className="mt-8">
                      Watch Demo
                    </FaqActionButton>
                  </div>
                </div>

                <div
                  className="space-y-3"
                  style={
                    faqListMinHeight > 0
                      ? { minHeight: faqListMinHeight }
                      : undefined
                  }
                >
                  {faqItems.map((item, index) => (
                    <FaqItemCard
                      key={item.question}
                      active={activeFaqIndex === index}
                      question={item.question}
                      answer={item.answer}
                      triggerRef={(node) => {
                        faqTriggerRefs.current[index] = node;
                      }}
                      contentRef={(node) => {
                        faqContentRefs.current[index] = node;
                      }}
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
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
