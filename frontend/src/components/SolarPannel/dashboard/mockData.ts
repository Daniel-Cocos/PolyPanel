import type { Panel, PanelMetrics, WeatherSnapshot } from './types'

const hourlyTemperatureDelta = [
  -3.1, -3.6, -4.0, -4.1, -3.4, -2.2, -0.5, 1.2, 3.3, 5.0, 6.2, 7.0, 7.6, 7.2, 6.1, 4.8, 3.2, 1.7, 0.5, -0.6, -1.5, -2.1, -2.6, -2.8,
]

const hourlyHumidityDelta = [
  6.0, 6.8, 7.5, 7.9, 7.1, 5.3, 2.8, 0.4, -2.1, -4.0, -5.2, -6.3, -7.0, -6.7, -5.3, -3.4, -1.2, 0.8, 2.4, 3.8, 4.9, 5.5, 5.9, 6.2,
]

const hourlySoilDelta = [
  1.6, 1.4, 1.2, 1.0, 0.8, 0.5, 0.1, -0.4, -1.0, -1.5, -2.0, -2.4, -2.8, -3.0, -3.2, -3.0, -2.6, -2.1, -1.5, -0.9, -0.3, 0.2, 0.7, 1.1,
]

const hourlyEnergyFactor = [
  0.0, 0.0, 0.0, 0.0, 0.03, 0.12, 0.31, 0.53, 0.71, 0.86, 0.97, 1.03, 1.08, 1.05, 0.96, 0.82, 0.63, 0.41, 0.19, 0.04, 0.0, 0.0, 0.0, 0.0,
]

const weatherSeries: WeatherSnapshot[] = [
  { summary: 'Cloudy', rainfallChancePct: 18, windKph: 10, temperatureC: 8 },
  { summary: 'Cloudy', rainfallChancePct: 16, windKph: 9, temperatureC: 7 },
  { summary: 'Cloudy', rainfallChancePct: 14, windKph: 8, temperatureC: 7 },
  { summary: 'Cloudy', rainfallChancePct: 15, windKph: 8, temperatureC: 6 },
  { summary: 'Cloudy', rainfallChancePct: 19, windKph: 9, temperatureC: 7 },
  { summary: 'Light clouds', rainfallChancePct: 21, windKph: 11, temperatureC: 9 },
  { summary: 'Partly sunny', rainfallChancePct: 25, windKph: 12, temperatureC: 11 },
  { summary: 'Partly sunny', rainfallChancePct: 27, windKph: 13, temperatureC: 13 },
  { summary: 'Sunny spells', rainfallChancePct: 24, windKph: 14, temperatureC: 15 },
  { summary: 'Sunny spells', rainfallChancePct: 20, windKph: 15, temperatureC: 17 },
  { summary: 'Bright', rainfallChancePct: 16, windKph: 14, temperatureC: 18 },
  { summary: 'Bright', rainfallChancePct: 14, windKph: 13, temperatureC: 19 },
  { summary: 'Bright', rainfallChancePct: 13, windKph: 12, temperatureC: 20 },
  { summary: 'Bright', rainfallChancePct: 18, windKph: 13, temperatureC: 20 },
  { summary: 'Light clouds', rainfallChancePct: 26, windKph: 14, temperatureC: 19 },
  { summary: 'Clouding over', rainfallChancePct: 34, windKph: 15, temperatureC: 18 },
  { summary: 'Clouding over', rainfallChancePct: 45, windKph: 16, temperatureC: 16 },
  { summary: 'Cloudy', rainfallChancePct: 56, windKph: 17, temperatureC: 14 },
  { summary: 'Cloudy', rainfallChancePct: 63, windKph: 18, temperatureC: 13 },
  { summary: 'Rain likely', rainfallChancePct: 74, windKph: 20, temperatureC: 12 },
  { summary: 'Rain likely', rainfallChancePct: 79, windKph: 20, temperatureC: 11 },
  { summary: 'Light rain', rainfallChancePct: 82, windKph: 18, temperatureC: 10 },
  { summary: 'Light rain', rainfallChancePct: 76, windKph: 16, temperatureC: 9 },
  { summary: 'Cloudy', rainfallChancePct: 61, windKph: 14, temperatureC: 9 },
]

const panelProfiles = {
  'panel-1': { temp: 22.6, humidity: 58, soil: 54, energy: 7.1 },
  'panel-2': { temp: 23.1, humidity: 55, soil: 51, energy: 7.4 },
  'panel-3': { temp: 22.4, humidity: 60, soil: 56, energy: 6.9 },
  'panel-4': { temp: 24.0, humidity: 53, soil: 49, energy: 7.8 },
  'panel-5': { temp: 25.0, humidity: 50, soil: 46, energy: 6.1 },
  'panel-6': { temp: 24.3, humidity: 52, soil: 47, energy: 5.8 },
} as const

/** Returns the fixed panel seed for the dashboard simulation. */
export function getInitialPanels(): Panel[] {
  return []
}

/** Returns the weather simulation for each hour of day. */
export function getWeatherSeries() {
  return weatherSeries
}

/** Returns the 24-point energy curve used by the chart. */
export function getEnergySeries24h() {
  return hourlyEnergyFactor.map((factor) => Number((factor * 56).toFixed(2)))
}

/** Returns base panel metrics before mode adjustments are applied. */
export function getBasePanelMetricsSeries(): Record<string, PanelMetrics[]> {
  const panelEntries = Object.entries(panelProfiles)
  return Object.fromEntries(
    panelEntries.map(([panelId, profile]) => [
      panelId,
      hourlyTemperatureDelta.map((temperatureDelta, hour) => ({
        tempC: Number((profile.temp + temperatureDelta).toFixed(1)),
        humidityPct: Number((profile.humidity + hourlyHumidityDelta[hour]).toFixed(1)),
        soilMoisturePct: Number((profile.soil + hourlySoilDelta[hour]).toFixed(1)),
        energyKwh: Number((profile.energy * hourlyEnergyFactor[hour]).toFixed(2)),
      })),
    ]),
  )
}
