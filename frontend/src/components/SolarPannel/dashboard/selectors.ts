import { deriveAlerts } from './rules'
import type {
  GeneralMetrics,
  Panel,
  PanelMetrics,
  PanelMode,
  SimulationTimelinePoint,
  WeatherSnapshot,
  WeatherTimelinePoint,
} from './types'

type ModeAdjustment = {
  tempOffset: number
  humidityOffset: number
  soilOffset: number
  energyMultiplier: number
}

const modeAdjustments: Record<PanelMode, ModeAdjustment> = {
  flat_down: { tempOffset: -1.8, humidityOffset: 2.2, soilOffset: 2.0, energyMultiplier: 0.78 },
  sun_tracking: { tempOffset: 1.9, humidityOffset: -1.4, soilOffset: -1.2, energyMultiplier: 1.18 },
  letting_sun_in: { tempOffset: 0.7, humidityOffset: -0.4, soilOffset: -0.3, energyMultiplier: 0.94 },
}

/** Builds a deterministic number from an arbitrary string id. */
function getStableHash(value: string) {
  return value.split('').reduce((hash, character) => hash + character.charCodeAt(0), 0)
}

/** Clamps a metric value to a user-safe display range. */
function clampMetric(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

/** Converts monthly timeline data into the shared weather snapshot shape. */
export function getWeatherSnapshot(point: WeatherTimelinePoint): WeatherSnapshot {
  return {
    summary: point.summary,
    rainfallChancePct: Math.round((point.rainyDays / Math.max(point.observedDays, 1)) * 100),
    windKph: point.averageWindKph,
    temperatureC: point.averageTempC,
  }
}

/** Suggests the best panel mode for the weather conditions in a month. */
export function getRecommendedMode(point: WeatherTimelinePoint): PanelMode {
  const rainyDayRatio = point.rainyDays / Math.max(point.observedDays, 1)

  if (point.totalRainfallMm >= 78 || rainyDayRatio >= 0.42) {
    return 'flat_down'
  }

  if (point.averageTempC >= 18 && point.solarRadiationKwhM2 >= 95) {
    return 'sun_tracking'
  }

  return 'letting_sun_in'
}

/** Creates seeded panel metrics from monthly weather conditions. */
function getBasePanelMetrics(panel: Panel, point: WeatherTimelinePoint): PanelMetrics {
  const panelSeed = panel.realPanelId ?? panel.id
  const hash = getStableHash(panelSeed)
  const canopyBias = ((hash % 11) - 5) * 0.35
  const humidityBias = ((hash % 13) - 6) * 1.1
  const soilRetention = 0.82 + (hash % 6) * 0.06
  const energyFactor = 0.92 + (hash % 7) * 0.05
  const panelOutputScale = panel.type === 'fake' ? 10.4 : 10.9

  return {
    tempC: Number(
      clampMetric(
        point.averageTempC + 8.4 + point.solarRadiationKwhM2 * 0.028 - point.totalRainfallMm * 0.014 + canopyBias,
        -10,
        48,
      ).toFixed(1),
    ),
    humidityPct: Number(
      clampMetric(
        point.averageHumidityPct + point.totalRainfallMm * 0.035 - point.solarRadiationKwhM2 * 0.075 + humidityBias,
        12,
        100,
      ).toFixed(1),
    ),
    soilMoisturePct: Number(
      clampMetric(
        24
          + point.totalRainfallMm * 0.31
          + point.averageHumidityPct * 0.16
          - point.averageTempC * 0.55
          - point.solarRadiationKwhM2 * 0.1
          + soilRetention * 9,
        6,
        100,
      ).toFixed(1),
    ),
    energyKwh: Number(
      Math.max(0, point.solarRadiationKwhM2 * panelOutputScale * energyFactor * (1 - Math.min(point.averageWindKph, 35) * 0.004)).toFixed(2),
    ),
  }
}

/** Applies panel mode adjustments to a base monthly metric snapshot. */
export function applyPanelMode(baseMetrics: PanelMetrics, mode: PanelMode): PanelMetrics {
  const adjustment = modeAdjustments[mode]
  return {
    tempC: Number(clampMetric(baseMetrics.tempC + adjustment.tempOffset, -20, 60).toFixed(1)),
    humidityPct: Number(clampMetric(baseMetrics.humidityPct + adjustment.humidityOffset, 0, 100).toFixed(1)),
    soilMoisturePct: Number(clampMetric(baseMetrics.soilMoisturePct + adjustment.soilOffset, 0, 100).toFixed(1)),
    energyKwh: Number(Math.max(0, baseMetrics.energyKwh * adjustment.energyMultiplier).toFixed(2)),
  }
}

/** Computes current aggregate metrics across all panels. */
export function getGeneralMetrics(panels: Panel[], metricsByPanelId: Record<string, PanelMetrics>): GeneralMetrics {
  if (panels.length === 0) {
    return { averageTempC: 0, averageHumidityPct: 0, averageSoilMoisturePct: 0 }
  }

  const totals = panels.reduce(
    (accumulator, panel) => {
      const metrics = metricsByPanelId[panel.id]
      if (!metrics) {
        return accumulator
      }

      return {
        temp: accumulator.temp + metrics.tempC,
        humidity: accumulator.humidity + metrics.humidityPct,
        soil: accumulator.soil + metrics.soilMoisturePct,
      }
    },
    { temp: 0, humidity: 0, soil: 0 },
  )

  return {
    averageTempC: Number((totals.temp / panels.length).toFixed(1)),
    averageHumidityPct: Number((totals.humidity / panels.length).toFixed(1)),
    averageSoilMoisturePct: Number((totals.soil / panels.length).toFixed(1)),
  }
}

/** Builds the simulated monthly timeline that powers the sidebar and reports. */
export function buildSimulationTimeline(panels: Panel[], weatherTimeline: WeatherTimelinePoint[]): SimulationTimelinePoint[] {
  return weatherTimeline.map((point) => {
    const weather = getWeatherSnapshot(point)
    const panelMetricsById = Object.fromEntries(
      panels.map((panel) => [panel.id, applyPanelMode(getBasePanelMetrics(panel, point), panel.mode)]),
    ) as Record<string, PanelMetrics>
    const totalEnergyKwh = Number(
      panels.reduce((sum, panel) => sum + (panelMetricsById[panel.id]?.energyKwh ?? 0), 0).toFixed(2),
    )

    return {
      monthLabel: point.monthLabel,
      monthStartIso: point.monthStartIso,
      weather,
      averageHumidityPct: point.averageHumidityPct,
      totalRainfallMm: point.totalRainfallMm,
      rainyDays: point.rainyDays,
      observedDays: point.observedDays,
      solarRadiationKwhM2: point.solarRadiationKwhM2,
      sunshineHours: point.sunshineHours,
      totalEnergyKwh,
      panelMetricsById,
      generalMetrics: getGeneralMetrics(panels, panelMetricsById),
      alerts: deriveAlerts(panels, panelMetricsById, weather, [], point.monthStartIso),
      recommendedMode: getRecommendedMode(point),
    }
  })
}
