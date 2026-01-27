'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formFields = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'John Doe',
        validation: { required: 'Name is required' },
        icon: '👤'
    },
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'johndoe',
        validation: { required: 'Username is required' },
        icon: '@'
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'john@example.com',
        validation: { 
            required: 'Email is required',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
            }
        },
        icon: '✉️'
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a strong password',
        validation: { 
            required: 'Password is required',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
            }
        },
        icon: '🔒'
    },
];

function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpLoading, setOtpLoading] = useState(false);
    const [signupData, setSignupData] = useState(null);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
        }
    }, [isAuthenticated, router, searchParams]);

    const signupAPI = async (userData) => {
        console.log('Sending signup data:', userData); // Debug log
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODlhY2E1YTA0MTM5NjE0ODM4OWNmNSIsImlhdCI6MTc1Mzg1MzIyNiwiZXhwIjoxNzUzOTM5NjI2fQ.lep_xGBaaSJDUH68SCspcrudeybsmtwBpeRkJolKlBY'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log('API Response:', data); // Debug log
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const verifyOTPAPI = async (email, otpCode) => {
        console.log('Verifying OTP for:', email, 'with code:', otpCode); // Debug log
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/user/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODlhY2E1YTA0MTM5NjE0ODM4OWNmNSIsImlhdCI6MTc1Mzg1MzIyNiwiZXhwIjoxNzUzOTM5NjI2fQ.lep_xGBaaSJDUH68SCspcrudeybsmtwBpeRkJolKlBY'
            },
            body: JSON.stringify({ email, otp: otpCode })
        });

        const data = await response.json();
        console.log('OTP Verification Response:', data); // Debug log
        console.log('OTP Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const googleSignupAPI = async (idToken) => {
        console.log('Attempting Google signup'); // Debug log
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.phyo.ai/api';
        const response = await fetch(`${apiUrl}/user/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                idToken,
                type: 'USER' // Default user type
            })
        });

        const data = await response.json();
        console.log('Google Signup API Response:', data); // Debug log
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);

        try {
            console.log('Google credential received'); // Debug log
            const result = await googleSignupAPI(credentialResponse.credential);
            
            // Handle successful signup/login
            if (result.token) {
                console.log('Google signup successful'); // Debug log
                
                // Store the authentication token
                localStorage.setItem('authToken', result.token);
                
                // Store user data if provided
                if (result.user) {
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    if (result.user.email) {
                        localStorage.setItem('userEmail', result.user.email);
                    }
                }
                
                toast.success('🎉 Successfully signed up with Google!');
                
                // Redirect to dashboard or requested page
                const redirect = searchParams.get('redirect') || '/';
                setTimeout(() => router.push(redirect), 1000);
                
            } else {
                console.log('Google signup failed with result:', result); // Debug log
                toast.error(result.message || 'Google signup failed');
            }
        } catch (error) {
            console.error('Google signup error:', error); // Debug log
            toast.error(error.message || 'Failed to sign up with Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign-Up failed');
        toast.error('Google Sign-Up was unsuccessful. Please try again.');
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const userData = {
                ...data,
                type: 'USER' // Set to USER as requested
            };

            console.log('Submitting form with data:', userData); // Debug log
            const result = await signupAPI(userData);
            console.log('Signup result:', result); // Debug log
            
            // More flexible response handling
            if (result.success || result.message?.includes('OTP') || result.status === 'success' || result.data) {
                console.log('OTP should be sent, showing OTP screen'); // Debug log
                toast.success('📧 OTP sent to your email! Please check your inbox.');
                setSignupData(userData);
                setShowOTP(true);
            } else {
                console.log('Unexpected response format:', result); // Debug log
                // Still show OTP screen if we got a response (assuming OTP was sent)
                toast.success('📧 OTP sent to your email! Please check your inbox.');
                setSignupData(userData);
                setShowOTP(true);
            }
        } catch (error) {
            console.error('Signup error:', error); // Debug log
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter all 6 digits');
            return;
        }

        setOtpLoading(true);

        try {
            console.log('Attempting OTP verification...'); // Debug log
            const result = await verifyOTPAPI(signupData.email, otpCode);
            console.log('OTP verification result:', result); // Debug log
            
            // More flexible success handling
            if (result.success || result.message?.includes('verified') || result.status === 'success' || result.verified) {
                console.log('OTP verified successfully, redirecting to login...'); // Debug log
                
                // Store token if provided
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }
                
                toast.success('✅ Email verified successfully! Redirecting to login...');
                
                // Small delay to show success, then redirect
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 1500);
                
            } else {
                console.log('OTP verification failed with result:', result); // Debug log
                toast.error(result.message || 'OTP verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error); // Debug log
            
            // If the error message indicates success, still redirect
            if (error.message?.includes('verified') || error.message?.includes('success')) {
                console.log('Error message indicates success, redirecting anyway...'); // Debug log
                toast.success('✅ Email verified successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 1500);
            } else {
                toast.error(error.message || 'OTP verification failed');
            }
        } finally {
            setOtpLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!signupData) return;
        
        try {
            await signupAPI(signupData);
            setError('');
            // Show success message or toast
        } catch (error) {
            setError('Failed to resend OTP');
        }
    };

    // Show loading if checking authentication
    if (isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00897B] border-t-transparent"></div>
            </div>
        );
    }

    if (showOTP) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📧</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to<br />
                            <span className="font-semibold text-[#00897B]">{signupData?.email}</span>
                        </p>
                    </div>

                    <div className="flex justify-center space-x-3 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#00897B] focus:outline-none transition-colors"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleOTPSubmit}
                        disabled={otpLoading || otp.join('').length !== 6}
                        className="w-full bg-[#00897B] hover:bg-[#00796B] text-white font-semibold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {otpLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Verifying...
                            </div>
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-600 mb-2">Didn't receive the code?</p>
                        <button
                            onClick={resendOTP}
                            className="text-[#00897B] hover:text-[#00796L] font-semibold transition-colors"
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Logo - Top Left - Fixed Position */}
            <div className="absolute top-6 left-8 z-20">
                <img 
                    src="/logo.png" 
                    alt="Phyo Logo" 
                    className="h-10 w-auto object-contain"
                />
            </div>

            {/* Left Illustration - Positioned to overlap towards center */}
            <div className="hidden lg:block absolute left-[-5%] bottom-0 w-[55%] h-[90%] z-0">
                <img 
                    src="/assets/right_illustration.svg" 
                    alt="Welcome Illustration" 
                    className="w-full h-full object-contain object-right-bottom"
                    style={{ objectPosition: 'right bottom' }}
                />
            </div>

            {/* Middle Section - Signup Form */}
            <div className="w-full max-w-[30%] flex items-center justify-center p-4 z-10">
                <div className="w-full bg-white rounded-2xl shadow-xl py-6 px-6 border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Let's setup your account</h2>
                        <p className="text-gray-500 text-sm">
                            Enter your details to create your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type={field.name === 'password' && showPassword ? 'text' : field.type}
                                        placeholder={field.placeholder}
                                        {...register(field.name, field.validation)}
                                        className="w-full px-4 py-1.5 bg-gray-100 border-[3px] rounded-lg focus:ring-2 focus:ring-[#43573B] focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
                                    />
                                    {field.name === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showPassword ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                )}
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors[field.name].message}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-start pt-2 pb-2 px-3">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-0.5 w-5 h-5 text-[#43573B] bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#43573B] checked:bg-[#43573B] checked:border-[#43573B] cursor-pointer"
                                style={{
                                    accentColor: '#43573B'
                                }}
                            />
                            <label htmlFor="terms" className="ml-3 text-xs text-gray-500 leading-relaxed cursor-pointer">
                                by signing up you agree to <span className="text-gray-700 font-semibold">Terms of Service</span> and{' '}
                                <span className="text-gray-700 font-semibold">Privacy Policy.</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#43573B] hover:bg-[#2d4a3a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                {/* <div className="w-full border-t border-gray-300"></div> */}
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500 text-xs font-bold">or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign-Up Button */}
                        <div className="w-full">
                            <button
                                type="button"
                                onClick={() => {
                                    // Trigger the hidden Google login button
                                    const googleBtn = document.querySelector('div[role="button"][aria-labelledby]');
                                    if (googleBtn) {
                                        googleBtn.click();
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border-[#43573B] border-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 text-sm shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                            {/* Hidden Google Login for actual functionality */}
                            <div className="hidden">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap={false}
                                />
                            </div>
                        </div>

                        {/* Already have account link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="text-gray-900 font-semibold hover:underline">
                                    Login
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Illustration - Positioned to overlap towards center */}
            <div className="hidden lg:block absolute right-0 bottom-0  w-[38%]  z-0">
                <img 
                    src="/assets/illustation_right.svg" 
                    alt="Social Media Illustration" 
                    className="w-full h-full object-contain"
                    style={{ objectPosition: 'left bottom' }}
                />
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default function SignupPage() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com';
    
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00897B] border-t-transparent"></div>
                </div>
            }>
                <SignupForm />
            </Suspense>
        </GoogleOAuthProvider>
    );
}