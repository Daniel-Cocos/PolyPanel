import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { SolarPannelMap } from '../components/SolarPannel'

const dashboardCards = [
  {
    label: 'Projects',
    value: '03',
    description: 'Active dual land-use assessments now tracked in this account.',
  },
  {
    label: 'Planning Status',
    value: 'On track',
    description: 'Next council touchpoint due in 6 days with community briefing prep.',
  },
  {
    label: 'Next Action',
    value: 'Upload site pack',
    description: 'Add the latest grid and crop-layout files to continue the workflow.',
  },
]

/** Renders a starter dashboard route for internal workflows. */
function DashboardPage() {
  return (
    <Box component="main" sx={{ minHeight: '100dvh', bgcolor: '#edf3f2', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ display: 'grid', gap: { xs: 2, md: 3.2 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: '#2f5a53' }}>
              PolyPanel
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.6, color: '#08241f', fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}>
              Dashboard
            </Typography>
            <Typography sx={{ mt: 0.6, maxWidth: '56ch', color: 'rgba(8,36,31,0.76)' }}>
              This is a new starter dashboard route. We can now wire project metrics, planning milestones, and farmer outreach
              tasks here.
            </Typography>
          </Box>

          <Button component={RouterLink} to="/" variant="contained" sx={{ width: { xs: '100%', sm: 'auto' }, bgcolor: '#1f705f', '&:hover': { bgcolor: '#17584b' } }}>
            Back to landing page
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 1.6,
          }}
        >
          {dashboardCards.map((card) => (
            <Box
              key={card.label}
              sx={{
                p: { xs: 2, md: 2.4 },
                border: '1px solid rgba(24, 74, 66, 0.2)',
                borderRadius: '8px',
                bgcolor: 'rgba(255,255,255,0.88)',
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#3b6d64' }}>
                {card.label}
              </Typography>
              <Typography sx={{ mt: 0.8, fontSize: { xs: '1.3rem', md: '1.6rem' }, fontWeight: 700, color: '#08241f' }}>
                {card.value}
              </Typography>
              <Typography sx={{ mt: 0.8, color: 'rgba(8,36,31,0.74)' }}>{card.description}</Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            p: { xs: 2, md: 2.4 },
            border: '1px solid rgba(24, 74, 66, 0.2)',
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.9)',
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#3b6d64' }}>
            Solar Layout Planner
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.8, color: '#08241f' }}>
            Interactive panel placement
          </Typography>
          <Typography sx={{ mt: 0.8, mb: 2, maxWidth: '70ch', color: 'rgba(8,36,31,0.74)' }}>
            Use the satellite map to place, inspect, and adjust proposed panel positions without affecting the rest of the dashboard.
          </Typography>
          <SolarPannelMap />
        </Box>
      </Container>
    </Box>
  )
}

export default DashboardPage
