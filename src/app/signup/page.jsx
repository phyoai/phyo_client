'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authUtils } from '../../utils/api';
import 'react-toastify/dist/ReactToastify.css';

const formFields = [
    {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        autoComplete: 'name',
        validation: { required: 'Full name is required.' },
    },
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        autoComplete: 'username',
        validation: { required: 'Username is required.' },
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        autoComplete: 'email',
        validation: {
            required: 'Email is required.',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address.',
            },
        },
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        autoComplete: 'new-password',
        validation: {
            required: 'Password is required.',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters.',
            },
        },
    },
];

const welcomeCopy =
    'It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing.';

const signupCopy =
    'It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages.';

const checkboxCopy =
    'The Banking And Finance Industry Is At The Forefront Of Digital Changeover.';

function getDefaultRedirect(userData) {
    if (userData?.type === 'USER') {
        if (userData.brandRegistrationStatus === 'COMPLETED') {
            return '/brand/dashboard';
        }

        if (userData.influencerRegistrationStatus === 'COMPLETED') {
            return '/influencer/dashboard';
        }

        return '/user/dashboard';
    }

    if (userData?.type === 'BRAND') {
        return '/brand/dashboard';
    }

    if (userData?.type === 'INFLUENCER') {
        return '/influencer/dashboard';
    }

    return '/';
}

function PhyoLogo({ priority = false, className = '' }) {
    return (
        <Image
            src="/landing/phyo_logo.svg"
            alt="Phyo"
            width={113}
            height={30}
            priority={priority}
            className={className}
        />
    );
}

function AuthLoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#010402]">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/15 border-t-[#10af56]"></div>
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
            className="h-5 w-5 mt-[40px]"
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
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </>
            )}
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
            <path
                d="M3.5 8.5l2.25 2.25L12.5 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

function AuthArtworkPanel() {
    return (
        <section className="relative hidden min-h-screen flex-1 overflow-hidden rounded-r-[42px] lg:flex">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#03200c_0%,#03170a_58%,#030603_100%)]"></div>
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(126, 182, 143, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(126, 182, 143, 0.1) 1px, transparent 1px)',
                    backgroundSize: '120px 100%, 100% 120px',
                    backgroundPosition: '48px 0, 0 100px',
                }}
            />
            <div className="absolute left-[-20%] top-[56%] h-24 w-[34rem] rotate-45 bg-[#124424]/25 blur-2xl"></div>
            <div className="absolute left-[30%] top-[52%] h-10 w-[20rem] bg-white/5 blur-xl"></div>
            <div className="absolute right-[-8%] top-[-10%] h-[26rem] w-[26rem] rounded-full bg-[#0c5227]/20 blur-[120px]"></div>
            <div className="absolute left-3 top-[142px] h-px w-28 bg-white/10"></div>
            <div className="absolute left-[36%] top-[53%] h-px w-44 bg-white/10"></div>
            <div className="absolute right-[-10px] bottom-10 h-px w-72 bg-white/12"></div>
            <div className="absolute right-[12%] bottom-[22%] h-40 w-px bg-white/10"></div>
            <div className="relative flex h-full w-full flex-col justify-between px-[56px] py-[60px] xl:px-[72px]">
                <PhyoLogo priority className="h-[30px] w-auto" />
                <div className="max-w-[540px] space-y-5 pb-2 mb-[210px]">
                    <h1
                        className="max-w-[440px] text-[42px] font-medium leading-[1.08] tracking-[-0.04em] text-white xl:text-[50px]"
                        style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
                    >
                        Welcome To The <span className="font-semibold">Phyo.AI</span>
                    </h1>
                    <p
                        className="max-w-[540px] text-[18px] leading-[1.55] text-white/52"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >
                        {welcomeCopy}
                    </p>

                    <Image
                        src="/login_page/bg_image.png"
                        alt="Login Artwork"
                        width={720}
                        height={1280}
                        className="absolute right-0 top-1/2 w-auto -translate-y-1/2 object-contain opacity-65 bg-cover bg-center bg-no-repeat mix-blend-luminosity"
                    />
                </div>
            </div>
        </section>
    );
}

