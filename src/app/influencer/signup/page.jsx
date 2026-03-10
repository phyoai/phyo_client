'use client'
import React, { Suspense, useEffect } from 'react'
import FormContainer from '../../../components/FormContainer'
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { isAuthenticated, isInfluencer, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isAuthenticated() && isInfluencer()) {
        router.replace('/influencer/dashboard');
      }
    }, [isAuthenticated, isInfluencer, loading, router]);

    if (!loading && isAuthenticated() && isInfluencer()) {
      return null;
    }

    const steps = [{
        title: "Creator Profile",
        description: "Tell us about yourself as a creator",
        submit: "Continue",
        fields: [
            { name: "full_name", type: "text", placeholder: "Enter Your Full Name", label: "Full Name", required: true },
            { name: "username", type: "text", placeholder: "Your creator handle", label: "Username / Handle", required: true },
            { name: "email", type: "text", placeholder: "you@example.com", label: "Email Address", required: true },
            { name: "phone", type: "text", placeholder: "+91 98765 43210", label: "Phone Number", required: false },
            { name: "location", type: "text", placeholder: "Mumbai", label: "Location", required: true },
            { name: "bio", type: "textarea", placeholder: "Tell brands about yourself and your content", label: "Creator Bio", required: false },
        ],
    }, {
        title: "Social Media & Content",
        description: "Add your social media profiles and content categories",
        submit: "Continue",
        fields: [
            {
                name: "social_media.instagram",
                type: "text",
                placeholder: "https://instagram.com/yourusername",
                label: "Instagram",
                required: false,
                validation: {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
                        message: "Please enter a valid Instagram URL"
                    }
                }
            },
            {
                name: "social_media.youtube",
                type: "text",
                placeholder: "https://youtube.com/@yourchannel",
                label: "YouTube",
                required: false,
                validation: {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/,
                        message: "Please enter a valid YouTube URL"
                    }
                }
            },
            {
                name: "social_media.twitter",
                type: "text",
                placeholder: "https://twitter.com/yourusername",
                label: "Twitter / X",
                required: false,
                validation: {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/.+$/,
                        message: "Please enter a valid Twitter/X URL"
                    }
                }
            },
            { name: "content_category", type: "select", placeholder: "Select your primary niche", label: "Primary Content Niche", required: true, options: [
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
                { value: "Lifestyle", label: "Lifestyle" },
                { value: "Other", label: "Other" },
            ]},
            { name: "profile_photo", type: "file", label: "Profile Photo", required: true, accept: "image/*" },
            { name: "portfolio_link", type: "text", placeholder: "https://yourportfolio.com", label: "Portfolio / Media Kit URL", required: false },
        ],
    }, {
        title: "Verification",
        description: "Verify your identity to start collaborating with brands",
        submit: "Complete Registration",
        fields: [
            {
                name: "verification_documents.pan_number",
                type: "text",
                placeholder: "ABCDE1234F",
                label: "PAN Number",
                required: false,
                validation: {
                    pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: "Please enter a valid PAN number (e.g., ABCDE1234F)"
                    }
                }
            },
            { name: "verification_documents.govt_id", type: "file", label: "Government ID (Aadhaar / Passport)", required: false, accept: ".pdf,.jpg,.jpeg,.png" },
            { name: "verification_documents.bank_account", type: "text", placeholder: "Bank Account Number", label: "Bank Account Number", required: false },
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
                    <FormContainer steps={steps} theme="influencer" />
                </Suspense>
            </div>
        </div>
    )
}
