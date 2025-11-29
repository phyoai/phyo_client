'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const formFields = [
    {
        name: 'name',
        label: 'Full Name',
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
    const [error, setError] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpLoading, setOtpLoading] = useState(false);
    const [signupData, setSignupData] = useState(null);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(redirect);
        }
    }, [isAuthenticated, router, searchParams]);

    const signupAPI = async (userData) => {
        console.log('Sending signup data:', userData); // Debug log
        
        const response = await fetch('https://api.phyo.ai/api/user/signup', {
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
        
        // Replace with your actual OTP verification endpoint
        const response = await fetch('https://api.phyo.ai/api/user/verify-otp', {
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

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

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
                setSignupData(userData);
                setShowOTP(true);
            } else {
                console.log('Unexpected response format:', result); // Debug log
                // Still show OTP screen if we got a response (assuming OTP was sent)
                setSignupData(userData);
                setShowOTP(true);
            }
        } catch (error) {
            console.error('Signup error:', error); // Debug log
            setError(error.message || 'An unexpected error occurred');
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
            setError('Please enter all 6 digits');
            return;
        }

        setOtpLoading(true);
        setError('');

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
                
                // Small delay to show success, then redirect
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 1000);
                
                // Show success message
                setError(''); // Clear any errors
                // You could set a success state here if you want to show a success message
                
            } else {
                console.log('OTP verification failed with result:', result); // Debug log
                setError(result.message || 'OTP verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error); // Debug log
            
            // If the error message indicates success, still redirect
            if (error.message?.includes('verified') || error.message?.includes('success')) {
                console.log('Error message indicates success, redirecting anyway...'); // Debug log
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 1000);
            } else {
                setError(error.message || 'OTP verification failed');
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

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

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
                            className="text-[#00897B] hover:text-[#00796B] font-semibold transition-colors"
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Section - Illustration with Green Background */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#F1FFEF] relative">
                {/* Logo - Top Left */}
                <div className="absolute top-8 left-8 z-10">
                    <h1 className="text-3xl font-bold text-gray-900">phyo</h1>
                </div>

                {/* Illustration Container */}
                <div className="w-full h-full flex items-center justify-center p-12">
                    <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                        {/* Social Media Icons - Positioned around illustration */}
                        <div className="absolute top-1/4 left-16 w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center z-10 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </div>
                        
                        <div className="absolute top-1/3 left-32 w-12 h-12 bg-[#2C3E50] rounded-full flex items-center justify-center z-10 shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                            </svg>
                        </div>

                        {/* Main Illustration - Centered */}
                        <div className="relative flex items-center justify-center">
                            <img 
                                src="/welcome.png" 
                                alt="Welcome Illustration" 
                                className="w-full max-w-lg object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F1FFEF] min-h-screen p-8">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#00897B] font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            <div className="flex items-center">
                                <span className="mr-2">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                                />
                                {errors[field.name] && (
                                    <p className="text-red-500 text-sm mt-1.5">
                                        {errors[field.name].message}
                                    </p>
                                )}
                            </div>
                        ))}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#00674F] hover:bg-[#00796B] text-white font-semibold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00897B] border-t-transparent"></div>
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}