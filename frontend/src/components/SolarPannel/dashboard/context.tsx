import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getInitialPanels } from './mockData'
import { downloadSimulationReport } from './report'
import { buildSimulationTimeline } from './selectors'
import DashboardContext from './dashboardContext'
import { panelRegistryService } from './panelRegistryService'
import type {
  DashboardAlert,
  GeneralMetrics,
  GridCellSelection,
  Panel,
  PanelActionResult,
  PanelMetrics,
  PanelMode,
  PanelType,
  ReportPayload,
  SimulationTimelinePoint,
  WeatherSnapshot,
  WeatherTimelinePoint,
} from './types'
import { fetchWeatherTimeline } from './weatherTimelineApi'

const emptyGeneralMetrics: GeneralMetrics = {
  averageTempC: 0,
  averageHumidityPct: 0,
  averageSoilMoisturePct: 0,
}

export type DashboardContextValue = {
  panels: Panel[]
  selectedTimelineIndex: number
  selectedSimulationPoint: SimulationTimelinePoint | null
  simulationTimeline: SimulationTimelinePoint[]
  weather: WeatherSnapshot | null
  isWeatherTimelineLoading: boolean
  weatherTimelineError: string | null
  yearlyEnergySeriesKwh: number[]
  panelMetricsById: Record<string, PanelMetrics>
  generalMetrics: GeneralMetrics
  alerts: DashboardAlert[]
  selectedGridCell: GridCellSelection | null
  selectedGridCellPanel: Panel | null
  selectedModalPanel: Panel | null
  isPanelModalOpen: boolean
  gridCells: GridCellSelection[]
  gridCellContent: Record<string, 'empty' | 'real-panel' | 'proposed-panel'>
  setSelectedTimelineIndex: (index: number) => void
  setPanelMode: (panelId: string, mode: PanelMode) => void
  acknowledgeAlert: (alertId: string) => void
  openGridCellModal: (cell: GridCellSelection) => void
  openPanelDetailsModal: (panelId: string) => void
  closePanelModal: () => void
  registerGridCells: (cells: GridCellSelection[]) => void
  addRealPanelToSelectedCell: (realPanelId: string) => Promise<PanelActionResult>
  addProposedPanelToSelectedCell: () => PanelActionResult
  assignSelectedCellWithPanelType: (panelType: PanelType) => void
  assignPanelToSelectedCell: (panelId: string) => void
  clearSelectedGridCellPanel: () => void
  setSelectedModalGridCellById: (cellId: string) => void
  generateReport: () => void
}

/** Resolves the panel currently linked to a specific grid cell. */
function getLinkedPanelForCell(panels: Panel[], cellId: string | null) {
  if (!cellId) {
    return null
  }

  return panels.find((panel) => panel.linkedGridCellId === cellId) ?? null
}

