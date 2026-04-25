import { Box } from '@mui/material'
import {
  AboutMissionSection,
  BenefitsSection,
  ContactCTASection,
  FooterSection,
  HeroSection,
  HowItWorksSection,
  PlanningCommunitySection,
} from '../components/LandingPage'

/** Composes the public landing page. */
function LandingPage() {
  return (
    <Box component="main">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <PlanningCommunitySection />
      <AboutMissionSection />
      <ContactCTASection />
      <FooterSection />
    </Box>
  )
}

export default LandingPage
