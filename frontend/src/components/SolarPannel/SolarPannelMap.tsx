import { useEffect, useRef, useState } from 'react'
import Map, {
  Layer,
  NavigationControl,
  Source,
  type MapGeoJSONFeature,
  type MapLayerMouseEvent,
  type MapMouseEvent,
  type MapRef,
  type ViewState,
  type ViewStateChangeEvent,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import './SolarPannelMap.css'
import {
  clampCoordinateToFarm,
  createFarmArea,
  createFarmFeatureCollection,
  getFarmBounds,
  getFarmCenter,
  isCoordinateInsideFarm,
  loadSavedFarmArea,
  persistFarmArea,
  type Coordinate,
  type FarmArea,
} from './farmArea'
import {
  birdseyeMapStyle,
  draftFarmOutlineLayer,
  savedFarmFillLayer,
  savedFarmOutlineLayer,
  selectedSolarPanelFillLayer,
  selectedSolarPanelGlowLayer,
  selectedSolarPanelOutlineLayer,
  solarPanelFillLayer,
  solarPanelOutlineLayer,
} from './mapConfig'
import { createPanelFeatureCollection, getSolarPanelDimensions } from './panelGeometry'
import SolarPannelPlannerControls from './SolarPannelPlannerControls'
import { useAddressSearch } from './useAddressSearch'

type SolarPanel = {
  id: string
  latitude: number
  longitude: number
  rotation: number
}

const defaultViewState: ViewState = {
  longitude: -1.5486,
  latitude: 52.4159,
  zoom: 17,
  pitch: 52,
  bearing: -24,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
}

/** Formats a map coordinate for popup display. */
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

/** Renders an interactive solar panel planning map. */
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
  const [panels, setPanels] = useState<SolarPanel[]>([])
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null)
  const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null)
  const [isHoveringPanel, setIsHoveringPanel] = useState(false)
  const [nextPanelNumber, setNextPanelNumber] = useState(1)
  const [plannerNotice, setPlannerNotice] = useState<string | null>(null)

  const selectedPanel = panels.find((panel) => panel.id === selectedPanelId) ?? null
  const draftFarm = draftStart && draftCorner ? createFarmArea(draftStart, draftCorner, 'Draft farm') : null
  const searchEnabled = !farmArea || isSelectingFarm
  const panelDimensions = getSolarPanelDimensions()
  const farmCenter = farmArea ? getFarmCenter(farmArea) : null

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
    const canvas = mapRef.current?.getMap().getCanvas()
    if (!canvas) {
      return
    }

    canvas.style.cursor = draggingPanelId ? 'grabbing' : isHoveringPanel ? 'move' : ''

    return () => {
      canvas.style.cursor = ''
    }
  }, [draggingPanelId, isHoveringPanel])

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

  const findPanelIdAtEvent = (event: MapMouseEvent | MapLayerMouseEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(event.point, { layers: ['solar-panels-fill'] }) ?? []
    const panelFeature = features[0] as MapGeoJSONFeature | undefined
    return typeof panelFeature?.properties?.id === 'string' ? panelFeature.properties.id : null
  }

  const resetDraftFarm = () => {
    setDraftStart(null)
    setDraftCorner(null)
  }

  const clearFarmPlanner = (notice: string | null = null) => {
    setFarmArea(null)
    setPanels([])
    setSelectedPanelId(null)
    setIsSelectingFarm(false)
    setIsOnboardingOpen(false)
    resetSearch()
    resetDraftFarm()
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
    setPanels([])
    setSelectedPanelId(null)
    setDraggingPanelId(null)
    setFarmPanBounds(undefined)
    resetDraftFarm()
    setPlannerNotice('Click first corner.')
    setIsOnboardingOpen(false)
    setIsSelectingFarm(true)
  }

  const handleMapClick = (event: MapMouseEvent) => {
    const panelId = findPanelIdAtEvent(event)
    if (panelId && !isSelectingFarm) {
      setSelectedPanelId(panelId)
      return
    }

    if (!isSelectingFarm) {
      setSelectedPanelId(null)
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
    setPanels([])
    setSelectedPanelId(null)
    setIsSelectingFarm(false)
    setIsOnboardingOpen(false)
    resetDraftFarm()
    setPlannerNotice('Farm saved. Double-click inside to place panels.')
    fitMapToFarm(nextFarm)
  }

  const handleMapMove = (event: ViewStateChangeEvent) => {
    setViewState((currentViewState) => ({
      ...event.viewState,
      zoom: farmMinZoom ? Math.max(event.viewState.zoom, farmMinZoom) : event.viewState.zoom,
      padding: currentViewState.padding,
    }))
  }

  const handleMapPointerMove = (event: MapMouseEvent) => {
    if (draggingPanelId && farmArea) {
      const coordinate = clampCoordinateToFarm(farmArea, { latitude: event.lngLat.lat, longitude: event.lngLat.lng })
      setPanels((currentPanels) =>
        currentPanels.map((panel) =>
          panel.id === draggingPanelId ? { ...panel, latitude: coordinate.latitude, longitude: coordinate.longitude } : panel,
        ),
      )
      return
    }

    if (!isSelectingFarm) {
      setIsHoveringPanel(Boolean(findPanelIdAtEvent(event)))
    }

    if (!isSelectingFarm || !draftStart) {
      return
    }

    setDraftCorner({ latitude: event.lngLat.lat, longitude: event.lngLat.lng })
  }

  const handleMapMouseLeave = () => {
    setIsHoveringPanel(false)
    setDraggingPanelId(null)
  }

  const handleMapDoubleClick = (event: MapMouseEvent) => {
    if (isSelectingFarm) {
      return
    }

    if (!farmArea) {
      setPlannerNotice('Save a farm boundary before placing panels.')
      return
    }

    const coordinate = { latitude: event.lngLat.lat, longitude: event.lngLat.lng }
    if (!isCoordinateInsideFarm(farmArea, coordinate)) {
      setPlannerNotice('Panels can only be placed inside the saved farm boundary.')
      return
    }

    const newPanel: SolarPanel = {
      id: `panel-${nextPanelNumber}`,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      rotation: Number(viewState.bearing.toFixed(1)),
    }

    setPanels((currentPanels) => [...currentPanels, newPanel])
    setSelectedPanelId(newPanel.id)
    setNextPanelNumber((currentNumber) => currentNumber + 1)
    setPlannerNotice(null)
  }

  const handlePanelMouseDown = (event: MapLayerMouseEvent) => {
    if (isSelectingFarm) {
      return
    }

    const panelId = findPanelIdAtEvent(event)
    if (!panelId) {
      return
    }

    event.preventDefault()
    setDraggingPanelId(panelId)
    setSelectedPanelId(panelId)
  }

  const handlePanelMouseUp = () => {
    setDraggingPanelId(null)
  }

  const handleDeletePanel = () => {
    if (!selectedPanel) {
      return
    }

    setPanels((currentPanels) => currentPanels.filter((panel) => panel.id !== selectedPanel.id))
    setSelectedPanelId(null)
  }

  const panelDimensionsLabel = `${panelDimensions.lengthMeters}m x ${panelDimensions.widthMeters}m`
  const farmLabel = farmCenter ? `Lat ${formatCoordinate(farmCenter.latitude)}\nLng ${formatCoordinate(farmCenter.longitude)}` : null
  const selectedPanelSummary = selectedPanel
    ? {
        id: selectedPanel.id,
        latitude: formatCoordinate(selectedPanel.latitude),
        longitude: formatCoordinate(selectedPanel.longitude),
        rotation: `${selectedPanel.rotation.toFixed(1)} deg`,
        size: panelDimensionsLabel,
      }
    : null

  return (
    <div className="solar-pannel-map solar-pannel-map--workspace">
      <SolarPannelPlannerControls
        plannerNotice={plannerNotice}
        farmName={farmLabel}
        selectedPanel={selectedPanelSummary}
        addressQuery={addressQuery}
        addressResults={addressResults}
        isOnboardingOpen={isOnboardingOpen}
        isSearchFocused={isSearchFocused}
        isSearching={isSearching}
        isSelectingFarm={isSelectingFarm}
        onOpenOnboarding={openOnboarding}
        onCloseOnboarding={closeOnboarding}
        onResetFarm={() => clearFarmPlanner(null)}
        onDeleteSelectedPanel={handleDeletePanel}
        onStartDrawingBoundary={startFarmSelection}
        onSearchSubmit={handleAddressSubmit}
        onAddressChange={handleAddressChange}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        onSelectAddress={selectAddress}
      />

      <div className="solar-pannel-map__canvas">
        <Map
          {...viewState}
          ref={mapRef}
          reuseMaps
          dragPan={!draggingPanelId}
          doubleClickZoom={false}
          mapLib={import('maplibre-gl')}
          mapStyle={birdseyeMapStyle}
          minZoom={farmMinZoom}
          maxBounds={farmPanBounds}
          onClick={handleMapClick}
          onDblClick={handleMapDoubleClick}
          onLoad={() => {
            syncFarmViewport(farmArea)
            syncFarmPanBounds(farmArea)
          }}
          onMouseDown={handlePanelMouseDown}
          onMouseMove={handleMapPointerMove}
          onMove={handleMapMove}
          onMouseUp={handlePanelMouseUp}
          onMouseLeave={handleMapMouseLeave}
          onResize={() => {
            syncFarmViewport(farmArea)
            syncFarmPanBounds(farmArea)
          }}
        >
          <NavigationControl position="top-right" visualizePitch />

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

          <Source id="solar-panels" type="geojson" data={createPanelFeatureCollection(panels)}>
            <Layer {...solarPanelFillLayer} />
            <Layer {...solarPanelOutlineLayer} />
          </Source>

          {selectedPanel && (
            <>
              <Source id="selected-solar-panel" type="geojson" data={createPanelFeatureCollection([selectedPanel])}>
                <Layer {...selectedSolarPanelGlowLayer} />
                <Layer {...selectedSolarPanelFillLayer} />
                <Layer {...selectedSolarPanelOutlineLayer} />
              </Source>
            </>
          )}
        </Map>
      </div>
    </div>
  )
}

export default SolarPannelMap
