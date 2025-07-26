'use client'
import React from 'react'
import Hero from './Hero'
import FeatureText from './FeatureText'
import FeatureSection from './FeatureSection'
import StatsSection from './StatsSection'
import FAQSection from './FAQSection'
import ComparisonTable from './ComparisonTable'
import CTASection from './CTASection'
import Footer from './components/Footer'
import PricingSection from './PricingSection'
import Navbar from './components/Navbar'
// import InfluencerList from './InfluencerList'


const page = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <FeatureText/>
      <FeatureSection/>
      <StatsSection/>
      {/* <PricingSection/> */}
      <FAQSection/>
      <ComparisonTable/>
      {/* <InfluencerList/> */}
      <CTASection/>
      <Footer/>
    </div>
  )
}

export default page