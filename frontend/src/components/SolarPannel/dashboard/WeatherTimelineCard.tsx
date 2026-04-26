import { Box, Chip, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FaCloudRain } from 'react-icons/fa6'
import { dashboardCardSx, dashboardEyebrowSx, dashboardPalette } from './styles'
import { useDashboardState } from './useDashboardState'
import { fetchWeatherTimeline } from './weatherTimelineApi'
import type { WeatherTimelinePoint } from './types'

const chartWidth = 284
const chartHeight = 92

/** Builds normalized chart coordinates for the monthly temperature trend. */
function getChartPoints(timeline: WeatherTimelinePoint[]) {
  const temperatures = timeline.map((point) => point.averageTempC)
  const minTemperature = Math.min(...temperatures)
  const maxTemperature = Math.max(...temperatures)
  const range = Math.max(maxTemperature - minTemperature, 1)

  return timeline
    .map((point, index) => {
      const x = (index / Math.max(timeline.length - 1, 1)) * chartWidth
      const y = chartHeight - ((point.averageTempC - minTemperature) / range) * chartHeight
      return `${x},${y}`
    })
    .join(' ')
}

/** Renders the backend-powered 12 month weather history for the dashboard. */
function WeatherTimelineCard() {
  const { selectedGridCell } = useDashboardState()
  const [timeline, setTimeline] = useState<WeatherTimelinePoint[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTimeline() {
      try {
        setErrorMessage(null)
        const response = await fetchWeatherTimeline({
          latitude: selectedGridCell?.latitude,
          longitude: selectedGridCell?.longitude,
          signal: controller.signal,
        })
        setTimeline(response.timeline)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        console.error(error)
        setErrorMessage('Weather timeline unavailable.')
      }
    }

    void loadTimeline()
    return () => controller.abort()
  }, [selectedGridCell?.latitude, selectedGridCell?.longitude])

  const latestPoint = timeline.at(-1) ?? null

  return (
    <Box sx={dashboardCardSx}>
      <Typography sx={dashboardEyebrowSx}>
        <FaCloudRain size={10} />
        Yearly weather
      </Typography>

      {errorMessage ? (
        <Typography sx={{ mt: 0.9, color: dashboardPalette.muted, fontSize: '0.9rem' }}>{errorMessage}</Typography>
      ) : null}

      {!errorMessage && !latestPoint ? (
        <Typography sx={{ mt: 0.9, color: dashboardPalette.muted, fontSize: '0.9rem' }}>Loading monthly history...</Typography>
      ) : null}

      {latestPoint ? (
        <>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.85, flexWrap: 'wrap' }}>
            <Chip size="small" label={latestPoint.summary} sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.1)', color: dashboardPalette.text, fontWeight: 700 }} />
            <Chip size="small" label={`${latestPoint.totalRainfallMm} mm rain`} sx={{ borderRadius: '8px', bgcolor: 'rgba(73,200,137,0.24)', color: dashboardPalette.accent, fontWeight: 700 }} />
          </Stack>

          <Typography sx={{ mt: 0.85, color: dashboardPalette.muted, fontSize: '0.92rem' }}>
            Latest month: {latestPoint.averageTempC} degC avg • Wind {latestPoint.averageWindKph} kph • Humidity {latestPoint.averageHumidityPct}%
          </Typography>

          <Box sx={{ mt: 1.2, border: `1px solid ${dashboardPalette.border}`, borderRadius: '10px', p: 1, bgcolor: 'rgba(255,255,255,0.03)' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="92" role="img" aria-label="Monthly average temperature for the last year">
              <polyline points={getChartPoints(timeline)} fill="none" stroke={dashboardPalette.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <Stack direction="row" sx={{ mt: 0.4, gap: 0.4, justifyContent: 'space-between' }}>
              {timeline.map((point) => (
                <Typography key={point.monthStartIso} sx={{ color: dashboardPalette.muted, fontSize: '0.67rem' }}>
                  {point.monthLabel}
                </Typography>
              ))}
            </Stack>
          </Box>
        </>
      ) : null}
    </Box>
  )
}

export default WeatherTimelineCard
