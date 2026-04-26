import { Box, IconButton, Stack, Typography } from '@mui/material'
import { FaRotateLeft, FaRotateRight } from 'react-icons/fa6'
import { useEffect, useMemo, useRef, useState } from 'react'
import Map, {
  Layer,
  NavigationControl,
  Source,
  type MapGeoJSONFeature,
  type MapMouseEvent,
  type MapRef,
  type ViewState,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  createFarmArea,
  createFarmFeatureCollection,
  getFarmBounds,
  getFarmCenter,
  loadSavedFarmArea,
  persistFarmArea,
  type Coordinate,
  type FarmArea,
} from './farmArea'
import {
  createFarmGridCells,
  createFarmGridFeatureCollection,
  createSelectedGridCellFeatureCollection,
  type GridCell,
} from './gridSystem'
import {
  birdseyeMapStyle,
  draftFarmOutlineLayer,
  farmGridFillLayer,
  farmGridOutlineLayer,
  savedFarmFillLayer,
  savedFarmOutlineLayer,
  selectedGridCellFillLayer,
  selectedGridCellGlowLayer,
  selectedGridCellOutlineLayer,
} from './mapConfig'
import SolarPannelPlannerControls from './SolarPannelPlannerControls'
import { useAddressSearch } from './useAddressSearch'
import { useDashboardState } from './dashboard/useDashboardState'
import { dashboardPalette } from './dashboard/styles'

const GRID_SCALE_FACTOR = 2.1
const GRID_LENGTH_METERS = 11.4 * GRID_SCALE_FACTOR
const GRID_WIDTH_METERS = 5.65 * GRID_SCALE_FACTOR

const defaultViewState: ViewState = {
  longitude: -1.5486,
  latitude: 52.4159,
  zoom: 17,
  pitch: 0,
  bearing: 0,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
}

/** Formats a map coordinate for panel display text. */
function formatCoordinate(value: number) {
  return value.toFixed(6)
}

/** Builds the initial camera state from a saved farm if one exists. */
function getInitialViewState() {
  const farmArea = loadSavedFarmArea()
  if (!farmArea) {
    return defaultViewState
  }

  const center = getFarmCenter(farmArea)
  return { ...defaultViewState, latitude: center.latitude, longitude: center.longitude, zoom: 18 }
}

