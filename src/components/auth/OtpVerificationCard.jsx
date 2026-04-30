'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import OutlineGlowButton from '@/components/shared/OutlineGlowButton';

const OTP_LENGTH = 6;
const OTP_ILLUSTRATION = '/landing/login_modal/loginmodal.svg';

const headingFont = { fontFamily: 'var(--font-bricolage-grotesque)' };
const bodyFont = { fontFamily: 'var(--font-inter)' };

function maskEmail(email) {
  if (!email || !email.includes('@')) {
    return 'ap****************com';
  }

  const [namePart = '', domainPart = ''] = email.toLowerCase().split('@');
  const compactValue = `${namePart}${domainPart}`.replace(/[^a-z0-9]/g, '');

  if (!compactValue) {
    return 'ap****************com';
  }

  const prefix = compactValue.slice(0, Math.min(2, compactValue.length));
  const suffix = compactValue.slice(-3);
  const availableMask = compactValue.length - prefix.length - suffix.length;
  const maskLength = Math.max(10, Math.min(16, availableMask || 12));

  return `${prefix}${'*'.repeat(maskLength)}${suffix}`;
}

function OTPIllustration() {
  return (
    <div className="relative h-[240px] w-[220px] shrink-0 overflow-hidden">
      <Image
        src={OTP_ILLUSTRATION}
        alt=""
        fill
        priority
        sizes="220px"
        className="object-contain"
      />
    </div>
  );
}

function OTPSlot({
  index,
  value,
  inputIdPrefix,
  disabled,
  onChange,
  onKeyDown,
  onPaste,
}) {
  return (
    <div className="flex h-[31px] flex-col justify-between">
      <label htmlFor={`${inputIdPrefix}-${index}`} className="sr-only">
        OTP digit {index + 1}
      </label>

      <input
        id={`${inputIdPrefix}-${index}`}
        type="text"
        inputMode="numeric"
        autoComplete={index === 0 ? 'one-time-code' : 'off'}
        maxLength={1}
        value={value}
        disabled={disabled}
        placeholder="0"
        onPaste={onPaste}
        onChange={(event) => onChange(index, event.target.value)}
        onKeyDown={(event) => onKeyDown(index, event)}
        className="h-5 w-full bg-transparent text-center text-[16px] leading-[1.2] text-[#868686] outline-none transition placeholder:text-[#868686] focus:text-white disabled:cursor-not-allowed disabled:opacity-60"
        style={bodyFont}
      />

      <div className="h-px w-full bg-white/70" />
    </div>
  );
}

