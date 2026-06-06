'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, UserRound, ChevronDown, X } from 'lucide-react';
import { campaignApi } from '@/api/campaign-api';

const FilterDropdown = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <span className="text-white text-sm">{label}</span>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-[#181818] text-[#9B9B9B] text-sm px-3 py-2 rounded-lg outline-none pr-8"
      >
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B] pointer-events-none" />
    </div>
  </div>
);

export default function NewApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
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
    <div className="bg-[#000201] min-h-full px-10 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-normal text-white capitalize leading-[120%]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          New Applications
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter(prev => !prev)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${showFilter ? 'bg-[#16A34A]' : 'bg-[#262626] hover:bg-[#333]'}`}
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

          <div className="absolute top-0 right-0 w-[300px] z-50 bg-[#262626] rounded-2xl p-5 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-white text-base font-medium">Filters</span>
              <button onClick={() => setShowFilter(false)} className="text-[#9B9B9B] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
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
              <span className="text-white text-sm">Followers</span>
              <div className="flex flex-wrap gap-2">
                {['1K-10K', '10K-100K', '100K-1M', '1M+'].map(fr => (
                  <button
                    key={fr}
                    onClick={() => setFilters(prev => ({ ...prev, followers: prev.followers === fr ? '' : fr }))}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      filters.followers === fr ? 'bg-[#16A34A] text-white' : 'bg-[#181818] text-[#9B9B9B]'
                    }`}
                  >
                    {fr}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setFilters({ region: '', category: '', ageGroup: '', gender: '', language: '', followers: '' })}
              className="mt-1 w-full py-2 rounded-full border border-white/10 text-[#9B9B9B] text-sm hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