/** Renders the top-down farm map with selectable planning grid cells. */
function SolarPannelMap() {
  const mapRef = useRef<MapRef | null>(null)
  const [viewState, setViewState] = useState(getInitialViewState)
  const [farmArea, setFarmArea] = useState<FarmArea | null>(() => loadSavedFarmArea())
  const [farmMinZoom, setFarmMinZoom] = useState<number | undefined>(undefined)
  const [farmPanBounds, setFarmPanBounds] = useState<[[number, number], [number, number]] | undefined>(undefined)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [draftStart, setDraftStart] = useState<Coordinate | null>(null)
  const [draftCorner, setDraftCorner] = useState<Coordinate | null>(null)
  const [isSelectingFarm, setIsSelectingFarm] = useState(false)
  const [isHoveringGridCell, setIsHoveringGridCell] = useState(false)
  const [plannerNotice, setPlannerNotice] = useState<string | null>(null)
  const [rotationDirection, setRotationDirection] = useState<number | null>(null)

  const rotateMap = (degrees: number) => {
    const map = mapRef.current?.getMap()
    if (!map) {
      return
    }

    const currentBearing = map.getBearing()
    map.rotateTo(currentBearing + degrees)
  }

  useEffect(() => {
    if (rotationDirection === null) {
      return
    }

    const interval = setInterval(() => rotateMap(rotationDirection), 16)
    return () => clearInterval(interval)
  }, [rotationDirection])

  const {
    panelMetricsById,
    gridCellContent,
    selectedGridCell,
    selectedGridCellPanel,
    openGridCellModal,
    registerGridCells,
    addRealPanelToSelectedCell,
    addProposedPanelToSelectedCell,
    clearSelectedGridCellPanel,
    setPanelMode,
  } = useDashboardState()

  const draftFarm = draftStart && draftCorner ? createFarmArea(draftStart, draftCorner, 'Draft farm') : null
  const farmCenter = farmArea ? getFarmCenter(farmArea) : null
  const searchEnabled = !farmArea || isSelectingFarm

  const farmGridCells = useMemo(() => {
    if (!farmArea) {
      return []
    }

    return createFarmGridCells(farmArea, GRID_LENGTH_METERS, GRID_WIDTH_METERS)
  }, [farmArea])

  const farmGridFeatureCollection = useMemo(
    () => createFarmGridFeatureCollection(farmGridCells, gridCellContent),
    [farmGridCells, gridCellContent],
  )

  const registeredGridCells = useMemo(
    () =>
      farmGridCells.map((cell) => ({
        id: cell.id,
        row: cell.row,
        column: cell.column,
        latitude: cell.centerLatitude,
        longitude: cell.centerLongitude,
      })),
    [farmGridCells],
  )

  const {
    addressQuery,
    addressResults,
    isSearching,
    isSearchFocused,
    handleAddressSubmit,
    handleAddressChange,
    handleSearchBlur,
    handleSearchFocus,
    resetSearch,
    selectAddress,
  } = useAddressSearch({
    latitude: viewState.latitude,
    longitude: viewState.longitude,
    searchEnabled,
    onSelect: (result) => {
      setPlannerNotice(null)
      setViewState((currentViewState) => ({
        ...currentViewState,
        latitude: result.latitude,
        longitude: result.longitude,
        zoom: Math.max(currentViewState.zoom, 18),
      }))
    },
  })

  useEffect(() => {
    persistFarmArea(farmArea)
  }, [farmArea])

  useEffect(() => {
    registerGridCells(registeredGridCells)
  }, [registerGridCells, registeredGridCells])

  useEffect(() => {
    const canvas = mapRef.current?.getMap().getCanvas()
    if (!canvas) {
      return
    }

    canvas.style.cursor = isSelectingFarm ? 'crosshair' : isHoveringGridCell ? 'pointer' : ''

    return () => {
      canvas.style.cursor = ''
    }
  }, [isHoveringGridCell, isSelectingFarm])

  const syncFarmViewport = (nextFarm: FarmArea | null) => {
    const map = mapRef.current?.getMap()
    if (!map || !nextFarm) {
      setFarmMinZoom(undefined)
      setFarmPanBounds(undefined)
      return
    }

    const lockedCamera = map.cameraForBounds(getFarmBounds(nextFarm), { padding: 60 })
    if (!lockedCamera || typeof lockedCamera.zoom !== 'number') {
      return
    }

    const nextMinZoom = lockedCamera.zoom
    setFarmMinZoom(nextMinZoom)
    setViewState((currentViewState) => ({
      ...currentViewState,
      zoom: Math.max(currentViewState.zoom, nextMinZoom),
    }))
  }

  const syncFarmPanBounds = (nextFarm: FarmArea | null) => {
    const map = mapRef.current?.getMap()
    if (!map || !nextFarm) {
      setFarmPanBounds(undefined)
      return
    }

    const bounds = map.getBounds()
    const longitudePadding = (bounds.getEast() - bounds.getWest()) / 2
    const latitudePadding = (bounds.getNorth() - bounds.getSouth()) / 2

    setFarmPanBounds([
      [nextFarm.minLongitude - longitudePadding, nextFarm.minLatitude - latitudePadding],
      [nextFarm.maxLongitude + longitudePadding, nextFarm.maxLatitude + latitudePadding],
    ])
  }

  useEffect(() => {
    syncFarmViewport(farmArea)
  }, [farmArea])

  const fitMapToFarm = (nextFarm: FarmArea) => {
    syncFarmViewport(nextFarm)
    mapRef.current?.fitBounds(getFarmBounds(nextFarm), { padding: 60, duration: 0 })
    syncFarmPanBounds(nextFarm)
  }

  const findGridCellIdAtEvent = (event: MapMouseEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(event.point, { layers: ['farm-grid-fill'] }) ?? []
    const cellFeature = features[0] as MapGeoJSONFeature | undefined
    return typeof cellFeature?.properties?.id === 'string' ? cellFeature.properties.id : null
  }

  const getGridCellById = (gridCellId: string): GridCell | null => {
    return farmGridCells.find((cell) => cell.id === gridCellId) ?? null
  }

  const resetDraftFarm = () => {
    setDraftStart(null)
    setDraftCorner(null)
  }

  const clearFarmPlanner = (notice: string | null = null) => {
    setFarmArea(null)
    setIsSelectingFarm(false)
    setIsOnboardingOpen(false)
    resetSearch()
    resetDraftFarm()
    registerGridCells([])
    setPlannerNotice(notice)
  }

  const openOnboarding = () => {
    setPlannerNotice(null)
    setIsOnboardingOpen(true)
  }

  const closeOnboarding = () => {
    setIsOnboardingOpen(false)
  }

  const startFarmSelection = () => {
    setFarmArea(null)
    setFarmPanBounds(undefined)
    resetDraftFarm()
    registerGridCells([])
    setPlannerNotice('Click first corner.')
    setIsOnboardingOpen(false)
    setIsSelectingFarm(true)
  }

  const handleMapClick = (event: MapMouseEvent) => {
    if (!isSelectingFarm) {
      const gridCellId = findGridCellIdAtEvent(event)
      if (!gridCellId) {
        return
      }

      const nextGridCell = getGridCellById(gridCellId)
      if (!nextGridCell) {
        return
      }

      openGridCellModal({
        id: nextGridCell.id,
        row: nextGridCell.row,
        column: nextGridCell.column,
        latitude: nextGridCell.centerLatitude,
        longitude: nextGridCell.centerLongitude,
      })
      setPlannerNotice(null)
      return
    }

    const coordinate = { latitude: event.lngLat.lat, longitude: event.lngLat.lng }
    if (!draftStart) {
      setDraftStart(coordinate)
      setDraftCorner(coordinate)
      setPlannerNotice('Click opposite corner.')
      return
    }

    const nextFarm = createFarmArea(draftStart, coordinate, addressQuery.trim() || 'Saved farm')
    setFarmArea(nextFarm)
    setIsSelectingFarm(false)
    setIsOnboardingOpen(false)
    resetDraftFarm()
    setPlannerNotice(null)
    fitMapToFarm(nextFarm)
  }


  const handleMapPointerMove = (event: MapMouseEvent) => {
    if (isSelectingFarm && draftStart) {
      setDraftCorner({ latitude: event.lngLat.lat, longitude: event.lngLat.lng })
      return
    }

    if (!isSelectingFarm) {
      setIsHoveringGridCell(Boolean(findGridCellIdAtEvent(event)))
    }
  }

  const handleMapMouseLeave = () => {
    setIsHoveringGridCell(false)
  }

  const selectedGridCellSummary = selectedGridCell
    ? {
        id: selectedGridCell.id,
        row: selectedGridCell.row,
        column: selectedGridCell.column,
        latitude: formatCoordinate(selectedGridCell.latitude),
        longitude: formatCoordinate(selectedGridCell.longitude),
        content: gridCellContent[selectedGridCell.id] ?? 'empty',
        panel: selectedGridCellPanel ? `${selectedGridCellPanel.name} (${selectedGridCellPanel.type})` : 'None',
      }
    : null

  const selectedGridCellPanelMetrics = selectedGridCellPanel ? panelMetricsById[selectedGridCellPanel.id] : null

  const selectedCellMapGeometry = selectedGridCell ? getGridCellById(selectedGridCell.id) : null
  const farmCenterLabel = farmCenter
    ? {
        latitude: formatCoordinate(farmCenter.latitude),
        longitude: formatCoordinate(farmCenter.longitude),
      }
    : null

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
        gridTemplateRows: { xs: 'auto minmax(0, 1fr)', md: 'minmax(0, 1fr)' },
        height: '100%',
        minHeight: 0,
        borderTop: `1px solid ${dashboardPalette.border}`,
        background: dashboardPalette.shell,
      }}
    >
      <SolarPannelPlannerControls
        plannerNotice={plannerNotice}
        farmCenter={farmCenterLabel}
        selectedGridCell={selectedGridCellSummary}
        addressQuery={addressQuery}
        addressResults={addressResults}
        isOnboardingOpen={isOnboardingOpen}
        isSearchFocused={isSearchFocused}
        isSearching={isSearching}
        isSelectingFarm={isSelectingFarm}
        onOpenOnboarding={openOnboarding}
        onCloseOnboarding={closeOnboarding}
        onResetFarm={() => clearFarmPlanner(null)}
        onStartDrawingBoundary={startFarmSelection}
        onSearchSubmit={handleAddressSubmit}
        onAddressChange={handleAddressChange}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        onSelectAddress={selectAddress}
        selectedGridCellPanel={selectedGridCellPanel}
        selectedGridCellPanelMetrics={selectedGridCellPanelMetrics}
        onAssignRealPanel={addRealPanelToSelectedCell}
        onAssignProposedPanel={addProposedPanelToSelectedCell}
        onClearSelectedGridCellPanel={clearSelectedGridCellPanel}
        onSetPanelMode={setPanelMode}
      />

      <Box sx={{ position: 'relative', minHeight: 0, height: '100%', background: dashboardPalette.shell }}>
        <Stack
          direction="row"
          spacing={0.6}
          sx={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            alignItems: 'center',
          }}
        >
          <IconButton
            size="small"
            onMouseDown={() => setRotationDirection(-5)}
            onMouseUp={() => setRotationDirection(null)}
            onMouseLeave={() => setRotationDirection(null)}
            sx={{
              width: 36,
              height: 36,
              border: `1px solid ${dashboardPalette.border}`,
              bgcolor: 'rgba(6,20,30,0.85)',
              color: dashboardPalette.text,
              backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: 'rgba(73,200,137,0.18)' },
            }}
            aria-label="Rotate map left 5 degrees"
          >
            <FaRotateLeft size={14} />
          </IconButton>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: dashboardPalette.text,
              bgcolor: 'rgba(6,20,30,0.85)',
              px: 0.6,
              py: 0.2,
              borderRadius: '3px',
              border: `1px solid ${dashboardPalette.border}`,
              minWidth: 42,
              textAlign: 'center',
            }}
          >
            {Math.round(viewState.bearing)}°
          </Typography>
          <IconButton
            size="small"
            onMouseDown={() => setRotationDirection(5)}
            onMouseUp={() => setRotationDirection(null)}
            onMouseLeave={() => setRotationDirection(null)}
            sx={{
              width: 36,
              height: 36,
              border: `1px solid ${dashboardPalette.border}`,
              bgcolor: 'rgba(6,20,30,0.85)',
              color: dashboardPalette.text,
              backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: 'rgba(73,200,137,0.18)' },
            }}
            aria-label="Rotate map right 5 degrees"
          >
            <FaRotateRight size={14} />
          </IconButton>
        </Stack>

        <Map
          {...viewState}
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          reuseMaps
          dragRotate={true}
          pitchWithRotate={true}
          touchZoomRotate={true}
          doubleClickZoom={false}
          mapLib={import('maplibre-gl')}
          mapStyle={birdseyeMapStyle}
          minZoom={farmMinZoom}
          maxBounds={farmPanBounds}
          onClick={handleMapClick}
          onLoad={() => {
            syncFarmViewport(farmArea)
            syncFarmPanBounds(farmArea)
          }}
          onMouseMove={handleMapPointerMove}
          onMove={(event) => {
            setViewState((currentViewState) => ({
              ...event.viewState,
              zoom: farmMinZoom ? Math.max(event.viewState.zoom, farmMinZoom) : event.viewState.zoom,
              pitch: event.viewState.pitch,
              bearing: event.viewState.bearing,
              padding: currentViewState.padding,
            }))
          }}
          onMouseLeave={handleMapMouseLeave}
          onResize={() => {
            syncFarmViewport(farmArea)
            syncFarmPanBounds(farmArea)
          }}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {farmArea && (
            <Source id="saved-farm" type="geojson" data={createFarmFeatureCollection(farmArea)}>
              <Layer {...savedFarmFillLayer} />
              <Layer {...savedFarmOutlineLayer} />
            </Source>
          )}

          {draftFarm && (
            <Source id="draft-farm" type="geojson" data={createFarmFeatureCollection(draftFarm)}>
              <Layer {...draftFarmOutlineLayer} />
            </Source>
          )}

          {farmGridCells.length > 0 && (
            <Source id="farm-grid" type="geojson" data={farmGridFeatureCollection}>
              <Layer {...farmGridFillLayer} />
              <Layer {...farmGridOutlineLayer} />
            </Source>
          )}

          {selectedCellMapGeometry && (
            <Source id="selected-grid-cell" type="geojson" data={createSelectedGridCellFeatureCollection(selectedCellMapGeometry)}>
              <Layer {...selectedGridCellFillLayer} />
              <Layer {...selectedGridCellGlowLayer} />
              <Layer {...selectedGridCellOutlineLayer} />
            </Source>
          )}
        </Map>
      </Box>
    </Box>
  )
}

export default SolarPannelMap
