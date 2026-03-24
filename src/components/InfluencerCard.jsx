'use client'
import { ChartColumnIncreasing, Eye, Heart, Instagram, ThumbsUp, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const InfluencerCard = ({ influencer }) => {
    const router = useRouter()
    
    function loadImage(url) {
        if (!url) return '';
        
        let p = url?.split("/") || [""];
        let t = '';
        for (let i = 0; i < p.length; i++) {
            if (i == 2) {
                t += p[i].replaceAll('-', '--').replaceAll('.', '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
            } else {
                if (i != p.length - 1) {
                    t += p[i] + '/';
                } else {
                    t += p[i];
                }
            }
        }
        return encodeURI(t);
    }
    
    // Handle click to navigate to details page
    const handleCardClick = (e) => {
        e.stopPropagation();
        // Get username from either the new API format or old format
        const username = influencer?.username || influencer?.user_name;
        console.log('Card clicked! Username:', username);
        console.log('Full influencer data:', influencer);
        if (username) {
            console.log('Navigating to:', `/influencer-details/${username}`);
            router.push(`/influencer-details/${username}`);
        } else {
            console.error('No username found in influencer data');
        }
    };
    
    // Support both new API format (from BrightScraper) and old format
    const displayName = influencer?.profile_name || influencer?.name;
    const profileImage = influencer?.profile_pic_url || influencer?.image;
    const displayUsername = influencer?.username || influencer?.user_name;
    
    // New API format data
    const followers = influencer?.followers;
    const engagement = influencer?.avg_engagement;
    const postsCount = influencer?.posts_count;
    const isVerified = influencer?.is_verified;
    
    // Old format data
    const totalFollowers = 
        influencer?.instagramData?.followers && influencer?.youtubeData?.followers ? 
        influencer.instagramData.followers + influencer.youtubeData.followers : 
        null;
    
    return (
        <div 
            className='bg-white rounded-lg flex justify-between pb-2 overflow-hidden shadow-md sm:mx-96 cursor-pointer hover:shadow-xl transition-shadow duration-300 relative z-10' 
            onClick={handleCardClick}
            onMouseEnter={() => console.log('Mouse entered card')}
            style={{ cursor: 'pointer', userSelect: 'none' }}
        >
            {profileImage && (
                <img 
                    src={loadImage(profileImage)} 
                    alt="profile" 
                    width={50} 
                    height={50} 
                    className='w-72 aspect-square rounded-full relative -top-12 -left-12 object-cover' 
                />
            )}
            <div className='mr-auto flex flex-col gap-4 self-center ml-12'>
                {displayName && (
                    <div>
                        <p className='font-medium text-2xl relative -left-8 flex items-center gap-2'>
                            {displayName}
                            {isVerified && <span className='text-blue-500'>✓</span>}
                        </p>
                        {displayUsername && (
                            <p className='text-[color:var(--green)] font-medium relative -left-8'>@{displayUsername}</p>
                        )}
                    </div>
                )}
                
                {/* New API format - Show followers and engagement */}
                {followers && (
                    <div className='flex items-center gap-4'>
                        <p className='flex items-center gap-2'>
                            <Instagram size={18} className='text-[color:var(--green)]' />
                            <span className='font-semibold'>{followers.toLocaleString()}</span> followers
                        </p>
                        {postsCount && (
                            <p className='text-gray-600'>{postsCount} posts</p>
                        )}
                    </div>
                )}
                
                {engagement && (
                    <p className='flex items-center gap-2 bg-[color:var(--sea-green)] px-3 py-1 rounded-md w-fit'>
                        <ThumbsUp size={18} className='text-[color:var(--dark-green)]' />
                        <span className='font-semibold text-[color:var(--dark-green)]'>{engagement.toFixed(2)}%</span>
                        <span className='text-sm text-[color:var(--dark-green)]'>engagement</span>
                    </p>
                )}
                
                {/* Old format data (for backward compatibility) */}
                {(influencer?.categoryYouTube || influencer?.categoryInstagram) && (
                    <span className='flex items-center gap-1.5'>
                        <p className='mr-2.5'>Type</p>
                        {influencer?.categoryYouTube && (
                            <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)] text-sm'>
                                {influencer.categoryYouTube}
                            </p>
                        )}
                        {influencer?.categoryInstagram && (
                            <p className='p-1 text-[color:var(--dark-green)] border-2 border-[color:var(--dark-green)] text-sm'>
                                {influencer.categoryInstagram}
                            </p>
                        )}
                    </span>
                )}
                
                {totalFollowers !== null && !followers && (
                    <p>Total Followers <span className='font-semibold'>{totalFollowers.toLocaleString()}</span></p>
                )}
                
                {(influencer?.youtubeData?.followers || influencer?.instagramData?.followers) && !followers && (
                    <>
                        <p>Followers</p>
                        <span className='flex gap-4'>
                            {influencer?.youtubeData?.followers !== null && influencer?.youtubeData?.followers !== undefined && (
                                <p className='flex gap-2 bg-[color:var(--dark-green)] px-4 py-2 rounded-md text-white text-sm'>
                                    <Youtube size={18} />
                                    {influencer.youtubeData.followers.toLocaleString()}
                                </p>
                            )}
                            {influencer?.instagramData?.followers !== null && influencer?.instagramData?.followers !== undefined && (
                                <p className='flex gap-2 bg-[color:var(--dark-green)] px-4 py-2 rounded-md text-white text-sm'>
                                    <Instagram size={18} />
                                    {influencer.instagramData.followers.toLocaleString()}
                                </p>
                            )}
                        </span>
                    </>
                )}
            </div>
        </div>
    )
}

export default InfluencerCard
