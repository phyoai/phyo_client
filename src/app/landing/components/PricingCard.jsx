'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';

const ButtonChrome = memo(function ButtonChrome({
  button_bg_color,
  active_bg_color_class = '',
  hide_border = false,
} = {}) {
  const buttonGlowColorClass = button_bg_color ?? '';

  return (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[40px] bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] p-[2px] blur-[2px] ${
          hide_border
            ? 'opacity-0'
            : 'opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-active:opacity-0'
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
            ? 'bg-transparent p-0'
            : 'bg-white p-px transition-all duration-300 ease-out group-hover:bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] group-hover:p-[2px] group-active:bg-transparent group-active:p-0'
        }`}
      >
        <span
          className={`block h-full w-full rounded-[inherit] ${button_bg_color ?? 'bg-[#141615]'} ${active_bg_color_class}`}
        />
      </span>
    </>
  );
});

ButtonChrome.displayName = 'ButtonChrome';

const PricingCard = memo(function PricingCard({ billingCycle, plan }) {
  const price = useMemo(
    () => (billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice),
    [billingCycle, plan.annualPrice, plan.monthlyPrice]
  );

  const billingNote = useMemo(() => {
    if (plan.monthlyPrice === '$0' || plan.monthlyPrice === 'Rs.0') {
      return plan.note;
    }
    return billingCycle === 'annual' ? 'Billed Annually.' : 'Billed Monthly.';
  }, [plan.monthlyPrice, plan.note, billingCycle]);

  const isHighlight = useMemo(() => Boolean(plan.highlight), [plan.highlight]);

  const outlineGlowButtonClass =
    'group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615]';
  const pressWhiteFillButtonClass = 'active:!bg-white active:text-[#16A34A]';

  return (
    <article
      className={`group/pricing relative isolate min-h-[907px] min-w-[285px] overflow-hidden rounded-[24px] border px-5 pb-6 pt-5 transition-all duration-300 ${
        isHighlight
          ? 'border-[#16a34a] shadow-[0_0_0_1px_rgba(22,163,74,0.4)]'
          : 'border-white/5'
      } hover:border-[#31d275] hover:shadow-[0_0_0_1px_rgba(34,211,116,0.58),0_14px_34px_rgba(22,163,74,0.32)] focus-within:border-[#31d275] focus-within:shadow-[0_0_0_1px_rgba(34,211,116,0.58),0_14px_34px_rgba(22,163,74,0.32)] active:scale-[0.995]`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[24px] ${
          isHighlight
            ? 'bg-[linear-gradient(180deg,#16A34A_0%,#073618_100%)]'
            : 'bg-[linear-gradient(160deg,#151618_0%,#101113_100%)]'
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(0deg,#16A34A_0%,#073618_100%)] opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100`}
      />
      <Image
        aria-hidden
        src="/landing/pricing_card_hover.svg"
        alt=""
        width={285}
        height={300}
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100"
      />

      {isHighlight && (
        <div className="absolute right-0 top-7 z-20">
          <img
            src="/landing/most_popular.svg"
            alt="Most Popular"
            className="w-[110px] h-[30px]"
          />
        </div>
      )}

      <div className="relative z-10">
        <h3 className="font-bricolage text-[36px] font-semibold leading-[1.2] text-white">
          {plan.name}
        </h3>

        <div className="mt-3 flex items-end gap-3">
          <p className="font-bricolage text-[36px] font-semibold leading-[1.2] text-white">
            {price}
          </p>
          <p
            className={`pb-1 text-base leading-[1.6] transition-colors duration-300 ${
              isHighlight
                ? 'text-[#d7f4df] group-hover/pricing:text-[#f1fff6] group-focus-within/pricing:text-[#f1fff6] group-active/pricing:text-[#f1fff6]'
                : 'text-[#9b9b9b] group-hover/pricing:text-[#d7f4df] group-focus-within/pricing:text-[#d7f4df] group-active/pricing:text-[#f1fff6]'
            }`}
          >
            {plan.period}
          </p>
        </div>

        <p
          className={`mt-3 text-[16px] leading-[1.6] transition-colors duration-300 ${
            isHighlight
              ? 'text-[#d7f4df] group-hover/pricing:text-[#f1fff6] group-focus-within/pricing:text-[#f1fff6] group-active/pricing:text-[#f1fff6]'
              : 'text-[#9b9b9b] group-hover/pricing:text-[#d7f4df] group-focus-within/pricing:text-[#d7f4df] group-active/pricing:text-[#f1fff6]'
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            className={`${outlineGlowButtonClass} ${pressWhiteFillButtonClass} h-12 w-full text-[16px] focus-visible:outline-none ${
              isHighlight
                ? `!bg-[#16a34a] !bg-[#138e40] group-hover/pricing:!bg-[#0d622c] group-focus-within/pricing:!bg-[#094820] group-active/pricing:!bg-[#fff]`
                : `!bg-[#141615] group-hover/pricing:!bg-[#094820] group-focus-within/pricing:!bg-[#094820] group-active/pricing:!bg-[#094820]`
            }`}
          >
            <ButtonChrome
              button_bg_color={
                isHighlight ? 'bg-[#16a34a]' : 'bg-[#141615]'
              }
              active_bg_color_class="group-active:bg-white"
            />
            <span className="relative z-10 leading-[1.2]">
              {plan.buttonLabel}
            </span>
          </button>
          <p
            className={`text-center text-xs leading-[1.6] transition-colors duration-300 ${
              isHighlight
                ? 'text-[#d7f4df] group-hover/pricing:text-[#f1fff6] group-focus-within/pricing:text-[#f1fff6] group-active/pricing:text-[#f1fff6]'
                : 'text-[#9b9b9b] group-hover/pricing:text-[#d7f4df] group-focus-within/pricing:text-[#d7f4df] group-active/pricing:text-[#f1fff6]'
            }`}
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
                        ? '/landing/double-tick-white.svg'
                        : '/landing/double-tick.svg'
                    }
                    alt=""
                    width={21}
                    height={12}
                    className={`absolute inset-0 h-[12px] w-[21px] transition-opacity duration-300 ${
                      isHighlight
                        ? 'opacity-100'
                        : 'opacity-100 group-hover/pricing:opacity-0 group-focus-within/pricing:opacity-0 group-active/pricing:opacity-0'
                    }`}
                  />
                  {!isHighlight && (
                    <Image
                      src="/landing/double-tick-white.svg"
                      alt=""
                      width={21}
                      height={12}
                      className="absolute inset-0 h-[12px] w-[21px] opacity-0 transition-opacity duration-300 group-hover/pricing:opacity-100 group-focus-within/pricing:opacity-100 group-active/pricing:opacity-100"
                    />
                  )}
                </span>
                <span
                  className={`text-[16px] leading-[1.6] transition-colors duration-300 ${
                    isHighlight
                      ? 'text-[#d7f4df] group-hover/pricing:text-[#f1fff6] group-focus-within/pricing:text-[#f1fff6] group-active/pricing:text-[#f1fff6]'
                      : 'text-[#9b9b9b] group-hover/pricing:text-[#d7f4df] group-focus-within/pricing:text-[#d7f4df] group-active/pricing:text-[#f1fff6]'
                  }`}
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
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.billingCycle === nextProps.billingCycle &&
    prevProps.plan.name === nextProps.plan.name
  );
});

PricingCard.displayName = 'PricingCard';

export default PricingCard;
