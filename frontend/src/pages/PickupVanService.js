// src/App.js

import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import PricingSection from '../components/PricingSection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'
import '../styles/landing.css'

const PickupVanService = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <br />
      <Footer />
    </div>
  )
}

export default PickupVanService
