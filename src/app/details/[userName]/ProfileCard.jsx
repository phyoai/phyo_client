import { Heart } from 'lucide-react'
import React from 'react'
// import { useNavigate, Link } from 'react-router-dom'

const ProfileCard = ({ creator }) => {
    
    function loadImage(url){
        
        let p = url?.split("/") || [""];
        let t = '';
        for(let i=0;i<p.length;i++){
          if(i==2){
            t += p[i].replaceAll('-','--').replaceAll('.','-')+atob('LnRyYW5zbGF0ZS5nb29n')+'/';
          }else{
            if(i != p.length-1){
              t += p[i]+'/';
            }else{
              t += p[i];
            }
          }
        }
        return encodeURI(t);
      }

    return (
        <div>
            <div className='flex justify-between items-start'>
                {/* <div className='flex flex-col gap-[20px]'> */}
                <img
                    src={loadImage(creator?.image)}
                    alt="profile"
                    height={150}
                    width={150}
                    className='rounded-full border-4 border-white sm:w-[150px] w-[100px] aspect-square'
                />                {/* <p className='bg-[color:var(--green)] px-[10px] py-[5px] font-bold text-[20px] text-[color:var(--sea-green)] cursor-pointer rounded-md'>{(creator?.qualityScore * 100).toFixed(0)} - Excellent</p> */}
                {/* </div> */}
                <div className=''>
                    <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{creator?.name || "Not available"}</p>
                    <p>{creator.categoryInstagram} - {creator.categoryYouTube}</p>
                    <span className='sm:flex gap-[60px] mt-[30px] hidden'>
                        <span>
                            <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{new Intl.NumberFormat("en-US", { notation: 'compact', compactDisplay: 'short' }).format(creator?.userCount)}</p>
                            <p>Followers</p>
                        </span>
                        <span>
                            <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{new Intl.NumberFormat("en-US", { notation: 'compact', compactDisplay: 'short' }).format(creator?.instagramData?.avgLikes || 0)}</p>
                            <p>Average Likes</p>
                        </span>
                        <span>
                            <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{((creator?.instagramData?.avgEngagement || 0) * 100).toFixed(2)}</p>
                            <p>Engagement Rate</p>
                        </span>
                    </span>
                </div>
                <div className='flex items-start gap-4'>
                    {/* <button className='border-2 border-[color:var(--green)] px-[20px] py-[5px] rounded-xl h-[50px]'><Link to={creator?.url} target='_blank' >View on instagram</Link></button> */}
                    <button className='border-2 border-[color:var(--green)] px-[20px] py-[5px] rounded-xl h-[50px]'><Heart size={20} color='#169B00' /></button>
                </div>
            </div>
            <span className='flex gap-[60px] mt-[30px] sm:hidden'>
                <span>
                    <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{new Intl.NumberFormat("en-US", { notation: 'compact', compactDisplay: 'short' }).format(creator?.userCount)}</p>
                    <p>Followers</p>
                </span>
                <span>
                    <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{new Intl.NumberFormat("en-US", { notation: 'compact', compactDisplay: 'short' }).format(creator?.instagramData?.avgLikes || 0)}</p>
                    <p>Average Likes</p>
                </span>
                <span>
                    <p className='font-bold text-[20px] text-[color:var(--dark-green)]'>{((creator.instagramData.avgEngagement || 0) * 100).toFixed(2)}</p>
                    <p>Engagement Rate</p>
                </span>
            </span>
        </div>
    )
}

export default ProfileCard