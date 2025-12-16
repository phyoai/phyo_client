'use client'
import FormContainer from '../../brand/components/FormContainer'
import Image from 'next/image'
import React, { Suspense } from 'react'

const page = () => {
    const steps = [{
        title: "Personal Information",
        description: "Tell us about yourself",
        submit: "Continue",
        fields: [
            { name: "full_name", type: "text", placeholder: "Your Full Name", label: "Full Name", required: true },
            { name: "stage_name", type: "text", placeholder: "Your Stage/Creator Name", label: "Stage Name", required: false },
            { name: "date_of_birth", type: "date", placeholder: "YYYY-MM-DD", label: "Date of Birth", required: false },
            { name: "gender", type: "select", placeholder: "Select gender", label: "Gender", required: false, options: [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
                { value: "Prefer not to say", label: "Prefer not to say" }
            ]},
            { name: "location.city", type: "text", placeholder: "Los Angeles", label: "City", required: false },
            { name: "location.state", type: "text", placeholder: "California", label: "State/Province", required: false },
            { name: "location.country", type: "select", placeholder: "Select country", label: "Country", required: false, options: [
                { value: "USA", label: "United States" },
                { value: "UK", label: "United Kingdom" },
                { value: "Canada", label: "Canada" },
                { value: "Australia", label: "Australia" },
                { value: "India", label: "India" },
                { value: "Germany", label: "Germany" },
                { value: "France", label: "France" },
                { value: "Brazil", label: "Brazil" },
                { value: "Mexico", label: "Mexico" },
                { value: "Other", label: "Other" }
            ]},
            { name: "bio", type: "textarea", placeholder: "Tell us about yourself and your content...", label: "Bio (max 500 characters)", required: false, maxLength: 500 }
        ],
    }, {
        title: "Social Media Presence",
        description: "Connect your social media accounts",
        submit: "Continue",
        fields: [
            { name: "social_media.instagram.username", type: "text", placeholder: "your_instagram_handle", label: "Instagram Username", required: true },
            { name: "social_media.instagram.link", type: "text", placeholder: "https://instagram.com/yourhandle", label: "Instagram Profile Link", required: false },
            { name: "social_media.youtube.channel_url", type: "text", placeholder: "https://youtube.com/@yourchannel", label: "YouTube Channel URL", required: false },
            { name: "social_media.tiktok.username", type: "text", placeholder: "your_tiktok_handle", label: "TikTok Username", required: false },
            { name: "social_media.facebook.profile_url", type: "text", placeholder: "https://facebook.com/yourprofile", label: "Facebook Profile URL", required: false },
            { name: "social_media.twitter.username", type: "text", placeholder: "your_twitter_handle", label: "Twitter Username", required: false },
            { name: "personal_website", type: "text", placeholder: "https://yourwebsite.com", label: "Personal Website", required: false }
        ],
    }, {
        title: "Content & Niches",
        description: "What type of content do you create?",
        submit: "Continue",
        fields: [
            { name: "niches", type: "multiselect", placeholder: "Select your niches", label: "Content Niches", required: false, options: [
                { value: "Fashion", label: "Fashion" },
                { value: "Beauty", label: "Beauty" },
                { value: "Lifestyle", label: "Lifestyle" },
                { value: "Travel", label: "Travel" },
                { value: "Food", label: "Food" },
                { value: "Fitness", label: "Fitness" },
                { value: "Health", label: "Health" },
                { value: "Technology", label: "Technology" },
                { value: "Gaming", label: "Gaming" },
                { value: "Music", label: "Music" },
                { value: "Comedy", label: "Comedy" },
                { value: "Education", label: "Education" },
                { value: "Business", label: "Business" },
                { value: "Finance", label: "Finance" },
                { value: "Parenting", label: "Parenting" },
                { value: "Home & Garden", label: "Home & Garden" },
                { value: "Sports", label: "Sports" },
                { value: "Art & Design", label: "Art & Design" },
                { value: "Photography", label: "Photography" },
                { value: "Sustainability", label: "Sustainability" }
            ]},
            { name: "languages_spoken", type: "multiselect", placeholder: "Select languages you speak", label: "Languages Spoken", required: false, options: [
                { value: "English", label: "English" },
                { value: "Spanish", label: "Spanish" },
                { value: "French", label: "French" },
                { value: "German", label: "German" },
                { value: "Chinese", label: "Chinese" },
                { value: "Japanese", label: "Japanese" },
                { value: "Portuguese", label: "Portuguese" },
                { value: "Hindi", label: "Hindi" },
                { value: "Arabic", label: "Arabic" },
                { value: "Russian", label: "Russian" }
            ]},
            { name: "portfolio.content_highlights", type: "textarea", placeholder: "Describe your content style, achievements, average engagement rates...", label: "Content Highlights", required: false }
        ],
    }, {
        title: "Collaboration Charges",
        description: "Set your rates for different types of content",
        submit: "Continue",
        fields: [
            { name: "rate_card.instagram_post", type: "number", placeholder: "5000", label: "Instagram Post (USD)", required: false },
            { name: "rate_card.instagram_story", type: "number", placeholder: "2000", label: "Instagram Story (USD)", required: false },
            { name: "rate_card.instagram_reel", type: "number", placeholder: "7500", label: "Instagram Reel (USD)", required: false },
            { name: "rate_card.youtube_video", type: "number", placeholder: "15000", label: "YouTube Video (USD)", required: false },
            { name: "rate_card.tiktok_video", type: "number", placeholder: "6000", label: "TikTok Video (USD)", required: false },
            { name: "rate_card.blog_post", type: "number", placeholder: "3000", label: "Blog Post (USD)", required: false }
        ],
    }, {
        title: "Availability & Preferences",
        description: "Set your availability and working preferences",
        submit: "Continue",
        fields: [
            { name: "availability.current_availability", type: "select", placeholder: "Current availability", label: "Current Availability", required: false, options: [
                { value: "Available", label: "Available" },
                { value: "Fully Booked", label: "Fully Booked" },
                { value: "Limited Capacity", label: "Available with Limited Capacity" },
                { value: "On Break", label: "On Break" }
            ]},
            { name: "availability.monthly_campaign_capacity", type: "number", placeholder: "5", label: "Monthly Campaign Capacity", required: false },
            { name: "availability.preferred_campaign_types", type: "multiselect", placeholder: "Preferred campaign types", label: "Preferred Campaign Types", required: false, options: [
                { value: "Product Reviews", label: "Product Reviews" },
                { value: "Brand Ambassadorships", label: "Brand Ambassadorships" },
                { value: "Sponsored Content", label: "Sponsored Content" },
                { value: "Event Coverage", label: "Event Coverage" },
                { value: "Giveaways", label: "Giveaways" },
                { value: "Long-term Partnerships", label: "Long-term Partnerships" }
            ]},
            { name: "availability.industries_work_with", type: "multiselect", placeholder: "Industries you work with", label: "Industries You Work With", required: false, options: [
                { value: "Fashion", label: "Fashion" },
                { value: "Beauty", label: "Beauty" },
                { value: "Technology", label: "Technology" },
                { value: "Health & Wellness", label: "Health & Wellness" },
                { value: "Food & Beverage", label: "Food & Beverage" },
                { value: "Travel", label: "Travel" },
                { value: "Automotive", label: "Automotive" },
                { value: "Finance", label: "Finance" },
                { value: "Gaming", label: "Gaming" },
                { value: "Sports", label: "Sports" }
            ]},
            { name: "availability.industries_avoid", type: "multiselect", placeholder: "Industries you avoid", label: "Industries You Avoid", required: false, options: [
                { value: "Tobacco", label: "Tobacco" },
                { value: "Alcohol", label: "Alcohol" },
                { value: "Fast Food", label: "Fast Food" },
                { value: "Gambling", label: "Gambling" },
                { value: "Political", label: "Political" },
                { value: "Adult Content", label: "Adult Content" }
            ]}
        ],
    }, {
        title: "Final Details & Upload",
        description: "Complete your profile with additional information",
        submit: "Complete Registration",
        fields: [
            { name: "profile_picture", type: "file", label: "Profile Picture", required: false, accept: "image/*" },
            { name: "cover_photo", type: "file", label: "Cover Photo", required: false, accept: "image/*" },
            { name: "portfolio.media_kit", type: "file", label: "Media Kit (PDF)", required: false, accept: ".pdf" },
            { name: "notifications.email_preferences", type: "checkbox", label: "Enable email notifications", required: false },
            { name: "notifications.push_notifications", type: "checkbox", label: "Enable push notifications", required: false },
            { name: "notifications.campaign_recommendations", type: "checkbox", label: "Receive campaign recommendations", required: false }
        ]
    }];
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex'>
            {/* Left side - Illustration (hidden on mobile) */}
            <div className='hidden lg:flex lg:w-1/2 relative items-center justify-center p-8'>
                <div className="relative">
                    <Image 
                        src="/welcome.png" 
                        width={400} 
                        height={500} 
                        alt='influencer registration' 
                        className='object-contain max-w-full max-h-[80vh]' 
                    />
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Join Our Creator Community</h3>
                        <p className="text-gray-600 text-sm">
                            Connect with top brands and monetize your influence with our AI-powered platform.
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
                        <FormContainer steps={steps} theme="influencer" />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default page