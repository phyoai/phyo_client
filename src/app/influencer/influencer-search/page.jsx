'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import {
  ArrowLeftLine, Message3Line, UserAddLine,
  BookmarkLine,
  InstagramFill, YoutubeFill, FacebookCircleFill,
} from '@phyoofficial/phyo-icon-library';

const C = {
  bg:        '#000201',
  panel:     '#181818',
  card:      '#262626',
  green:     '#16A34A',
  white:     '#FFFFFF',
  gray:      '#9B9B9B',
  orange:    '#F89617',
  upgradeBg: '#432004',
};

const SAMPLE = [
  { id: 1, name: 'Alcie',   followers: '22.4k', avatarColor: '#8B5CF6' },
  { id: 2, name: 'Alcie',   followers: '22.4k', avatarColor: '#EC4899' },
  { id: 3, name: 'Alcie',   followers: '22.4k', avatarColor: '#F97316' },
  { id: 4, name: 'Alcie',   followers: '22.4k', avatarColor: '#06B6D4' },
  { id: 5, name: 'Alcie',   followers: '22.4k', avatarColor: '#14B8A6' },
];

export default function InfluencerSearch() {
  const router = useRouter();
  const [query, setQuery]               = useState('');
  const [isSearching, setIsSearching]   = useState(false);
  const [showResults, setShowResults]   = useState(false);
  const [selected, setSelected]         = useState(null);
  const [invited, setInvited]           = useState(new Set());
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [voiceModal, setVoiceModal]     = useState(false);
  const [isListening, setIsListening]   = useState(false);
  const [voiceText, setVoiceText]       = useState('');
  const [recognition, setRecognition]   = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const inputRef      = useRef(null);
  const moreRef       = useRef(null);
  const silenceRef    = useRef(null);
  const finalRef      = useRef('');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setIsSearching(true);
      const t2 = setTimeout(() => { setIsSearching(false); setShowResults(true); }, 2000);
      return () => clearTimeout(t2);
    }, 300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!showMoreMenu) return;
    const h = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setShowMoreMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showMoreMenu]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; // eslint-disable-line
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
    rec.onresult = (e) => {
      let fin = '', int = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        e.results[i].isFinal ? (fin += t + ' ') : (int += t);
      }
      const full = fin + int;
      setVoiceText(full); finalRef.current = full;
      if (silenceRef.current) clearTimeout(silenceRef.current);
      silenceRef.current = setTimeout(() => { if (finalRef.current.trim()) rec.stop(); }, 2000);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => {
      setIsListening(false);
      if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
      const text = finalRef.current.trim();
      if (text) { setQuery(text); setVoiceModal(false); setVoiceText(''); finalRef.current = ''; setTimeout(() => doSearch(text), 300); }
    };
    setRecognition(rec);
  }, []);

  const doSearch = (q = query) => {
    if (!q.trim()) return;
    setShowResults(false); setIsSearching(true); setSelected(null);
    setTimeout(() => { setIsSearching(false); setShowResults(true); }, 2000);
  };

  const startVoice = () => {
    setVoiceModal(true); setVoiceText(''); finalRef.current = '';
    if (recognition) { setIsListening(true); try { recognition.start(); } catch {} }
  };

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop(); setIsListening(false);
      if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
      setTimeout(() => {
        const text = finalRef.current.trim() || voiceText.trim();
        if (text) { setQuery(text); setVoiceModal(false); setVoiceText(''); finalRef.current = ''; setTimeout(() => doSearch(text), 300); }
        else { setVoiceModal(false); setVoiceText(''); finalRef.current = ''; }
      }, 200);
    } else {
      setVoiceText(''); finalRef.current = ''; setIsListening(true);
      try { recognition.start(); } catch {}
    }
  };

  return (
    <>
      <style jsx global>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        ::placeholder { color: #9B9B9B !important; opacity: 1; }
      `}</style>

      <div className="flex flex-col h-full overflow-hidden" style={{ background: C.bg }}>

        {/* Search bar */}
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={doSearch}
          onMic={startVoice}
          onMore={() => setShowMoreMenu(!showMoreMenu)}
          isSearching={isSearching}
          inputRef={inputRef}
        />

        {/* Filter dropdown */}
        {showMoreMenu && (
          <div
            ref={moreRef}
            className="absolute z-50 rounded-2xl shadow-2xl py-4"
            style={{ background: C.panel, width: 360, border: '1px solid rgba(255,255,255,0.08)', top: '200px', right: '20px' }}
          >
            {[
              { label: 'Region',   placeholder: 'india' },
              { label: 'Category', placeholder: 'Comedy, Life' },
              { label: 'Audience', placeholder: '18-24, 25-35' },
            ].map(({ label, placeholder }) => (
              <div key={label} className="px-4 mb-4">
                <p className="text-sm font-medium mb-2" style={{ color: C.white }}>{label}</p>
                <div className="rounded-xl px-4 py-2.5 flex items-center justify-between" style={{ background: C.card, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-sm" style={{ color: C.gray }}>{placeholder}</span>
                  <svg className="w-4 h-4" style={{ color: C.gray }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
            <div className="px-4">
              <p className="text-sm font-medium mb-2" style={{ color: C.white }}>Platform</p>
              <div className="flex gap-2 flex-wrap">
                {['Instagram', 'YouTube', 'Twitter', 'Facebook'].map((p) => (
                  <button key={p} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: C.card, border: '1px solid rgba(255,255,255,0.1)', color: C.white }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Voice modal */}
        {voiceModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => { if (recognition && isListening) recognition.stop(); setVoiceModal(false); setIsListening(false); }}
          >
            <div
              className="rounded-3xl p-8 w-[480px] max-w-[90vw]"
              style={{ background: C.panel }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-8" style={{ color: C.white }}>Speak</h2>
              <div className="flex justify-center mb-8">
                <button
                  onClick={toggleListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'animate-pulse' : ''}`}
                  style={{ background: C.green }}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm0-12c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm4 10c0 2.97-2.16 5.43-5 5.91V21h-2v-3.09C7.16 17.43 5 14.97 5 12h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2z"/></svg>
                </button>
              </div>
              <p className="text-center min-h-[48px]" style={{ color: C.gray, fontSize: 16 }}>
                {voiceText || (isListening ? 'Listening...' : 'Tap the mic to start')}
              </p>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden">

          {/* Searching state */}
          {!showResults && (
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className="flex flex-col items-center transition-all duration-700"
                style={{ opacity: isSearching ? 1 : 0, transform: isSearching ? 'scale(1)' : 'scale(0.95)' }}
              >
                <img
                  src="/assets/searching_look.svg"
                  alt=""
                  style={{ width: 187, height: 279, objectFit: 'contain' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <p
                  className="mt-4 text-center"
                  style={{
                    color: '#808080',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: '120%',
                    letterSpacing: '0.2px',
                  }}
                >
                  finding results...
                </p>
              </div>
            </div>
          )}

          {/* Results state */}
          {showResults && (
            <div className="fade-up flex h-full pr-5 items-stretch" style={{ gap: 16, paddingTop: 20, paddingBottom: 20, paddingLeft: 0 }}>

              {/* Left: cards */}
              <div
                className="flex-shrink-0 overflow-y-auto flex flex-col rounded-[28px] px-4 py-4"
                style={{
                  width: 450,
                  gap: 12,
                  background: '#181818',
                  border: '1px solid rgba(255,255,255,0.03)',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
                }}
              >
                <div className="px-1 pb-3">
                  <p style={{ color: C.white, fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 400, lineHeight: '1.2' }}>
                    Top Influencers
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 pb-3 overflow-x-auto flex-shrink-0" style={{ scrollBehavior: 'smooth', minWidth: 0 }}>
                  {['All', 'Fitness', 'Comedy', 'Travel', 'Tech', 'Lifestyle'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className="flex-shrink-0 rounded-full px-4 py-1.5 font-medium transition-all"
                      style={{
                        background: activeFilter === filter ? C.green : 'rgba(255,255,255,0.1)',
                        color: activeFilter === filter ? '#000' : C.white,
                        border: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Upgrade banner */}
                <div
                  style={{
                    background: C.upgradeBg,
                    borderRadius: 8,
                    height: 70,
                    borderLeft: `4px solid ${C.orange}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px 0 16px',
                    flexShrink: 0,
                  }}
                >
                  <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, color: C.white, flexShrink: 0 }}>
                      <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 14a1 1 0 100 2 1 1 0 000-2zm0-9a1 1 0 00-1 1v5a1 1 0 002 0V8a1 1 0 00-1-1z"/>
                    </svg>
                    <p style={{ color: C.white, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '140%' }}>
                      You have reached your limit. Upgrade plan for more.
                    </p>
                  </div>
                  <button
                    className="flex-shrink-0 hover:opacity-90 transition-opacity"
                    style={{
                      background: '#73400B',
                      color: C.white,
                      borderRadius: 40,
                      width: 80,
                      height: 28,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    Upgrade
                  </button>
                </div>

                {SAMPLE.map((inf) => (
                  <InfluencerCard
                    key={inf.id}
                    inf={inf}
                    isInvited={invited.has(inf.id)}
                    isSelected={selected?.id === inf.id}
                    onInvite={() => setInvited(new Set([...invited, inf.id]))}
                    onClick={() => setSelected(selected?.id === inf.id ? null : inf)}
                  />
                ))}
              </div>

              {/* Right: profile */}
              <div
                className="flex-1 rounded-[28px] overflow-hidden"
                style={{
                  minWidth: 0,
                  background: '#181818',
                  border: '1px solid rgba(255,255,255,0.03)',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
                }}
              >
                {selected ? (
                  <InfluencerProfile
                    inf={selected}
                    isInvited={invited.has(selected.id)}
                    onInvite={() => setInvited(new Set([...invited, selected.id]))}
                    onBack={() => setSelected(null)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <img
                      src="/assets/phyo_logo_new.svg"
                      alt="Phyo"
                      style={{ width: 240, height: 60, objectFit: 'contain', opacity: 0.6 }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <p style={{ color: '#666666', fontFamily: 'Manrope, sans-serif', fontSize: 16, fontWeight: 500, lineHeight: '24px', letterSpacing: '0' }}>
                      A PyroMedia Product
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfluencerCard({ inf, isInvited, isSelected, onInvite, onClick }) {
  const [toast, setToast] = useState(false);
  const handleInvite = (e) => { e.stopPropagation(); onInvite(); setToast(true); setTimeout(() => setToast(false), 2500); };

  return (
    <>
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl text-sm shadow-xl" style={{ background: '#333', color: C.white }}>
          Invite sent
        </div>
      )}
      <div
        onClick={onClick}
        className="flex items-center justify-between flex-shrink-0 cursor-pointer transition-all"
        style={{
          height: 80,
          background: C.card,
          borderRadius: 16,
          padding: '12px 16px',
          border: isSelected ? `1px solid ${C.green}` : '1px solid rgba(255,255,255,0.08)',
          gap: 16,
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(22,163,74,0.3)'; }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <div className="flex items-center" style={{ gap: 16, flex: 1, minWidth: 0 }}>
          <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 56, height: 56, background: inf.avatarColor || '#555' }} />
          <div className="flex flex-col" style={{ gap: 2 }}>
            <span style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 400, lineHeight: '120%' }}>{inf.name}</span>
            <span style={{ color: C.gray, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '120%' }}>{inf.followers} Followers</span>
          </div>
        </div>
        <button
          onClick={handleInvite}
          className="flex-shrink-0 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          style={{
            background: isInvited ? 'rgba(22,163,74,0.3)' : C.green,
            borderRadius: 40,
            border: isInvited ? `1px solid ${C.green}` : 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            color: C.white,
            padding: '6px 16px',
            whiteSpace: 'nowrap',
          }}
        >
          <UserAddLine style={{ width: 18, height: 18 }} />
          {isInvited ? 'Invited' : 'Invitations'}
        </button>
      </div>
    </>
  );
}

function InfluencerProfile({ inf, isInvited, onInvite, onBack }) {
  const router = useRouter();
  const [toast, setToast] = useState(false);
  const handleInvite = () => { onInvite(); setToast(true); setTimeout(() => setToast(false), 2500); };
  const profile = {
    name: 'Dadi Cool', username: '@dadi_cool', location: 'Mumbai, India',
    followers: '2.4M', engagement: '6.8%', campaigns: '48',
    about: 'Fitness-first creator blending tech reviews with wellness content. Known for high-trust, community-driven storytelling. Works best with purpose-led brands focused on real outcomes.',
    categories: ['Fitness', 'Comedy', 'Travel', 'Infra', 'Label', 'Comedy'],
    gender: { female: 60, male: 40 },
    ageGroups: [
      { range: '12-18', val: 75 },
      { range: '19-24', val: 45 },
      { range: '24-34', val: 55 },
      { range: '35-45', val: 30 },
      { range: '46-55', val: 40 },
      { range: '56-65', val: 25 },
      { range: '65+', val: 35 }
    ],
    locations: [
      { country: 'IN', val: 70 },
      { country: 'DL', val: 60 },
      { country: 'USA', val: 50 },
      { country: 'NY', val: 45 },
      { country: 'UK', val: 40 },
      { country: 'LON', val: 35 },
      { country: 'UAE', val: 30 },
      { country: 'DUB', val: 25 }
    ],
    topCampaigns: [
      { name: 'Nike Campaign', engagement: '71%', followers: '1.4M' },
      { name: 'Apple Campaign', engagement: '65%', followers: '1.2M' },
      { name: 'Samsung Campaign', engagement: '58%', followers: '1.1M' }
    ],
    reviews: [
      { brand: 'Nike India', role: 'Marketing Lead', rating: 5, text: 'Aarya delivered beyond brief. Authenticity was off the charts DMs flooded with leads.' },
      { brand: 'Nike India', role: 'Marketing Lead', rating: 5, text: 'Aarya delivered beyond brief. Authenticity was off the charts DMs flooded with leads.' }
    ]
  };

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: '#181818',
      }}
    >
      {toast && <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl text-sm shadow-xl" style={{ background: '#333', color: C.white }}>Invite sent</div>}

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="px-5 pt-5 pb-4" style={{ position: 'relative', zIndex: 10 }}>
          {/* Avatar + Name + Bookmark */}
          <div className="relative mb-4" style={{ minHeight: 124 }}>
            <div className="absolute inset-0 opacity-45" style={{ background: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35), transparent 38%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.18), transparent 32%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)' }} />
            <div className="relative flex gap-3 items-start">
              <div className="w-[100px] h-[100px] rounded-full flex-shrink-0 border-2 overflow-hidden shadow-[0_0_74px_rgba(0,0,0,0.55)]" style={{ background: inf.avatarColor || '#555', borderColor: C.white }} />
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-[24px] leading-[1.2] font-semibold" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{profile.name}</h2>
                  <span style={{ color: '#8FC2A5', fontSize: '18px' }}>✓</span>
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)', fontFamily: 'Inter, sans-serif' }}>{profile.username} | {profile.location}</p>
              </div>
              <button className="w-[40px] h-[40px] flex items-center justify-center hover:bg-white/10 rounded-full relative z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: C.white }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4 max-w-[353px]">
            {profile.categories.map((cat, i) => (
              <span key={i} className="px-4 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.12)', color: C.white, fontFamily: 'Inter, sans-serif' }}>
                {cat}
              </span>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Followers', val: profile.followers },
              { label: 'Engagement', val: profile.engagement },
              { label: 'Campaigns', val: profile.campaigns }
            ].map(({ label, val }) => (
              <div key={label} className="text-center rounded-[12px] py-5" style={{ background: C.card }}>
                <p className="text-[24px] leading-[1.2] font-normal" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{val}</p>
                <p className="text-[16px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Biography */}
        <div className="px-5 pt-4 pb-5">
          <p className="mb-2" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Biography</p>
          <p className="text-sm leading-6" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{profile.about}</p>
        </div>

        {/* Top Campaigns */}
        <div className="px-5 mb-5 pb-5">
          <div className="flex justify-between items-center mb-3">
            <p style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Top Campaigns</p>
            <button className="flex items-center gap-1.5 text-xs" style={{ color: C.green, fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View All
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M0 0.81727L0.892353 0L5.75277 4.45412C5.83112 4.5255 5.8933 4.61037 5.93573 4.70385C5.97816 4.79734 6 4.89759 6 4.99884C6 5.1001 5.97816 5.20035 5.93573 5.29384C5.8933 5.38732 5.83112 5.47219 5.75277 5.54356L0.892353 10L0.000840664 9.18273L4.56269 5L0 0.81727Z" fill="#16A34A"/>
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {profile.topCampaigns.map((camp, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-[8px] hover:bg-white/5 transition-colors" style={{ background: C.card }}>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-[4px]" style={{ background: inf.avatarColor || '#555' }} />
                  <div>
                    <span className="block" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 16 }}>{camp.name}</span>
                    <span className="block text-xs" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{profile.username}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[16px]" style={{ color: C.green, fontFamily: 'Inter, sans-serif' }}>{camp.engagement} eng.</span>
                  <span className="block text-[13px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{camp.followers} followers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Insights */}
        <div className="px-5 mb-5 pb-5">
          <p className="mb-4" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Audience Insights</p>

          {/* Gender Chart */}
          <div className="mb-6 rounded-[24px] p-5 relative overflow-hidden" style={{ background: C.card, minHeight: 220 }}>
            <p className="text-[16px] font-semibold mb-2" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Gender</p>
            <div className="absolute right-5 top-5 flex gap-4 text-[12px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>
              <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#8FC2A5' }} />Female</span>
              <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: C.green }} />Male</span>
            </div>
            <div className="flex items-center justify-center pt-2">
              <div className="relative w-[171px] h-[171px] rounded-full border-[18px]" style={{ borderColor: 'rgba(67, 160, 71, 0.18)' }}>
                <div className="absolute inset-0 rounded-full border-[18px] border-transparent border-r-[#8FC2A5] border-b-[#8FC2A5] border-l-transparent border-t-transparent rotate-45" />
                <div className="absolute left-[118px] top-[33px] bg-[#8FC2A5] text-black text-[12px] rounded-[4px] px-2 py-1 font-semibold">36%</div>
                <div className="absolute left-[20px] bottom-[25px] bg-[#067635] text-white text-[12px] rounded-[4px] px-2 py-1 font-semibold">62%</div>
              </div>
            </div>
          </div>

          {/* Age Groups Chart */}
          <div className="mb-6 rounded-[24px] p-5" style={{ background: C.card }}>
            <p className="text-[16px] font-semibold mb-3" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Age groups</p>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between h-[226px] text-[12px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>
                <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
              </div>
              <div className="flex-1 flex items-end gap-1 h-[226px]">
                {profile.ageGroups.map((group, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full rounded-t-[8px]" style={{ background: C.green, height: `${Math.max(group.val * 1.8, 8)}px` }} />
                    <p className="text-[12px] mt-2" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>{group.range}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Locations Chart */}
          <div className="rounded-[24px] p-5" style={{ background: C.card }}>
            <p className="text-[16px] font-semibold mb-3" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>Top locations</p>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between h-[226px] text-[12px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>
                <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
              </div>
              <div className="flex-1 flex items-end gap-1 h-[226px]">
                {profile.locations.map((loc, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full rounded-t-[8px]" style={{ background: i % 2 === 0 ? C.green : '#8FC2A5', height: `${Math.max(loc.val * 1.8, 8)}px` }} />
                    <p className="text-[12px] mt-2" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>{loc.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Highlights */}
        <div className="px-5 mb-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Content highlights</p>
            <div className="bg-[#262626] px-3 py-1 rounded-full text-[14px]" style={{ color: C.white, fontFamily: 'Inter, sans-serif' }}>Reels</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[0.62] rounded-[16px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EC4899, #D946EF)' }}>
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 flex items-end p-3">
                  <div className="flex gap-1 text-[12px]" style={{ color: C.white, fontFamily: 'Work Sans, sans-serif' }}>
                    <span>❤️ 62K</span>
                    <span>💬 10K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Reviews */}
        <div className="px-5 mb-32">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[64px] leading-none font-bold" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>4.9</div>
            <div className="text-right">
              <div className="text-yellow-400 text-[18px]">★★★★★</div>
              <p className="text-[14px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>31 brand reviews</p>
            </div>
          </div>
          <p className="mb-3" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 400, lineHeight: '1.2', textTransform: 'capitalize' }}>Campaign Reviews</p>
          <div className="space-y-3">
            {profile.reviews.map((review, i) => (
              <div key={i} className="bg-[#262626] rounded-[16px] p-4 border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[20px] font-bold" style={{ color: C.white, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{review.brand}</p>
                    <p className="text-[14px]" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>{review.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <span key={j} style={{ color: '#FCD34D', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[14px] leading-6" style={{ color: C.gray, fontFamily: 'Inter, sans-serif' }}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-white/10 bg-[#0d0d0d] flex gap-3">
        <button
          onClick={handleInvite}
          className="flex-1 flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{
            background: '#262626',
            color: C.white,
            borderRadius: 40,
            padding: '10px 40px 11px 41px',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '1.2',
          }}
        >
          {isInvited ? '✓ Invited' : '+ Invite'}
        </button>
        <button
          onClick={() => router.push(`/influencer/inbox/${inf.id}?name=${encodeURIComponent(profile.name)}`)}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{
            background: '#16A34A',
            color: C.white,
            borderRadius: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 40px 11px 41px',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '1.2',
          }}
        >
          Message
        </button>
      </div>
    </div>
  );
}
