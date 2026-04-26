import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa6'
import type { SimulationTimelinePoint } from './types'
import { dashboardCardSx, dashboardEyebrowSx, dashboardPalette } from './styles'

type SimulationTimelineProps = {
  timeline: SimulationTimelinePoint[]
  selectedTimelineIndex: number
  isLoading: boolean
  errorMessage: string | null
  onChangeTimelineIndex: (index: number) => void
}

/** Renders a scrollable 12 month simulation timeline selector. */
function SimulationTimeline({
  timeline,
  selectedTimelineIndex,
  isLoading,
  errorMessage,
  onChangeTimelineIndex,
}: SimulationTimelineProps) {
  const selectedMonth = timeline[selectedTimelineIndex] ?? null
  const timelineRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = timelineRef.current
    const selectedItem = container?.querySelector<HTMLElement>(`[data-month-index="${selectedTimelineIndex}"]`)
    selectedItem?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedTimelineIndex])

  const canMoveBackward = selectedTimelineIndex > 0
  const canMoveForward = selectedTimelineIndex < timeline.length - 1

  return (
    <Box sx={dashboardCardSx}>
      <Typography sx={dashboardEyebrowSx}>
        <FaClock size={10} />
        Simulation timeline
      </Typography>

      {selectedMonth ? (
        <Typography sx={{ mt: 0.55, color: dashboardPalette.text, fontSize: '0.92rem' }}>
          {selectedMonth.monthLabel} simulation • {selectedMonth.weather.summary}
        </Typography>
      ) : null}

      {isLoading ? (
        <Typography sx={{ mt: 0.75, color: dashboardPalette.muted, fontSize: '0.9rem' }}>Loading the last 12 months...</Typography>
      ) : null}

      {errorMessage ? (
        <Typography sx={{ mt: 0.75, color: dashboardPalette.muted, fontSize: '0.9rem' }}>{errorMessage}</Typography>
      ) : null}

      {!isLoading && !errorMessage && timeline.length > 0 ? (
        <>
          <Stack direction="row" spacing={0.8} sx={{ mt: 0.95, alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => onChangeTimelineIndex(selectedTimelineIndex - 1)}
              disabled={!canMoveBackward}
              sx={{ border: `1px solid ${dashboardPalette.border}`, color: dashboardPalette.text }}
            >
              <FaChevronLeft size={12} />
            </IconButton>
            <Box
              ref={timelineRef}
              sx={{
                display: 'flex',
                gap: 0.8,
                overflowX: 'auto',
                pb: 0.35,
                scrollSnapType: 'x proximity',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(73, 200, 137, 0.45)', borderRadius: 999 },
              }}
            >
              {timeline.map((point, index) => {
                const isSelected = index === selectedTimelineIndex
                return (
                  <Box
                    key={point.monthStartIso}
                    component="button"
                    type="button"
                    data-month-index={index}
                    onClick={() => onChangeTimelineIndex(index)}
                    sx={{
                      minWidth: 92,
                      px: 1,
                      py: 0.85,
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? dashboardPalette.accent : dashboardPalette.border}`,
                      bgcolor: isSelected ? 'rgba(73,200,137,0.14)' : 'rgba(255,255,255,0.03)',
                      color: dashboardPalette.text,
                      textAlign: 'left',
                      cursor: 'pointer',
                      scrollSnapAlign: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{point.monthLabel}</Typography>
                    <Typography sx={{ mt: 0.2, color: dashboardPalette.muted, fontSize: '0.73rem' }}>
                      {point.weather.temperatureC} degC
                    </Typography>
                    <Typography sx={{ mt: 0.1, color: dashboardPalette.muted, fontSize: '0.73rem' }}>
                      {point.totalRainfallMm} mm rain
                    </Typography>
                  </Box>
                )
              })}
            </Box>
            <IconButton
              size="small"
              onClick={() => onChangeTimelineIndex(selectedTimelineIndex + 1)}
              disabled={!canMoveForward}
              sx={{ border: `1px solid ${dashboardPalette.border}`, color: dashboardPalette.text }}
            >
              <FaChevronRight size={12} />
            </IconButton>
          </Stack>

          <Typography sx={{ mt: 0.8, color: dashboardPalette.muted, fontSize: '0.86rem' }}>
            Scroll through the year to simulate proposed-panel conditions against real monthly weather history.
          </Typography>
        </>
      ) : null}
    </Box>
  )
}

export default SimulationTimeline
