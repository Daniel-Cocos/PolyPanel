import { useEffect, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import Map, {
  type MapMouseEvent,
  Marker,
  type MarkerEvent,
  NavigationControl,
  Popup,
  type MarkerDragEvent,
  type StyleSpecification,
  type ViewStateChangeEvent,
  type ViewState,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import './SolarPannelMap.css'
import { searchAddresses, type AddressSuggestion } from './addressLookup'

type SolarPanel = {
  id: string
  latitude: number
  longitude: number
  rotation: number
}

const initialViewState: ViewState = {
  longitude: -1.5486,
  latitude: 52.4159,
  zoom: 17,
  pitch: 52,
  bearing: -24,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
}

const birdseyeMapStyle: StyleSpecification = {
  version: 8,
  sources: {
    imagery: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    },
  },
  layers: [{ id: 'imagery', type: 'raster', source: 'imagery' }],
}

/** Formats a map coordinate for popup display. */
function formatCoordinate(value: number) {
  return value.toFixed(6)
}

/** Renders an interactive solar panel planning map. */
function SolarPannelMap() {
  const [viewState, setViewState] = useState(initialViewState)
  const [panels, setPanels] = useState<SolarPanel[]>([])
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null)
  const [nextPanelNumber, setNextPanelNumber] = useState(1)
  const [addressQuery, setAddressQuery] = useState('')
  const [addressResults, setAddressResults] = useState<AddressSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const selectedPanel = panels.find((panel) => panel.id === selectedPanelId) ?? null

  useEffect(() => {
    if (addressQuery.trim().length < 3) {
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true)
        setAddressResults(await searchAddresses(addressQuery.trim(), viewState.latitude, viewState.longitude, controller.signal))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setAddressResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [addressQuery, viewState.latitude, viewState.longitude])

  const handleMapDoubleClick = (event: MapMouseEvent) => {
    const newPanel: SolarPanel = {
      id: `panel-${nextPanelNumber}`,
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
      rotation: Number(viewState.bearing.toFixed(1)),
    }

    setPanels((currentPanels) => [...currentPanels, newPanel])
    setSelectedPanelId(newPanel.id)
    setNextPanelNumber((currentNumber) => currentNumber + 1)
  }

  const handlePanelDragEnd =
    (panelId: string) =>
    (event: MarkerDragEvent) => {
      setPanels((currentPanels) =>
        currentPanels.map((panel) =>
          panel.id === panelId
            ? { ...panel, latitude: event.lngLat.lat, longitude: event.lngLat.lng }
            : panel,
        ),
      )
      setSelectedPanelId(panelId)
    }

  const handleDeletePanel = () => {
    if (!selectedPanel) {
      return
    }

    setPanels((currentPanels) => currentPanels.filter((panel) => panel.id !== selectedPanel.id))
    setSelectedPanelId(null)
  }

  const selectAddress = (result: AddressSuggestion) => {
    setAddressQuery(result.label)
    setAddressResults([])
    setIsSearchFocused(false)
    setViewState((currentViewState) => ({
      ...currentViewState,
      latitude: result.latitude,
      longitude: result.longitude,
      zoom: Math.max(currentViewState.zoom, 18),
    }))
  }

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (addressResults[0]) {
      selectAddress(addressResults[0])
    }
  }

  const handleAddressChange = (value: string) => {
    setAddressQuery(value)
    if (value.trim().length < 3) {
      setAddressResults([])
      setIsSearching(false)
    }
  }

  return (
    <div className="solar-pannel-map">
      <div className="solar-pannel-map__hint">Double-click anywhere on the bird&apos;s-eye map to place a panel.</div>

      <div className="solar-pannel-map__canvas">
        <div className="solar-pannel-map__search-shell">
          <form className="solar-pannel-map__search" onSubmit={handleAddressSubmit}>
            <input
              className="solar-pannel-map__search-input"
              type="search"
              placeholder="Search an address"
              value={addressQuery}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(event) => handleAddressChange(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            <button type="submit" className="solar-pannel-map__search-button">Go</button>
          </form>

          {isSearchFocused && (isSearching || addressResults.length > 0) && (
            <div className="solar-pannel-map__results">
              {isSearching && <p className="solar-pannel-map__results-state">Searching...</p>}
              {!isSearching && addressResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  className="solar-pannel-map__result"
                  onClick={() => selectAddress(result)}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {result.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Map
          {...viewState}
          reuseMaps
          doubleClickZoom={false}
          mapLib={import('maplibre-gl')}
          mapStyle={birdseyeMapStyle}
          onClick={() => setSelectedPanelId(null)}
          onDblClick={handleMapDoubleClick}
          onMove={(event: ViewStateChangeEvent) => setViewState(event.viewState)}
        >
          <NavigationControl position="top-right" visualizePitch />

          {panels.map((panel) => (
            <Marker
              key={panel.id}
              anchor="center"
              draggable
              latitude={panel.latitude}
              longitude={panel.longitude}
              pitchAlignment="map"
              rotation={panel.rotation}
              rotationAlignment="map"
              onClick={(event: MarkerEvent<MouseEvent>) => {
                event.originalEvent.stopPropagation()
                setSelectedPanelId(panel.id)
              }}
              onDragStart={() => setSelectedPanelId(panel.id)}
              onDragEnd={handlePanelDragEnd(panel.id)}
            >
              <button
                type="button"
                className="solar-pannel-map__panel"
                aria-label={`Open ${panel.id}`}
                onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation()
                  setSelectedPanelId(panel.id)
                }}
              />
            </Marker>
          ))}

          {selectedPanel && (
            <Popup
              anchor="top"
              className="solar-pannel-map__popup"
              closeOnClick={false}
              latitude={selectedPanel.latitude}
              longitude={selectedPanel.longitude}
              maxWidth="260px"
              offset={16}
              onClose={() => setSelectedPanelId(null)}
            >
              <div className="solar-pannel-map__popup-content">
                <p>
                  <strong>Panel ID:</strong> {selectedPanel.id}
                </p>
                <p>
                  <strong>Latitude:</strong> {formatCoordinate(selectedPanel.latitude)}
                </p>
                <p>
                  <strong>Longitude:</strong> {formatCoordinate(selectedPanel.longitude)}
                </p>
                <p>
                  <strong>Rotation:</strong> {selectedPanel.rotation.toFixed(1)} deg
                </p>
                <button type="button" className="solar-pannel-map__delete" onClick={handleDeletePanel}>
                  Delete panel
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  )
}

export default SolarPannelMap
