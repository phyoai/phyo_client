'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OTP_LENGTH = 6;
const FORGOT_ILLUSTRATION = '/landing/login_modal/loginmodal.svg';

const headingFont = { fontFamily: 'var(--font-bricolage-grotesque)' };
const bodyFont = { fontFamily: 'var(--font-inter)' };

function ForgotIllustration({ compact = false }) {
  return (
    <div
      className={`relative overflow-hidden ${compact ? 'h-[150px] w-[138px]' : 'h-[240px] w-[220px]'}`}
      data-node-id="8:3026"
    >
      <img src={FORGOT_ILLUSTRATION} alt="" className="absolute h-full w-full object-fill" />
    </div>
  );
}

function EyeIcon({ slashed = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
    >
      {slashed ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18m-8.879-8.879a3 3 0 104.243 4.243M9.88 9.88A3 3 0 0114.12 14.12"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.73 5.08A10.94 10.94 0 0112 5c4.73 0 8.72 2.95 10 7a10.96 10.96 0 01-4.04 5.19M6.61 6.61A10.95 10.95 0 002 12c1.28 4.05 5.27 7 10 7 1.31 0 2.57-.23 3.74-.65"
          />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.04 12.32a1.01 1.01 0 010-.64C3.42 7.51 7.36 4.5 12 4.5s8.58 3.01 9.96 7.18a1 1 0 010 .64C20.58 16.49 16.64 19.5 12 19.5S3.42 16.49 2.04 12.32z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  );
}

function maskOtpDestination(value) {
  if (!value || !value.includes('@')) {
    return 'ap**************com';
  }

  const [localPart, domain] = value.split('@');
  const alphaNumLocal = (localPart || '').replace(/[^a-zA-Z0-9]/g, '');
  const alphaNumDomain = (domain || '').replace(/[^a-zA-Z0-9]/g, '');

  if (!alphaNumLocal && !alphaNumDomain) {
    return 'ap**************com';
  }

  const start = (alphaNumLocal.slice(0, 2) || 'ap').toLowerCase();
  const end = (alphaNumDomain.slice(-3) || 'com').toLowerCase();
  const starCount = Math.max(12, alphaNumLocal.length + alphaNumDomain.length - start.length - end.length);

  return `${start}${'*'.repeat(starCount)}${end}`;
}

export function ForgotPasswordCard({ isModal = false, onClose, onCompleted }) {
  const isCompact = false;
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const sendForgotPasswordEmail = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.phyo.ai/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Verification code sent to your email');
        setStep(2);
      } else {
        toast.error(result.message || 'Failed to send verification code');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== OTP_LENGTH) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.phyo.ai/api/user/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: verificationCode }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Code verified successfully');
        setStep(3);
      } else {
        toast.error(result.message || 'Invalid verification code');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.phyo.ai/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          if (onCompleted) {
            onCompleted();
            return;
          }

          if (isModal && onClose) {
            onClose();
            return;
          }

          router.replace('/login');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const nextValue = value.replace(/\D/g, '').slice(0, 1);
    const updated = verificationCode.split('');
    updated[index] = nextValue;
    const nextCode = updated.join('').slice(0, OTP_LENGTH);
    setVerificationCode(nextCode);

    if (nextValue && index < OTP_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const modalHeightClass =
    step === 1 ? 'sm:h-[610px]' : step === 2 ? 'sm:h-[621px]' : 'sm:h-[669px]';

  const cardClass = isCompact
    ? 'relative w-full max-w-[320px] overflow-hidden rounded-[18px] bg-[#001a0a] px-5 pb-6 pt-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:min-h-0 sm:px-5 sm:pb-6 sm:pt-5'
    : `relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#001a0a] px-6 pb-8 pt-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] ${modalHeightClass} sm:px-10 sm:pb-10 sm:pt-10`;

  const contentGapClass = isCompact ? 'gap-5' : 'gap-8 sm:gap-10';
  const contentWidthClass = isCompact ? 'w-full max-w-[280px]' : 'w-full max-w-[440px]';
  const titleClass = isCompact
    ? 'text-[40px] font-medium leading-[1.15] tracking-[-0.02em]'
    : 'text-[36px] font-medium leading-[1.2] tracking-[-0.02em]';
  const subtitleClass = isCompact ? 'text-[12px] leading-[1.5] text-[#9b9b9b]' : 'text-[16px] leading-[1.6] text-[#9b9b9b]';
  const labelClass = isCompact ? 'block text-[12px] leading-[1.2] text-[#868686]' : 'block text-[16px] leading-[1.2] text-[#868686]';
  const inputClass = isCompact
    ? 'w-full bg-transparent text-[14px] leading-none text-white outline-none placeholder:text-white/25'
    : 'w-full bg-transparent text-[18px] leading-none text-white outline-none placeholder:text-white/25';
  const buttonClass = isCompact
    ? 'flex h-10 w-full items-center justify-center rounded-[40px] border border-white text-[14px] font-medium text-white transition hover:border-[#16a34a] hover:text-[#16a34a] disabled:cursor-not-allowed disabled:opacity-55'
    : 'flex h-12 w-full items-center justify-center rounded-[40px] border border-white text-[16px] font-medium text-white transition hover:border-[#16a34a] hover:text-[#16a34a] disabled:cursor-not-allowed disabled:opacity-55';

  return (
    <section className={cardClass} data-node-id="8:3022">
      <div className="pointer-events-none absolute bottom-[-210px] right-[-210px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.45)_0%,rgba(0,26,10,0)_68%)]" />

      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/35 text-white/75 transition hover:border-white hover:text-white"
          aria-label="Close forgot password modal"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
      )}

      <div className={`relative z-10 flex h-full flex-col items-center ${contentGapClass}`}>
        <ForgotIllustration compact={isCompact} />

        <div className={contentWidthClass}>
          {step === 1 && (
            <form
              className={isCompact ? 'space-y-5' : 'space-y-8'}
              onSubmit={(event) => {
                event.preventDefault();
                sendForgotPasswordEmail();
              }}
            >
              <div className="space-y-3 text-center">
                <h1
                  className={titleClass}
                  style={headingFont}
                  data-node-id="8:3186"
                >
                  <span className="text-white">Forget </span>
                  <span className="text-[#16a34a]">Password</span>
                </h1>
                <p className={subtitleClass} style={bodyFont}>
                  {`We'll send you an email with instruction to`}
                  <br />
                  reset your password.
                </p>
              </div>

              <div className={isCompact ? 'space-y-5' : 'space-y-8'}>
                <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
                  <label className={labelClass} style={bodyFont}>
                    Enter Your Email
                  </label>
                  <div className="border-b border-white/65 pb-2.5 transition-colors focus-within:border-white">
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@email.com"
                      className={inputClass}
                      style={bodyFont}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={buttonClass}
                  style={bodyFont}
                  data-node-id="8:3191"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              className={isCompact ? 'space-y-4' : 'space-y-5'}
              onSubmit={(event) => {
                event.preventDefault();
                verifyCode();
              }}
            >
              <div className="space-y-3 text-center" data-node-id="8:3635">
                <h2 className={titleClass} style={headingFont}>
                  <span className="text-white">OTP </span>
                  <span className="text-[#16a34a]">Verification</span>
                </h2>
                <p className={subtitleClass} style={bodyFont}>
                  OTP has been send to {maskOtpDestination(email)}
                </p>
              </div>

              <div className={isCompact ? 'space-y-5' : 'space-y-8'} data-node-id="8:3638">
                <div className={isCompact ? 'grid grid-cols-6 gap-1.5' : 'grid grid-cols-6 gap-2'} data-node-id="8:3639">
                  {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                    <div key={index} className={isCompact ? 'flex h-[28px] flex-col justify-between' : 'flex h-[31px] flex-col justify-between'}>
                      <input
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={verificationCode[index] || ''}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(event, index)}
                        placeholder="0"
                        className={isCompact
                          ? 'h-4 w-full bg-transparent text-center text-[13px] leading-none text-[#868686] outline-none placeholder:text-[#868686] focus:text-white'
                          : 'h-5 w-full bg-transparent text-center text-[16px] leading-none text-[#868686] outline-none placeholder:text-[#868686] focus:text-white'}
                        style={bodyFont}
                      />
                      <div className="h-px w-full bg-white/70" />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== OTP_LENGTH}
                  className={buttonClass}
                  style={bodyFont}
                  data-node-id="8:3658"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>

                <p className={isCompact ? 'text-center text-[12px] text-[#868686]' : 'text-center text-[14px] text-[#868686]'} style={bodyFont} data-node-id="8:3659">
                  Don&apos;t receive?{' '}
                  <button
                    type="button"
                    onClick={sendForgotPasswordEmail}
                    disabled={loading}
                    className="font-medium text-[#16a34a] underline underline-offset-2 transition hover:text-[#22c55e] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              className={isCompact ? 'space-y-5' : 'space-y-8'}
              onSubmit={(event) => {
                event.preventDefault();
                resetPassword();
              }}
            >
              <div className="space-y-3 text-center">
                <h2 className={titleClass} style={headingFont}>
                  <span className="text-white">Create </span>
                  <span className="text-[#16a34a]">New Password</span>
                </h2>
                <p className={subtitleClass} style={bodyFont}>
                  Use at least 8 characters with letters,
                  <br />
                  numbers, and symbols.
                </p>
              </div>

              <div className={isCompact ? 'space-y-5' : 'space-y-7'}>
                <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
                  <label className={labelClass} style={bodyFont}>
                    New Password
                  </label>
                  <div className="flex items-center gap-2 border-b border-white/65 pb-2.5 transition-colors focus-within:border-white">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      className={inputClass}
                      style={bodyFont}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((value) => !value)}
                      className="text-white/55 transition hover:text-white/90"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      <EyeIcon slashed={!showNewPassword} />
                    </button>
                  </div>
                </div>

                <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
                  <label className={labelClass} style={bodyFont}>
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-2 border-b border-white/65 pb-2.5 transition-colors focus-within:border-white">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(event) => setConfirmNewPassword(event.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      className={inputClass}
                      style={bodyFont}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="text-white/55 transition hover:text-white/90"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      <EyeIcon slashed={!showConfirmPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={buttonClass}
                  style={bodyFont}
                >
                  {loading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010402] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_84%,rgba(22,163,74,0.26),rgba(1,4,2,0)_46%)]" />
      <div className="absolute left-[-12rem] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#0f6b34]/20 blur-[120px]" />

      <ForgotPasswordCard />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
