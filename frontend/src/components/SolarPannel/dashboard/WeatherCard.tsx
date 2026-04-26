import { Box, Chip, Stack, Typography } from '@mui/material'
import { FaCloudSun } from 'react-icons/fa6'
import type { SimulationTimelinePoint, WeatherSnapshot } from './types'
import { dashboardCardSx, dashboardEyebrowSx, dashboardPalette } from './styles'

type WeatherCardProps = {
  weather: WeatherSnapshot | null
  selectedSimulationPoint: SimulationTimelinePoint | null
  isLoading: boolean
}

/** Displays the weather snapshot for the selected month. */
function WeatherCard({ weather, selectedSimulationPoint, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <Box sx={dashboardCardSx}>
        <Typography sx={dashboardEyebrowSx}>
          <FaCloudSun size={10} />
          Weather
        </Typography>
        <Typography sx={{ mt: 0.85, color: dashboardPalette.muted, fontSize: '0.92rem' }}>Loading selected month weather...</Typography>
      </Box>
    )
  }

  if (!weather || !selectedSimulationPoint) {
    return (
      <Box sx={dashboardCardSx}>
        <Typography sx={dashboardEyebrowSx}>
          <FaCloudSun size={10} />
          Weather
        </Typography>
        <Typography sx={{ mt: 0.85, color: dashboardPalette.muted, fontSize: '0.92rem' }}>No monthly weather data loaded.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={dashboardCardSx}>
      <Typography sx={dashboardEyebrowSx}>
        <FaCloudSun size={10} />
        Weather
      </Typography>
      <Typography sx={{ mt: 0.55, color: dashboardPalette.text, fontSize: '0.92rem' }}>
        {selectedSimulationPoint.monthLabel} historical weather
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ mt: 0.85 }}>
        <Chip size="small" label={weather.summary} sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.1)', color: dashboardPalette.text, fontWeight: 700 }} />
        <Chip size="small" label={`${selectedSimulationPoint.totalRainfallMm} mm rain`} sx={{ borderRadius: '8px', bgcolor: 'rgba(73,200,137,0.24)', color: dashboardPalette.accent, fontWeight: 700 }} />
      </Stack>
      <Typography sx={{ mt: 0.85, color: dashboardPalette.muted, fontSize: '0.92rem' }}>
        {weather.temperatureC} degC avg • Wind {weather.windKph} kph • Humidity {selectedSimulationPoint.averageHumidityPct}%
      </Typography>
      <Typography sx={{ mt: 0.55, color: dashboardPalette.muted, fontSize: '0.86rem' }}>
        {selectedSimulationPoint.rainyDays}/{selectedSimulationPoint.observedDays} rainy days • {selectedSimulationPoint.solarRadiationKwhM2} kWh/m² solar
      </Typography>
    </Box>
  )
}

export default WeatherCard
