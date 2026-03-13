import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading';
import InfluencerAvatar from '@/components/cards/InfluencerAvatar';
import { useAuth } from '@/app/context/AuthContext';
import { dashboardService } from '@/services';

/**
 * Trending Influencers Section
 * Displays a horizontal scrollable list of trending influencers
 */
export default function TrendingInfluencersSection( ) {
  const { getUserType } = useAuth();
  const role = (getUserType() || 'user').toLowerCase();
  const router = useRouter();
  const [trendingInfluencers, setTrendingInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingInfluencers = async () => {
      setLoading(true);
      try {
        const response = await dashboardService.getInfluencersByRole(role, {
          page: 1,
          limit: 10
        });
        const influencersData = response.data || [];

        // Format and map influencers with color coding
        const formattedInfluencers = influencersData.map((influencer, index) => ({
          id: influencer._id || influencer.id || index,
          name: influencer.name || 'Influencer',
          avatar: influencer.avatar || '/dummyAvatar.jpg',
          color: [
            'bg-pink-500', 'bg-purple-600', 'bg-blue-500', 'bg-green-500',
            'bg-yellow-500', 'bg-red-500', 'bg-indigo-600', 'bg-teal-500',
            'bg-orange-500', 'bg-cyan-500'
          ][index % 10]
        }));

        setTrendingInfluencers(formattedInfluencers);
      } catch (error) {
        console.error('Error fetching trending influencers:', error);
        // Fallback to empty array
        setTrendingInfluencers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingInfluencers();
  }, [role]);

  return (
    <div className="mb-8">
      <SectionHeading
        title="Trending Influencers"
        onViewAll={() => router.push(`/${role}/influencers`)}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array(10).fill(null).map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Horizontal Scroll of Influencers */}
      {!loading && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {trendingInfluencers.length > 0 ? (
            trendingInfluencers.map((influencer) => (
              <InfluencerAvatar
                key={influencer.id}
                name={influencer.name}
                avatar={influencer.avatar}
                bgColor={influencer.color}
                onClick={() => router.push(`/${role}/influencers/${influencer.id}`)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No trending influencers found</p>
          )}
        </div>
      )}
    </div>
  );
}
