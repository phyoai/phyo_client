'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/store/slices/authSlice';
import Spinner from '@/components/ui/Spinner';

const RESET_ILLUSTRATION = '/landing/login_modal/loginmodal.svg';
const headingFont = { fontFamily: 'var(--font-bricolage-grotesque)' };
const bodyFont = { fontFamily: 'var(--font-inter)' };

function ResetIllustration() {
  return (
    <div className="relative h-[240px] w-[220px] overflow-hidden" data-node-id="8:3245">
      <img src={RESET_ILLUSTRATION} alt="" className="absolute h-full w-full object-fill" />
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
      className="h-4 w-4"
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#010402]">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setValidationError('Both fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    if (!email || !token) {
      setValidationError('Invalid reset link. Please request a new password reset.');
      return;
    }

    const result = await dispatch(
      resetPassword({
        email,
        newPassword: formData.newPassword,
      })
    );

    if (result.payload?.success) {
      setSuccessMessage('Password updated successfully. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    if (result.payload?.message) {
      setValidationError(result.payload.message);
    }
  };

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010402] px-4">
        <div className="w-full max-w-[520px] rounded-[24px] border border-white/15 bg-[#001a0a] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <h1 className="text-[32px] leading-[1.2]" style={headingFont}>
            Invalid <span className="text-[#16a34a]">Link</span>
          </h1>
          <p className="mt-4 text-[16px] leading-[1.6] text-[#9b9b9b]" style={bodyFont}>
            The reset link is invalid or expired. Please request a new password reset.
          </p>
          <Link
            href="/forgot-password"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-[40px] border border-white text-[16px] font-medium text-white transition hover:border-[#16a34a] hover:text-[#16a34a]"
            style={bodyFont}
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010402] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_84%,rgba(22,163,74,0.26),rgba(1,4,2,0)_46%)]" />
      <div className="absolute left-[-12rem] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#0f6b34]/20 blur-[120px]" />

      <section
        className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#001a0a] px-6 pb-8 pt-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:min-h-[610px] sm:px-10 sm:pb-10 sm:pt-10"
        data-node-id="8:3241"
      >
        <div className="pointer-events-none absolute bottom-[-210px] right-[-210px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.45)_0%,rgba(0,26,10,0)_68%)]" />

        <div className="relative z-10 flex h-full flex-col items-center gap-10">
          <ResetIllustration />

          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-3 text-center" data-node-id="8:3404">
              <h1
                className="text-[36px] font-medium leading-[1.2] tracking-[-0.02em]"
                style={headingFont}
                data-node-id="8:3405"
              >
                <span className="text-white">Reset </span>
                <span className="text-[#16a34a]">Password</span>
              </h1>
              <p className="text-[16px] leading-[1.6] text-[#9b9b9b]" style={bodyFont} data-node-id="8:3406">
                {`We'll send you an email with instruction to`}
                <br />
                reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate data-node-id="8:3407">
              <div className="space-y-7">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="newPassword"
                      className="text-[16px] leading-[1.2] text-[#868686]"
                      style={bodyFont}
                      data-node-id="8:3412"
                    >
                      Enter New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((value) => !value)}
                      className="text-[#7f7f7f] transition hover:text-white"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      <EyeIcon slashed={!showNewPassword} />
                    </button>
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full bg-transparent text-[18px] leading-none text-white outline-none placeholder:text-white/20"
                    style={bodyFont}
                  />
                  <div className="h-px w-full bg-white/70" data-node-id="8:3414" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[16px] leading-[1.2] text-[#868686]"
                      style={bodyFont}
                      data-node-id="8:3418"
                    >
                      Re-Enter New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="text-[#7f7f7f] transition hover:text-white"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      <EyeIcon slashed={!showConfirmPassword} />
                    </button>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full bg-transparent text-[18px] leading-none text-white outline-none placeholder:text-white/20"
                    style={bodyFont}
                  />
                  <div className="h-px w-full bg-white/70" data-node-id="8:3420" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-[40px] border border-white text-[16px] font-medium text-white transition hover:border-[#16a34a] hover:text-[#16a34a] disabled:cursor-not-allowed disabled:opacity-55"
                style={bodyFont}
                data-node-id="8:3421"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              {(validationError || error) && (
                <p className="text-center text-[14px] text-[#ff8f8f]" style={bodyFont}>
                  {validationError || error}
                </p>
              )}

              {successMessage && (
                <p className="text-center text-[14px] text-[#7ee2a8]" style={bodyFont}>
                  {successMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
