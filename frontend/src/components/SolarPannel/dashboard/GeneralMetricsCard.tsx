import { Box, Stack, Typography } from '@mui/material'
import { FaChartSimple } from 'react-icons/fa6'
import type { GeneralMetrics } from './types'
import { dashboardCardSx, dashboardEyebrowSx, dashboardPalette } from './styles'

type GeneralMetricsCardProps = {
  metrics: GeneralMetrics
}

/** Displays high-level environmental averages for the selected month. */
function GeneralMetricsCard({ metrics }: GeneralMetricsCardProps) {
  return (
    <Box sx={dashboardCardSx}>
      <Typography sx={dashboardEyebrowSx}>
        <FaChartSimple size={10} />
        General metrics
      </Typography>
      <Stack spacing={0.6} sx={{ mt: 0.8 }}>
        <Typography sx={{ color: dashboardPalette.text, fontSize: '0.93rem' }}>Average temp: {metrics.averageTempC} degC</Typography>
        <Typography sx={{ color: dashboardPalette.text, fontSize: '0.93rem' }}>Average humidity: {metrics.averageHumidityPct}%</Typography>
        <Typography sx={{ color: dashboardPalette.text, fontSize: '0.93rem' }}>Average soil moisture: {metrics.averageSoilMoisturePct}%</Typography>
      </Stack>
    </Box>
  )
}

export default GeneralMetricsCard
