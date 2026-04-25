import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { FiActivity, FiTrendingUp, FiZap } from 'react-icons/fi'
import Reveal from './Reveal'

const problemStats = [
  {
    value: '70GW',
    label: 'solar needed by 2035',
    detail: 'The UK is currently at 22GW.',
    icon: FiTrendingUp,
  },
  {
    value: '£38k',
    label: 'annual farm energy bill',
    detail: 'Many growers are carrying that cost today.',
    icon: FiZap,
  },
  {
    value: '4,000+',
    label: 'hectares of polytunnels',
    detail: 'Existing covered land generating nothing.',
    icon: FiActivity,
  },
] as const

/** Frames the market problem in the same visual language as the rest of the page. */
function BenefitsSection() {
  return (
    <Box component="section" id="benefits" sx={{ py: { xs: 8, md: 14 }, bgcolor: '#08151d', color: 'common.white' }}>
      <Container maxWidth={false} sx={{ width: { xs: 'min(1200px, calc(100% - 24px))', sm: 'min(1200px, calc(100% - 32px))' } }}>
        <Reveal sx={{ display: 'grid', gap: { xs: 3.2, md: 5 } }}>
          <Box sx={{ display: 'grid', gap: 2, maxWidth: 860 }}>
            <Chip
              label="Problem"
              sx={{
                justifySelf: 'start',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.16)',
                bgcolor: 'rgba(255,255,255,0.08)',
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '1.85rem', md: '3.2rem' }, lineHeight: 1.03, maxWidth: { xs: '13ch', md: '20ch' } }}>
              The need for solar is obvious. The route through farmland is not.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.78)', maxWidth: { xs: '34ch', md: '58ch' }, lineHeight: { xs: 1.6, md: 1.7 } }}>
              The UK needs much more solar, but farmland remains difficult to unlock. Planning resistance, high on-farm
              energy costs, and underused polytunnel infrastructure are all part of the same problem.
            </Typography>
          </Box>

          <Stack
            spacing={{ xs: 2.2, md: 0 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: { xs: 1.6, md: 2.4 },
            }}
          >
            {problemStats.map((stat) => {
              const StatIcon = stat.icon

              return (
                <Paper
                  key={stat.label}
                  variant="outlined"
                  sx={{
                    p: { xs: 2.3, md: 2.6 },
                    borderRadius: '3px',
                    borderColor: 'rgba(255,255,255,0.14)',
                    bgcolor: 'rgba(7,18,27,0.42)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Stack direction="row" spacing={0.9} sx={{ alignItems: 'center', mb: 1.2 }}>
                    <Box sx={{ color: 'secondary.main', display: 'inline-flex' }}>
                      <StatIcon size={16} />
                    </Box>
                    <Typography sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', fontWeight: 700 }}>
                      Market pressure
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: { xs: '2rem', md: '2.3rem' }, lineHeight: 1, fontWeight: 700, color: 'common.white', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'common.white', mb: 0.8 }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ color: 'rgba(232,245,249,0.76)', lineHeight: 1.5 }}>{stat.detail}</Typography>
                </Paper>
              )
            })}
          </Stack>

        </Reveal>
      </Container>
    </Box>
  )
}

export default BenefitsSection
