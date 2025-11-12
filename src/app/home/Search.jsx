import React, { useState } from 'react'
// import { influencers } from '../../data/data'
import InfluencerCard from '../../components/InfluencerCard'
import axios from 'axios'

const index = () => {
    const [influencers, setInfluencers] = useState([])
    const [fetchingState, setFetchingState] = useState("idle")
    
    const getInfluencers = async (prompt) => {
        setFetchingState("loading")
        try {
            const res = await axios({
                method: "post",
                baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.phyo.ai/api",
                url: "/ask",
                data: {
                    prompt
                }
            })
            if (res.data.data.length < 1) {
                setFetchingState("notFound")
            } else {
                setInfluencers(res.data.data)
                setFetchingState("success")
            }
            
        } catch (error) {
            alert("Could not fetch the influencers")
            setFetchingState("error")
            console.log(error);
        }
    }
    return (
        <div className='relative bg-black overflow-hidden min-h-screen'>
            {/* Content container */}
            <div className='max-w-[1200px] mx-auto pt-[130px] relative z-10'>
                <Header handleSubmit={getInfluencers} fetchingState={fetchingState} />
                <InfluencersList influencers={influencers} fetchingState={fetchingState} />
            </div>
            
            {/* Background div */}
            <div className='h-[400px] w-[300px] rounded-full bg-[color:var(--green)] blur-[180px] shadow-2xl absolute -right-[100px] top-[20vh]'></div>
        </div>
    )
}

const Header = ({ handleSubmit, fetchingState }) => {
    const [prompt, setPrompt] = useState("")
    return (
        <div>
            <h1 className='text-[color:var(--light-green)] font-semibold text-[64px] text-center'>Ai Search</h1>
            <h2 className='text-white text-[40px] font-medium text-center'>Find top right influencer for your brand</h2>
            <div className='mt-[55px] border-2 border-[color:var(--dark-green)] flex p-2 pl-[40px] rounded-xl'>
                <input onChange={(e) => setPrompt(e.target.value)} type="text" placeholder="Example: Find influencers who have followers around 50k and posts videos on Vlogs from delhi" className='outline-none bg-transparent border-none flex-grow py-2 text-white' />
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

export default index