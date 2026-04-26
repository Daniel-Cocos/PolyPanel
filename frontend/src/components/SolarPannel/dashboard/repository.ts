import { getBasePanelMetricsSeries, getEnergySeries24h, getInitialPanels, getWeatherSeries } from './mockData'
import type { Panel, PanelMetrics, PanelMode, WeatherSnapshot } from './types'

type DashboardSeed = {
  panels: Panel[]
  weatherSeries: WeatherSnapshot[]
  energySeries24h: number[]
  basePanelMetricsSeries: Record<string, PanelMetrics[]>
}

/** Defines data operations for dashboard state, swappable with real APIs later. */
export interface DashboardRepository {
  loadSeed(): Promise<DashboardSeed>
  savePanelMode(panelId: string, mode: PanelMode): Promise<void>
  savePanelLink(panelId: string, gridCellId: string | null): Promise<void>
  acknowledgeAlert(alertId: string): Promise<void>
}

/** Provides hardcoded dashboard data and no-op persistence for MVP. */
export class MockDashboardRepository implements DashboardRepository {
  async loadSeed() {
    return {
      panels: getInitialPanels(),
      weatherSeries: getWeatherSeries(),
      energySeries24h: getEnergySeries24h(),
      basePanelMetricsSeries: getBasePanelMetricsSeries(),
    }
  }

  async savePanelMode(panelId: string, mode: PanelMode) {
    void panelId
    void mode
  }

  async savePanelLink(panelId: string, gridCellId: string | null) {
    void panelId
    void gridCellId
  }

  async acknowledgeAlert(alertId: string) {
    void alertId
  }
}
