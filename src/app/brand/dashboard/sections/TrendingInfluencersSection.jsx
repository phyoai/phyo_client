'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { getTrendingInfluencers } from '@/api/trending-nearby.api';

export default function TrendingInfluencersSection() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingInfluencers({ limit: 10 })
      .then((res) => setInfluencers(res.data || res.influencers || []))
      .catch(() => setInfluencers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SectionHeading
        title="Top Influencers"
        onViewAll={() => router.push('/brand/influencers')}
      />

      {loading ? (
        <div className="flex gap-[20px] overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-[8px] flex-shrink-0 w-[120px] animate-pulse">
              <div className="w-full aspect-square bg-[#2f2f2f] rounded-full" />
              <div className="h-3 bg-[#2f2f2f] rounded w-16" />
            </div>
          ))}
        </div>
      ) : influencers.length > 0 ? (
        <div className="flex gap-[20px] overflow-x-auto pb-2 scrollbar-hide">
          {influencers.map((inf, index) => (
            <InfluencerAvatar
              key={inf._id || inf.id || index}
              name={inf.profile_name || inf.stage_name || inf.name || 'Unknown'}
              avatar={inf.profile_pic_url || inf.profileImage || inf.profilePicture}
              onClick={() => router.push(`/brand/influencers/${inf._id || inf.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-[#9b9b9b] text-sm py-4">No trending influencers available</p>
      )}
    </div>
  );
}
