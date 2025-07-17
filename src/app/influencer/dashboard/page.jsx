import React from 'react'
import InfluencerBanner from './InfluencerBanner'
import Overview from './Overview'
import AudienceSection from './AudienceSection'

const page = () => {
  return (
    <div>
        <InfluencerBanner />
        <Overview/>
        <AudienceSection/>
    </div>
  )
}

export default page


