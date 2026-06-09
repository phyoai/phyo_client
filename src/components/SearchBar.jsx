'use client'
import { SearchLine, MicLine, MoreLine } from '@phyoofficial/phyo-icon-library';

/**
 * Dark theme glassmorphism search bar component
 * Usage: <SearchBar value={q} onChange={setQ} onSearch={doSearch} onMic={startVoice} onMore={toggleMore} isSearching={searching} />
 */
export default function SearchBar({
  placeholder = 'Search influencers (e.g. i need influencers in mumbai)...',
  value = '',
  onChange = () => {},
  onSearch = () => {},
  onMic = null,
  onMore = null,
  showMic = true,
  showMore = true,
  isSearching = false,
  inputRef = null,
}) {
  return (
    <div className="flex items-center gap-5 w-full flex-nowrap overflow-hidden pr-5" style={{ paddingTop: '32px', marginBottom: '17px', paddingLeft: 0 }}>
      {/* Glasmorphism pill — full width */}
      <div className="relative cursor-pointer flex-1 min-w-0">
        <div className="absolute inset-0 rounded-full blur-[8px] border-2 border-[#16a34a] pointer-events-none" />
        <div className="relative flex items-center bg-[rgba(255,255,255,0.08)] backdrop-blur-[6px] rounded-full border-[0.8px] border-[#16a34a] overflow-hidden pr-[9.6px] py-[10px] pl-[19.6px] gap-3 h-[60px]">
          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-[16px] leading-[1.6] truncate"
            style={{
              color: '#FFFFFF',
              caretColor: '#16A34A',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
            }}
          />

          {/* Search button */}
          <button
            onClick={onSearch}
            className="flex items-center gap-2 bg-[#16a34a] text-white rounded-[20px] pl-[40px] pr-[16px] py-[8px] text-[16px] font-normal shrink-0 relative h-[40px] hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <SearchLine
              className={isSearching ? 'animate-spin absolute left-[10px]' : 'absolute left-[10px]'}
              style={{ width: 24, height: 24, color: '#FFFFFF' }}
            />
            Search
          </button>
        </div>
      </div>

      {/* Mic button */}
      {showMic && onMic && (
        <button
          onClick={onMic}
          className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ width: 60, height: 60, borderRadius: '50%', background: '#262626', color: '#FFFFFF' }}
        >
          <MicLine style={{ width: 24, height: 24 }} />
        </button>
      )}

      {/* More button */}
      {showMore && onMore && (
        <button
          onClick={onMore}
          className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ width: 60, height: 60, borderRadius: '50%', background: '#262626', color: '#FFFFFF' }}
        >
          <MoreLine style={{ width: 24, height: 24 }} />
        </button>
      )}
    </div>
  );
}