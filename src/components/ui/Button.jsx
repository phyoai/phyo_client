'use client';

import React from 'react';

/**
 * Variants:
 *   primary   — green filled, white text  (most common CTA)
 *   ghost     — transparent, white border (secondary action)
 *   dark      — dark surface (#262626), muted text
 *   chip      — pill filter/tab; use `active` prop for selected state
 *
 * Sizes:
 *   sm  — h-[32px]  text-[13px]
 *   md  — h-[40px]  text-[16px]  (default)
 *   lg  — h-[48px]  text-[18px]
 *
 * All buttons are rounded-full to match the design system.
 */

const sizeConfig = {
  sm: { height: 'h-[32px]', text: 'text-[13px]', px: 'px-[16px]', iconSize: 14, gap: 'gap-[6px]' },
  md: { height: 'h-[40px]', text: 'text-[16px]', px: 'px-[24px]', iconSize: 16, gap: 'gap-[8px]' },
  lg: { height: 'h-[48px]', text: 'text-[18px]', px: 'px-[32px]', iconSize: 18, gap: 'gap-[10px]' },
};

const variantConfig = {
  primary: {
    base: 'bg-[#16a34a] text-white hover:bg-[#15803d]',
    disabled: 'bg-[#16a34a]/40 text-white/50 cursor-not-allowed',
  },
  ghost: {
    base: 'border border-white text-white hover:bg-white/10',
    disabled: 'border border-white/20 text-white/30 cursor-not-allowed',
  },
  dark: {
    base: 'bg-[#262626] text-[#9b9b9b] hover:bg-[#333] hover:text-white',
    disabled: 'bg-[#262626]/50 text-[#9b9b9b]/40 cursor-not-allowed',
  },
  chip: {
    base: 'bg-[#181818] text-[#9b9b9b] hover:bg-[#262626] hover:text-white',
    active: 'bg-[#16a34a] text-white',
    disabled: 'bg-[#181818]/50 text-[#9b9b9b]/40 cursor-not-allowed',
  },
};

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  active = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const sc = sizeConfig[size] ?? sizeConfig.md;
  const vc = variantConfig[variant] ?? variantConfig.primary;

  const stateClass = disabled
    ? vc.disabled
    : (variant === 'chip' && active)
      ? vc.active
      : vc.base;

  const classes = [
    'inline-flex items-center justify-center',
    'rounded-full',
    'font-normal capitalize leading-[1.2]',
    'transition-colors duration-200',
    'whitespace-nowrap shrink-0',
    sc.height,
    sc.text,
    sc.px,
    sc.gap,
    fullWidth ? 'w-full' : '',
    stateClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      style={{ fontFamily: 'Inter, sans-serif' }}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-[14px] h-[14px] rounded-full border-2 border-white/30 border-t-white animate-spin" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon width={sc.iconSize} height={sc.iconSize} fill="currentColor" color="currentColor" />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon width={sc.iconSize} height={sc.iconSize} fill="currentColor" color="currentColor" />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