/** Creates a unique panel id for newly linked cells. */
function createPanelId() {
  return `panel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** Adds or replaces the panel linked to a target grid cell. */
function upsertCellPanel(panels: Panel[], panel: Panel) {
  const nextPanels = panels.filter((entry) => entry.linkedGridCellId !== panel.linkedGridCellId)
  return [...nextPanels, panel]
}

/** Provides shared simulation and planning state for dashboard features. */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [panels, setPanels] = useState(getInitialPanels)
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0)
  const [selectedGridCell, setSelectedGridCell] = useState<GridCellSelection | null>(null)
  const [focusedPanelId, setFocusedPanelId] = useState<string | null>(null)
  const [isPanelModalOpen, setIsPanelModalOpen] = useState(false)
  const [gridCells, setGridCells] = useState<GridCellSelection[]>([])
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<string[]>([])
  const [isWeatherTimelineLoading, setIsWeatherTimelineLoading] = useState(true)
  const [weatherTimelineError, setWeatherTimelineError] = useState<string | null>(null)
  const [weatherSourceGeneratedAtIso, setWeatherSourceGeneratedAtIso] = useState('')
  const [weatherSourceCoordinates, setWeatherSourceCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
  const [weatherTimeline, setWeatherTimeline] = useState<WeatherTimelinePoint[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadWeatherTimeline() {
      setIsWeatherTimelineLoading(true)
      setWeatherTimelineError(null)
      setWeatherTimeline([])

      try {
        const response = await fetchWeatherTimeline({
          latitude: selectedGridCell?.latitude,
          longitude: selectedGridCell?.longitude,
          signal: controller.signal,
        })

        if (controller.signal.aborted) {
          return
        }

        setWeatherSourceGeneratedAtIso(response.generatedAtIso)
        setWeatherSourceCoordinates({ latitude: response.latitude, longitude: response.longitude })
        setWeatherTimeline(response.timeline)
        setSelectedTimelineIndex(Math.max(response.timeline.length - 1, 0))
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        console.error(error)
        setWeatherTimeline([])
        setWeatherTimelineError('Historical weather data is unavailable.')
      } finally {
        if (!controller.signal.aborted) {
          setIsWeatherTimelineLoading(false)
        }
      }
    }

    void loadWeatherTimeline()
    return () => controller.abort()
  }, [selectedGridCell?.latitude, selectedGridCell?.longitude])

  const simulationTimeline = useMemo<SimulationTimelinePoint[]>(
    () => buildSimulationTimeline(panels, weatherTimeline),
    [panels, weatherTimeline],
  )

  const selectedSimulationPoint = simulationTimeline[selectedTimelineIndex] ?? null
  const weather = selectedSimulationPoint?.weather ?? null
  const panelMetricsById = selectedSimulationPoint?.panelMetricsById ?? {}
  const generalMetrics = selectedSimulationPoint?.generalMetrics ?? emptyGeneralMetrics

  const alerts = useMemo(() => {
    const acknowledgedLookup = new Set(acknowledgedAlertIds)
    return (selectedSimulationPoint?.alerts ?? []).map((alert) => ({
      ...alert,
      acknowledged: acknowledgedLookup.has(alert.id),
    }))
  }, [acknowledgedAlertIds, selectedSimulationPoint])

  const selectedGridCellPanel = useMemo(
    () => getLinkedPanelForCell(panels, selectedGridCell?.id ?? null),
    [panels, selectedGridCell],
  )

  const selectedModalPanel = useMemo(() => {
    if (focusedPanelId) {
      return panels.find((panel) => panel.id === focusedPanelId) ?? null
    }

    return selectedGridCellPanel
  }, [focusedPanelId, panels, selectedGridCellPanel])

  const gridCellContent = useMemo(
    () =>
      Object.fromEntries(
        gridCells.map((cell) => {
          const linkedPanel = panels.find((panel) => panel.linkedGridCellId === cell.id)
          if (!linkedPanel) {
            return [cell.id, 'empty']
          }

          return [cell.id, linkedPanel.type === 'real' ? 'real-panel' : 'proposed-panel']
        }),
      ) as Record<string, 'empty' | 'real-panel' | 'proposed-panel'>,
    [gridCells, panels],
  )

  const yearlyEnergySeriesKwh = useMemo(
    () => simulationTimeline.map((point) => point.totalEnergyKwh),
    [simulationTimeline],
  )

  const registerGridCells = (cells: GridCellSelection[]) => {
    setGridCells((currentCells) => {
      const hasSameLength = currentCells.length === cells.length
      const hasSameIds = hasSameLength && currentCells.every((cell, index) => cell.id === cells[index]?.id)
      return hasSameIds ? currentCells : cells
    })
    const validCellIds = new Set(cells.map((cell) => cell.id))
    setPanels((currentPanels) => {
      const nextPanels = currentPanels.filter((panel) => !panel.linkedGridCellId || validCellIds.has(panel.linkedGridCellId))
      return nextPanels.length === currentPanels.length ? currentPanels : nextPanels
    })
    setSelectedGridCell((currentCell) => (currentCell && validCellIds.has(currentCell.id) ? currentCell : null))
  }

  const openGridCellModal = (cell: GridCellSelection) => {
    setSelectedGridCell(cell)
    setFocusedPanelId(null)
    setIsPanelModalOpen(false)
  }

  const openPanelDetailsModal = (panelId: string) => {
    const panel = panels.find((entry) => entry.id === panelId)
    if (!panel) {
      return
    }

    const linkedCell = panel.linkedGridCellId ? gridCells.find((cell) => cell.id === panel.linkedGridCellId) ?? null : null
    setSelectedGridCell(linkedCell)
    setFocusedPanelId(panelId)
    setIsPanelModalOpen(false)
  }

  const closePanelModal = () => {
    setFocusedPanelId(null)
    setIsPanelModalOpen(false)
  }

  const addProposedPanelToSelectedCell = () => {
    if (!selectedGridCell) {
      return { ok: false, message: 'No grid cell selected.' }
    }

    const proposedPanel: Panel = {
      id: createPanelId(),
      name: `Proposed ${selectedGridCell.id}`,
      type: 'proposed',
      realPanelId: null,
      mode: 'letting_sun_in',
      linkedGridCellId: selectedGridCell.id,
    }

    setPanels((currentPanels) => upsertCellPanel(currentPanels, proposedPanel))
    setFocusedPanelId(proposedPanel.id)
    return { ok: true, message: 'Proposed panel linked.' }
  }

  const addRealPanelToSelectedCell = async (realPanelId: string) => {
    if (!selectedGridCell) {
      return { ok: false, message: 'No grid cell selected.' }
    }

    const lookupResult = await panelRegistryService.lookupRealPanelById(realPanelId)
    if (!lookupResult.ok) {
      return { ok: false, message: lookupResult.message }
    }

    const realPanel: Panel = {
      id: createPanelId(),
      name: lookupResult.panelName,
      type: 'real',
      realPanelId: realPanelId.trim(),
      mode: 'sun_tracking',
      linkedGridCellId: selectedGridCell.id,
    }

    setPanels((currentPanels) => upsertCellPanel(currentPanels, realPanel))
    setFocusedPanelId(realPanel.id)
    return { ok: true, message: lookupResult.message }
  }

  const assignPanelToSelectedCell = (panelId: string) => {
    void addRealPanelToSelectedCell(panelId)
  }

  const assignSelectedCellWithPanelType = (panelType: PanelType) => {
    if (panelType === 'proposed') {
      addProposedPanelToSelectedCell()
    }
  }

  const clearSelectedGridCellPanel = () => {
    if (!selectedGridCell) {
      return
    }

    setPanels((currentPanels) => currentPanels.filter((panel) => panel.linkedGridCellId !== selectedGridCell.id))
    setFocusedPanelId(null)
  }

  const setPanelMode = (panelId: string, mode: PanelMode) => {
    setPanels((currentPanels) => currentPanels.map((panel) => (panel.id === panelId ? { ...panel, mode } : panel)))
  }

  const acknowledgeAlert = (alertId: string) => {
    setAcknowledgedAlertIds((currentIds) => (currentIds.includes(alertId) ? currentIds : [...currentIds, alertId]))
  }

  const setSelectedModalGridCellById = (cellId: string) => {
    const nextCell = gridCells.find((cell) => cell.id === cellId) ?? null
    setSelectedGridCell(nextCell)
  }

  const generateReport = () => {
    if (!selectedSimulationPoint || !weather || !weatherSourceCoordinates || panels.length === 0) {
      return
    }

    const payload: ReportPayload = {
      generatedAtIso: new Date().toISOString(),
      weatherSourceGeneratedAtIso,
      sourceCoordinates: weatherSourceCoordinates,
      selectedTimelineIndex,
      selectedMonthStartIso: selectedSimulationPoint.monthStartIso,
      weather,
      generalMetrics,
      panels: panels.map((panel) => ({ ...panel, metrics: panelMetricsById[panel.id] })),
      alerts,
      yearlyEnergySeriesKwh,
      simulationTimeline: simulationTimeline.map((point) => ({
        ...point,
        panels: panels.map((panel) => ({ ...panel, metrics: point.panelMetricsById[panel.id] })),
      })),
    }

    downloadSimulationReport(payload)
  }

  const value: DashboardContextValue = {
    panels,
    selectedTimelineIndex,
    selectedSimulationPoint,
    simulationTimeline,
    weather,
    isWeatherTimelineLoading,
    weatherTimelineError,
    yearlyEnergySeriesKwh,
    panelMetricsById,
    generalMetrics,
    alerts,
    selectedGridCell,
    selectedGridCellPanel,
    selectedModalPanel,
    isPanelModalOpen,
    gridCells,
    gridCellContent,
    setSelectedTimelineIndex,
    setPanelMode,
    acknowledgeAlert,
    openGridCellModal,
    openPanelDetailsModal,
    closePanelModal,
    registerGridCells,
    addRealPanelToSelectedCell,
    addProposedPanelToSelectedCell,
    assignSelectedCellWithPanelType,
    assignPanelToSelectedCell,
    clearSelectedGridCellPanel,
    setSelectedModalGridCellById,
    generateReport,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
