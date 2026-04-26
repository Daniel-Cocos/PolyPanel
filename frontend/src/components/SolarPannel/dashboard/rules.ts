import type { DashboardAlert, Panel, PanelMetrics, WeatherSnapshot } from './types'

/** Creates deterministic dashboard alerts for the selected monthly simulation snapshot. */
export function deriveAlerts(
  panels: Panel[],
  metricsByPanelId: Record<string, PanelMetrics>,
  weather: WeatherSnapshot,
  acknowledgedAlertIds: string[],
  timelineKey = 'current',
) {
  const acknowledgedLookup = new Set(acknowledgedAlertIds)
  const alerts: DashboardAlert[] = []

  panels.forEach((panel) => {
    const metrics = metricsByPanelId[panel.id]
    if (!metrics) {
      return
    }

    if (metrics.tempC >= 31) {
      const id = `${panel.id}-${timelineKey}-plant-heat`
      alerts.push({
        id,
        panelId: panel.id,
        panelName: panel.name,
        kind: 'plant_heat',
        severity: 'warning',
        message: `Plant in ${panel.name} is too hot (${metrics.tempC} degC).`,
        recommendedMode: 'letting_sun_in',
        acknowledged: acknowledgedLookup.has(id),
      })
    }

    if (metrics.soilMoisturePct <= 38) {
      const id = `${panel.id}-${timelineKey}-soil-dry`
      alerts.push({
        id,
        panelId: panel.id,
        panelName: panel.name,
        kind: 'soil_dry',
        severity: 'info',
        message: `${panel.name} soil moisture is low (${metrics.soilMoisturePct}%).`,
        recommendedMode: 'flat_down',
        acknowledged: acknowledgedLookup.has(id),
      })
    }

    if (weather.rainfallChancePct >= 45 && panel.mode !== 'flat_down') {
      const id = `${panel.id}-${timelineKey}-weather-rain`
      alerts.push({
        id,
        panelId: panel.id,
        panelName: panel.name,
        kind: 'weather_rain',
        severity: 'warning',
        message: `Wet month likely (${weather.rainfallChancePct}% rainy days) - set ${panel.name} to flat_down.`,
        recommendedMode: 'flat_down',
        acknowledged: acknowledgedLookup.has(id),
      })
    }
  })

  return alerts
}
