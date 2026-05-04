"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Play, Plus } from "lucide-react";

import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer";

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

const outlineGlowButtonClass =
  "group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615]";
const pressWhiteFillButtonClass = "active:!bg-white active:text-[#16A34A]";
const pageSectionClass = "mx-auto max-w-[1440px] sm:px-6 lg:px-[120px]";

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

export default function FaqPage() {
  const [activeFaqIndex, setActiveFaqIndex] = useState(1);
  const [faqListMinHeight, setFaqListMinHeight] = useState(0);
  const faqTriggerRefs = useRef([]);
  const faqContentRefs = useRef([]);

  useLayoutEffect(() => {
    const measureFaqListMinHeight = () => {
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
      className="min-h-screen bg-black font-inter text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <Navbar />

      <div className="py-16 sm:py-20 lg:py-24">
        <section id="faq" className={pageSectionClass}>
          <div className="grid gap-10 px-4 xl:grid-cols-[590px_570px] xl:items-stretch">
            <div className="mb-1 flex flex-col gap-7 xl:self-stretch">
              <div>
                <h1 className="font-bricolage text-[34px] leading-[1.25] text-white sm:text-[36px] sm:leading-[1.4]">
                  Frequently Asked{" "}
                  <span className="font-semibold text-[#16a34a]">
                    Questions
                  </span>
                </h1>
                <p className="mt-3 max-w-[590px] text-[16px] leading-[1.6] text-[#9b9b9b] [text-transform:capitalize]">
                  It was popularised in the 1960s of the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </p>
              </div>

              <div className="rounded-[24px] bg-[linear-gradient(122deg,#16a34a_1.95%,#073618_95.26%)] px-8 py-9 xl:sticky xl:top-6 xl:self-start">
                <h2 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
                  Still Have Questions?
                </h2>
                <p className="mt-4 max-w-[430px] text-[16px] leading-[1.6] text-[#f8f2f2]">
                  See how Phyo helps you find the right influencers, track
                  campaigns, and scale faster all in one place.
                </p>
                <ActionButton
                  href="/contact_us"
                  className="mt-8"
                  widthClass="w-[180px]"
                  iconPosition="left"
                  icon={<Play className="h-[14px] w-[13px] stroke-[1.8]" />}
                >
                  Watch Demo
                </ActionButton>
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

      <Footer />
    </main>
  );
}
