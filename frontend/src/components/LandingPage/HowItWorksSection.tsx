import { Box, Chip, Container, Typography } from '@mui/material'
import Reveal from './Reveal'

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
            <Typography sx={{ color: 'rgba(232,245,249,0.78)', maxWidth: '68ch', fontSize: { xs: '1.02rem', md: '1.14rem' }, lineHeight: 1.8 }}>
              We start by screening land for agricultural fit, grid access, and basic constraints, then build a clear
              planning case for councils, communities, and partners before moving into delivery with aligned scope,
              governance, and rollout priorities.
            </Typography>
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default HowItWorksSection
