// Prevent prerendering for all influencer routes that use context hooks
export const dynamic = 'force-dynamic';

export default function InfluencerLayout({ children }) {
  return children;
}
