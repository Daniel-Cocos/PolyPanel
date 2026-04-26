import type { ReportPayload } from './types'

/** Downloads a browser file from plain text content. */
function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const objectUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(objectUrl)
}

/** Converts the yearly simulation timeline into a CSV export. */
function buildSimulationReportCsv(reportPayload: ReportPayload) {
  const header = [
    'month',
    'summary',
    'avg_temp_c',
    'avg_humidity_pct',
    'rainfall_mm',
    'rainy_days',
    'solar_radiation_kwh_m2',
    'sunshine_hours',
    'total_energy_kwh',
    'recommended_mode',
    'alert_count',
    'fake_panel_count',
    'real_panel_count',
  ]

  const rows = reportPayload.simulationTimeline.map((point) => [
    point.monthStartIso,
    point.weather.summary,
    point.weather.temperatureC,
    point.averageHumidityPct,
    point.totalRainfallMm,
    point.rainyDays,
    point.solarRadiationKwhM2,
    point.sunshineHours,
    point.totalEnergyKwh,
    point.recommendedMode,
    point.alerts.length,
    point.panels.filter((panel) => panel.type === 'fake').length,
    point.panels.filter((panel) => panel.type === 'real').length,
  ])

  return [header, ...rows].map((row) => row.join(',')).join('\n')
}

/** Downloads the current simulation report as JSON and CSV. */
export function downloadSimulationReport(reportPayload: ReportPayload) {
  if (typeof window === 'undefined') {
    return
  }

  const fileDate = new Date().toISOString().slice(0, 10)

  downloadFile(JSON.stringify(reportPayload, null, 2), `simulation-report-${fileDate}.json`, 'application/json')
  downloadFile(buildSimulationReportCsv(reportPayload), `simulation-report-${fileDate}.csv`, 'text/csv;charset=utf-8')
}