function FormField({ field, register, error, showPassword, onTogglePassword }) {
    return (
        <div className={field.name === 'email' || field.name === 'password' ? 'sm:col-span-2' : ''}>
            <div className="relative border-b border-white/45 pb-3 transition-colors focus-within:border-white/80">
                <label
                    htmlFor={field.name}
                    className="block text-[15px] leading-none text-white/48"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    {field.label}
                </label>
                <input
                    id={field.name}
                    type={field.name === 'password' && showPassword ? 'text' : field.type}
                    autoComplete={field.autoComplete}
                    spellCheck={field.name === 'email' ? false : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                    {...register(field.name, field.validation)}
                    className="mt-4 w-full bg-transparent text-[18px] leading-none text-white outline-none placeholder:text-white/18"
                    style={{ fontFamily: 'var(--font-inter)' }}
                />

                {field.name === 'password' && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-0 top-0 text-white/40 transition hover:text-white/75"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        <EyeIcon slashed={!showPassword} className='mt-[40px]' />
                    </button>
                )}
            </div>

            {error && (
                <p
                    className="pt-2 text-sm text-[#ff8f8f]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
}

function OTPVerificationForm({
    email,
    otp,
    otpLoading,
    resendLoading,
    onOtpChange,
    onOtpKeyDown,
    onOtpPaste,
    onVerify,
    onResend,
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#010402] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(7,96,39,0.34)_0%,rgba(2,15,8,0.28)_34%,rgba(1,4,2,1)_65%)]"></div>
            <div className="absolute right-[-18rem] top-[-18rem] h-[50rem] w-[50rem] rounded-full bg-[#0b662e]/20 blur-[120px]"></div>

            <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
                <AuthArtworkPanel />

                <section className="relative flex min-h-screen flex-1 items-center px-6 py-10 sm:px-10 lg:items-start lg:px-[60px] lg:py-[60px] xl:px-[92px]">
                    <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top,rgba(9,97,41,0.25),rgba(1,4,2,0)_48%)]"></div>

                    <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto lg:mr-0">
                        <PhyoLogo priority className="mb-12 h-[30px] w-auto lg:hidden" />

                        <div className="mb-10 space-y-4 lg:mb-9">
                            <h2
                                className="text-[42px] leading-none tracking-[-0.04em] text-white sm:text-[48px]"
                                style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
                            >
                                Verify Your Email
                            </h2>
                            <p
                                className="max-w-[520px] text-base leading-[1.65] text-white/52 sm:text-[18px]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                We sent a 6-digit code to{' '}
                                <span className="text-[#10af56]">{email}</span>. Enter it below to
                                finish creating your account.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                        maxLength="1"
                                        value={digit}
                                        onChange={(event) => onOtpChange(index, event.target.value)}
                                        onKeyDown={(event) => onOtpKeyDown(index, event)}
                                        onPaste={onOtpPaste}
                                        className="h-14 w-12 rounded-2xl border border-white/20 bg-white/5 text-center text-xl text-white outline-none transition focus:border-[#10af56] focus:bg-white/[0.08] sm:h-16 sm:w-14"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    />
                                ))}
                            </div>

                            <div className="space-y-5">
                                <button
                                    type="button"
                                    onClick={onVerify}
                                    disabled={otpLoading || otp.join('').length !== 6}
                                    className="flex h-12 w-full items-center justify-center rounded-full border border-white bg-transparent px-5 text-[18px] font-medium text-white transition hover:border-[#10af56] hover:text-[#10af56] disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    {otpLoading ? (
                                        <span className="flex items-center gap-3">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify Email'
                                    )}
                                </button>

                                <div
                                    className="text-center text-[14px] text-white/42"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    Didn&apos;t receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={onResend}
                                        disabled={resendLoading}
                                        className="font-medium text-[#10af56] underline underline-offset-4 transition hover:text-[#34d27a] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {resendLoading ? 'Resending...' : 'Resend'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

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

