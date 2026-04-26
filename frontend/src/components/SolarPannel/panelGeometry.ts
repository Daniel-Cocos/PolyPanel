type SolarPanelShape = {
  id: string
  latitude: number
  longitude: number
  rotation: number
}

type PanelFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: { id: string }
    geometry: {
      type: 'Polygon'
      coordinates: number[][][]
    }
  }>
}

type PanelHandleFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: { id: string }
    geometry: {
      type: 'Point'
      coordinates: number[]
    }
  }>
}

const PANEL_SCALE_FACTOR = 2.5
const PANEL_LENGTH_METERS = 4.56 * PANEL_SCALE_FACTOR
const PANEL_WIDTH_METERS = 2.26 * PANEL_SCALE_FACTOR

/** Converts meters to latitude degrees near the given location. */
function metersToLatitudeDegrees(meters: number) {
  return meters / 111_320
}

/** Converts meters to longitude degrees near the given location. */
function metersToLongitudeDegrees(meters: number, latitude: number) {
  const latitudeRadians = (latitude * Math.PI) / 180
  const metersPerDegree = 111_320 * Math.cos(latitudeRadians)
  return metersPerDegree === 0 ? 0 : meters / metersPerDegree
}

/** Rotates a panel corner offset around the panel center. */
function rotateOffset(xMeters: number, yMeters: number, rotationDegrees: number) {
  const rotationRadians = (rotationDegrees * Math.PI) / 180
  const cos = Math.cos(rotationRadians)
  const sin = Math.sin(rotationRadians)

  return {
    x: xMeters * cos - yMeters * sin,
    y: xMeters * sin + yMeters * cos,
  }
}

/** Builds a real-world panel footprint polygon centered on the panel position. */
function createPanelCoordinates(panel: SolarPanelShape) {
  const halfLength = PANEL_LENGTH_METERS / 2
  const halfWidth = PANEL_WIDTH_METERS / 2
  const corners = [
    { x: -halfLength, y: -halfWidth },
    { x: halfLength, y: -halfWidth },
    { x: halfLength, y: halfWidth },
    { x: -halfLength, y: halfWidth },
  ]

  const coordinates = corners.map((corner) => {
    const rotated = rotateOffset(corner.x, corner.y, panel.rotation)
    return [
      panel.longitude + metersToLongitudeDegrees(rotated.x, panel.latitude),
      panel.latitude + metersToLatitudeDegrees(rotated.y),
    ]
  })

  return [...coordinates, coordinates[0]]
}

/** Returns the four draggable panel corners as point features. */
function createPanelCornerCoordinates(panel: SolarPanelShape) {
  return createPanelCoordinates(panel).slice(0, 4)
}

/** Converts panel state into a GeoJSON feature collection for map rendering. */
export function createPanelFeatureCollection(panels: SolarPanelShape[]): PanelFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: panels.map((panel) => ({
      type: 'Feature',
      properties: { id: panel.id },
      geometry: {
        type: 'Polygon',
        coordinates: [createPanelCoordinates(panel)],
      },
    })),
  }
}

/** Converts a panel into visible drag-handle points for the selected state. */
export function createPanelHandleFeatureCollection(panel: SolarPanelShape): PanelHandleFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: createPanelCornerCoordinates(panel).map((coordinate, index) => ({
      type: 'Feature',
      properties: { id: `${panel.id}-handle-${index}` },
      geometry: {
        type: 'Point',
        coordinates: coordinate,
      },
    })),
  }
}

/** Returns the physical dimensions used for a single solar panel. */
export function getSolarPanelDimensions() {
  return { lengthMeters: PANEL_LENGTH_METERS, widthMeters: PANEL_WIDTH_METERS }
}
