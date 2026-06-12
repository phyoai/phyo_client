  'use client'
  import { useState, useRef, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import SearchBar from '@/components/SearchBar';
  import InfluencerProfilePanel from '@/components/InfluencerProfilePanel';
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
                    <InfluencerProfilePanel
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

