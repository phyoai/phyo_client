'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { influencerApi } from '@/api/influencer-api';

const DUMMY_INFLUENCERS = [
  { _id: 'n1', name: 'Priya Sharma' },
  { _id: 'n2', name: 'Arjun Mehta' },
  { _id: 'n3', name: 'Riya Kapoor' },
  { _id: 'n4', name: 'Vikram Singh' },
  { _id: 'n5', name: 'Neha Gupta' },
  { _id: 'n6', name: 'Rohan Verma' },
  { _id: 'n7', name: 'Anjali Das' },
  { _id: 'n8', name: 'Kabir Khan' },
];

export default function InfluencerListSection({ title = 'Nearby Influencers', eyebrow, limit = 10, showViewAll = true }) {
  const router = useRouter();
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    influencerApi.getAllInfluencers({}, { page: 1, limit })
      .then(({ influencers: data }) => {
        setInfluencers(data?.length > 0 ? data : DUMMY_INFLUENCERS);
      })
      .catch(() => setInfluencers(DUMMY_INFLUENCERS))
      .finally(() => setLoading(false));
  }, [limit]);

  const displayList = influencers.length > 0 ? influencers : DUMMY_INFLUENCERS;
  const scrollList = [...displayList, ...displayList];

  return (
    <div>
      <style>{`
        @keyframes scrollNearby {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-nearby { animation: scrollNearby 28s linear infinite; }
        .scroll-nearby-wrap:hover .scroll-nearby { animation-play-state: paused; }
      `}</style>

      <SectionHeading
        title={title}
        eyebrow={eyebrow}
        showViewAll={showViewAll}
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
        <div className="scroll-nearby-wrap overflow-hidden">
          <div className="scroll-nearby flex gap-[20px]" style={{ width: 'max-content' }}>
            {scrollList.map((inf, index) => (
              <InfluencerAvatar
                key={`${inf._id || inf.id}-${index}`}
                name={inf.profile_name || inf.stage_name || inf.name || 'Influencer'}
                avatar={inf.profile_pic_url || inf.profileImage || inf.profilePicture}
                onClick={() => inf._id?.startsWith('n') ? null : router.push(`/brand/influencers/${inf._id || inf.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
