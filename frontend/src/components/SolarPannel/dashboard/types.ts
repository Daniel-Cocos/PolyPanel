export type PanelType = 'real' | 'fake'

export type PanelMode = 'flat_down' | 'sun_tracking' | 'letting_sun_in'

export type Panel = {
  id: string
  name: string
  type: PanelType
  realPanelId: string | null
  mode: PanelMode
  linkedGridCellId: string | null
}

export type PanelMetrics = {
  tempC: number
  humidityPct: number
  soilMoisturePct: number
  energyKwh: number
}

export type WeatherSnapshot = {
  summary: string
  rainfallChancePct: number
  windKph: number
  temperatureC: number
}

export type WeatherTimelinePoint = {
  monthLabel: string
  monthStartIso: string
  averageTempC: number
  averageHumidityPct: number
  averageWindKph: number
  totalRainfallMm: number
  rainyDays: number
  observedDays: number
  solarRadiationKwhM2: number
  sunshineHours: number
  summary: string
}

export type WeatherTimelineResponse = {
  generatedAtIso: string
  latitude: number
  longitude: number
  timeline: WeatherTimelinePoint[]
}

export type SimulationTimelinePoint = {
  monthLabel: string
  monthStartIso: string
  weather: WeatherSnapshot
  averageHumidityPct: number
  totalRainfallMm: number
  rainyDays: number
  observedDays: number
  solarRadiationKwhM2: number
  sunshineHours: number
  totalEnergyKwh: number
  panelMetricsById: Record<string, PanelMetrics>
  generalMetrics: GeneralMetrics
  alerts: DashboardAlert[]
  recommendedMode: PanelMode
}

export type GridCellSelection = {
  id: string
  row: number
  column: number
  latitude: number
  longitude: number
}

export type AlertKind = 'plant_heat' | 'soil_dry' | 'weather_rain'

export type AlertSeverity = 'info' | 'warning'

export type DashboardAlert = {
  id: string
  panelId: string
  panelName: string
  kind: AlertKind
  severity: AlertSeverity
  message: string
  recommendedMode: PanelMode
  acknowledged: boolean
}

export type GeneralMetrics = {
  averageTempC: number
  averageHumidityPct: number
  averageSoilMoisturePct: number
}

export type ReportPayload = {
  generatedAtIso: string
  weatherSourceGeneratedAtIso: string
  sourceCoordinates: {
    latitude: number
    longitude: number
  }
  selectedTimelineIndex: number
  selectedMonthStartIso: string
  weather: WeatherSnapshot
  generalMetrics: GeneralMetrics
  panels: Array<Panel & { metrics: PanelMetrics }>
  alerts: DashboardAlert[]
  yearlyEnergySeriesKwh: number[]
  simulationTimeline: Array<SimulationTimelinePoint & { panels: Array<Panel & { metrics: PanelMetrics }> }>
}

export type PanelActionResult = {
  ok: boolean
  message: string
}
