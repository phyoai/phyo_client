'use client'
import React, { useEffect, useState } from 'react'
import InfluencerCard from '../../components/InfluencerCard'

const InfluencerList = () => {
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true)
      try {
        const res = await fetch('https://api.phyo.ai/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'I need influencers in delhi with 10k to 100k followers in the fashion category'
          })
        })
        const data = await res.json()
        setInfluencers(data.data || [])
      } catch (err) {
        setInfluencers([])
      }
      setLoading(false)
    }
    fetchInfluencers()
  }, [])

  if (loading) return null
  if (!influencers.length) return null

  return (
    <div className="flex flex-col gap-6 my-8">
      {influencers.map((influencer) => (
        <InfluencerCard key={influencer._id} influencer={influencer} />
      ))}
    </div>
  )
}

export default InfluencerList 


