'use client'
import Image from 'next/image'
import React, { Suspense } from 'react'
import FormContainer from '../components/FormContainer'
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
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
      return null; // Or a loader if you want
    }

    const steps = [{
        title: "Brand Details",
        description: "Tell us about your company",
        submit: "Continue",
        fields: [
            { name: "company_name", type: "text", placeholder: "Enter Your Company Name", label: "Company Name", required: true },
            { 
                name: "website_url", 
                type: "text", 
                placeholder: "https://yourcompany.com", 
                label: "Website URL", 
                required: true,
                validation: {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                        message: "Please enter a valid website URL (e.g., https://yourcompany.com)"
                    }
                }
            },
            { name: "industry", type: "select", placeholder: "Select your industry", label: "Select Industry Type", required: true, options: [
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
            { name: "company_type", type: "select", placeholder: "Select company type", label: "Select Company Type", required: true, options: [
                { value: "Brand", label: "Brand" },
                { value: "Agency", label: "Marketing Agency" },
                { value: "Startup", label: "Startup" },
                { value: "Enterprise", label: "Enterprise" },
                { value: "SMB", label: "Small/Medium Business" }
            ]},
            { name: "company_size", type: "select", placeholder: "Select company size", label: "Select Company Size", required: false, options: [
                { value: "1-10", label: "1-10 employees" },
                { value: "11-50", label: "11-50 employees" },
                { value: "51-200", label: "51-200 employees" },
                { value: "201-1000", label: "201-1000 employees" },
                { value: "1000+", label: "1000+ employees" }
            ]},
            { name: "location", type: "text", placeholder: "Mumbai", label: "Location", required: true },
            { name: "company_description", type: "textarea", placeholder: "Briefly describe your company", label: "Company Description", required: false }
        ],
    }, {
        title: "Brand Identity",
        description: "Add your social media links and upload brand assets",
        submit: "Continue",
        fields: [
            { 
                name: "social_media.instagram", 
                type: "text", 
                placeholder: "https://instagram.com/yourcompany", 
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
                name: "social_media.linkedin", 
                type: "text", 
                placeholder: "https://linkedin.com/company/yourcompany", 
                label: "Linkedin", 
                required: false,
                validation: {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?linkedin\.com\/(company|in)\/.+$/,
                        message: "Please enter a valid LinkedIn URL"
                    }
                }
            },
            { 
                name: "social_media.twitter", 
                type: "text", 
                placeholder: "https://twitter.com/yourcompany", 
                label: "X (Twitter)", 
                required: false,
                validation: {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/.+$/,
                        message: "Please enter a valid Twitter/X URL"
                    }
                }
            },
            { name: "company_logo", type: "file", label: "Company Logo", required: true, accept: "image/*" },
            { name: "brand_images", type: "file", label: "Brand Images (up to 10)", required: false, accept: "image/*", multiple: true },
            { name: "brand_story", type: "textarea", placeholder: "Tell your brand story...", label: "Brand Story", required: false }
        ],
    }, {
        title: "Documents Upload",
        description: "Provide your business verification documents",
        submit: "Complete Registration",
        fields: [
            { 
                name: "verification_documents.tax_id", 
                type: "text", 
                placeholder: "07ABCDE1234F2Z5", 
                label: "GST No.", 
                required: false,
                validation: {
                    pattern: {
                        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                        message: "Please enter a valid GSTIN (15 characters, e.g., 07ABCDE1234F2Z5)"
                    }
                }
            },
            { 
                name: "verification_documents.company_registration_number", 
                type: "text", 
                placeholder: "CIN/Registration Number", 
                label: "Company Registration No.", 
                required: true,
                validation: {
                    minLength: {
                        value: 15,
                        message: "Company Registration Number should be at least 15 characters"
                    }
                }
            },
            { name: "verification_documents.business_registration", type: "file", label: "Registration Certificate", required: false, accept: ".pdf,.doc,.docx" },
            { name: "verification_documents.authorization_letter", type: "file", label: "Authorization Letter", required: false, accept: ".pdf,.doc,.docx" }
        ],
    }]
    return (
        <div className='min-h-screen bg-white flex items-center justify-center'>
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