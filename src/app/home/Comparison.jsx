"use client"
import React from 'react'

const Comparison = () => {
    const data = {
        "Turnaround Time": {
            phyo: "30-minute campaign setup and execution",
            other: "1–2 days for campaign completion",
        },
        "Data Sources": {
            phyo: "Real-time data via Meta & Google partnerships",
            other: "Outdated or estimated data",
        },
        "Influencer Analytics": {
            phyo: "In-depth analytics (ROI, virality, content affinity)",
            other: "Basic follower/engagement metrics",
        },
        "Content Affinity Insights": {
            phyo: "Analyzes audience preferences for content types",
            other: "Not Available",
        },
        "AI Matchmaking": {
            phyo: "AI-driven recommendations based on brands",
            other: "Manual searches or basic filters",
        },
        "Influencer Database": {
            phyo: "300,000+ vetted influencers globally",
            other: "Limited creators (under 50k)",
        },
        "Language Support": {
            phyo: "Supports 95+ languages for global campaigns",
            other: "Limited to major languages",
        },
        "Performance Estimation": {
            phyo: "Predicts campaign success with AI",
            other: "No predictive tools",
        },
        "Campaign Reports": {
            phyo: "Detailed reports (ROI, audience sentiment, platform-wise sharing)",
            other: "Basic engagement summaries",
        },
        "Global Search": {
            phyo: "Influencers across 15+ countries including India, the United States, the United Kingdom, Australia, Germany, Indonesia, Vietnam, Thailand, Singapore, the Philippines, Malaysia, Canada, South Korea, Japan, and Italy.",
            other: "Limited to local markets",
        },
    };
    
  return (
    <section className='max-w-[1400px] mx-auto px-[10px] md:px-[100px] my-[50px]'>
       <h1 className='font-bold text-[35px] sm:text-[45px] text-center mb-[50px]'>Phyo Vs Competitors</h1> 
       <div className="overflow-x-auto">
           <table className='border w-full bg-gradient-to-b from-[color:var(--dark-green)] to-[color:var(--green)] table-fixed shadow-lg'>
            <thead>
                <tr className='[&>*:nth-child(1)]:bg-white [&>*:nth-child(2)]:bg-white text-center'>
                    <th className='border py-3 text-[color:var(--dark-green)]'>Feature</th>
                    <th className='border py-3 text-red-500'>Other Platforms</th>
                    <th className='border py-3 text-white'>Phyo</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).map((ele)=> {
                    return <tr key={ele} className='[&>*:nth-child(1)]:bg-white [&>*:nth-child(2)]:bg-white text-center border'>
                        <td className='border px-4 py-2'>{ele}</td>
                        <td className='border px-4 py-2'>{data[ele].other}</td>
                        <td className='border text-white px-4 py-2'>{data[ele].phyo}</td>
                    </tr>
                })}
            </tbody>
           </table>
       </div>
    </section>
  )
}

export default Comparison;
