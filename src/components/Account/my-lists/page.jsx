'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleContext } from '@/app/context/RoleContext';
import api from '@/utils/api';

const CATEGORIES = ['All', 'Sports', 'Lifestyle', 'Fashion'];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function MyLists() {
  const router = useRouter();
  const { role } = useRoleContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateList, setShowCreateList] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [listName, setListName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const influencersRes = await api.get('/influencers', { params: { page: 1, limit: 30 } });
        const infData = influencersRes.data?.data || influencersRes.data || [];
        setInfluencers(Array.isArray(infData) ? infData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setInfluencers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(influencers.map(i => i._id || i.id));
      setSelectAll(true);
    }
  };

  const handleCreateNow = async () => {
    if (!selected.length) return;
    setCreating(true);
    try {
      await api.post('/lists', {
        name: listName || 'My List',
        influencers: selected.map(id => ({ influencerId: id, status: 'new' })),
      });
      setShowCreateList(false);
      setSelected([]);
      setListName('');
    } catch (err) {
      console.error('Create list error:', err);
    } finally {
      setCreating(false);
    }
  };

  const bg = 'bg-[#000201]';
  const panelCls = 'bg-[#181818] rounded-[24px] overflow-hidden';

  if (showCreateList) {
    return (
      <div className={`min-h-screen ${bg} text-white p-5`}>
        <div className={`${panelCls} p-5`}>
          <div className="mb-5">
            <p className="text-[24px] font-normal text-white capitalize text-center leading-[1.2] mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
              Create New List
            </p>
            <input
              type="text"
              value={listName}
              onChange={e => setListName(e.target.value)}
              placeholder="List name…"
              className="w-full bg-[#272626] h-[40px] rounded-[8px] px-[16px] text-[14px] text-white placeholder-[#9b9b9b] outline-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <div className="flex items-end justify-between pb-[10px] border-b border-white/10">
            <span className="text-[16px] font-normal text-[#9b9b9b] capitalize leading-[1.2]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select all
            </span>
            <button
              onClick={handleSelectAll}
              className="w-[20px] h-[20px] border border-[#9b9b9b] rounded-[4px] flex items-center justify-center flex-shrink-0"
            >
              {selectAll && <svg className="w-3 h-3 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
            </button>
          </div>

          <div className="flex flex-col gap-[10px] mt-[10px] overflow-y-auto max-h-[60vh]">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse py-2">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[48px] h-[48px] rounded-full bg-[#272626]" />
                    <div className="flex flex-col gap-2"><div className="h-3 bg-[#272626] rounded w-24" /><div className="h-2 bg-[#272626] rounded w-36" /></div>
                  </div>
                  <div className="w-[20px] h-[20px] border border-[#9b9b9b] rounded-[4px]" />
                </div>
              ))
            ) : influencers.map((inf, idx) => {
              const id = inf._id || inf.id;
              const name = inf.profile?.name || inf.name || 'Influencer';
              const subtitle = inf.profile?.bio || inf.bio || inf.about || 'Hey, any updates on the campaign?';
              const avatar = inf.profile?.profileImage || inf.profileImage || inf.profilePicture;
              const isChecked = selected.includes(id);
              return (
                <div key={id || idx}>
                  <div className="flex items-center justify-between py-[10px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[48px] h-[48px] rounded-full bg-[#272626] overflow-hidden flex-shrink-0">
                        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-white text-sm font-semibold">{getInitials(name)}</span>}
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="text-[16px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{name}</p>
                        <p className="text-[12px] font-normal text-[#9b9b9b] leading-[1.2] truncate max-w-[400px]" style={{ fontFamily: 'Inter, sans-serif' }}>{subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSelect(id)}
                      className={`w-[20px] h-[20px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${isChecked ? 'border-[#16a34a] bg-[#16a34a]/20' : 'border-[#9b9b9b]'}`}
                    >
                      {isChecked && <svg className="w-3 h-3 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                    </button>
                  </div>
                  <div className="h-px bg-white/10" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-[20px] mt-5">
          <button onClick={() => setShowCreateList(false)} className="border border-white h-[40px] w-[160px] rounded-full text-[16px] font-normal text-white capitalize hover:bg-white/10 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            Cancel
          </button>
          <button onClick={handleCreateNow} disabled={creating || !selected.length} className="bg-[#16a34a] hover:bg-[#15803d] h-[40px] w-[160px] rounded-full text-[16px] font-normal text-white capitalize transition-colors disabled:opacity-40" style={{ fontFamily: 'Inter, sans-serif' }}>
            {creating ? 'Creating…' : 'Create Now'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} text-white p-5`}>
      <div className={`${panelCls} p-5`}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[24px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: '"opsz" 14, "wdth" 100' }}>
            Saved Influencers
          </p>
          <button
            onClick={() => setShowCreateList(true)}
            className="bg-[#16a34a] hover:bg-[#15803d] h-[40px] w-[200px] rounded-full text-[16px] font-normal text-white capitalize transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Create New List
          </button>
        </div>

        <div className="flex gap-[12px] items-center mb-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-[24px] py-[4px] rounded-full text-[14px] capitalize transition-colors ${
                activeCategory === cat ? 'bg-[#16a34a] text-white' : 'bg-white/12 text-white hover:bg-white/20'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-[10px]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-[8px] animate-pulse py-[10px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#272626] flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1"><div className="h-3 bg-[#272626] rounded w-24" /><div className="h-2 bg-[#272626] rounded w-48" /></div>
              </div>
            ))}
          </div>
        ) : influencers.length === 0 ? (
          <p className="text-[#9b9b9b] text-sm text-center py-12">No saved influencers yet.</p>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {influencers.map((inf, idx) => {
              const id = inf._id || inf.id;
              const name = inf.profile?.name || inf.name || 'Influencer';
              const subtitle = inf.profile?.bio || inf.bio || inf.about || 'Hey, any updates on the campaign?';
              const avatar = inf.profile?.profileImage || inf.profileImage || inf.profilePicture;
              return (
                <div key={id || idx}>
                  <div className="flex items-center gap-[8px] py-[10px] cursor-pointer hover:bg-white/5 rounded-lg px-2 transition-colors" onClick={() => router.push(`/${role}/influencers/${id}`)}>
                    <div className="w-[48px] h-[48px] rounded-full bg-[#272626] overflow-hidden flex-shrink-0">
                      {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-white text-sm font-semibold">{getInitials(name)}</span>}
                    </div>
                    <div className="flex flex-col gap-[4px] min-w-0">
                      <p className="text-[16px] font-normal text-white capitalize leading-[1.2]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{name}</p>
                      <p className="text-[12px] font-normal text-[#9b9b9b] leading-[1.2] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{subtitle}</p>
                    </div>
                  </div>
                  {idx < influencers.length - 1 && <div className="h-px bg-white/10" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
