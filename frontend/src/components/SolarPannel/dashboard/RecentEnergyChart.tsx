import { Box, Typography } from '@mui/material'
import { FaBolt } from 'react-icons/fa6'
import { dashboardCardSx, dashboardEyebrowSx, dashboardPalette } from './styles'

type RecentEnergyChartProps = {
  energySeries: number[]
  labels: string[]
  selectedIndex: number
  hasPanels: boolean
}

/** Renders a compact SVG chart for yearly simulated energy sourcing. */
function RecentEnergyChart({ energySeries, labels, selectedIndex, hasPanels }: RecentEnergyChartProps) {
  const chartWidth = 304
  const chartHeight = 120
  const maxEnergy = Math.max(...energySeries, 1)

  const points = energySeries
    .map((value, index) => {
      const x = (index / Math.max(energySeries.length - 1, 1)) * chartWidth
      const y = chartHeight - (value / maxEnergy) * chartHeight
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const selectedValue = energySeries[selectedIndex] ?? 0
  const selectedX = (selectedIndex / Math.max(energySeries.length - 1, 1)) * chartWidth
  const selectedY = chartHeight - (selectedValue / maxEnergy) * chartHeight
  const selectedLabel = labels[selectedIndex] ?? 'Selected month'

  return (
    <Box sx={dashboardCardSx}>
      <Typography sx={dashboardEyebrowSx}>
        <FaBolt size={10} />
        Simulated energy sourced
      </Typography>
      {hasPanels ? (
        <>
          <Box sx={{ mt: 1, borderRadius: '3px', bgcolor: 'rgba(255,255,255,0.05)', p: 0.75 }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="120" role="img" aria-label="Yearly energy sourced chart">
              <polyline points={points} fill="none" stroke={dashboardPalette.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={selectedX} cy={selectedY} r="4" fill="#0d2633" stroke={dashboardPalette.accent} strokeWidth="2" />
            </svg>
          </Box>
          <Typography sx={{ mt: 0.65, color: dashboardPalette.muted, fontSize: '0.9rem' }}>
            {selectedLabel}: {selectedValue.toFixed(2)} kWh
          </Typography>
        </>
      ) : (
        <Typography sx={{ mt: 1, color: dashboardPalette.muted, fontSize: '0.9rem' }}>
          Add a proposed or real panel to begin simulating energy output for the selected month.
        </Typography>
      )}
    </Box>
  )
}

export default RecentEnergyChart
