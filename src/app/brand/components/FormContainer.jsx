"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import TextInput from "../../../components/Inputs/TextInput";
import Select from "../../../components/Inputs/Select";
import FileInput from "../../../components/Inputs/FileInput";
import RadioInput from "../../../components/Inputs/RadioInput";
import Distribution from "../../../components/Inputs/Distribution";
import CollaborationCharges from "../../../components/Inputs/CollaborationCharges";
import AudienceLocation from "../../../components/Inputs/AudienceLocation";

const FormContainer = ({ steps }) => {
  const methods = useForm({ 
    mode: "onBlur",
    resolver: (values) => {
      const errors = {};
      
      // Check if passwords match on the first step
      if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
        errors.confirmPassword = {
          type: "manual",
          message: "Passwords do not match"
        };
      }
      
      return {
        values,
        errors
      };
    }
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationInitiated, setRegistrationInitiated] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [userToken, setUserToken] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isAuthenticated } = useAuth();

  // Function to initiate registration (sends OTP)
  const initiateRegistration = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const signupData = {
        email: data.email,
        password: data.password,
        type: 'BRAND',
        name: data.brandName || data.name || 'Brand User',
        username: data.brandName?.toLowerCase().replace(/\s+/g, '') || 'branduser',
        industry: data.industry || 'general',
        companyName: data.brandName || data.companyName || 'Brand Company',
        website: data.website || '',
        ...data
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.message && result.message.includes('verification code')) {
        setRegistrationInitiated(true);
        setRegistrationEmail(result.email || data.email);
        setError('');
        
        // Store the signup data for later use after OTP verification
        sessionStorage.setItem('pendingSignupData', JSON.stringify(signupData));
      } else {
        if ((result.message || result.error || '').toLowerCase().includes('already exist')) {
          setError(
            <span>
              User with this email already exists.{' '}
              <a href="/login" className="text-blue-600 underline">Login here</a>.
            </span>
          );
        } else {
          setError(result.message || result.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP and redirect to dashboard
  const verifyOTP = async (email, otp) => {
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` }),
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setOtpVerified(true);
        setOtpError('');
        
        // Clean up session storage
        sessionStorage.removeItem('pendingSignupData');
        
        // Show success message briefly then redirect
        setTimeout(() => {
          const redirect = searchParams.get('redirect') || '/brand/dashboard';
          router.push(redirect);
        }, 1500);
        
      } else {
        setOtpError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Function to resend OTP by calling signup again
  const resendOTP = async () => {
    const pendingData = sessionStorage.getItem('pendingSignupData');
    if (pendingData) {
      const signupData = JSON.parse(pendingData);
      await initiateRegistration(signupData);
    }
  };

  const onSubmit = async (data) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission - initiate registration (which sends OTP)
      await initiateRegistration(data);
    }
  };

  const step = steps[currentStep];

  // Function to render OTP verification modal
  const renderOTPVerificationModal = () => {
    if (!registrationInitiated) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
            <p className="text-gray-600 text-sm">
              We've sent a verification code to<br />
              <span className="font-medium">{registrationEmail}</span>
            </p>
          </div>

          {!otpVerified ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  maxLength="6"
                  onChange={(e) => {
                    // Only allow numbers
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    if (e.target.value.length === 6) {
                      verifyOTP(registrationEmail, e.target.value);
                    }
                  }}
                  disabled={otpLoading}
                  autoFocus
                />
              </div>
              
              {otpError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {otpError}
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={otpLoading}
                  className="text-green-600 hover:text-green-800 font-medium text-sm disabled:opacity-50"
                >
                  {otpLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </div>

              {otpLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Verifying...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-green-600 mb-2">
                Email Verified Successfully!
              </h4>
              <p className="text-gray-600 text-sm">
                Redirecting to your dashboard...
              </p>
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto px-[50px] flex flex-col justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
        <p className="mb-4">{step.description}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Show OTP verification modal if registration is initiated */}
        {registrationInitiated && renderOTPVerificationModal()}

        {/* Only show form fields if registration hasn't been initiated yet */}
        {!registrationInitiated && (
          <>
            {step.fields.map((field) => {
              if (field.type === "text") {
                return <TextInput key={field.name} {...field} />;
              } else if (field.type === "select") {
                return <Select key={field.name} {...field} />;
              } else if (field.type === "file") {
                return <FileInput key={field.name} {...field} />;
              } else if (field.type === "radio") {
                return <RadioInput key={field.name} {...field} />;
              } else if (field.type === "distribution") {
                return <Distribution key={field.name} {...field} />
              } else if (field.type === "collaborationCharges") {
                return <CollaborationCharges key={field.name} {...field} />;
              } else if (field.type === "audienceLocation") {
                return <AudienceLocation key={field.name} {...field} />;
              } else {
                return <TextInput key={field.name} {...field} />;
              }
            })}

            <div className="flex justify-between gap-2 mt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Back
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="flex-grow px-4 py-2 bg-[#00674F] text-white rounded disabled:opacity-50"
              >
                {loading ? 'Processing...' : step.submit}
              </button>
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
};

export default FormContainer;