'use client';

import { Suspense } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/utils/api';
import api from '@/utils/api';
import secureAuthStorage from '@/utils/secure-auth';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { accountApi } from '@/api/account-api';
import {
  ArrowLeftLine, LockLine, PhoneLine, InformationLine,
  UserCommunityLine, DashboardLine, MultiImageLine, MapPinLine,
  AddLargeFill, LogoutBoxRLine,
} from '@phyoofficial/phyo-icon-library';

// Edit pencil icon
function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// Info field: label + value
function InfoField({ label, value }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <p className="text-[16px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
        {label}
      </p>
      <p className="text-[14px] font-normal text-[#9b9b9b] leading-[1.4] lowercase break-all" style={{ fontFamily: 'Inter, sans-serif' }}>
        {value || '—'}
      </p>
    </div>
  );
}

function BrandAccountContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null); // null | 'profile-editor'
  const [activeEditTab, setActiveEditTab] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [brandImageFiles, setBrandImageFiles] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileView, setMobileView] = useState('list');

  useEffect(() => { fetchUserProfile(); }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getUserProfile();
      setUser(response.data || response.user || response);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFormChange = (field, value) => setEditFormData(prev => ({ ...prev, [field]: value }));

  const openEditSection = (tab) => {
    switch (tab) {
      case 'email':    setEditFormData({ email: user?.email || '' }); break;
      case 'phone':    setEditFormData({ mobileNumber: user?.contact?.phone || user?.mobileNumber || '' }); break;
      case 'bio':      setEditFormData({ bio: user?.about || user?.bio || '' }); break;
      case 'socials':  setEditFormData({ instagram: user?.social_media?.instagram || '', facebook: user?.social_media?.facebook || '', linkedin: user?.social_media?.linkedin || '', twitter: user?.social_media?.twitter || '', youtube: user?.social_media?.youtube || '' }); break;
      case 'categories': setEditFormData({ categories: user?.categories || [] }); break;
      case 'location': setEditFormData({ city: user?.location || '', country: user?.country || '' }); break;
      case 'password': setEditFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); break;
      default: break;
    }
  };

  const switchEditTab = (tab) => {
    setActiveEditTab(tab);
    setMobileView('panel');
    openEditSection(tab);
  };

  const closeEditSection = () => {
    setEditingSection(null);
    setActiveEditTab(null);
    setEditFormData({});
    setMobileView('list');
    setShowOTPModal(false);
    setOtpValue('');
    setBrandImageFiles([]);
    setIsSaving(false);
  };

  const handleSendOTP = async (type) => {
    setIsSaving(true);
    try {
      const payload = type === 'email' ? { email: editFormData.email } : { phone: editFormData.mobileNumber };
      const res = await api.post('/auth/resend-otp', payload);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed');
      setOtpType(type); setOtpValue(''); setOtpSentSuccess(true); setShowOTPModal(true);
    } catch {
      setOtpType(type); setOtpValue(''); setOtpSentSuccess(false); setShowOTPModal(true);
    } finally { setIsSaving(false); }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) return;
    setIsSaving(true);
    try {
      const payload = otpType === 'email' ? { otp: otpValue, code: otpValue } : { phone: editFormData.mobileNumber, otp: otpValue };
      const endpoint = otpType === 'email' ? '/users/profile/email-change/verify' : '/auth/resend-otp';
      const res = await api.post(endpoint, payload);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed');
      await userAPI.updateUserProfile(otpType === 'email' ? { email: editFormData.email } : { mobileNumber: editFormData.mobileNumber });
      await fetchUserProfile();
      setShowOTPModal(false); setOtpValue(''); setActiveEditTab(null);
    } catch (err) { console.error('OTP error:', err); }
    finally { setIsSaving(false); }
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    try {
      let payload = {};
      if (activeEditTab === 'phone') payload = { contact: { phone: editFormData.mobileNumber } };
      else if (activeEditTab === 'bio') payload = { about: editFormData.bio };
      else if (activeEditTab === 'socials') payload = { social_media: { instagram: editFormData.instagram, facebook: editFormData.facebook, linkedin: editFormData.linkedin, twitter: editFormData.twitter, youtube: editFormData.youtube } };
      else if (activeEditTab === 'location') payload = { location: editFormData.city, country: editFormData.country };
      else if (activeEditTab === 'categories') payload = { categories: editFormData.categories };
      await userAPI.updateUserProfile(payload);
      await fetchUserProfile();
      setActiveEditTab(null);
    } catch (err) { console.error('Save error:', err); }
    finally { setIsSaving(false); }
  };

  const handleSavePassword = async () => {
    if (editFormData.newPassword !== editFormData.confirmPassword) { alert('Passwords do not match'); return; }
    setIsSaving(true);
    try {
      await api.put('/users/change-password', { currentPassword: editFormData.currentPassword, newPassword: editFormData.newPassword });
      setActiveEditTab(null);
    } catch (err) { console.error('Password error:', err); }
    finally { setIsSaving(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsSaving(true);
    try {
      const fd = new FormData(); fd.append('company_logo', file);
      await userAPI.updateUserProfile(fd, true);
      await fetchUserProfile();
    } catch (err) { console.error('Avatar error:', err); }
    finally { setIsSaving(false); }
  };

  const handleAddBrandImage = (e) => {
    const files = Array.from(e.target.files);
    setBrandImageFiles(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
  };

  const handleRemoveBrandImage = (i) => {
    setBrandImageFiles(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); });
  };

  const handleSaveBrandImages = async () => {
    if (!brandImageFiles.length) return;
    setIsSaving(true);
    try {
      const fd = new FormData(); brandImageFiles.forEach(({ file }) => fd.append('brand_images', file));
      await userAPI.updateUserProfile(fd, true);
      await fetchUserProfile(); setBrandImageFiles([]); setActiveEditTab(null);
    } catch (err) { console.error('Brand images error:', err); }
    finally { setIsSaving(false); }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#000201] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a]" />
      </div>
    );
  }

  const displayName = user?.companyName || user?.name || user?.contact?.first_name || 'Brand';
  const planBadge = user?.currentPlan || 'Free';
  const credits = user?.creditsRemaining ?? 0;

  const infoRows = [
    [
      { label: 'Email',         value: user?.email },
      { label: 'Phone Number',  value: user?.contact?.phone || user?.mobileNumber },
    ],
    [
      { label: 'Location',      value: user?.location },
      { label: 'Country',       value: user?.country },
    ],
    [
      { label: 'Company Name',  value: user?.companyName },
      { label: 'Company Type',  value: user?.company_type },
    ],
    [
      { label: 'Industry',      value: user?.industry },
      { label: 'Website',       value: user?.website },
    ],
    [
      { label: 'Social Link',   value: user?.social_media?.instagram || user?.social_media?.linkedin },
      { label: 'Category',      value: (user?.categories || []).join(', ') },
    ],
    [
      { label: 'Billing Address', value: user?.billing_info?.billing_address },
      { label: 'Finance Email',   value: user?.billing_info?.finance_email },
    ],
    [
      { label: 'Password',      value: '••••••••' },
    ],
  ];

  const subscriptionStatus = user?.subscriptionStatus || 'inactive';
  const currentPlan = user?.currentPlan || 'free';

  const CATEGORY_OPTIONS = ['Comedy','Lifestyle','Fashion','Beauty','Tech','Travel','Food','Fitness','Education','Finance','Gaming','Sports','Music'];

  /* ── Edit Panel Sections ── */
  const RightPanelDefault = () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#0a0a0a]">
      <svg className="w-16 h-16 text-[#2a2a2a]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm4-4h8v2h-8z"/></svg>
      <p className="text-[#3a3a3a] text-sm">Select a section to edit</p>
    </div>
  );

  const inputCls = "w-full px-4 py-3 bg-[#262626] border border-[#333] rounded-xl text-sm text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#16a34a]";
  const saveBtnCls = "mt-4 w-full h-[44px] bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full text-[15px] font-medium transition-colors disabled:opacity-40";
  const labelCls = "block text-xs font-semibold text-[#9b9b9b] mb-1";

  const RightPanelEmail = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Email</h3>
      <input type="email" value={editFormData.email || ''} onChange={e => handleFormChange('email', e.target.value)} className={inputCls} placeholder="your@email.com" />
      <button onClick={() => handleSendOTP('email')} disabled={isSaving || !editFormData.email} className={saveBtnCls}>{isSaving ? 'Sending…' : 'Get OTP'}</button>
    </div>
  );

  const RightPanelPhone = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Contact</h3>
      <div className="space-y-4 flex-1">
        <div><label className={labelCls}>First Name</label><input type="text" value={editFormData.first_name || ''} onChange={e => handleFormChange('first_name', e.target.value)} className={inputCls} placeholder="First name" /></div>
        <div><label className={labelCls}>Last Name</label><input type="text" value={editFormData.last_name || ''} onChange={e => handleFormChange('last_name', e.target.value)} className={inputCls} placeholder="Last name" /></div>
        <div><label className={labelCls}>Mobile Number</label><input type="tel" maxLength={10} value={editFormData.mobileNumber || ''} onChange={e => handleFormChange('mobileNumber', e.target.value)} className={inputCls} placeholder="9876543210" /></div>
      </div>
      <button onClick={handleSaveSection} disabled={isSaving} className={saveBtnCls}>{isSaving ? 'Saving…' : 'Save'}</button>
    </div>
  );

  const RightPanelBio = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Bio</h3>
      <textarea rows={8} value={editFormData.bio || ''} onChange={e => handleFormChange('bio', e.target.value)} className={`${inputCls} resize-none`} placeholder="Tell us about your brand…" />
      <button onClick={handleSaveSection} disabled={isSaving} className={saveBtnCls}>{isSaving ? 'Saving…' : 'Save'}</button>
    </div>
  );

  const RightPanelSocials = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Socials</h3>
      <div className="flex-1 space-y-4 overflow-y-auto">
        {[['instagram','Instagram'],['facebook','Facebook'],['linkedin','LinkedIn'],['twitter','X (Twitter)'],['youtube','YouTube']].map(([k,l]) => (
          <div key={k}><label className={labelCls}>{l}</label><input type="url" value={editFormData[k] || ''} onChange={e => handleFormChange(k, e.target.value)} className={inputCls} placeholder={`https://${k}.com/…`} /></div>
        ))}
      </div>
      <button onClick={handleSaveSection} disabled={isSaving} className={saveBtnCls}>{isSaving ? 'Saving…' : 'Save'}</button>
    </div>
  );

  const RightPanelCategories = () => {
    const selected = editFormData.categories || [];
    const toggle = (cat) => handleFormChange('categories', selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat]);
    return (
      <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
        <h3 className="text-base font-semibold text-white mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2 mb-3">{selected.map(c => (<span key={c} className="flex items-center gap-1 px-3 py-1 bg-[#16a34a] text-white rounded-full text-xs">{c}<button onClick={() => toggle(c)} className="ml-1">×</button></span>))}</div>
        <div className="flex-1 overflow-y-auto border border-[#333] rounded-xl">{CATEGORY_OPTIONS.map(cat => (<div key={cat} onClick={() => toggle(cat)} className={`px-4 py-3 flex items-center justify-between cursor-pointer border-b border-[#222] hover:bg-[#1a1a1a] ${selected.includes(cat) ? 'text-[#16a34a]' : 'text-white'}`}><span className="text-sm">{cat}</span><input type="checkbox" checked={selected.includes(cat)} readOnly className="w-4 h-4" /></div>))}</div>
        <button onClick={handleSaveSection} disabled={isSaving || !selected.length} className={saveBtnCls}>{isSaving ? 'Saving…' : `Save (${selected.length})`}</button>
      </div>
    );
  };

  const RightPanelBrandImages = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Brand Images</h3>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {[...(user?.brand_images || []), ...brandImageFiles.map(f => f.preview)].map((url, i) => (
          <div key={i} className="relative w-full h-[140px] rounded-[20px] overflow-hidden bg-[#181818]">
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <label htmlFor="brand-img-upload" className="w-full h-[140px] rounded-[20px] bg-[#181818] border border-[#333] border-dashed flex items-center justify-center cursor-pointer hover:bg-[#222] transition-colors">
          <AddLargeFill width={32} height={32} fill="#666" />
        </label>
        <input id="brand-img-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleAddBrandImage} />
      </div>
      <button onClick={handleSaveBrandImages} disabled={isSaving || !brandImageFiles.length} className={saveBtnCls}>{isSaving ? 'Saving…' : 'Save'}</button>
    </div>
  );

  const RightPanelLocation = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Location</h3>
      <div className="space-y-4 flex-1">
        <div><label className={labelCls}>City</label><input type="text" value={editFormData.city || ''} onChange={e => handleFormChange('city', e.target.value)} className={inputCls} placeholder="Mumbai" /></div>
        <div><label className={labelCls}>Country</label><input type="text" value={editFormData.country || ''} onChange={e => handleFormChange('country', e.target.value)} className={inputCls} placeholder="India" /></div>
      </div>
      <button onClick={handleSaveSection} disabled={isSaving} className={saveBtnCls}>{isSaving ? 'Saving…' : 'Save'}</button>
    </div>
  );

  const RightPanelPassword = () => (
    <div className="flex flex-col h-full p-6 bg-[#0f0f0f]">
      <h3 className="text-base font-semibold text-white mb-4">Password</h3>
      <div className="space-y-4 flex-1">
        <div><label className={labelCls}>Current Password</label><input type="password" value={editFormData.currentPassword || ''} onChange={e => handleFormChange('currentPassword', e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>New Password</label><input type="password" value={editFormData.newPassword || ''} onChange={e => handleFormChange('newPassword', e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>Confirm Password</label><input type="password" value={editFormData.confirmPassword || ''} onChange={e => handleFormChange('confirmPassword', e.target.value)} className={inputCls} /></div>
      </div>
      <button onClick={handleSavePassword} disabled={isSaving || !editFormData.currentPassword || !editFormData.newPassword} className={saveBtnCls}>{isSaving ? 'Saving…' : 'Save Password'}</button>
    </div>
  );

  const OTPModal = () => {
    const masked = otpType === 'email'
      ? (editFormData.email || '').replace(/(.{1})(.*)(@.*)/, '$1****$3')
      : '+91 ******' + String(editFormData.mobileNumber || '').slice(-4);
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={() => { setShowOTPModal(false); setOtpValue(''); }} />
        <div className="relative w-[90%] max-w-sm bg-[#181818] rounded-2xl overflow-hidden border border-[#333]">
          {otpSentSuccess && <div className="bg-[#16a34a] text-white text-sm px-4 py-2 text-center">OTP sent successfully.</div>}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white text-center mb-2">{otpType === 'email' ? 'Verify Email' : 'Verify Phone'}</h3>
            <p className="text-sm text-[#9b9b9b] text-center mb-6">We sent an OTP to {masked}. Enter the 6-digit code below.</p>
            <div className="flex justify-center gap-2 mb-6">
              {[0,1,2,3,4,5].map(i => (
                <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength="1" value={otpValue[i] || ''}
                  onChange={e => { const v = e.target.value.replace(/\D/,''); const d = otpValue.split(''); d[i] = v; setOtpValue(d.join('')); if (v && i < 5) document.getElementById(`otp-${i+1}`)?.focus(); }}
                  onKeyDown={e => { if (e.key === 'Backspace' && !otpValue[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                  className="w-10 h-10 text-center text-lg font-semibold bg-[#262626] border-2 border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] text-white"
                />
              ))}
            </div>
            <button onClick={handleVerifyOTP} disabled={isSaving || otpValue.replace(/\s/g,'').length < 6} className="bg-[#16a34a] text-white rounded-full py-3 w-full font-semibold disabled:opacity-40 mb-3">{isSaving ? 'Verifying…' : 'Verify OTP'}</button>
            <p className="text-sm text-[#9b9b9b] text-center">Didn't receive it? <button onClick={() => { setOtpValue(''); handleSendOTP(otpType); }} className="text-white font-semibold hover:underline">Resend OTP</button></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#000201] text-white">

      {/* ── Profile Editor — Figma 136:7139 layout ── */}
      {editingSection === 'profile-editor' && (
        <div className="fixed inset-0 z-50 bg-[#000201] overflow-y-auto">
          <div className="flex gap-[20px] p-5 min-h-screen">

            {/* Center panel — 2-col form */}
            <div className="flex-1 bg-[#181818] rounded-[24px] p-[20px] flex flex-col gap-[20px]">
              <p className="text-[24px] font-normal text-white capitalize text-center leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Edit Profile
              </p>

              {/* Form grid — 2 cols, gap-[20px] rows, gap-[20px] between cols */}
              {[
                [
                  { key: 'name',             label: 'Full Name',       value: editFormData.name       ?? (user?.companyName || user?.name || ''),          type: 'text'     },
                  { key: 'email',            label: 'Email',           value: editFormData.email      ?? (user?.email || ''),                              type: 'email'    },
                ],
                [
                  { key: 'phone',            label: 'Phone Number',    value: editFormData.phone      ?? (user?.contact?.phone || ''),                     type: 'text'     },
                  { key: 'location',         label: 'Location',        value: editFormData.location   ?? (user?.location || ''),                           type: 'text'     },
                ],
                [
                  { key: 'country',          label: 'Country',         value: editFormData.country    ?? (user?.country || ''),                            type: 'text'     },
                  { key: 'billingAddress',   label: 'Billing Address', value: editFormData.billingAddress ?? (user?.billing_info?.billing_address || ''),  type: 'text'     },
                ],
                [
                  { key: 'companyName',      label: 'Company Name',    value: editFormData.companyName ?? (user?.companyName || ''),                       type: 'text'     },
                  { key: 'companyType',      label: 'Company Type',    value: editFormData.companyType ?? (user?.company_type || ''),                      type: 'text'     },
                ],
                [
                  { key: 'category',         label: 'Category',        value: editFormData.category    ?? ((user?.categories || []).join(', ')),            type: 'text'     },
                  { key: 'industry',         label: 'Industry',        value: editFormData.industry    ?? (user?.industry || ''),                          type: 'text'     },
                ],
                [
                  { key: 'website',          label: 'Website',         value: editFormData.website     ?? (user?.website || ''),                           type: 'url'      },
                  { key: 'socialLink',       label: 'Social Link',     value: editFormData.socialLink  ?? (user?.social_media?.instagram || ''),           type: 'url'      },
                ],
                [
                  { key: 'financeEmail',     label: 'Finance Email',   value: editFormData.financeEmail ?? (user?.billing_info?.finance_email || ''),      type: 'email'    },
                  { key: 'currentPassword',  label: 'Current Password', value: editFormData.currentPassword ?? '',                                         type: 'password' },
                ],
                [
                  { key: 'newPassword',      label: 'Enter New Password',    value: editFormData.newPassword    ?? '',                                     type: 'password' },
                  { key: 'confirmPassword',  label: 'Re-enter New Password', value: editFormData.confirmPassword ?? '',                                    type: 'password' },
                ],
              ].map((row, ri) => (
                <div key={ri} className="flex gap-[20px]">
                  {row.map(({ key, label, value, type }) => (
                    <div key={key} className="flex-1 flex flex-col gap-[8px]">
                      <label className="text-[14px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {label}
                      </label>
                      <div className="bg-[#272626] h-[40px] rounded-[8px] overflow-hidden flex items-center px-[20px]">
                        <input
                          type={type}
                          value={value}
                          onChange={e => handleFormChange(key, e.target.value)}
                          className="w-full bg-transparent text-[14px] text-[#9b9b9b] placeholder-[#9b9b9b] outline-none leading-[1.2]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder={label}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Right panel — Biography + Upload */}
            <div className="w-[360px] flex-shrink-0 bg-[#181818] rounded-[24px] p-[20px] flex flex-col gap-[20px]">
              {/* Biography */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Biography
                </label>
                <div className="bg-[#272626] rounded-[8px] overflow-hidden">
                  <textarea
                    rows={5}
                    value={editFormData.bio ?? (user?.about || user?.bio || '')}
                    onChange={e => handleFormChange('bio', e.target.value)}
                    className="w-full bg-transparent text-[14px] text-[#9b9b9b] placeholder-[#9b9b9b] outline-none leading-[1.2] p-[20px] resize-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="Write a short bio…"
                  />
                </div>
              </div>

              {/* Upload Profile Image */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Upload Profile Image
                </label>
                <label htmlFor="avatar-upload-edit" className="bg-[#272626] h-[136px] rounded-[8px] flex flex-col items-center justify-center gap-[12px] cursor-pointer hover:bg-[#333] transition-colors">
                  <p className="text-[14px] text-[#9b9b9b] capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>Drag files here to upload..</p>
                  <div className="border border-white h-[32px] px-[16px] rounded-full flex items-center justify-center">
                    <span className="text-[14px] text-white capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>Browse Files</span>
                  </div>
                </label>
                <input id="avatar-upload-edit" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Upload Brand Image */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Upload Brand Image
                </label>
                <label htmlFor="brand-upload-edit" className="bg-[#272626] h-[136px] rounded-[8px] flex flex-col items-center justify-center gap-[12px] cursor-pointer hover:bg-[#333] transition-colors">
                  <p className="text-[14px] text-[#9b9b9b] capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>Drag files here to upload..</p>
                  <div className="border border-white h-[32px] px-[16px] rounded-full flex items-center justify-center">
                    <span className="text-[14px] text-white capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>Browse Files</span>
                  </div>
                </label>
                <input id="brand-upload-edit" type="file" accept="image/*" multiple className="hidden" onChange={handleAddBrandImage} />
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="sticky bottom-0 flex justify-end gap-[20px] px-5 py-4 bg-[#000201]/80 backdrop-blur">
            <button
              onClick={closeEditSection}
              className="border border-white h-[40px] px-[32px] rounded-full text-[16px] font-normal text-white capitalize hover:bg-white/10 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setIsSaving(true);
                try {
                  const payload = {};
                  if (editFormData.name) payload.name = editFormData.name;
                  if (editFormData.email !== undefined) payload.email = editFormData.email;
                  if (editFormData.phone) payload.contact = { ...user?.contact, phone: editFormData.phone };
                  if (editFormData.location) payload.location = editFormData.location;
                  if (editFormData.country) payload.country = editFormData.country;
                  if (editFormData.companyName) payload.companyName = editFormData.companyName;
                  if (editFormData.companyType) payload.company_type = editFormData.companyType;
                  if (editFormData.industry) payload.industry = editFormData.industry;
                  if (editFormData.website) payload.website = editFormData.website;
                  if (editFormData.socialLink) payload.social_media = { ...user?.social_media, instagram: editFormData.socialLink };
                  if (editFormData.billingAddress || editFormData.financeEmail) {
                    payload.billing_info = { billing_address: editFormData.billingAddress || user?.billing_info?.billing_address, finance_email: editFormData.financeEmail || user?.billing_info?.finance_email };
                  }
                  if (editFormData.bio) payload.about = editFormData.bio;
                  if (editFormData.category) payload.categories = editFormData.category.split(',').map(c => c.trim()).filter(Boolean);
                  await userAPI.updateUserProfile(payload);
                  if (editFormData.newPassword && editFormData.currentPassword) {
                    await api.put('/users/change-password', { currentPassword: editFormData.currentPassword, newPassword: editFormData.newPassword });
                  }
                  await fetchUserProfile();
                  closeEditSection();
                } catch (err) { console.error('Update error:', err); }
                finally { setIsSaving(false); }
              }}
              disabled={isSaving}
              className="bg-[#16a34a] hover:bg-[#15803d] h-[40px] px-[32px] rounded-full text-[16px] font-normal text-white capitalize transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isSaving ? 'Saving…' : 'Update Profile'}
            </button>
          </div>
          {showOTPModal && <OTPModal />}
        </div>
      )}

      {/* ── Main Account Profile View ── */}
      <div className="flex gap-[20px] p-5 min-h-screen">

        {/* Center Panel — Profile */}
        <div className="flex-1 bg-[#181818] rounded-[24px] overflow-hidden flex flex-col">
          {/* Avatar + edit pencil */}
          <div className="flex flex-col items-center pt-[20px] pb-0 relative">
            <div className="relative">
              <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-[#16a34a] to-[#166534] flex items-center justify-center overflow-hidden">
                {user?.company_logo
                  ? <img src={user.company_logo} alt="" className="w-full h-full object-cover rounded-full" />
                  : <span className="text-5xl font-bold text-white">{getInitials(displayName)}</span>
                }
              </div>
              {/* Edit pencil — offset to bottom-right of avatar */}
              <button
                onClick={() => setEditingSection('profile-editor')}
                className="absolute bottom-[10px] right-0 w-[40px] h-[40px] bg-[#272626] rounded-[20px] flex items-center justify-center hover:bg-[#333] transition-colors shadow-[0_0_44px_0_rgba(0,0,0,0.25)]"
              >
                <PencilIcon />
              </button>
            </div>

            {/* Name + plan badge */}
            <div className="flex items-center gap-[12px] mt-[10px]">
              <p className="text-[24px] font-normal text-white capitalize leading-[1.2] text-center" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                {displayName}
              </p>
              {planBadge !== 'free' && planBadge !== 'Free' && (
                <div className="bg-[#432004] border border-[#713f0b] h-[20px] px-[10px] rounded-[28px] flex items-center">
                  <span className="text-[12px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {planBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-[#9b9b9b] text-[16px] text-center leading-[1.6] px-[40px] mt-[8px] max-w-[460px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {user?.about || user?.bio || 'No bio added yet.'}
            </p>

            {/* Credits pill */}
            <div className="flex items-center gap-[8px] mt-[12px] bg-[#ffcd67] border border-[#ffab01] px-[14px] h-[30px] rounded-[48px]">
              <img src="/assets/phyo_coin.svg" alt="" className="w-[14px] h-[14px]" onError={e => e.currentTarget.style.display='none'} />
              <span className="text-[14px] font-normal text-black leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {credits}/10
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mx-[40px] mt-[28px] mb-[28px]" />

          {/* Info grid — 2 cols */}
          <div className="flex flex-col gap-[20px] px-[40px] pb-[40px]">
            {infoRows.map((row, ri) => (
              <div key={ri} className="flex gap-[40px]">
                {row.map(({ label, value }) => (
                  <div key={label} className="flex-1">
                    <InfoField label={label} value={value} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Subscription Info */}
        <div className="w-[360px] flex-shrink-0 bg-[#181818] rounded-[24px] overflow-hidden flex flex-col">
          <div className="flex flex-col gap-[20px] p-[20px] flex-1 overflow-y-auto">
            {/* Subscription Card */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px] font-semibold text-white capitalize leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                Subscription
              </p>
              <div className="bg-[#0f0f0f] rounded-[12px] p-[12px] flex flex-col gap-[8px]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Plan</span>
                  <span className="text-[14px] font-semibold text-white capitalize" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{currentPlan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Status</span>
                  <span className={`text-[12px] font-medium px-[8px] py-[4px] rounded-full ${subscriptionStatus === 'active' ? 'bg-[#16a34a]/20 text-[#16a34a]' : subscriptionStatus === 'paused' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#6b7280]/20 text-[#9b9b9b]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus === 'paused' ? 'Paused' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#9b9b9b]" style={{ fontFamily: 'Inter, sans-serif' }}>Credits</span>
                  <span className="text-[14px] font-semibold text-white" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{user?.creditsRemaining || 0}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/account/pause')}
                className="w-full h-[40px] border border-[#16a34a] text-[#16a34a] rounded-full text-[14px] font-medium hover:bg-[#16a34a]/10 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Manage Subscription
              </button>
              <button
                onClick={() => router.push('/brand/account/upgrade-plan')}
                className="w-full h-[40px] bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full text-[14px] font-medium transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Upgrade Plan
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Brand Images */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px] font-semibold text-white capitalize leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
                Brand Images
              </p>
              <div className="flex flex-col gap-[12px]">
                {(user?.brand_images?.length > 0 ? user.brand_images : [null, null]).map((url, i) => (
                  <div key={i} className="w-full h-[100px] rounded-[12px] bg-[#272626] overflow-hidden flex items-center justify-center">
                    {url
                      ? <img src={url} alt="" className="w-full h-full object-cover" />
                      : <svg className="w-8 h-8 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5"/><path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    }
                  </div>
                ))}
                <button
                  onClick={() => { setEditingSection('profile-editor'); setActiveEditTab('brandImages'); setMobileView('panel'); }}
                  className="w-full h-[40px] rounded-[12px] bg-[#272626] border border-[#333] border-dashed flex items-center justify-center hover:bg-[#2f2f2f] transition-colors text-[14px] text-[#9b9b9b]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  + Add Images
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative w-[90%] max-w-md bg-[#181818] rounded-3xl border border-[#333] p-8">
            <h2 className="text-2xl font-semibold text-white mb-3">Log Out?</h2>
            <p className="text-[#9b9b9b] mb-8">Your data will remain saved. You can sign back in anytime.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 border border-[#444] text-white rounded-full hover:bg-white/5">Cancel</button>
              <button onClick={() => { setShowLogoutConfirm(false); logout(); router.push('/login'); }} className="flex-1 py-3 bg-[#bf3709] text-white rounded-full flex items-center justify-center gap-2">
                <LogoutBoxRLine width={18} height={18} fill="white" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BrandAccountSkeleton() {
  return (
    <div className="w-full h-screen bg-[#000201] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a]" />
    </div>
  );
}

export default function BrandAccount() {
  return (
    <Suspense fallback={<BrandAccountSkeleton />}>
      <BrandAccountContent />
    </Suspense>
  );
}
