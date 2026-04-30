'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import OtpVerificationCard from '@/components/auth/OtpVerificationCard';
import {
  clearError,
  resendEmailOtp,
  verifyEmailOtp,
} from '@/store/slices/authSlice';
import { authUtils } from '@/utils/api';

const headingFont = { fontFamily: 'var(--font-bricolage-grotesque)' };
const bodyFont = { fontFamily: 'var(--font-inter)' };

function OTPPageShell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#010402] px-4 py-8 text-white sm:px-6">
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <OTPPageShell>
      <section className="relative flex min-h-[621px] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-[24px] bg-[#001a0a] px-6 pb-8 pt-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:px-10 sm:pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-296px] right-[-350px] h-[830px] w-[824px] rounded-full bg-[#16a34a]/30 blur-[125px]"
          style={{ transform: 'rotate(27.85deg)' }}
        />
        <div className="relative z-10 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-[#16a34a]" />
      </section>
    </OTPPageShell>
  );
}

function MissingEmailState() {
  return (
    <OTPPageShell>
      <section className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#001a0a] px-6 pb-8 pt-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:min-h-[621px] sm:px-10 sm:pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-296px] right-[-350px] h-[830px] w-[824px] rounded-full bg-[#16a34a]/30 blur-[125px]"
          style={{ transform: 'rotate(27.85deg)' }}
        />

        <div className="relative z-10 flex min-h-[541px] flex-col items-center justify-center gap-8 text-center">
          <div className="space-y-3">
            <h1
              className="text-[36px] font-medium leading-[1.2]"
              style={headingFont}
            >
              <span className="text-white">OTP </span>
              <span className="text-[#16a34a]">Verification</span>
            </h1>

            <p
              className="text-[16px] leading-[1.6] text-[#9b9b9b]"
              style={bodyFont}
            >
              No email was found for OTP verification.
            </p>
          </div>

          <Link
            href="/login"
            className="flex h-12 w-full max-w-[440px] items-center justify-center rounded-[40px] border border-white bg-transparent px-5 text-[16px] font-medium leading-[1.2] text-white transition hover:border-[#16a34a] hover:text-[#16a34a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
            style={bodyFont}
          >
            Back to login
          </Link>
        </div>
      </section>
    </OTPPageShell>
  );
}

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { loading, error, otpVerified, token, user } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState('');
  const [hasResolvedEmail, setHasResolvedEmail] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(clearError());

    const emailFromQuery = searchParams.get('email')?.trim();
    const pendingEmail = localStorage.getItem('pendingEmail');
    const userEmail = localStorage.getItem('userEmail');

    setEmail(emailFromQuery || pendingEmail || userEmail || '');
    setHasResolvedEmail(true);
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (!otpVerified) {
      return;
    }

    if (token) {
      authUtils.setToken(token);
    }

    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    }

    if (email) {
      localStorage.setItem('userEmail', email);
    }

    setStatusMessage('OTP verified successfully. Redirecting...');

    const timer = setTimeout(() => {
      localStorage.removeItem('pendingEmail');
      router.push('/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [email, otpVerified, router, token, user]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setResendCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerifyOtp = async (otpCode) => {
    setValidationError('');
    setStatusMessage('');
    dispatch(clearError());

    const result = await dispatch(verifyEmailOtp({ email, otp: otpCode }));

    if (result.type.endsWith('/fulfilled')) {
      return true;
    }

    setValidationError(result.payload || 'Invalid OTP. Please try again.');
    return false;
  };

  const handleResendOtp = async () => {
    if (!email || loading || resendCountdown > 0) {
      return false;
    }

    setValidationError('');
    setStatusMessage('');
    dispatch(clearError());

    const result = await dispatch(resendEmailOtp({ email }));

    if (result.type.endsWith('/fulfilled')) {
      setResendCountdown(60);
      setStatusMessage('A new OTP has been sent to your email.');
      return true;
    }

    setValidationError(result.payload || 'Failed to resend OTP.');
    return false;
  };

  if (!hasResolvedEmail) {
    return <LoadingState />;
  }

  if (!email) {
    return <MissingEmailState />;
  }

  return (
    <OTPPageShell>
      <OtpVerificationCard
        email={email}
        loading={loading}
        resendDisabled={resendCountdown > 0}
        resendLabel={
          resendCountdown > 0
            ? `Resend OTP (${resendCountdown}s)`
            : 'Resend OTP'
        }
        errorMessage={validationError || error || ''}
        statusMessage={statusMessage}
        inputIdPrefix="otp-page-digit"
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </OTPPageShell>
  );
}
