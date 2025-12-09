import React, { useState } from 'react'
// import { influencers } from '../../data/data'
import InfluencerCard from '../../components/InfluencerCard'
import axios from 'axios'

export default function Search() {
    const [influencers, setInfluencers] = useState([])
    const [fetchingState, setFetchingState] = useState("idle")
    const [prompt, setPrompt] = useState("")
    
    // Restore previous search on mount
    React.useEffect(() => {
        try {
            const savedResults = localStorage.getItem('home_search_results');
            const savedPrompt = localStorage.getItem('home_search_prompt');
            
            if (savedResults) {
                const parsedResults = JSON.parse(savedResults);
                if (Array.isArray(parsedResults) && parsedResults.length > 0) {
                    setInfluencers(parsedResults);
                    setFetchingState("success");
                }
            }
            
            if (savedPrompt) {
                setPrompt(savedPrompt);
            }
        } catch (err) {
            console.error('Error restoring search results:', err);
        }
    }, []);
    
    const getInfluencers = async (searchPrompt) => {
        setFetchingState("loading")
        try {
            const res = await axios({
                method: "post",
                baseURL: "https://api.phyo.ai",
                url: "/api/ask",
                data: {
                    prompt: searchPrompt
                }
            })
            if (res.data.data.length < 1) {
                setFetchingState("notFound")
                // Clear localStorage if no results
                localStorage.removeItem('home_search_results');
                localStorage.removeItem('home_search_prompt');
            } else {
                setInfluencers(res.data.data)
                // Store in localStorage for persistence
                localStorage.setItem('influencer_search_results', JSON.stringify(res.data.data))
                localStorage.setItem('home_search_results', JSON.stringify(res.data.data))
                localStorage.setItem('home_search_prompt', searchPrompt)
                setFetchingState("success")
            }
            
        } catch (error) {
            alert("Could not fetch the influencers")
            setFetchingState("error")
            console.log(error);
            // Clear localStorage on error
            localStorage.removeItem('home_search_results');
            localStorage.removeItem('home_search_prompt');
        }
    }
    return (
        <div className='relative bg-black overflow-hidden min-h-screen'>
            {/* Content container */}
            <div className='max-w-[1200px] mx-auto pt-[130px] relative z-10'>
                <Header 
                    handleSubmit={getInfluencers} 
                    fetchingState={fetchingState} 
                    prompt={prompt} 
                    setPrompt={setPrompt} 
                />
                <InfluencersList influencers={influencers} fetchingState={fetchingState} />
            </div>
            
            {/* Background div */}
            <div className='h-[400px] w-[300px] rounded-full bg-[color:var(--green)] blur-[180px] shadow-2xl absolute -right-[100px] top-[20vh]'></div>
        </div>
    )
}

const Header = ({ handleSubmit, fetchingState, prompt, setPrompt }) => {
    return (
        <div>
            <h1 className='text-[color:var(--light-green)] font-semibold text-[64px] text-center'>Ai Search</h1>
            <h2 className='text-white text-[40px] font-medium text-center'>Find top right influencer for your brand</h2>
            <div className='mt-[55px] border-2 border-[color:var(--dark-green)] flex p-2 pl-[40px] rounded-xl'>
                <input 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)} 
                    type="text" 
                    placeholder="Example: Find influencers who have followers around 50k and posts videos on Vlogs from delhi" 
                    className='outline-none bg-transparent border-none flex-grow py-2 text-white' 
                />
                <button 
                    className='bg-white px-6 py-2 rounded-md' 
                    onClick={() => handleSubmit(prompt)}
                    disabled={fetchingState === "loading"}
                >
                    {fetchingState === "loading" ? "Finding..." : "Find"}
                </button>
            </div>
        </div>
    )
}

export const InfluencersList = ({ influencers, fetchingState }) => {
    return (
        <>
            {fetchingState === "idle" ? (
                <p className='text-center mt-[150px] text-white'>Enter the prompt and hit the find button to find influencers</p>
            ) : fetchingState === "error" ? (
                <p className='text-center mt-[150px] text-white'>Something went wrong while fetching. Please try again.</p>
            ) : fetchingState === "loading" ? (
                <p className='text-center mt-[150px] text-white'>Fetching influencers. Please wait...</p>
            ) : fetchingState === "notFound" ? (
                <div className='text-center mt-[150px]'>
                    <p className='text-white text-xl font-medium'>Sorry, no influencers found for this prompt.</p>
                    <p className='text-gray-400 mt-2'>Please enter the prompt properly</p>
                </div>
            ) : (
                <div className='flex flex-col gap-[20px] mt-[150px]'>
                    {
                        influencers?.map((influencer, i) => {
                            return <InfluencerCard influencer={influencer} key={i} />
                        })
                    }
                </div>
            )}
        </>
    )
}