'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const OTP_LENGTH = 6;
const OTP_ILLUSTRATION = '/landing/login_modal/loginmodal.svg';

const headingFont = { fontFamily: 'var(--font-bricolage-grotesque)' };
const bodyFont = { fontFamily: 'var(--font-inter)' };

function OTPIllustration() {
  return (
    <div className="relative h-[240px] w-[220px] overflow-hidden" data-node-id="8:4005">
      <img src={OTP_ILLUSTRATION} alt="" className="absolute h-full w-full object-fill" />
    </div>
  );
}

function normalizePhone(rawPhone) {
  if (!rawPhone) {
    return '';
  }

  const trimmed = rawPhone.trim();
  if (trimmed.startsWith('+')) {
    return `+${trimmed.slice(1).replace(/\D/g, '')}`;
  }

  return trimmed.replace(/\D/g, '');
}

function maskPhone(phone) {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return '+91 *****6859';
  }

  const digits = normalized.replace(/\D/g, '');
  if (digits.length <= 4) {
    return `+${digits}`;
  }

  const countryCode = digits.length > 10 ? digits.slice(0, digits.length - 10) : '91';
  const lastFour = digits.slice(-4);

  return `+${countryCode} *****${lastFour}`;
}

function OTPSlot({
  index,
  value,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
}) {
  return (
    <div className="flex h-[31px] flex-col justify-between" data-node-id={`8:417${index}`}>
      <input
        id={`verify-phone-otp-${index}`}
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
        className="h-5 w-full bg-transparent text-center text-[16px] leading-none text-[#868686] outline-none placeholder:text-[#868686] focus:text-white disabled:cursor-not-allowed disabled:opacity-60"
        style={bodyFont}
      />
      <div className="h-px w-full bg-white/70" />
    </div>
  );
}

export default function VerifyPhonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const otpValue = useMemo(() => otpDigits.join(''), [otpDigits]);
  const maskedPhone = useMemo(() => maskPhone(phone), [phone]);

  useEffect(() => {
    const fromQuery = searchParams.get('phone') || '';
    const fromStorage =
      localStorage.getItem('pendingPhone') ||
      localStorage.getItem('pendingPhoneNumber') ||
      localStorage.getItem('userPhone') ||
      localStorage.getItem('phoneNumber') ||
      '';

    setPhone(normalizePhone(fromQuery || fromStorage));
  }, [searchParams]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setResendCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChangeOtp = (index, nextValue) => {
    const sanitized = nextValue.replace(/\D/g, '').slice(0, 1);

    setOtpDigits((current) => {
      const next = [...current];
      next[index] = sanitized;
      return next;
    });

    if (sanitized && index < OTP_LENGTH - 1) {
      document.getElementById(`verify-phone-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`verify-phone-otp-${index - 1}`)?.focus();
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`verify-phone-otp-${index - 1}`)?.focus();
      return;
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      document.getElementById(`verify-phone-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');

    if (!pasted) {
      return;
    }

    event.preventDefault();
    const nextDigits = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] || '');
    setOtpDigits(nextDigits);

    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    if (lastIndex >= 0) {
      document.getElementById(`verify-phone-otp-${lastIndex}`)?.focus();
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setValidationError('');
    setStatusMessage('');

    if (!phone) {
      setValidationError('Phone number not found. Please try again.');
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      setValidationError('Please enter the full 6-digit OTP.');
      return;
    }

    setIsVerifying(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
      const response = await fetch(`${apiBase}/brand-requests/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          otp: otpValue,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || 'Invalid OTP. Please try again.');
      }

      setStatusMessage('Phone number verified successfully. Redirecting...');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setValidationError(error.message || 'Failed to verify OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phone || resendCountdown > 0 || isResending) {
      return;
    }

    setValidationError('');
    setStatusMessage('');
    setIsResending(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
      const response = await fetch(`${apiBase}/brand-requests/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to resend OTP.');
      }

      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setResendCountdown(60);
      setStatusMessage('A new OTP has been sent to your mobile number.');
    } catch (error) {
      setValidationError(error.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  if (!phone) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010402] px-4 py-8 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_84%,rgba(22,163,74,0.26),rgba(1,4,2,0)_46%)]" />
        <div className="absolute left-[-12rem] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#0f6b34]/20 blur-[120px]" />

        <section className="relative z-10 w-full max-w-[520px] rounded-[24px] border border-white/10 bg-[#001a0a] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
          <h1 className="text-[36px] font-medium leading-[1.2] tracking-[-0.02em]" style={headingFont}>
            Verify <span className="text-[#16a34a]">Phone Number</span>
          </h1>
          <p className="mt-3 text-[16px] leading-[1.6] text-[#9b9b9b]" style={bodyFont}>
            No phone number was found for OTP verification.
          </p>
          <Link
            href="/login"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-[40px] border border-white text-[16px] font-medium text-white transition hover:border-[#16a34a] hover:text-[#16a34a]"
            style={bodyFont}
          >
            Back to Login
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010402] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_84%,rgba(22,163,74,0.26),rgba(1,4,2,0)_46%)]" />
      <div className="absolute left-[-12rem] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#0f6b34]/20 blur-[120px]" />

      <section
        className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#001a0a] px-6 pb-8 pt-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:min-h-[673px] sm:px-10 sm:pb-10 sm:pt-10"
        data-node-id="8:4001"
      >
        <div className="pointer-events-none absolute bottom-[-210px] right-[-210px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.45)_0%,rgba(0,26,10,0)_68%)]" />

        <div className="relative z-10 flex h-full flex-col items-center gap-10">
          <OTPIllustration />

          <div className="w-full max-w-[440px] space-y-8" data-node-id="8:4163">
            <div className="space-y-3 text-center" data-node-id="8:4165">
              <h1
                className="text-[36px] font-medium leading-[1.2] tracking-[-0.02em]"
                style={headingFont}
                data-node-id="8:4166"
              >
                <span className="text-white">Verify </span>
                <span className="text-[#16a34a]">Phone Number</span>
              </h1>
              <p className="text-[16px] leading-[1.6] text-[#9b9b9b]" style={bodyFont} data-node-id="8:4167">
                We Had Sent An OTP To Your Mobile Number {maskedPhone}. Enter The 4-Digit Otp Below To Confirm Your
                Phone Number.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-8" noValidate data-node-id="8:4168">
              <div className="grid grid-cols-6 gap-2" data-node-id="8:4169">
                {otpDigits.map((digit, index) => (
                  <OTPSlot
                    key={index}
                    index={index}
                    value={digit}
                    disabled={isVerifying || isResending}
                    onPaste={handleOtpPaste}
                    onChange={handleChangeOtp}
                    onKeyDown={handleOtpKeyDown}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying || isResending || otpValue.length !== OTP_LENGTH}
                className="flex h-12 w-full items-center justify-center rounded-[40px] border border-white text-[32px] font-medium text-white transition hover:border-[#16a34a] hover:text-[#16a34a] disabled:cursor-not-allowed disabled:opacity-55"
                style={headingFont}
                data-node-id="8:4188"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>

              <p className="text-center text-[14px] text-[#868686]" style={bodyFont} data-node-id="8:4189">
                Don&apos;t Receive?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isVerifying || isResending || resendCountdown > 0}
                  className="font-medium text-[#16a34a] underline underline-offset-2 transition hover:text-[#22c55e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              </p>
            </form>

            {validationError && (
              <p className="text-center text-[14px] text-[#ff8f8f]" style={bodyFont}>
                {validationError}
              </p>
            )}

            {statusMessage && (
              <p className="text-center text-[14px] text-[#7ee2a8]" style={bodyFont}>
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
