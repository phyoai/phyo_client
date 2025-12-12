'use client'
import Image from 'next/image'
import React, { Suspense } from 'react'
import FormContainer from '../components/FormContainer'
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { isAuthenticated, isBrand, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isAuthenticated() && isBrand()) {
        router.replace('/brand/dashboard');
      }
    }, [isAuthenticated, isBrand, loading, router]);

    if (!loading && isAuthenticated() && isBrand()) {
      return null; // Or a loader if you want
    }

    const steps = [{
        title: "Brand Registration",
        description: "Create your account to get started",
        submit: "Create Account",
        fields: [
            { name: "email", type: "email", placeholder: "Enter your email", label: "Email", required: true },
            { name: "password", type: "password", placeholder: "Create a password", label: "Password", required: true },
            { name: "confirmPassword", type: "password", placeholder: "Confirm your password", label: "Confirm Password", required: true }
        ],
    }, {
        title: "Company Information",
        description: "Tell us about your company",
        submit: "Continue",
        fields: [
            { name: "company_name", type: "text", placeholder: "Enter Your Company Name", label: "Company Name", required: true },
            { name: "website_url", type: "text", placeholder: "https://yourcompany.com", label: "Website URL", required: true },
            { name: "industry", type: "select", placeholder: "Select your industry", label: "Industry", required: true, options: [
                { value: "Technology", label: "Technology" },
                { value: "Fashion", label: "Fashion & Beauty" },
                { value: "Food & Beverage", label: "Food & Beverage" },
                { value: "Health & Fitness", label: "Health & Fitness" },
                { value: "Travel & Tourism", label: "Travel & Tourism" },
                { value: "Education", label: "Education" },
                { value: "Finance", label: "Finance" },
                { value: "Sports", label: "Sports" },
                { value: "Entertainment", label: "Entertainment" },
                { value: "Automotive", label: "Automotive" },
                { value: "Real Estate", label: "Real Estate" },
                { value: "E-commerce", label: "E-commerce" },
                { value: "Gaming", label: "Gaming" },
                { value: "Other", label: "Other" }
            ]},
            { name: "company_type", type: "select", placeholder: "Select company type", label: "Company Type", required: false, options: [
                { value: "Brand", label: "Brand" },
                { value: "Agency", label: "Marketing Agency" },
                { value: "Startup", label: "Startup" },
                { value: "Enterprise", label: "Enterprise" },
                { value: "SMB", label: "Small/Medium Business" }
            ]},
            { name: "company_size", type: "select", placeholder: "Select company size", label: "Company Size", required: false, options: [
                { value: "1-10", label: "1-10 employees" },
                { value: "11-50", label: "11-50 employees" },
                { value: "51-200", label: "51-200 employees" },
                { value: "201-1000", label: "201-1000 employees" },
                { value: "1000+", label: "1000+ employees" }
            ]},
            { name: "company_description", type: "textarea", placeholder: "Briefly describe your company", label: "Company Description", required: false }
        ],
    }, {
        title: "Contact Information",
        description: "Primary contact details for your account",
        submit: "Continue",
        fields: [
            { name: "contact.first_name", type: "text", placeholder: "First Name", label: "First Name", required: true },
            { name: "contact.last_name", type: "text", placeholder: "Last Name", label: "Last Name", required: true },
            { name: "contact.email", type: "email", placeholder: "Contact Email", label: "Contact Email", required: true },
            { name: "contact.phone", type: "text", placeholder: "+1 (555) 123-4567", label: "Phone Number", required: false },
            { name: "contact.job_title", type: "text", placeholder: "Marketing Manager", label: "Job Title", required: false },
            { name: "location", type: "text", placeholder: "San Francisco", label: "City", required: false },
            { name: "country", type: "select", placeholder: "Select country", label: "Country", required: false, options: [
                { value: "USA", label: "United States" },
                { value: "UK", label: "United Kingdom" },
                { value: "Canada", label: "Canada" },
                { value: "Australia", label: "Australia" },
                { value: "India", label: "India" },
                { value: "Germany", label: "Germany" },
                { value: "France", label: "France" },
                { value: "Other", label: "Other" }
            ]}
        ],
    }, {
        title: "Social Media & Brand Assets",
        description: "Add your social media links and upload brand assets",
        submit: "Continue",
        fields: [
            { name: "social_media.facebook", type: "text", placeholder: "https://facebook.com/yourcompany", label: "Facebook URL", required: false },
            { name: "social_media.instagram", type: "text", placeholder: "https://instagram.com/yourcompany", label: "Instagram URL", required: false },
            { name: "social_media.twitter", type: "text", placeholder: "https://twitter.com/yourcompany", label: "Twitter URL", required: false },
            { name: "social_media.linkedin", type: "text", placeholder: "https://linkedin.com/company/yourcompany", label: "LinkedIn URL", required: false },
            { name: "social_media.youtube", type: "text", placeholder: "https://youtube.com/yourcompany", label: "YouTube URL", required: false },
            { name: "social_media.tiktok", type: "text", placeholder: "https://tiktok.com/@yourcompany", label: "TikTok URL", required: false },
            { name: "company_logo", type: "file", label: "Company Logo", required: false, accept: "image/*" },
            { name: "brand_images", type: "file", label: "Brand Images (up to 10)", required: false, accept: "image/*", multiple: true },
            { name: "brand_story", type: "textarea", placeholder: "Tell your brand story...", label: "Brand Story", required: false }
        ],
    }, {
        title: "Subscription & Preferences",
        description: "Choose your plan and set preferences",
        submit: "Complete Registration",
        fields: [
            { name: "subscription_plan", type: "select", placeholder: "Select subscription plan", label: "Subscription Plan", required: false, options: [
                { value: "BRONZE", label: "Bronze - Free (Limited features)" },
                { value: "SILVER", label: "Silver - $99/month" },
                { value: "GOLD", label: "Gold - $199/month" },
                { value: "PROFESSIONAL", label: "Professional - $299/month" },
                { value: "ENTERPRISE", label: "Enterprise - Contact us" }
            ]},
            { name: "preferences.notifications", type: "checkbox", label: "Email notifications", required: false },
            { name: "preferences.timezone", type: "select", placeholder: "Select timezone", label: "Timezone", required: false, options: [
                { value: "America/New_York", label: "Eastern Time (ET)" },
                { value: "America/Chicago", label: "Central Time (CT)" },
                { value: "America/Denver", label: "Mountain Time (MT)" },
                { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
                { value: "Europe/London", label: "London (GMT)" },
                { value: "Europe/Paris", label: "Paris (CET)" },
                { value: "Asia/Tokyo", label: "Tokyo (JST)" },
                { value: "Asia/Shanghai", label: "Shanghai (CST)" },
                { value: "Asia/Kolkata", label: "Mumbai (IST)" }
            ]},
            { name: "preferences.language", type: "select", placeholder: "Select language", label: "Language", required: false, options: [
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
                { value: "zh", label: "Chinese" },
                { value: "ja", label: "Japanese" },
                { value: "hi", label: "Hindi" }
            ]},
            { name: "billing_info.billing_address", type: "textarea", placeholder: "123 Main St, City, State, ZIP", label: "Billing Address", required: false },
            { name: "billing_info.finance_email", type: "email", placeholder: "finance@yourcompany.com", label: "Finance Email", required: false }
        ]
    }]
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex'>
            {/* Left side - Illustration (hidden on mobile) */}
            <div className='hidden lg:flex lg:w-1/2 relative items-center justify-center p-8'>
                <div className="relative">
                    <Image 
                        src="/welcome.png" 
                        width={400} 
                        height={500} 
                        alt='brand registration' 
                        className='object-contain max-w-full max-h-[80vh]' 
                    />
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Join Thousands of Brands</h3>
                        <p className="text-gray-600 text-sm">
                            Connect with top influencers and grow your brand with our AI-powered platform.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Right side - Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-4'>
                <div className='bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] max-h-[900px] overflow-hidden'>
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                        </div>
                    }>
                        <FormContainer steps={steps} theme="brand" />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}