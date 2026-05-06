"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Play, Plus } from "lucide-react";

const DEFAULT_FAQ_INTRO =
  "It was popularised in the 1960s of the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const DEFAULT_CTA_DESCRIPTION =
  "See how Phyo helps you find the right influencers, track campaigns, and scale faster all in one place.";

const outlineGlowButtonClass =
  "group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615]";
const pressWhiteFillButtonClass = "active:!bg-white active:text-[#16A34A]";

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

export default function FaqSection({
  id = "faq",
  sectionClassName = "",
  faqItems = [],
  titlePrefix = "Frequently Asked",
  titleHighlight = "Questions",
  intro = DEFAULT_FAQ_INTRO,
  ctaTitle = "Still Have Questions?",
  ctaDescription = DEFAULT_CTA_DESCRIPTION,
  ctaHref = "#home",
  ctaLabel = "Watch Demo",
}) {
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
  }, [faqItems]);

  return (
    <section id={id} className={sectionClassName}>
      <div className="grid gap-10 xl:grid-cols-[590px_570px] xl:items-stretch">
        <div className="flex flex-col gap-7 mb-1 xl:self-stretch">
          <div>
            <h2 className="font-bricolage text-[34px] leading-[1.25] text-white sm:text-[36px] sm:leading-[1.4]">
              {titlePrefix}{" "}
              <span className="font-semibold text-[#16a34a]">
                {titleHighlight}
              </span>
            </h2>
            <p className="mt-3 max-w-[590px] text-[16px] leading-[1.6] text-[#9b9b9b] [text-transform:capitalize]">
              {intro}
            </p>
          </div>

          <div className="rounded-[24px] bg-[linear-gradient(122deg,#16a34a_1.95%,#073618_95.26%)] px-8 py-9 xl:sticky xl:top-6 xl:self-start">
            <h3 className="font-bricolage text-[24px] font-medium leading-[1.2] text-white">
              {ctaTitle}
            </h3>
            <p className="mt-4 max-w-[430px] text-[16px] leading-[1.6] text-[#f8f2f2]">
              {ctaDescription}
            </p>
            <FaqActionButton href={ctaHref} className="mt-8">
              {ctaLabel}
            </FaqActionButton>
          </div>
        </div>

        <div
          className="space-y-3"
          style={faqListMinHeight > 0 ? { minHeight: faqListMinHeight } : undefined}
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
  );
}
