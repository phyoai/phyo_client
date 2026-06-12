'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { getTrendingInfluencers } from '@/api/trending-nearby.api';

const DUMMY_INFLUENCERS = [
  { _id: 'd1', name: 'Natalie Clark' },
  { _id: 'd2', name: 'Sophia' },
  { _id: 'd3', name: 'James' },
  { _id: 'd4', name: 'Daniel Hall' },
  { _id: 'd5', name: 'Ava Jackson' },
  { _id: 'd6', name: 'Sarah Williams' },
  { _id: 'd7', name: 'Olivia Martin' },
  { _id: 'd8', name: 'Swagdeep' },
];

export default function TrendingInfluencersSection() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingInfluencers({ limit: 10 })
      .then((res) => {
        const data = res.data || res.influencers || [];
        setInfluencers(data.length > 0 ? data : DUMMY_INFLUENCERS);
      })
      .catch(() => setInfluencers(DUMMY_INFLUENCERS))
      .finally(() => setLoading(false));
  }, []);

  const displayList = influencers.length > 0 ? influencers : DUMMY_INFLUENCERS;
  const scrollList = [...displayList, ...displayList];

  return (
    <div>
      <style>{`
        @keyframes scrollInfluencers {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-influencers { animation: scrollInfluencers 24s linear infinite; }
        .scroll-influencers-wrap:hover .scroll-influencers { animation-play-state: paused; }
      `}</style>

      <SectionHeading
        title="Top Influencers"
        onViewAll={() => router.push('/brand/influencers')}
      />

      {loading ? (
        <div className="flex gap-[20px] overflow-x-hidden pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[120px] animate-pulse">
              <div className="w-full aspect-square bg-[#2f2f2f] rounded-full" />
              <div className="h-3 bg-[#2f2f2f] rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="scroll-influencers-wrap overflow-hidden">
          <div className="scroll-influencers flex gap-[20px]" style={{ width: 'max-content' }}>
            {scrollList.map((inf, index) => (
              <InfluencerAvatar
                key={`${inf._id || inf.id}-${index}`}
                name={inf.profile_name || inf.stage_name || inf.name || 'Unknown'}
                avatar={inf.profile_pic_url || inf.profileImage || inf.profilePicture}
                onClick={() => inf._id?.startsWith('d') ? null : router.push(`/brand/influencers/${inf._id || inf.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
