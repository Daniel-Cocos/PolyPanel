import { useRef } from 'react'
import { Box } from '@mui/material'
import {
  BenefitsSection,
  ContactCTASection,
  FooterSection,
  HeroSection,
  HowItWorksSection,
  PlanningCommunitySection,
  PricingSection,
} from '../components/LandingPage'
import useLandingPageGsap from '../components/LandingPage/useLandingPageGsap'

/** Composes the public landing page. */
function LandingPage() {
  const mainRef = useRef<HTMLElement | null>(null)

  useLandingPageGsap(mainRef)

  return (
    <Box component="main" ref={mainRef} className="landing-page">
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <BenefitsSection />
      <PlanningCommunitySection />
      <ContactCTASection />
      <FooterSection />
    </Box>
  )
}

export default LandingPage
