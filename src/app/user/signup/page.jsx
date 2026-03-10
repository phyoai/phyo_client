'use client'
import React, { Suspense, useEffect } from 'react'
import FormContainer from '@/components/dashboard/FormContainer'
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { isAuthenticated, isUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isAuthenticated() && isUser()) {
        router.replace('/user/dashboard');
      }
    }, [isAuthenticated, isUser, loading, router]);

    if (!loading && isAuthenticated() && isUser()) {
      return null;
    }

    const steps = [{
        title: "Personal Details",
        description: "Tell us about yourself",
        submit: "Continue",
        fields: [
            { name: "full_name", type: "text", placeholder: "Enter Your Full Name", label: "Full Name", required: true },
            { name: "username", type: "text", placeholder: "Choose a username", label: "Username", required: true },
            { name: "email", type: "text", placeholder: "you@example.com", label: "Email Address", required: true },
            { name: "phone", type: "text", placeholder: "+91 98765 43210", label: "Phone Number", required: false },
            { name: "location", type: "text", placeholder: "Mumbai", label: "Location", required: true },
            { name: "bio", type: "textarea", placeholder: "Tell us a bit about yourself", label: "Bio", required: false },
        ],
    }, {
        title: "Preferences",
        description: "Customize your experience",
        submit: "Continue",
        fields: [
            { name: "content_categories", type: "select", placeholder: "Select your interest", label: "Primary Interest", required: true, options: [
                { value: "Technology", label: "Technology" },
                { value: "Fashion", label: "Fashion & Beauty" },
                { value: "Food & Beverage", label: "Food & Beverage" },
                { value: "Health & Fitness", label: "Health & Fitness" },
                { value: "Travel & Tourism", label: "Travel & Tourism" },
                { value: "Education", label: "Education" },
                { value: "Finance", label: "Finance" },
                { value: "Sports", label: "Sports" },
                { value: "Entertainment", label: "Entertainment" },
                { value: "Gaming", label: "Gaming" },
                { value: "Other", label: "Other" },
            ]},
            { name: "preferred_platform", type: "select", placeholder: "Select preferred platform", label: "Preferred Platform", required: false, options: [
                { value: "Instagram", label: "Instagram" },
                { value: "YouTube", label: "YouTube" },
                { value: "Twitter", label: "Twitter / X" },
                { value: "LinkedIn", label: "LinkedIn" },
                { value: "TikTok", label: "TikTok" },
            ]},
            { name: "profile_photo", type: "file", label: "Profile Photo", required: false, accept: "image/*" },
        ],
    }, {
        title: "Account Setup",
        description: "Secure your account",
        submit: "Complete Registration",
        fields: [
            { name: "password", type: "text", placeholder: "Create a strong password", label: "Password", required: true },
            { name: "confirm_password", type: "text", placeholder: "Repeat your password", label: "Confirm Password", required: true },
            { name: "referral_code", type: "text", placeholder: "Enter referral code (optional)", label: "Referral Code", required: false },
        ],
    }]

    return (
        <div className='min-h-screen bg-neutral-base flex items-center justify-center'>
            <div className='w-full h-screen max-w-full overflow-hidden'>
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                    </div>
                }>
                    <FormContainer steps={steps} theme="user" />
                </Suspense>
            </div>
        </div>
    )
}
