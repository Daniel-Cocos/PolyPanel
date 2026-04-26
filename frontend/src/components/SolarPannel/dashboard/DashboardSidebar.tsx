import { Box, Stack } from '@mui/material'
import { useDashboardState } from './useDashboardState'
import GeneralMetricsCard from './GeneralMetricsCard'
import NotificationList from './NotificationList'
import RecentEnergyChart from './RecentEnergyChart'
import ReportButton from './ReportButton'
import SimulationTimeline from './SimulationTimeline'
import WeatherCard from './WeatherCard'
import { dashboardPalette } from './styles'

/** Renders the simulation sidebar with alerts, stats, and actions. */
function DashboardSidebar() {
  const {
    panels,
    weather,
    generalMetrics,
    selectedSimulationPoint,
    selectedTimelineIndex,
    simulationTimeline,
    isWeatherTimelineLoading,
    weatherTimelineError,
    yearlyEnergySeriesKwh,
    alerts,
    setSelectedTimelineIndex,
    setPanelMode,
    acknowledgeAlert,
    openPanelDetailsModal,
    generateReport,
  } = useDashboardState()

  const isReportDisabled = !selectedSimulationPoint || isWeatherTimelineLoading || panels.length === 0

  return (
    <Box
      sx={{
        minHeight: 0,
        overflowY: 'auto',
        p: { xs: 1.25, md: 1.5 },
        borderLeft: { xs: 0, lg: `1px solid ${dashboardPalette.border}` },
        borderTop: { xs: `1px solid ${dashboardPalette.border}`, lg: 0 },
        bgcolor: dashboardPalette.shell,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(73, 200, 137, 0.6) rgba(255,255,255,0.08)',
        animation: 'dashboardSidebarEnter 420ms ease-out both',
        '@keyframes dashboardSidebarEnter': {
          from: {
            opacity: 0,
            transform: 'translateX(10px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        '&::-webkit-scrollbar': {
          width: 10,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderRadius: 999,
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 999,
          backgroundColor: 'rgba(73, 200, 137, 0.58)',
          border: '2px solid rgba(6, 18, 26, 0.8)',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(73, 200, 137, 0.72)',
        },
      }}
    >
      <Stack
        spacing={0}
        sx={{
          '& > *': {
            animation: 'dashboardSectionFade 520ms ease-out both',
          },
          '& > *:nth-of-type(1)': { animationDelay: '40ms' },
          '& > *:nth-of-type(2)': { animationDelay: '90ms' },
          '& > *:nth-of-type(3)': { animationDelay: '140ms' },
          '& > *:nth-of-type(4)': { animationDelay: '190ms' },
          '& > *:nth-of-type(5)': { animationDelay: '240ms' },
          '& > *:nth-of-type(6)': { animationDelay: '290ms' },
          '@keyframes dashboardSectionFade': {
            from: {
              opacity: 0,
              transform: 'translateY(8px)',
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <WeatherCard
          weather={weather}
          selectedSimulationPoint={selectedSimulationPoint}
          isLoading={isWeatherTimelineLoading}
        />
        <GeneralMetricsCard metrics={generalMetrics} />
        <SimulationTimeline
          timeline={simulationTimeline}
          selectedTimelineIndex={selectedTimelineIndex}
          isLoading={isWeatherTimelineLoading}
          errorMessage={weatherTimelineError}
          onChangeTimelineIndex={setSelectedTimelineIndex}
        />
        <RecentEnergyChart
          energySeries={yearlyEnergySeriesKwh}
          labels={simulationTimeline.map((point) => point.monthLabel)}
          selectedIndex={selectedTimelineIndex}
          hasPanels={simulationTimeline.length > 0 && Object.keys(simulationTimeline[selectedTimelineIndex]?.panelMetricsById ?? {}).length > 0}
        />
        <NotificationList
          alerts={alerts.filter((alert) => !alert.acknowledged)}
          onAcknowledge={acknowledgeAlert}
          onOpenPanelDetails={openPanelDetailsModal}
          onSetPanelMode={setPanelMode}
        />
        <ReportButton onGenerateReport={generateReport} disabled={isReportDisabled} />
      </Stack>
    </Box>
  )
}

export default DashboardSidebar