function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(() => Array(6).fill(''));
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [signupData, setSignupData] = useState(null);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    const redirectTarget = searchParams.get('redirect');

    useEffect(() => {
        if (!isAuthenticated()) {
            return;
        }

        const userDataStr = localStorage.getItem('userData');
        let redirect = redirectTarget;

        if (!redirect && userDataStr) {
            try {
                redirect = getDefaultRedirect(JSON.parse(userDataStr));
            } catch {
                redirect = '/';
            }
        }

        router.push(redirect || '/');
    }, [isAuthenticated, redirectTarget, router]);

    const signupAPI = async (userData) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    };

    const verifyOTPAPI = async (email, otpCode) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/user/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp: otpCode }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    };

    const googleSignupAPI = async (idToken) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken,
                type: 'USER',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);

        try {
            const result = await googleSignupAPI(credentialResponse.credential);

            if (!result.token) {
                throw new Error(result.message || 'Google signup failed.');
            }

            authUtils.setToken(result.token);

            const userData = result.user || result.data?.user || result.data;
            if (userData) {
                localStorage.setItem('userData', JSON.stringify(userData));
                if (userData.email) {
                    localStorage.setItem('userEmail', userData.email);
                }
            }

            toast.success('Successfully signed up with Google.');

            const redirect = redirectTarget || getDefaultRedirect(userData);
            setTimeout(() => router.push(redirect), 1000);
        } catch (error) {
            toast.error(error.message || 'Failed to sign up with Google.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google sign-up was unsuccessful. Please try again.');
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const userData = {
                name: data.name.trim(),
                username: data.username.trim(),
                email: data.email.trim(),
                password: data.password,
                type: 'USER',
            };

            await signupAPI(userData);
            setSignupData(userData);
            setShowOTP(true);
            setOtp(Array(6).fill(''));
            toast.success('OTP sent to your email. Please check your inbox.');
        } catch (error) {
            toast.error(error.message || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const nextOtp = [...otp];
        nextOtp[index] = value;
        setOtp(nextOtp);

        if (value && index < nextOtp.length - 1) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }

        if (event.key === 'ArrowLeft' && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }

        if (event.key === 'ArrowRight' && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPPaste = (event) => {
        const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '');

        if (!pastedValue) {
            return;
        }

        event.preventDefault();

        const nextOtp = Array(6)
            .fill('')
            .map((_, index) => pastedValue[index] || '');
        setOtp(nextOtp);

        const nextFocusIndex = Math.min(pastedValue.length, 6) - 1;
        if (nextFocusIndex >= 0) {
            document.getElementById(`otp-${nextFocusIndex}`)?.focus();
        }
    };

    const handleOTPSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6 || !signupData?.email) {
            toast.error('Please enter the full 6-digit code.');
            return;
        }

        setOtpLoading(true);

        try {
            const result = await verifyOTPAPI(signupData.email, otpCode);
            const verified =
                result.success ||
                result.status === 'success' ||
                result.verified ||
                result.message?.toLowerCase().includes('verified');

            if (!verified) {
                throw new Error(result.message || 'OTP verification failed.');
            }

            toast.success('Email verified successfully. Redirecting to login...');
            setTimeout(() => router.push('/login?verified=true'), 1200);
        } catch (error) {
            toast.error(error.message || 'OTP verification failed.');
        } finally {
            setOtpLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!signupData) {
            return;
        }

        setResendLoading(true);

        try {
            await signupAPI(signupData);
            setOtp(Array(6).fill(''));
            toast.success('A new OTP has been sent to your email.');
        } catch (error) {
            toast.error(error.message || 'Failed to resend OTP.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleGoogleButtonClick = () => {
        const googleButton = document.querySelector(
            '.phyo-hidden-google-signup div[role="button"][aria-labelledby]'
        );

        if (googleButton) {
            googleButton.click();
            return;
        }

        toast.error('Google sign-up is still loading. Please try again.');
    };

    if (isAuthenticated()) {
        return <AuthLoadingScreen />;
    }

    if (showOTP) {
        return (
            <OTPVerificationForm
                email={signupData?.email}
                otp={otp}
                otpLoading={otpLoading}
                resendLoading={resendLoading}
                onOtpChange={handleOTPChange}
                onOtpKeyDown={handleOTPKeyDown}
                onOtpPaste={handleOTPPaste}
                onVerify={handleOTPSubmit}
                onResend={resendOTP}
            />
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#010402] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(7,96,39,0.34)_0%,rgba(2,15,8,0.28)_34%,rgba(1,4,2,1)_65%)]"></div>
            <div className="absolute right-[-18rem] top-[-18rem] h-[50rem] w-[50rem] rounded-full bg-[#0b662e]/20 blur-[120px]"></div>

            <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
                <AuthArtworkPanel />

                <section className="relative flex min-h-screen flex-1 items-center px-6 py-10 sm:px-10 lg:items-start lg:px-[60px] lg:py-[60px] xl:px-[92px]">
                    <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top,rgba(9,97,41,0.25),rgba(1,4,2,0)_48%)]"></div>

                    <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto lg:mr-0">
                        <PhyoLogo priority className="mb-12 h-[30px] w-auto lg:hidden" />

                        <div className="mb-10 space-y-4 lg:mb-9">
                            <h2
                                className="text-[48px] leading-none tracking-[-0.04em] text-white sm:text-[56px]"
                                style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
                            >
                                Let&apos;s Setup Your Account
                            </h2>
                            <p
                                className="max-w-[540px] text-base leading-[1.65] text-white/52 sm:text-[18px]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                {signupCopy}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2">
                                {formFields.map((field) => (
                                    <FormField
                                        key={field.name}
                                        field={field}
                                        register={register}
                                        error={errors[field.name]}
                                        showPassword={showPassword}
                                        onTogglePassword={() =>
                                            setShowPassword((value) => !value)
                                        }
                                    />
                                ))}
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="terms" className="flex cursor-pointer items-start gap-3">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        {...register('terms', {
                                            required: 'Please check the box to continue.',
                                        })}
                                        className="peer sr-only"
                                    />
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-white/55 bg-transparent text-transparent transition peer-checked:border-[#10af56] peer-checked:bg-[#10af56]/10 peer-checked:text-[#10af56] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#10af56]">
                                        <CheckIcon />
                                    </span>
                                    <span
                                        className="max-w-[460px] text-[13px] leading-[1.4] text-white/40"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        {checkboxCopy}
                                    </span>
                                </label>

                                {errors.terms && (
                                    <p
                                        className="text-sm text-[#ff8f8f]"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        {errors.terms.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-10 pt-1">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-12 w-full items-center justify-center rounded-full border border-white bg-transparent px-5 text-[18px] font-medium text-white transition hover:border-[#10af56] hover:text-[#10af56] disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>

                                <div className="flex items-center gap-3 text-white/28">
                                    <span className="h-px flex-1 bg-white/18"></span>
                                    <span
                                        className="text-sm text-white/42"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        Or
                                    </span>
                                    <span className="h-px flex-1 bg-white/18"></span>
                                </div>

                                <div className="space-y-6">
                                    <button
                                        type="button"
                                        onClick={handleGoogleButtonClick}
                                        disabled={googleLoading || loading}
                                        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white bg-transparent px-5 text-[18px] font-medium text-white transition hover:border-[#10af56] hover:text-[#10af56] disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        {googleLoading ? (
                                            <span className="flex items-center gap-3">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                                Connecting To Google...
                                            </span>
                                        ) : (
                                            <>
                                                <GoogleIcon />
                                                <span>Continue With Google</span>
                                            </>
                                        )}
                                    </button>

                                    <p
                                        className="text-center text-[14px] text-white/42"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                        Already Have An Account?{' '}
                                        <Link
                                            href="/login"
                                            className="font-medium text-[#10af56] underline underline-offset-4 transition hover:text-[#34d27a]"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>

                        <div
                            className="phyo-hidden-google-signup absolute h-0 w-0 overflow-hidden opacity-0"
                            aria-hidden="true"
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap={false}
                            />
                        </div>
                    </div>
                </section>
            </div>

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

export default function SignupPage() {
    const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Suspense fallback={<AuthLoadingScreen />}>
                <SignupForm />
            </Suspense>
        </GoogleOAuthProvider>
    );
}
