'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, UserRound, ChevronDown, X } from 'lucide-react';
import { campaignApi } from '@/api/campaign-api';

const FilterDropdown = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <span className="text-white text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-[#181818] text-[#9B9B9B] text-sm px-3 py-2.5 rounded-lg outline-none pr-8 border border-[#333]"
      >
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B] pointer-events-none" />
    </div>
  </div>
);

export default function NewApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    region: '', category: '', ageGroup: '', gender: '', language: '', followers: '',
  });

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { campaigns: data } = await campaignApi.getBrandCampaigns({}, { page: 1, limit: 50 });
      const seen = new Set();
      const embedded = data
        .flatMap(c => (c.applicants || []).map(a => ({
          ...a, campaignName: c.campaignName, campaignId: c._id,
        })))
        .filter(a => {
          const id = a._id || a.id;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      setApplications(embedded);
    } catch (error) {
      console.error(error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications;

  return (
    <div className="bg-[#000201] min-h-full pl-0 pr-10 py-6">
      <div className="flex items-center justify-between gap-8 mb-6">
        <h2
          className="text-2xl font-normal text-white capitalize leading-[120%]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          New Applications
        </h2>

        <div className="flex items-center gap-4">
          {/* Search bar — landing page style with glow + gradient stroke */}
          <div className="relative" style={{ width: 294 }}>
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-[50px] pointer-events-none" style={{
              background: 'linear-gradient(90deg, #16A34A 0%, #06FF62 100%)',
              filter: 'blur(16px)',
              opacity: 0.55,
              zIndex: 0,
            }} />
            {/* Gradient border wrapper */}
            <div className="relative z-10 rounded-[50px]" style={{
              padding: '1.5px',
              background: 'linear-gradient(90deg, #16A34A 0%, #ffffff 51%, #16A34A 100%)',
            }}>
              <div className="flex items-center rounded-[50px] px-4 h-[40px] gap-2" style={{
                background: '#000201',
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Campaigns..."
                  className="flex-1 bg-transparent text-[16px] text-white placeholder:text-[#9b9b9b] outline-none min-w-0"
                  style={{ fontFamily: 'Inter, sans-serif', lineHeight: '160%' }}
                />
                <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowFilter(prev => !prev)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
              showFilter ? 'bg-[#16A34A]' : 'bg-[#262626] hover:bg-[#333]'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex flex-col gap-2">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-[68px] bg-[#262626] rounded-xl animate-pulse" />
            ))
          ) : filtered.length > 0 ? filtered.map((app, idx) => {
            const name = app.name || app.username || 'Influencer';
            const bio = Array.isArray(app.niche)
              ? app.niche.join(', ')
              : (app.niche || app.campaignName || '');
            const initials = name.charAt(0).toUpperCase();
            return (
              <div
                key={(app._id || app.id || idx) + '-' + idx}
                className="h-[68px] bg-[#262626] rounded-xl flex items-center px-4 justify-between hover:bg-[#2e2e2e] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {app.profilePicture ? (
                    <img
                      src={app.profilePicture}
                      alt={name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center text-white text-base font-medium shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-base truncate">{name}</p>
                    <p className="text-[#9B9B9B] text-xs truncate">{bio}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/brand/influencers/' + (app._id || app.id))}
                  className="bg-[#16A34A] text-white text-xs rounded-full flex items-center justify-center gap-1 shrink-0 ml-3 hover:bg-green-700 transition-colors"
                  style={{ width: '100px', height: '28px' }}
                >
                  <UserRound className="w-3 h-3" />
                  <span>View profile</span>
                </button>
              </div>
            );
          }) : (
            <div className="py-20 text-center">
              <p className="text-white text-base font-medium mb-1">No applications yet</p>
              <p className="text-[#9B9B9B] text-sm">Applications from influencers will appear here.</p>
            </div>
          )}
        </div>

        {showFilter && (
          <div className="absolute top-0 right-0 w-[320px] z-50 bg-[#0a0a0a] rounded-2xl p-4 flex flex-col gap-4 shadow-2xl border border-[#262626]">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <span className="text-white text-base font-medium" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Filters</span>
              <button onClick={() => setShowFilter(false)} className="text-[#9B9B9B] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
              <FilterDropdown
                label="Region" value={filters.region}
                onChange={v => setFilters(f => ({ ...f, region: v }))}
                options={['India', 'USA', 'UK', 'UAE', 'Australia']}
              />
              <FilterDropdown
                label="Category" value={filters.category}
                onChange={v => setFilters(f => ({ ...f, category: v }))}
                options={['Comedy', 'Lifestyle', 'Fashion', 'Tech', 'Food', 'Travel', 'Sports']}
              />
              <FilterDropdown
                label="Age Group" value={filters.ageGroup}
                onChange={v => setFilters(f => ({ ...f, ageGroup: v }))}
                options={['18-24', '25-35', '36-45', '45+']}
              />
              <FilterDropdown
                label="Gender" value={filters.gender}
                onChange={v => setFilters(f => ({ ...f, gender: v }))}
                options={['Male', 'Female', 'Other']}
              />
              <FilterDropdown
                label="Language" value={filters.language}
                onChange={v => setFilters(f => ({ ...f, language: v }))}
                options={['English', 'Hindi', 'Spanish', 'French', 'Arabic']}
              />
              <div className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Followers</span>
                <div className="flex flex-wrap gap-2">
                  {['1K-10K', '10K-100K', '100K-1M', '1M+'].map(fr => (
                    <button
                      key={fr}
                      onClick={() => setFilters(prev => ({ ...prev, followers: prev.followers === fr ? '' : fr }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        filters.followers === fr
                          ? 'bg-[#16A34A] text-white border-[#16A34A]'
                          : 'bg-transparent text-[#9B9B9B] border-[#333] hover:border-[#16A34A]/50'
                      }`}
                    >
                      {fr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#262626]">
              <button
                onClick={() => setFilters({ region: '', category: '', ageGroup: '', gender: '', language: '', followers: '' })}
                className="flex-1 py-2 rounded-full border border-[#333] text-[#9B9B9B] text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 py-2 rounded-full bg-[#16A34A] text-white text-sm font-medium hover:bg-[#15803d] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
