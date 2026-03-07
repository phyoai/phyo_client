'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/utils/api';
import { useTheme } from '@/app/context/ThemeContext';
import { useLanguage } from '@/app/context/LanguageContext';
import {
  AccountCircleFill,
  ListUnordered, FileList3Line, WalletLine, PassExpiredLine, PaletteLine, Notification2Line, FileTextLine, CloseCircleLine, QuestionLine, LogoutBoxRLine, GlobalLine, InformationLine, ArrowDropRightLine,
  LockLine, PhoneLine, GroupLine, GridLine, ImageLine, MapPinLine, AddCircleLine, ArrowLeftLine,
  UserCommunityLine,
  DashboardLine,
  MultiImageLine,
  AddLargeFill
} from '@phyoofficial/phyo-icon-library';

export default function BrandAccount() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [activeEditTab, setActiveEditTab] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [brandImageFiles, setBrandImageFiles] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, language, changeLanguage, currentLanguage, languages } = useLanguage();

  useEffect(() => {
    fetchUserProfile();
  }, []);


  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getUserProfile();
      // Extract user data from response.data or response.user or response itself
      const userData = response.data || response.user || response;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };
console.log('UserLine profile data:', user);

  const getInitials = (name) => {
    if (!name) return 'J';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    router.push('/login');
  };

  const switchEditTab = (tab) => {
    setActiveEditTab(tab);
    setMobileView('panel');
    setOtpValue('');
    setShowOTPModal(false);
    setOtpSentSuccess(false);
    openEditSection(tab);
  };

  const openEditSection = (section) => {
    // Initialize form data based on the section
    switch (section) {
      case 'email':
        setEditFormData({ email: user?.email || '' });
        break;
      case 'phone':
        setEditFormData({
          // first_name: user?.contact?.first_name || '',
          // last_name: user?.contact?.last_name || '',
          mobileNumber: user?.mobileNumber || ''
        });
        break;
      case 'bio':
        setEditFormData({
          subtitle: user?.subtitle || '',
          bio: user?.bio || 'A confident, expressive personality with a bright turban and bold sunglasses. Swagdeep brings a sense of style and individuality—perfect for moments that need a touch of flair.'
        });
        break;
      case 'socials':
        setEditFormData({
          instagram: user?.social_media?.instagram || '',
          facebook: user?.social_media?.facebook || '',
          linkedin: user?.social_media?.linkedin || '',
          twitter: user?.social_media?.twitter || '',
          youtube: user?.social_media?.youtube || '',
          personalSite: user?.social_media?.tiktok || ''
        });
        break;
      case 'categories':
        setEditFormData({ categories: user?.categories || [] });
        break;
      case 'location':
        setEditFormData({
          city: user?.location || '',
          country: user?.country || ''
        });
        break;
      case 'password':
        setEditFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        break;
      default:
        break;
    }
  };

  const closeEditSection = () => {
    setEditingSection(null);
    setEditFormData({});
    setActiveEditTab(null);
    setMobileView('list');
    setShowOTPModal(false);
    setOtpValue('');
    setOtpSentSuccess(false);
    setIsSaving(false);
    setBrandImageFiles([]);
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOTP = async (type) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = type === 'email'
        ? { email: editFormData.email }
        : { phone: editFormData.mobileNumber };

      await fetch('https://api.phyo.ai/api/brand-requests/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      setOtpType(type);
      setOtpValue('');
      setOtpSentSuccess(true);
      setShowOTPModal(true);
    } catch (err) {
      setOtpType(type);
      setOtpValue('');
      setOtpSentSuccess(false);
      setShowOTPModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = otpType === 'email'
        ? { email: editFormData.email, otp: otpValue }
        : { phone: editFormData.mobileNumber, otp: otpValue };

      await fetch('https://api.phyo.ai/api/brand-requests/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const field = otpType === 'email'
        ? { email: editFormData.email }
        : { mobileNumber: editFormData.mobileNumber };
      await userAPI.updateUserProfile(field);
      await fetchUserProfile();
      setShowOTPModal(false);
      setOtpValue('');
      setActiveEditTab(null);
    } catch (err) {
      console.error('OTP verify error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    try {
      let payload = {};
      switch (activeEditTab) {
        case 'phone':
          payload = {
            contact: {
              first_name: editFormData.first_name,
              last_name: editFormData.last_name
            },
            mobileNumber: editFormData.mobileNumber
          };
          break;
        case 'bio':
          payload = {
            subtitle: editFormData.subtitle,
            bio: editFormData.bio
          };
          break;
        case 'socials':
          payload = {
            social_media: {
              instagram: editFormData.instagram,
              facebook: editFormData.facebook,
              linkedin: editFormData.linkedin,
              twitter: editFormData.twitter,
              youtube: editFormData.youtube,
              tiktok: editFormData.personalSite,
            }
          };
          break;
        case 'location':
          payload = {
            location: editFormData.city,
            country: editFormData.country
          };
          break;
        case 'categories':
          payload = { categories: editFormData.categories };
          break;
        default:
          break;
      }
      await userAPI.updateUserProfile(payload);
      await fetchUserProfile();
      setActiveEditTab(null);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (editFormData.newPassword !== editFormData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsSaving(true);
    try {
      await userAPI.updateUserProfile({
        currentPassword: editFormData.currentPassword,
        newPassword: editFormData.newPassword,
      });
      setActiveEditTab(null);
    } catch (err) {
      console.error('Password save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBrandImage = (e) => {
    const files = Array.from(e.target.files);
    const newEntries = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setBrandImageFiles(prev => [...prev, ...newEntries]);
  };

  const handleRemoveBrandImage = (index) => {
    setBrandImageFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveBrandImages = async () => {
    if (brandImageFiles.length === 0) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      brandImageFiles.forEach(({ file }) => formData.append('brand_images', file));
      await userAPI.updateUserProfile(formData, true);
      await fetchUserProfile();
      setBrandImageFiles([]);
      setActiveEditTab(null);
    } catch (err) {
      console.error('Brand images save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('company_logo', file);
      await userAPI.updateUserProfile(formData, true);
      await fetchUserProfile();
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col dark:bg-[#121212]">
        <div className="flex-shrink-0 bg-neutral-base dark:bg-[#1e1e1e] border-b border-gray-100 dark:border-gray-700">
          <div className="">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6 dark:bg-[#121212]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="mb-6">
            <div className="bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-2xl p-2">
              <div className="bg-neutral-base dark:bg-[#1e1e1e] rounded-lg overflow-hidden">
                {[1, 2, 3, 4, 5].map((i, idx) => (
                  <React.Fragment key={i}>
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    {idx < 4 && <div className="border-t border-gray-200 dark:border-gray-700 mx-6 my-1"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const MenuItem = ({ icon: Icon, label, rightElement, textColor = "text-[#43573b] dark:text-green-400", showChevron = true }) => (
    <div className="w-full flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${textColor}`} strokeWidth={1.5} />
        <div className="text-left">
          <div className={`text-base font-semibold ${textColor}`}>{label}</div>
        </div>
      </div>
      <div className="flex items-center">
        {rightElement}
      </div>
      {showChevron && (
        <ArrowDropRightLine width={24} height={24} className="text-gray-400 dark:text-gray-500" />
      )}
    </div>
  );

  const CATEGORY_OPTIONS = [
    'Comedy', 'Lifestyle', 'Fashion', 'Beauty', 'Tech', 'Travel',
    'Food', 'Fitness', 'Education', 'Finance', 'Gaming', 'Sports', 'Music',
  ];

  const RightPanelDefault = () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-0 bg-[#ebebeb] dark:bg-[#1a1a1a]">
      <img
        src="/assets/phyo_logo_new.svg"
        alt="Phyo"
        className="w-full max-w-[23rem] h-[8rem] object-contain"
      />
      <p className="text-base font-medium text-[#999999] dark:text-gray-800 leading-none -mt-8">
        A PyroMedia Product
      </p>
    </div>
  );

  const RightPanelEmail = () => (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Email</h3>
      <div className="flex-1">
        <input
          type="email"
          value={editFormData.email || ''}
          onChange={e => handleFormChange('email', e.target.value)}
          className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
          placeholder="your@email.com"
        />
      </div>
      <button
        onClick={() => handleSendOTP('email')}
        disabled={isSaving || !editFormData.email}
        className="bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Sending…' : 'Get OTP'}
      </button>
    </div>
  );

  const RightPanelPhone = () => (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Contact Information</h3>
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#808080] mb-2">First Name</label>
          <input
            type="text"
            value={editFormData.first_name || ''}
            onChange={e => handleFormChange('first_name', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#808080] mb-2">Last Name</label>
          <input
            type="text"
            value={editFormData.last_name || ''}
            onChange={e => handleFormChange('last_name', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            placeholder="Last name"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-[#808080]">Mobile Number</label>
            <span className="text-xs text-[#808080]">
              {String(editFormData.mobileNumber || '').length}/10
            </span>
          </div>
          <input
            type="tel"
            maxLength={10}
            value={editFormData.mobileNumber || ''}
            onChange={e => handleFormChange('mobileNumber', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            placeholder="9876543210"
          />
        </div>
      </div>
      <button
        onClick={handleSaveSection}
        disabled={isSaving}
        className="mt-4 bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );

  const RightPanelBio = () => (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Bio</h3>
      <div className="flex-1">
        <textarea
          rows={8}
          value={editFormData.bio || 'A confident, expressive personality with a bright turban and bold sunglasses. Swagdeep brings a sense of style and individuality—perfect for moments that need a touch of flair.'}
          onChange={e => handleFormChange('bio', e.target.value)}
          className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] resize-none dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
          placeholder="Tell us about your brand…"
        />
      </div>
      <button
        onClick={handleSaveSection}
        disabled={isSaving}
        className="mt-4 bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );

  const RightPanelSocials = () => {
    const socialFields = [
      { key: 'instagram', label: 'InstagramFill', placeholder: 'https://instagram.com/yourbrand' },
      { key: 'facebook', label: 'FacebookFill', placeholder: 'https://facebook.com/yourbrand' },
      { key: 'linkedin', label: 'LinkedinFill', placeholder: 'https://linkedin.com/company/…' },
      { key: 'twitter', label: 'CloseLine (TwitterXLine)', placeholder: 'https://x.com/yourbrand' },
      { key: 'youtube', label: 'YoutubeFill', placeholder: 'https://youtube.com/@yourbrand' },
      { key: 'personalSite', label: 'Personal', placeholder: 'https://yourwebsite.com' },
    ];
    return (
      <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
        <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Socials</h3>
        <div className="flex-1 space-y-4">
          {socialFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#808080] mb-1">{label}</label>
              <input
                type="url"
                value={editFormData[key] || ''}
                onChange={e => handleFormChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveSection}
          disabled={isSaving}
          className="mt-4 bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    );
  };

const RightPanelCategories = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const selected = editFormData.categories || [];

  const toggle = (cat) => {
    const next = selected.includes(cat)
      ? selected.filter(c => c !== cat)
      : [...selected, cat];
    handleFormChange('categories', next);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      {/* Header with title and toggle button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#242527] dark:text-white">
          Categories
        </h3>
        
      </div>

      {/* Selected Categories Display (Always Visible) */}
      <div className="mb-4 p-3 bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-xl min-h-12 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-start flex-1">
          {selected.length === 0 ? (
            <span className="text-sm text-[#999999] dark:text-gray-500">Select categories...</span>
          ) : (
            selected.map(cat => (
              <div
                key={cat}
                className="flex items-center gap-2 px-3 py-1 bg-[#43573b] text-white rounded-full text-xs font-medium"
              >
                {cat}
                <button
                  onClick={() => toggle(cat)}
                  className="hover:opacity-80 transition-opacity font-bold"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-[#666] dark:text-gray-400 hover:text-[#43573b] dark:hover:text-green-400 transition-colors"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            // Down arrow (collapsed → expand to show)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            // Up arrow (expanded → collapse to hide)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Collapsible Category List */}
      {!isCollapsed && (
        <>
          {/* Category List with Checkboxes */}
          <div className="flex-1 overflow-y-auto border border-[#e6e6e6] dark:border-gray-600 rounded-xl bg-neutral-base dark:bg-[#2a2a2a] pb-4">
            {CATEGORY_OPTIONS.map(cat => {
              const isSelected = selected.includes(cat);
              return (
                <div
                  key={cat}
                  onClick={() => toggle(cat)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between cursor-pointer border-b border-[#e6e6e6] dark:border-gray-700 hover:bg-[#f0f0f0] dark:hover:bg-[#1e1e1e]
                    ${isSelected
                      ? 'bg-[#f0f0f0] dark:bg-[#1e1e1e] text-[#43573b] dark:text-green-400'
                      : 'text-[#242527] dark:text-white'
                    }`}
                >
                  <span>{cat}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Save Button (always visible at bottom) */}
      <button
        onClick={handleSaveSection}
        disabled={isSaving || selected.length === 0}
        className="mt-auto bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50 transition-colors"
      >
        {isSaving ? 'Saving…' : `Save (${selected.length})`}
      </button>
    </div>
  );
};

  const RightPanelBrandImages = () => (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Brand Images</h3>
      <div className="flex-1">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <label
            htmlFor="brand-image-upload"
            className="w-32 h-32 flex-shrink-0 bg-[#f0f0f0]
                       flex items-center justify-center cursor-pointer hover:border-[#43573b] transition-colors dark:bg-[#2a2a2a] dark:border-gray-600"
          >
            <AddLargeFill className="w-10 h-10 text-[#808080]" />
          </label>
          <input
            id="brand-image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddBrandImage}
          />

          {brandImageFiles.map((item, idx) => (
            <div key={idx} className="relative w-32 h-32 flex-shrink-0  overflow-hidden">
              <img src={item.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemoveBrandImage(idx)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-black text-sm font-bold hover:bg-black/10"
              >
                ×
              </button>
            </div>
          ))}

          {(user?.brand_images || []).map((url, idx) => (
            <div key={`existing-${idx}`} className="w-32 h-32 flex-shrink-0 overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleSaveBrandImages}
        disabled={isSaving || brandImageFiles.length === 0}
        className="mt-4 bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );

  const RightPanelLocation = () => (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Location</h3>
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#808080] mb-1">City</label>
          <input
            type="text"
            value={editFormData.city || ''}
            onChange={e => handleFormChange('city', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            placeholder="West Delhi"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#808080] mb-1">Country</label>
          <input
            type="text"
            value={editFormData.country || ''}
            onChange={e => handleFormChange('country', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            placeholder="India"
          />
        </div>
      </div>
      <button
        onClick={handleSaveSection}
        disabled={isSaving}
        className="mt-4 bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );

  const RightPanelPassword = () => (
    <div className="flex flex-col h-full p-6 bg-neutral-base dark:bg-[#1e1e1e]">
      <h3 className="text-base font-semibold text-[#242527] dark:text-white mb-4">Password</h3>
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#808080] mb-1">Old Password</label>
          <input
            type="password"
            value={editFormData.currentPassword || ''}
            onChange={e => handleFormChange('currentPassword', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[#808080]">New Password</label>
            <span className="text-xs text-[#808080]">
              {String(editFormData.newPassword || '').length}/8
            </span>
          </div>
          <input
            type="password"
            value={editFormData.newPassword || ''}
            onChange={e => handleFormChange('newPassword', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[#808080]">Confirm Password</label>
            <span className="text-xs text-[#808080]">
              {String(editFormData.confirmPassword || '').length}/8
            </span>
          </div>
          <input
            type="password"
            value={editFormData.confirmPassword || ''}
            onChange={e => handleFormChange('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 bg-[#f0f0f0] border border-[#e6e6e6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43573b] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      <button
        onClick={handleSavePassword}
        disabled={isSaving || !editFormData.currentPassword || !editFormData.newPassword}
        className="mt-4 bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save Password'}
      </button>
    </div>
  );

  const LogoutConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowLogoutConfirm(false)}
      />
      <div className="relative w-[90%] max-w-md bg-neutral-base dark:bg-[#1e1e1e] rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-[#242527] dark:text-white mb-3">
          Are you sure you want to log out?
        </h2>
        <p className="text-base text-[#808080] dark:text-gray-400 mb-8 leading-relaxed">
          Your data will remain saved. You can sign back in anytime.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 px-6 py-3 text-[#242527] dark:text-white font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="flex-1 px-6 py-3 bg-[#bf3709] text-white font-semibold rounded-full hover:bg-[#a02f07] transition-colors flex items-center justify-center gap-2"
          >
            <LogoutBoxRLine className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );

  const OTPVerifyModal = () => {
    const maskedContact = otpType === 'email'
      ? (editFormData.email || '').replace(/(.{1})(.*)(@.*)/, '$1****$3')
      : '+91 ******' + String(editFormData.mobileNumber || '').slice(-4);

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => { setShowOTPModal(false); setOtpValue(''); }}
        />

        <div className="relative w-[90%] max-w-sm bg-neutral-base dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden">
          {otpSentSuccess && (
            <div className="bg-green-500 text-white text-sm px-4 py-2 text-center font-medium">
              OTP sent successfully.
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#242527] dark:text-white text-center mb-2">
              {otpType === 'email' ? 'Verify Email' : 'Verify PhoneLine number'}
            </h3>

            <p className="text-sm text-[#808080] dark:text-gray-400 text-center mb-6 leading-relaxed">
              {otpType === 'email'
                ? `We sent an OTP to your email ${maskedContact}. Enter the 6-digit OTP below to confirm.`
                : `We sent an OTP to your mobile number ${maskedContact}. Enter the 6-digit OTP below to confirm your phone number.`
              }
            </p>

            <div className="flex justify-center gap-1 sm:gap-2 mb-6">
              {[0,1,2,3,4,5].map(index => (
                <input
                  key={index}
                  id={`edit-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={otpValue[index] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, '');
                    if (val.length <= 1) {
                      const digits = otpValue.split('');
                      digits[index] = val;
                      setOtpValue(digits.join(''));
                      if (val && index < 5) {
                        document.getElementById(`edit-otp-${index + 1}`)?.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
                      document.getElementById(`edit-otp-${index - 1}`)?.focus();
                    }
                  }}
                  className="w-9 h-9 sm:w-11 sm:h-11 text-center text-lg font-semibold bg-[#f0f0f0]
                             border-[3px] border-[#e6e6e6] rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-[#43573b] focus:bg-neutral-base
                             text-[#242527] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={isSaving || otpValue.replace(/\s/g,'').length < 6}
              className="bg-[#43573b] text-white rounded-full py-3 w-full font-semibold disabled:opacity-50 mb-4"
            >
              {isSaving ? 'Verifying…' : 'Verify OTP'}
            </button>

            <p className="text-sm text-[#808080] text-center">
              {"Didn't receive "}
              {otpType === 'email' ? 'mail' : 'SMS'}
              {'? '}
              <button
                onClick={() => {
                  setOtpValue('');
                  handleSendOTP(otpType);
                }}
                className="font-semibold text-[#242527] dark:text-white hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col dark:bg-[#121212]">
      {/* Fixed App Bar */}
      <div className="flex-shrink-0 bg-neutral-base dark:bg-[#1e1e1e] border-b border-gray-100 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-9 py-4 sm:py-5">
          <h1 className="text-lg sm:text-xl font-semibold text-[#242527] dark:text-white">{t('account_title')}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-9 py-4 sm:py-6 dark:bg-[#121212]">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-xl font-bold text-white">
              {getInitials(user?.companyName || user?.contact?.first_name || user?.email || '')}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#242527] dark:text-white mb-1 truncate">
              {user?.contact?.first_name || user?.agencyName || user?.name || 'UserLine'}
            </h2>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-[#666] dark:text-gray-400 bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-md">
              {user?.plan || user?.subscription || 'Free'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black dark:bg-[#1a1a1a] text-white px-3 py-1.5 rounded-full">
            <img src="/assets/phyo_coin.svg" alt="Phyo coin" className="w-4 h-4" />
            <span className="text-sm font-semibold">3/3</span>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mb-6">
          <div className="bg-neutral-base dark:bg-[#1e1e1e] rounded-2xl overflow-hidden border border-[#e6e6e6] dark:border-gray-700">
            <button className="w-full" onClick={() => setEditingSection('profile-editor')}>
              <MenuItem icon={AccountCircleFill} label={t('update_profile')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => router.push('/brand/account/my-lists')}>
              <MenuItem icon={ListUnordered} label={t('my_lists')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => router.push('/brand/account/billing-history')}>
              <MenuItem icon={FileList3Line} label={t('transactions')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => router.push('/brand/account/upgrade-plan')}>
              <MenuItem icon={WalletLine} label={t('upgrade_plan')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => setShowPauseModal(true)}>
              <MenuItem icon={PassExpiredLine} label={t('pause_subscription')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => setShowCancelModal(true)}>
              <MenuItem icon={CloseCircleLine} label={t('cancel_subscription')} textColor="text-[#bf3709]" />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={toggleDarkMode}>
              <MenuItem
                icon={PaletteLine}
                label={t('dark_theme')}
                rightElement={
                  <div className={`w-11 h-8 rounded-full transition-colors flex items-center px-1 ${darkMode ? 'bg-[#3d4f36]' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-neutral-base rounded-full transition-transform ${darkMode ? 'translate-x-3' : 'translate-x-0'}`}></div>
                  </div>
                }
                textColor="text-[#242527] dark:text-gray-200"
                showChevron={false}
              />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => router.push('/brand/account/notifications-preferences')}>
              <MenuItem icon={Notification2Line} label={t('notifications_preferences')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => setShowLanguageModal(true)}>
              <MenuItem
                icon={GlobalLine}
                textColor="text-[#242527] dark:text-gray-200"
                showChevron={false}
                label={
                  <div className="flex flex-col text-left">
                    <span>{t('app_language')}</span>
                    <span className="text-sm text-[#808080] dark:text-gray-400">
                      {currentLanguage.nativeName}
                    </span>
                  </div>
                }
              />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => router.push('/brand/account/help-support')}>
              <MenuItem icon={QuestionLine} label={t('help_support')} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => router.push('/privacy-policy')}>
              <MenuItem icon={FileTextLine} label={t('terms_privacy')} showChevron={false} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={() => {}}>
              <MenuItem icon={InformationLine} label={t('app_version')} showChevron={false} />
              <div className="h-px bg-[#e6e6e6] dark:bg-gray-700 mx-4"></div>
            </button>
            <button className="w-full" onClick={handleLogout}>
              <MenuItem icon={LogoutBoxRLine} label={t('log_out')} textColor="text-[#bf3709]" showChevron={false} />
            </button>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowLanguageModal(false)}
    />

    {/* Modal */}
    <div className="relative w-[90%] max-w-md bg-neutral-base dark:bg-[#1e1e1e] rounded-2xl shadow-xl animate-fadeIn">

      {/* Title */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-[#242527] dark:text-white text-center">
          {t('select_language')}
        </h2>
      </div>

      {/* Language List */}
      <div className="max-h-80 overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              changeLanguage(lang.code);
              setShowLanguageModal(false);
            }}
            className="w-full flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          >
            {/* Radio Button */}
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 border-gray-400 bg-neutral-base dark:bg-[#1e1e1e]">
              {language === lang.code && (
                <div className="w-3 h-3 rounded-full bg-[#43573B]" />
              )}
            </div>

            {/* Language Text */}
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-[#242527] dark:text-white">
                {lang.nativeName}
              </span>
              <span className="text-sm text-[#808080] dark:text-gray-400">
                {lang.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
)}

      {/* EditLine Profile Modal */}
      {editingSection === 'profile-editor' && (
        <div className="fixed inset-0 z-50 bg-neutral-base dark:bg-[#121212] flex flex-col">
          {/* Modal Header */}
          <div className="flex-shrink-0 flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-base dark:bg-[#1e1e1e]">
            <button
              onClick={closeEditSection}
              className="flex items-center justify-center hover:opacity-70 transition-opacity mr-3"
            >
              <ArrowLeftLine className="w-6 h-6 text-[#242527] dark:text-white" />
            </button>
            <h2 className="text-xl font-semibold text-[#242527] dark:text-white">
              Profile
            </h2>
          </div>

          {/* Two-column body */}
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT COLUMN - Sticky sidebar */}
            <div className={`${mobileView === 'panel' ? 'hidden' : 'flex flex-col'} md:flex md:flex-col w-full md:w-72 lg:w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-neutral-base dark:bg-[#1e1e1e]`}>
              {/* Avatar */}
              <div className="flex flex-col items-center py-8 px-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center overflow-hidden">
                    {user?.company_logo ? (
                      <img
                        src={user.company_logo}
                        alt={user?.companyName || user?.agencyName || user?.name || 'Logo'}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span className="text-4xl font-bold text-white" style={{display: user?.company_logo ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                      {getInitials(user?.companyName || user?.agencyName || user?.name || 'J')}
                    </span>
                  </div>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="mt-3 text-base font-semibold text-[#242527] dark:text-white cursor-pointer hover:opacity-70 transition-opacity"
                >
                  EditLine
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Menu items */}
              <nav className="px-6 pb-8 space-y-0">
                {[
                  {
                    tab: 'email',
                    icon: LockLine,
                    label: 'Email',
                    subtitle: user?.email ? user.email.slice(0, 3) + '***' + user.email.slice(user.email.indexOf('@')) : 'abc@gmail.com',
                  },
                  {
                    tab: 'phone',
                    icon: PhoneLine,
                    label: 'Contact',
                    subtitle: user?.contact?.mobileNumber && user?.contact?.mobileNumber.length >= 10
                      ? '+91 ******' + user.contact.mobileNumber.slice(-4)
                      : 'Add contact info',
                  },
                  {
                    tab: 'bio',
                    icon: InformationLine,
                    label: 'Bio',
                    subtitle: user?.bio
                      ? user.bio.slice(0, 30) + (user.bio.length > 30 ? '…' : '')
                      : 'Add your bio',
                  },
                  {
                    tab: 'socials',
                    icon: UserCommunityLine,
                    label: 'Socials',
                    subtitle: [
                      user?.social_media?.instagram && 'InstagramFill',
                      user?.social_media?.linkedin && 'LinkedinFill',
                    ].filter(Boolean).join(', ') || 'Add social links',
                  },
                  {
                    tab: 'categories',
                    icon: DashboardLine,
                    label: 'Categories',
                    subtitle: (user?.categories || []).slice(0, 2).join(', ') || 'Add categories',
                  },
                  {
                    tab: 'brandImages',
                    icon: MultiImageLine,
                    label: 'Brand Images',
                    subtitle: `${(user?.brand_images || []).length} images`,
                  },
                  {
                    tab: 'location',
                    icon: MapPinLine,
                    label: 'Location',
                    subtitle: [user?.location, user?.country].filter(Boolean).join(', ') || 'Add location',
                  },
                  {
                    tab: 'password',
                    icon: LockLine,
                    label: 'Password',
                    subtitle: '',
                  },
                ].map(({ tab, icon: Icon, label, subtitle }) => (
                  <div key={tab}>
                    <button
                      onClick={() => switchEditTab(tab)}
                      className={`w-full flex items-center gap-4 py-4 text-left transition-colors rounded-lg
                        ${activeEditTab === tab
                          ? 'bg-gray-100 dark:bg-[#252525]'
                          : 'hover:bg-gray-50 dark:hover:bg-[#252525]'
                        }`}
                    >
                      <Icon className="w-5 h-5 text-[#242527] dark:text-gray-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-[#242527] dark:text-white">
                          {label}
                        </div>
                        {subtitle && (
                          <div className="text-xs text-[#999999] dark:text-gray-400 truncate">
                            {subtitle}
                          </div>
                        )}
                      </div>
                    </button>
                    {tab !== 'password' && <div className=""></div>}
                  </div>
                ))}
              </nav>
            </div>

            {/* RIGHT COLUMN */}
            <div className={`${mobileView === 'list' ? 'hidden' : 'flex flex-col'} md:flex md:flex-col flex-1 overflow-y-auto bg-neutral-base dark:bg-[#1e1e1e]`}>
              {/* Mobile back button */}
              {mobileView === 'panel' && activeEditTab && (
                <button
                  onClick={() => { setMobileView('list'); setActiveEditTab(null); }}
                  className="md:hidden flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-neutral-base dark:bg-[#1e1e1e]"
                >
                  <ArrowLeftLine className="w-5 h-5 text-[#242527] dark:text-white" />
                  <span className="text-base font-medium text-[#242527] dark:text-white">Back</span>
                </button>
              )}
              {!activeEditTab && <RightPanelDefault />}
              {activeEditTab === 'email' && <RightPanelEmail />}
              {activeEditTab === 'phone' && <RightPanelPhone />}
              {activeEditTab === 'bio' && <RightPanelBio />}
              {activeEditTab === 'socials' && <RightPanelSocials />}
              {activeEditTab === 'categories' && <RightPanelCategories />}
              {activeEditTab === 'brandImages' && <RightPanelBrandImages />}
              {activeEditTab === 'location' && <RightPanelLocation />}
              {activeEditTab === 'password' && <RightPanelPassword />}
            </div>
          </div>

          {/* OTP Modal overlay */}
          {showOTPModal && <OTPVerifyModal />}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && <LogoutConfirmModal />}

      {/* Pause Subscription Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-base dark:bg-[#1e1e1e] rounded-3xl w-[400px] max-w-[90%] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-[#242527] dark:text-white text-center">
                Pause Subscription?
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-base text-[#505152] dark:text-gray-400 text-center mb-6">
                You can pause your subscription for up to 3 months. Your current plan will be frozen and you won't be charged during this period.
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-center">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-full font-semibold text-[#242527] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Pause subscription confirmed');
                  setShowPauseModal(false);
                }}
                className="flex-1 py-3 px-4 bg-[#43573B] hover:bg-[#3d4f36] text-white rounded-full font-semibold transition-colors"
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-base dark:bg-[#1e1e1e] rounded-3xl w-[400px] max-w-[90%] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-[#242527] dark:text-white text-center">
                Cancel Subscription?
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-base text-[#505152] dark:text-gray-400 text-center mb-3">
                Canceling your subscription will immediately revoke access to premium features. This action cannot be undone.
              </p>
              <p className="text-sm text-[#808080] dark:text-gray-500 text-center">
                You'll lose access to all premium features right away.
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-center">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-full font-semibold text-[#242527] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  console.log('Cancel subscription confirmed');
                  setShowCancelModal(false);
                }}
                className="flex-1 py-3 px-4 bg-[#bf3709] hover:bg-[#a02e07] text-white rounded-full font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
