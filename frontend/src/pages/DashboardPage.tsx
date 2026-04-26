import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { FaArrowLeftLong, FaChartLine, FaSolarPanel } from 'react-icons/fa6'
import { Link as RouterLink } from 'react-router-dom'
import { SolarPannelMap } from '../components/SolarPannel'
import DashboardSidebar from '../components/SolarPannel/dashboard/DashboardSidebar'
import { DashboardProvider } from '../components/SolarPannel/dashboard/context'
import { dashboardPalette } from '../components/SolarPannel/dashboard/styles'

/** Renders the full-page solar planning workspace. */
function DashboardPage() {
  return (
    <Box
      component="main"
      sx={{
        height: '100dvh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        bgcolor: dashboardPalette.shell,
      }}
    >
      <Stack
        direction="row"
        spacing={1.1}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 1.25, md: 1.8 },
          py: { xs: 1, md: 1.15 },
          borderBottom: `1px solid ${dashboardPalette.border}`,
          bgcolor: dashboardPalette.panelSoft,
          backdropFilter: 'blur(14px)',
        }}
      >
        <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center', minWidth: 0 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '3px',
              display: 'grid',
              placeItems: 'center',
              color: dashboardPalette.text,
              border: `1px solid ${dashboardPalette.border}`,
              bgcolor: 'rgba(255,255,255,0.04)',
              flexShrink: 0,
            }}
          >
            <FaSolarPanel size={14} />
          </Box>

          <Stack spacing={0.2} sx={{ minWidth: 0 }}>
            <Typography sx={{ color: dashboardPalette.text, fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Solar Layout Planner
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Chip label="PolyPanel" size="small" sx={{ height: 20, bgcolor: 'rgba(73,200,137,0.2)', color: dashboardPalette.accent, fontWeight: 700, '& .MuiChip-label': { px: 0.8 } }} />
              <Chip
                icon={<FaChartLine size={10} />}
                label="Live simulation"
                size="small"
                sx={{
                  height: 20,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color: dashboardPalette.muted,
                  '& .MuiChip-icon': { color: dashboardPalette.accent, ml: 0.7 },
                  '& .MuiChip-label': { px: 0.7 },
                }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          startIcon={<FaArrowLeftLong size={12} />}
          sx={{
            minHeight: 34,
            px: { xs: 0.9, md: 1.2 },
            borderColor: dashboardPalette.border,
            color: dashboardPalette.text,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            '&:hover': { borderColor: 'rgba(255,255,255,0.36)', bgcolor: 'rgba(255,255,255,0.04)' },
          }}
        >
          Landing page
        </Button>
      </Stack>

      <DashboardProvider>
        <Box
          sx={{
            minHeight: 0,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
            gridTemplateRows: { xs: 'minmax(0, 1fr) auto', lg: 'minmax(0, 1fr)' },
          }}
        >
          <SolarPannelMap />
          <DashboardSidebar />
        </Box>
      </DashboardProvider>
    </Box>
  )
}

export default DashboardPage
