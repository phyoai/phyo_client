"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { authAPI, brandAPI, influencerAPI } from '../../../utils/api';
import Lottie from 'lottie-react';
import businessDealAnimation from '../../../../public/assets/businessdeal.json';
import TextInput from "../../../components/Inputs/TextInput";
import Select from "../../../components/Inputs/Select";
import FileInput from "../../../components/Inputs/FileInput";
import RadioInput from "../../../components/Inputs/RadioInput";
import Distribution from "../../../components/Inputs/Distribution";
import CollaborationCharges from "../../../components/Inputs/CollaborationCharges";
import AudienceLocation from "../../../components/Inputs/AudienceLocation";
import MultiSelect from "../../../components/Inputs/MultiSelect";
import CheckboxInput from "../../../components/Inputs/CheckboxInput";
import TextAreaInput from "../../../components/Inputs/TextAreaInput";
import ToggleInput from "../../../components/Inputs/ToggleInput";

const FormContainer = ({ steps, theme = 'brand' }) => {
  const methods = useForm({ 
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isAuthenticated } = useAuth();

  // Check if user has already submitted a registration
  const checkExistingRegistration = async () => {
    try {
      // Prefer live status if authenticated
      if (isAuthenticated) {
        const statusResp = await authAPI.getRegistrationStatus();
        const status = statusResp?.data || {};

        if (theme === 'brand') {
          if (['PENDING', 'APPROVED', 'DECLINED'].includes(status.brandRegistrationStatus)) {
            setAlreadySubmitted(true);
            setRegistrationMessage(
              status.brandRegistrationStatus === 'PENDING'
                ? 'Your Brand registration is pending approval.'
                : status.brandRegistrationStatus === 'APPROVED'
                  ? 'Your Brand account is already approved.'
                  : 'Your Brand registration was declined. Please contact support.'
            );
            return true;
          }
        }

        if (theme === 'influencer') {
          if (['PENDING', 'APPROVED', 'REJECTED'].includes(status.influencerRegistrationStatus)) {
            setAlreadySubmitted(true);
            setRegistrationMessage(
              status.influencerRegistrationStatus === 'PENDING'
                ? 'Your Influencer registration is pending approval.'
                : status.influencerRegistrationStatus === 'APPROVED'
                  ? 'Your Influencer account is already approved.'
                  : 'Your Influencer registration was rejected. Please contact support.'
            );
            return true;
          }
        }

        // If server says NONE, clear any old local flags
        localStorage.removeItem('brandRegistrationSubmitted');
        localStorage.removeItem('influencerRegistrationSubmitted');
        localStorage.removeItem('brandRegistrationBlocked');
        localStorage.removeItem('influencerRegistrationBlocked');
      }
    } catch (err) {
      console.error('Registration status check failed, falling back to local flags:', err);
    }

    // Fallback to legacy localStorage flags
    const brandSubmitted = localStorage.getItem('brandRegistrationSubmitted');
    const influencerSubmitted = localStorage.getItem('influencerRegistrationSubmitted');
    const brandBlocked = localStorage.getItem('brandRegistrationBlocked');
    const influencerBlocked = localStorage.getItem('influencerRegistrationBlocked');
    
    if (brandSubmitted && theme === 'brand') {
      setAlreadySubmitted(true);
      setRegistrationMessage('You have already submitted a brand registration. Please wait for our review.');
      return true;
    }
    
    if (influencerSubmitted && theme === 'influencer') {
      setAlreadySubmitted(true);
      setRegistrationMessage('You have already submitted an influencer registration. Please wait for our review.');
      return true;
    }
    
    if (brandBlocked && theme === 'brand') {
      setAlreadySubmitted(true);
      setRegistrationMessage('You have already submitted an influencer registration. You cannot register as a brand until your influencer application is reviewed.');
      return true;
    }
    
    if (influencerBlocked && theme === 'influencer') {
      setAlreadySubmitted(true);
      setRegistrationMessage('You have already submitted a brand registration. You cannot register as an influencer until your brand application is reviewed.');
      return true;
    }
    
    return false;
  };

  // Check on component mount
  useEffect(() => {
    checkExistingRegistration();
  }, [theme, isAuthenticated]);

  // Function to handle registration submission
  const initiateRegistration = async (data) => {
    setLoading(true);
    setError('');

    const isValidUrl = (value) => {
      if (!value) return false;
      try {
        const u = new URL(value);
        return u.protocol === 'https:' || u.protocol === 'http:';
      } catch (e) {
        return false;
      }
    };

    const buildBrandFormData = (formValues) => {
      const formData = new FormData();
      const appendIfPresent = (key, value) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      };

      const firstFile = (...candidates) => {
        for (const c of candidates) {
          if (!c) continue;
          if (c instanceof File) return c;
          if (Array.isArray(c) && c[0] instanceof File) return c[0];
          if (c instanceof FileList && c.length > 0) return c[0];
        }
        return null;
      };

      const allFiles = (...candidates) => {
        for (const c of candidates) {
          if (!c) continue;
          if (Array.isArray(c) && c.length) return Array.from(c).filter(f => f instanceof File);
          if (c instanceof FileList && c.length) return Array.from(c);
          if (c instanceof File) return [c];
        }
        return [];
      };

      // Basic account info
      appendIfPresent('email', formValues.email);
      appendIfPresent('password', formValues.password);

      // Company information
      appendIfPresent('company_name', formValues.company_name || formValues.brandName);
      appendIfPresent('website_url', formValues.website_url || formValues.website);
      appendIfPresent('industry', formValues.industry);
      appendIfPresent('company_type', formValues.company_type || 'Brand');
      appendIfPresent('company_size', formValues.company_size);
      appendIfPresent('company_description', formValues.company_description);
      appendIfPresent('location', formValues.location);
      appendIfPresent('country', formValues.country);

      // Contact information
      const contact = {
        first_name: formValues.contact?.first_name || formValues['contact.first_name'] || formValues.first_name,
        last_name: formValues.contact?.last_name || formValues['contact.last_name'] || formValues.last_name,
        email: formValues.contact?.email || formValues['contact.email'] || formValues.email,
        phone: formValues.contact?.phone || formValues['contact.phone'],
        job_title: formValues.contact?.job_title || formValues['contact.job_title']
      };
      appendIfPresent('contact', JSON.stringify(contact));

      // Social media and brand story
      appendIfPresent('social_media', JSON.stringify(formValues.social_media || {}));
      appendIfPresent('brand_story', formValues.brand_story);

      // Brand assets (files)
      const logoFile = firstFile(formValues.company_logo, formValues['company_logo']);
      if (logoFile) {
        formData.append('company_logo', logoFile);
      }

      const brandImages = allFiles(formValues.brand_images, formValues['brand_images']);
      if (brandImages.length) {
        brandImages.forEach((img) => formData.append('brand_images', img));
      }

      // Verification documents
      const verificationDocuments = formValues.verification_documents || {
        tax_id: formValues['verification_documents.tax_id'],
        company_registration_number: formValues['verification_documents.company_registration_number'],
        business_registration: formValues['verification_documents.business_registration'],
        authorization_letter: formValues['verification_documents.authorization_letter']
      };
      appendIfPresent('verification_documents', JSON.stringify({
        tax_id: verificationDocuments.tax_id,
        company_registration_number: verificationDocuments.company_registration_number
      }));

      const businessRegistrationFile = firstFile(
        verificationDocuments.business_registration,
        formValues['verification_documents.business_registration']
      );
      if (businessRegistrationFile) formData.append('business_registration', businessRegistrationFile);

      const authorizationLetterFile = firstFile(
        verificationDocuments.authorization_letter,
        formValues['verification_documents.authorization_letter']
      );
      if (authorizationLetterFile) formData.append('authorization_letter', authorizationLetterFile);

      // Billing and preferences
      appendIfPresent('billing_info', JSON.stringify(formValues.billing_info || {}));
      appendIfPresent('subscription_plan', formValues.subscription_plan || 'BRONZE');
      appendIfPresent('payment_method', JSON.stringify(formValues.payment_method || {}));
      appendIfPresent('preferences', JSON.stringify(formValues.preferences || {}));
      appendIfPresent('team_members', JSON.stringify(formValues.team_members || []));

      // Account setup
      appendIfPresent('account', JSON.stringify({ signup_method: 'email' }));

      return formData;
    };

    const buildInfluencerFormData = (formValues) => {
      const formData = new FormData();
      
      const appendIfPresent = (key, value) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      };

      const firstFile = (...candidates) => {
        for (const c of candidates) {
          if (!c) continue;
          if (c instanceof File) return c;
          if (Array.isArray(c) && c[0] instanceof File) return c[0];
          if (c instanceof FileList && c.length > 0) return c[0];
        }
        return null;
      };

      // Helper to get value from nested or flat field names
      const getValue = (nestedPath, flatPath) => {
        return formValues[nestedPath] || formValues[flatPath];
      };

      // Personal Information
      appendIfPresent('full_name', formValues.full_name);
      appendIfPresent('stage_name', formValues.stage_name);
      appendIfPresent('date_of_birth', formValues.date_of_birth);
      appendIfPresent('gender', formValues.gender);
      appendIfPresent('bio', formValues.bio);
      appendIfPresent('personal_website', formValues.personal_website);

      // Location - handle both nested and flat structures
      const location = {
        city: getValue('location.city', 'location.city') || formValues.location?.city,
        state: getValue('location.state', 'location.state') || formValues.location?.state,
        country: getValue('location.country', 'location.country') || formValues.location?.country
      };
      if (location.city || location.state || location.country) {
        appendIfPresent('location', JSON.stringify(location));
      }

      // Arrays - send as JSON strings
      appendIfPresent('languages_spoken', JSON.stringify(formValues.languages_spoken || []));
      appendIfPresent('niches', JSON.stringify(formValues.niches || []));

      // Social Media - handle flat field names from React Hook Form
      const socialMedia = {
        instagram: {
          username: getValue('social_media.instagram.username', 'social_media.instagram.username') || formValues.social_media?.instagram?.username,
          link: getValue('social_media.instagram.link', 'social_media.instagram.link') || formValues.social_media?.instagram?.link
        },
        youtube: {
          channel_url: getValue('social_media.youtube.channel_url', 'social_media.youtube.channel_url') || formValues.social_media?.youtube?.channel_url
        },
        tiktok: {
          username: getValue('social_media.tiktok.username', 'social_media.tiktok.username') || formValues.social_media?.tiktok?.username
        },
        facebook: {
          profile_url: getValue('social_media.facebook.profile_url', 'social_media.facebook.profile_url') || formValues.social_media?.facebook?.profile_url
        },
        twitter: {
          username: getValue('social_media.twitter.username', 'social_media.twitter.username') || formValues.social_media?.twitter?.username
        }
      };
      
      console.log('🔍 Debug - Social Media Data:', {
        instagram_username: socialMedia.instagram.username,
        instagram_link: socialMedia.instagram.link,
        raw_formValues_keys: Object.keys(formValues).filter(k => k.includes('instagram'))
      });
      
      appendIfPresent('social_media', JSON.stringify(socialMedia));

      // Portfolio
      const portfolio = {
        content_highlights: getValue('portfolio.content_highlights', 'portfolio.content_highlights') || formValues.portfolio?.content_highlights
      };
      if (portfolio.content_highlights) {
        appendIfPresent('portfolio', JSON.stringify(portfolio));
      }

      // Files
      const profilePicture = firstFile(formValues.profile_picture, formValues['profile_picture']);
      if (profilePicture) formData.append('profile_picture', profilePicture);

      const coverPhoto = firstFile(formValues.cover_photo, formValues['cover_photo']);
      if (coverPhoto) formData.append('cover_photo', coverPhoto);

      const mediaKit = firstFile(getValue('portfolio.media_kit', 'portfolio.media_kit'));
      if (mediaKit) formData.append('media_kit', mediaKit);

      // Rate Card - handle flat field names
      const rateCard = {
        instagram_post: getValue('rate_card.instagram_post', 'rate_card.instagram_post') || formValues.rate_card?.instagram_post,
        instagram_story: getValue('rate_card.instagram_story', 'rate_card.instagram_story') || formValues.rate_card?.instagram_story,
        instagram_reel: getValue('rate_card.instagram_reel', 'rate_card.instagram_reel') || formValues.rate_card?.instagram_reel,
        youtube_video: getValue('rate_card.youtube_video', 'rate_card.youtube_video') || formValues.rate_card?.youtube_video,
        tiktok_video: getValue('rate_card.tiktok_video', 'rate_card.tiktok_video') || formValues.rate_card?.tiktok_video,
        blog_post: getValue('rate_card.blog_post', 'rate_card.blog_post') || formValues.rate_card?.blog_post
      };
      if (Object.values(rateCard).some(v => v)) {
        appendIfPresent('rate_card', JSON.stringify(rateCard));
      }

      // Availability - handle flat field names
      const availability = {
        current_availability: getValue('availability.current_availability', 'availability.current_availability') || formValues.availability?.current_availability,
        monthly_campaign_capacity: getValue('availability.monthly_campaign_capacity', 'availability.monthly_campaign_capacity') || formValues.availability?.monthly_campaign_capacity,
        preferred_campaign_types: formValues['availability.preferred_campaign_types'] || formValues.availability?.preferred_campaign_types || [],
        industries_work_with: formValues['availability.industries_work_with'] || formValues.availability?.industries_work_with || [],
        industries_avoid: formValues['availability.industries_avoid'] || formValues.availability?.industries_avoid || []
      };
      if (Object.values(availability).some(v => v)) {
        appendIfPresent('availability', JSON.stringify(availability));
      }

      // Notifications - handle flat field names
      const notifications = {
        email_preferences: getValue('notifications.email_preferences', 'notifications.email_preferences') || formValues.notifications?.email_preferences || false,
        push_notifications: getValue('notifications.push_notifications', 'notifications.push_notifications') || formValues.notifications?.push_notifications || false,
        campaign_recommendations: getValue('notifications.campaign_recommendations', 'notifications.campaign_recommendations') || formValues.notifications?.campaign_recommendations || false
      };
      appendIfPresent('notifications', JSON.stringify(notifications));

      // Contact
      const contact = {
        email: formValues.email || formValues['contact.email'],
        phone: formValues.phone || formValues['contact.phone']
      };
      appendIfPresent('contact', JSON.stringify(contact));

      // Account
      appendIfPresent('account', JSON.stringify({ signup_method: 'email' }));

      return formData;
    };
    
    // Check if already submitted before proceeding
    const already = await checkExistingRegistration();
    if (already) {
      setLoading(false);
      return;
    }
    
    try {
      // Detect if this is brand or influencer registration based on form fields
      const isBrandForm = data.company_name || data.brandName;
      const isInfluencerForm = data.full_name || data.stage_name || data.social_media?.instagram?.username;
      
      if (isBrandForm) {
        // Frontend URL validation to prevent invalid website URLs
        const website = data.website_url || data.website;
        if (!isValidUrl(website)) {
          setError('Please enter a valid website URL starting with http:// or https://');
          setLoading(false);
          return;
        }

        // Handle brand registration
        const formData = buildBrandFormData(data);

        // Use the new brand API (multipart/form-data to support uploads)
        const result = await brandAPI.submitRegistration(formData, true);
        
        if (result.message) {
          setRegistrationSuccess(true);
          setRegistrationMessage(result.message);
          setError('');
          // Mark as submitted to prevent re-registration
          localStorage.setItem('brandRegistrationSubmitted', 'true');
          localStorage.setItem('influencerRegistrationBlocked', 'true');
          // Clear any stored data as registration is complete
          sessionStorage.removeItem('pendingBrandData');
        } else {
          setError(result.error || 'Brand registration failed');
        }
        
      } else if (isInfluencerForm) {
        // Handle influencer registration with FormData
        const formData = buildInfluencerFormData(data);

        // Use the new influencer API with FormData (true flag for multipart)
        const result = await influencerAPI.submitRegistration(formData, true);
        
        if (result.message) {
          setRegistrationSuccess(true);
          setRegistrationMessage(result.message);
          setError('');
          // Mark as submitted to prevent re-registration
          localStorage.setItem('influencerRegistrationSubmitted', 'true');
          localStorage.setItem('brandRegistrationBlocked', 'true');
          // Clear any stored data as registration is complete
          sessionStorage.removeItem('pendingInfluencerData');
        } else {
          setError(result.error || 'Influencer registration failed');
        }
        
      } else {
        setError('Unable to determine registration type. Please ensure all required fields are filled.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An unexpected error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    // Clear previous errors
    setError('');

    if (currentStep < steps.length - 1) {
      // Trigger validation for all fields in current step
      const currentStepFields = steps[currentStep].fields;
      const fieldNames = currentStepFields.map(f => f.name);
      
      // Trigger validation for all current step fields
      const isValid = await methods.trigger(fieldNames);
      
      console.log('🔍 Current Step:', currentStep);
      console.log('📋 Validation Result:', isValid);
      console.log('📋 Form Errors:', methods.formState.errors);
      
      if (!isValid) {
        // Get first error message
        const firstError = Object.values(methods.formState.errors)[0];
        setError(firstError?.message || 'Please fix the errors before continuing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // Get current form values from React Hook Form
      const formValues = methods.getValues();
      
      console.log('📋 All Form Values:', formValues);
      
      // Validate current step's required fields before proceeding
      const requiredFields = currentStepFields.filter(field => field.required);
      const missingFields = [];

      for (const field of requiredFields) {
        // Handle nested field names (e.g., "location.city", "social_media.instagram.username")
        let fieldValue = field.name.includes('.') 
          ? field.name.split('.').reduce((obj, key) => obj?.[key], formValues)
          : formValues[field.name];
        
        // Special handling for multiselect: parse JSON string if needed
        if (field.type === 'multiselect' && typeof fieldValue === 'string') {
          try {
            fieldValue = JSON.parse(fieldValue);
          } catch (e) {
            console.log(`    ⚠️  Failed to parse JSON for "${field.name}":`, fieldValue);
          }
        }
        
        console.log(`  ✓ Checking field "${field.name}":`, fieldValue, `(type: ${typeof fieldValue})`);
        
        // Check if field is empty or invalid
        let isEmpty = false;
        
        if (fieldValue === undefined || fieldValue === null) {
          isEmpty = true;
        } else if (typeof fieldValue === 'string') {
          // For string fields, check if empty or just whitespace
          if (fieldValue.trim() === '') {
            isEmpty = true;
          }
        } else if (Array.isArray(fieldValue)) {
          // For arrays (including parsed multiselect), check length
          if (fieldValue.length === 0) {
            isEmpty = true;
          }
        } else if (fieldValue instanceof FileList) {
          // For file inputs
          if (fieldValue.length === 0) {
            isEmpty = true;
          }
        } else if (fieldValue instanceof File) {
          // Single file
          isEmpty = false;
        }

        if (isEmpty) {
          console.log(`    ❌ Field "${field.name}" is EMPTY`);
          missingFields.push(field.label || field.name);
        } else {
          // console.log(`    ✅ Field "${field.name}" is VALID`);
        }
      }

      // Also validate non-required fields with patterns (like URLs)
      const fieldsWithValidation = currentStepFields.filter(field => field.validation && !field.required);
      for (const field of fieldsWithValidation) {
        let fieldValue = field.name.includes('.') 
          ? field.name.split('.').reduce((obj, key) => obj?.[key], formValues)
          : formValues[field.name];

        // Only validate if field has a value
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim() !== '') {
          // Check pattern validation
          if (field.validation.pattern) {
            const pattern = field.validation.pattern.value;
            if (!pattern.test(fieldValue)) {
              setError(field.validation.pattern.message || `Invalid format for ${field.label}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
          }
        }
      }

      if (missingFields.length > 0) {
        // console.log('❌ Validation Failed. Missing fields:', missingFields);
        setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        
        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return; // Don't proceed to next step
      }

      // console.log('✅ Validation Passed. Moving to next step.');
      
      // If validation passes, move to next step
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission - initiate registration
      await initiateRegistration(data);
    }
  };

  const step = steps[currentStep];

  // Function to render success screen for brand/influencer registration
  const renderSuccessScreen = () => {
    if (!registrationSuccess) return null;

    return (
      <>
        {/* Fixed Progress Steps for Success State */}
     

        {/* Scrollable Success Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-9 py-4">
          <div className="max-w-[90%] mx-auto px-40">
            <div className="flex flex-col items-center gap-4">
              {/* Success Animation */}
              <div className="w-[518px] h-[355px] shrink-0">
                <Lottie 
                  animationData={businessDealAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Success Message */}
              <div className="flex flex-col gap-4 items-center max-w-[500px] w-full text-center">
                <h2 className="text-xl font-semibold text-[#242527] leading-7 tracking-[-0.14px] w-full">
                  {theme === 'influencer' 
                    ? 'You have successfully registered as an influencer'
                    : 'You have successfully registered your brand'
                  }
                </h2>
                <p className="text-base text-[#505152] leading-6 w-full">
                  We will get back to you as soon as your request get's approved.
                </p>
                <p className="text-base text-[#505152] leading-6 w-full">
                  Once approved your login id and password will be provided by your registered email{' '}
                  <span className="font-bold">xyz@abc.com</span>
                </p>
              </div>

              {/* Back to Home Button */}
              <div className="max-w-[500px] w-full">
                <button
                  onClick={() => {
                    setRegistrationSuccess(false);
                    router.push('/');
                  }}
                  className="w-full px-4 py-2 bg-[#43573b] text-white rounded-full font-semibold hover:bg-[#3a4a32] transition-colors duration-200"
                >
                  Go back to home
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Function to render "already submitted" modal
  const renderAlreadySubmittedModal = () => {
    if (!alreadySubmitted) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Already Submitted</h3>
            <div className="text-gray-600 text-sm mb-6">
              <p className="mb-2">{registrationMessage}</p>
              <p className="text-yellow-600 font-medium">You cannot register for the other type until your current application is reviewed.</p>
            </div>
            
            <button
              onClick={() => {
                setAlreadySubmitted(false);
                router.push('/');
              }}
              className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-colors duration-200 ${
                theme === 'influencer' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="h-screen flex flex-col bg-white">
        {/* Fixed App Bar */}
        <div className="bg-white flex items-center justify-between px-1 py-2 shrink-0 border-b border-gray-200">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              if (registrationSuccess) {
                router.push('/');
              } else if (currentStep > 0) {
                setCurrentStep((prev) => prev - 1);
              } else {
                router.push('/');
              }
            }}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex-1 px-2">
            <h1 className="text-xl font-semibold text-gray-800">
              {theme === 'influencer' ? 'Influencer Registration' : 'Brand Registration'}
            </h1>
          </div>

          {/* Menu Button */}
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>

        {/* Show Already Submitted Modal */}
        {renderAlreadySubmittedModal()}

        {/* Conditional Rendering: Success Screen OR Normal Form Steps */}
        {registrationSuccess ? (
          renderSuccessScreen()
        ) : !alreadySubmitted ? (
          <>
            {/* Fixed Progress Steps */}
            <div className="bg-white px-9 py-4 shrink-0">
              <div className={`mx-auto ${theme === 'influencer' ? 'max-w-[80%] px-4' : 'max-w-4xl px-10'}`}>
                {/* Step Circles and Labels */}
                <div className="flex items-start justify-between relative">
                  {steps.map((stepItem, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 relative">
                      {/* Connecting Line to Previous Step */}
                      {index > 0 && (
                        <div 
                          className="absolute top-[18px] right-1/2 w-full h-[2px]"
                          style={{
                            backgroundColor: index <= currentStep ? '#43573b' : '#eceeeb',
                            zIndex: 0
                          }}
                        />
                      )}
                      
                      {/* Connecting Line to Next Step */}
                      {index < steps.length - 1 && (
                        <div 
                          className="absolute top-[18px] left-1/2 w-full h-[2px]"
                          style={{
                            backgroundColor: index < currentStep ? '#43573b' : '#eceeeb',
                            zIndex: 0
                          }}
                        />
                      )}
                      
                      {/* Step Circle */}
                      <div 
                        className="flex items-center justify-center w-9 h-9 rounded-full text-base font-semibold shrink-0 relative"
                        style={{
                          backgroundColor: index < currentStep || index === currentStep ? '#43573b' : '#eceeeb',
                          color: index < currentStep || index === currentStep ? 'white' : '#1f2937',
                          zIndex: 10
                        }}
                      >
                        {index < currentStep ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <div className={`font-medium text-gray-800 text-center ${theme === 'influencer' ? 'text-xs leading-tight max-w-[120px]' : 'text-sm max-w-[140px]'}`}>
                        {stepItem.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-9 py-4">
              <div className="max-w-[90%] mx-auto px-40">
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <div className="text-red-600 text-sm">
                          <strong>Error:</strong> {error}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {step.fields.map((field, index) => {
                      const isFullWidth = field.type === 'textarea' || 
                                        field.name === 'company_description' || 
                                        field.name === 'brand_story' ||
                                        field.name === 'bio' ||
                                        field.name === 'billing_info.billing_address';
                      
                      return (
                        <div key={field.name} className={isFullWidth ? 'w-full' : 'w-full'}>
                          {field.type === "text" && <TextInput {...field} />}
                          {field.type === "email" && <TextInput {...field} type="email" />}
                          {field.type === "password" && <TextInput {...field} type="password" />}
                          {field.type === "number" && <TextInput {...field} type="number" />}
                          {field.type === "date" && <TextInput {...field} type="date" />}
                          {field.type === "select" && <Select {...field} />}
                          {field.type === "file" && <FileInput {...field} />}
                          {field.type === "radio" && <RadioInput {...field} />}
                          {field.type === "distribution" && <Distribution {...field} />}
                          {field.type === "collaborationCharges" && <CollaborationCharges {...field} />}
                          {field.type === "audienceLocation" && <AudienceLocation {...field} />}
                          {field.type === "multiselect" && <MultiSelect {...field} />}
                          {field.type === "checkbox" && <CheckboxInput {...field} />}
                          {field.type === "toggle" && <ToggleInput {...field} />}
                          {field.type === "textarea" && <TextAreaInput {...field} />}
                          {!["text", "email", "password", "number", "date", "select", "file", "radio", "distribution", "collaborationCharges", "audienceLocation", "multiselect", "checkbox", "toggle", "textarea"].includes(field.type) && <TextInput {...field} />}
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>
            </div>

            {/* Fixed Bottom Navigation Buttons */}
            <div className="bg-white px-9 py-4 shrink-0 border-t border-gray-200">
              <div className={`mx-auto ${theme === 'influencer' ? 'max-w-5xl px-4' : 'max-w-4xl px-40'}`}>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      disabled={loading}
                      className="flex-1 px-4 py-2 rounded-full font-semibold transition-colors duration-200 border border-[#43573b] text-[#43573b] hover:bg-[#43573b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  )}
                  <button 
                    type="submit" 
                    onClick={methods.handleSubmit(onSubmit)}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded-full font-semibold transition-colors duration-200 bg-[#43573b] text-white hover:bg-[#3a4a32] disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === 0 ? 'w-full' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      currentStep === steps.length - 1 ? step.submit : 'Continue'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </FormProvider>
  );
};

export default FormContainer;
