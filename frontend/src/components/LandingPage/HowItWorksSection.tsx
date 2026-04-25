import { Box, Chip, Container, Typography } from '@mui/material'
import { FiFileText, FiSearch, FiSun } from 'react-icons/fi'
import Reveal from './Reveal'

const steps = [
  {
    title: '1. Screen land quickly',
    copy: 'Check agricultural fit, grid access, and basic constraints.',
    icon: FiSearch,
  },
  {
    title: '2. Build the planning case',
    copy: 'Frame one clear story for councils, communities, and partners.',
    icon: FiFileText,
  },
  {
    title: '3. Move into delivery',
    copy: 'Align scope, governance, and rollout priorities.',
    icon: FiSun,
  },
]

/** Explains the stacked solar model in three steps. */
function HowItWorksSection() {
  return (
    <Box component="section" id="how-it-works" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#08151d', color: 'common.white' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal sx={{ display: 'grid', gap: 4 }}>
          <Box sx={{ maxWidth: 820, display: 'grid', gap: 1.8 }}>
            <Chip
              label="How it works"
              sx={{
                justifySelf: 'start',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.16)',
                bgcolor: 'rgba(255,255,255,0.08)',
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1.01, color: 'common.white' }}>
              Three steps. One deployable model.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.78)', maxWidth: '54ch' }}>
              Built for energy teams working with farmers.
            </Typography>
          </Box>

          <Box component="ol" data-gsap-card-group sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <Box component="li" key={step.title} sx={{ listStyle: 'none' }}>
                  <Box
                    data-gsap-card
                    sx={{
                      pt: 1.8,
                      px: { xs: 2, md: 2.2 },
                      pb: { xs: 2.2, md: 2.4 },
                      borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      bgcolor: 'rgba(7,18,27,0.72)',
                      backdropFilter: 'blur(14px)',
                      boxShadow: '0 28px 60px rgba(1, 9, 14, 0.22)',
                    }}
                  >
                    <Box data-gsap-divider sx={{ height: 2, bgcolor: 'secondary.main', mb: 1.8, borderRadius: '999px' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                      <Icon size={16} color="currentColor" />
                      <Typography variant="h6" sx={{ fontSize: '1.2rem', color: 'common.white' }}>
                        {step.title}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(232,245,249,0.78)' }}>{step.copy}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default HowItWorksSection
