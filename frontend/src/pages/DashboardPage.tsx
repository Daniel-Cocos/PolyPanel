import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { SolarPannelMap } from '../components/SolarPannel'

/** Renders the full-page solar planning workspace. */
function DashboardPage() {
  return (
    <Box component="main" sx={{ height: '100dvh', overflow: 'hidden', display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', bgcolor: '#eef4f1' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 2.5 },
          borderBottom: '1px solid rgba(20, 80, 109, 0.12)',
          bgcolor: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: '#2f5a53' }}>
            PolyPanel
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, color: '#08241f' }}>
            Solar Layout Planner
          </Typography>
          <Typography sx={{ mt: 0.5, maxWidth: '62ch', color: 'rgba(8,36,31,0.72)' }}>
            Select a farm, lock the workspace to its boundary, and plan panel placement inside that area.
          </Typography>
        </Box>

        <Button component={RouterLink} to="/" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' }, borderColor: 'rgba(20, 80, 109, 0.18)', color: '#14506d' }}>
          Back to landing page
        </Button>
      </Stack>

      <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
        <SolarPannelMap />
      </Box>
    </Box>
  )
}

export default DashboardPage