export default function OtpVerificationCard({
  email,
  onVerify,
  onResend,
  loading = false,
  resendLoading = false,
  resendDisabled = false,
  resendLabel = 'Resend OTP',
  submitLabel = 'Verify',
  errorMessage = '',
  statusMessage = '',
  onClose,
  secondaryActionLabel,
  onSecondaryAction,
  inputIdPrefix = 'otp-digit',
}) {
  const [otpDigits, setOtpDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [localError, setLocalError] = useState('');

  const otpValue = useMemo(() => otpDigits.join(''), [otpDigits]);
  const maskedEmail = useMemo(() => maskEmail(email), [email]);
  const titleId = `${inputIdPrefix}-title`;
  const descriptionId = `${inputIdPrefix}-description`;

  useEffect(() => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setLocalError('');
  }, [email]);

  const focusInput = (index) => {
    document.getElementById(`${inputIdPrefix}-${index}`)?.focus();
  };

  const handleChangeOtp = (index, nextValue) => {
    const sanitizedValue = nextValue.replace(/\D/g, '').slice(0, 1);

    setOtpDigits((currentDigits) => {
      const nextDigits = [...currentDigits];
      nextDigits[index] = sanitizedValue;
      return nextDigits;
    });

    if (sanitizedValue && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpPaste = (event) => {
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '');

    if (!pastedValue) {
      return;
    }

    event.preventDefault();

    const nextDigits = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pastedValue[index] || ''
    );

    setOtpDigits(nextDigits);

    const lastIndex = Math.min(pastedValue.length, OTP_LENGTH) - 1;
    if (lastIndex >= 0) {
      focusInput(lastIndex);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (otpValue.length !== OTP_LENGTH) {
      setLocalError('Please enter the full 6-digit OTP.');
      return;
    }

    await onVerify?.(otpValue);
  };

  const handleResend = async () => {
    setLocalError('');

    const didReset = await onResend?.();
    if (!didReset) {
      return;
    }

    setOtpDigits(Array(OTP_LENGTH).fill(''));
    focusInput(0);
  };

  return (
    <section
      role={onClose ? 'dialog' : undefined}
      aria-modal={onClose ? 'true' : undefined}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#001a0a] px-6 pb-8 pt-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:min-h-[621px] sm:px-10 sm:pb-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-296px] right-[-350px] h-[830px] w-[824px] rounded-full bg-[#16a34a]/30 blur-[125px]"
        style={{ transform: 'rotate(27.85deg)' }}
      />

      {/* {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close OTP verification"
          disabled={loading || resendLoading}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )} */}

      <div className="relative z-10 flex h-full flex-col items-center gap-10">
        <OTPIllustration />

        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-3 text-center">
            <h1
              id={titleId}
              className="text-[36px] font-medium leading-[1.2]"
              style={headingFont}
            >
              <span className="text-white">OTP </span>
              <span className="text-[#16a34a]">Verification</span>
            </h1>

            <p
              id={descriptionId}
              className="text-[16px] leading-[1.6] text-[#9b9b9b]"
              style={bodyFont}
            >
              OTP has been send to {maskedEmail}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8" noValidate>
            <div className="grid grid-cols-6 gap-2">
              {otpDigits.map((digit, index) => (
                <OTPSlot
                  key={index}
                  index={index}
                  value={digit}
                  inputIdPrefix={inputIdPrefix}
                  disabled={loading || resendLoading}
                  onPaste={handleOtpPaste}
                  onChange={handleChangeOtp}
                  onKeyDown={handleOtpKeyDown}
                />
              ))}
            </div>

            <OutlineGlowButton
              type="submit"
              disabled={loading || resendLoading || otpValue.length !== OTP_LENGTH}
              className="h-12 w-full px-5 normal-case disabled:cursor-not-allowed disabled:opacity-50"
              baseSurfaceClassName="bg-[#053918]"
              glowSurfaceClassName="bg-[#16A34A]"
            >
              {loading ? (
                <span
                  className="inline-flex items-center justify-center gap-3"
                  style={bodyFont}
                >
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying...
                </span>
              ) : (
                <span className="text-center" style={bodyFont}>
                  {submitLabel}
                </span>
              )}
            </OutlineGlowButton>
          </form>

          <div className="space-y-3">
            <p
              className="text-center text-[14px] leading-[1.2] text-[#868686]"
              style={bodyFont}
            >
              Don&apos;t receive?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading || resendLoading || resendDisabled}
                className="font-medium text-[#16a34a] underline underline-offset-2 transition hover:text-[#22c55e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resendLoading ? 'Resending...' : resendLabel}
              </button>
            </p>

            {(localError || errorMessage) && (
              <p
                className="text-center text-[14px] leading-[1.4] text-[#ff8f8f]"
                style={bodyFont}
              >
                {localError || errorMessage}
              </p>
            )}

            {statusMessage && (
              <p
                className="text-center text-[14px] leading-[1.4] text-[#7ee2a8]"
                style={bodyFont}
              >
                {statusMessage}
              </p>
            )}

            {secondaryActionLabel && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="mx-auto block text-[13px] text-[#868686] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[14px]"
                style={bodyFont}
                disabled={loading || resendLoading}
              >
                {secondaryActionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
