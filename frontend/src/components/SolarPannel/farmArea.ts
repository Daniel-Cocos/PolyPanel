export type Coordinate = {
  latitude: number
  longitude: number
}

export type FarmArea = {
  id: string
  name: string
  minLatitude: number
  maxLatitude: number
  minLongitude: number
  maxLongitude: number
}

type FarmFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: { name: string }
    geometry: {
      type: 'Polygon'
      coordinates: number[][][]
    }
  }>
}

const SAVED_FARM_STORAGE_KEY = 'solar-pannel-saved-farm'

/** Normalizes farm bounds so min/max coordinates always stay ordered. */
function normalizeFarmAreaBounds(farmArea: FarmArea): FarmArea {
  return {
    ...farmArea,
    minLatitude: Math.min(farmArea.minLatitude, farmArea.maxLatitude),
    maxLatitude: Math.max(farmArea.minLatitude, farmArea.maxLatitude),
    minLongitude: Math.min(farmArea.minLongitude, farmArea.maxLongitude),
    maxLongitude: Math.max(farmArea.minLongitude, farmArea.maxLongitude),
  }
}

/** Creates a square farm area from two corner coordinates. */
export function createFarmArea(start: Coordinate, end: Coordinate, name: string): FarmArea {
  const latSpan = Math.abs(end.latitude - start.latitude)
  const lngSpan = Math.abs(end.longitude - start.longitude)
  const span = Math.max(latSpan, lngSpan)

  return normalizeFarmAreaBounds({
    id: 'saved-farm',
    name,
    minLatitude: start.latitude,
    maxLatitude: start.latitude + (end.latitude >= start.latitude ? span : -span),
    minLongitude: start.longitude,
    maxLongitude: start.longitude + (end.longitude >= start.longitude ? span : -span),
  })
}

/** Returns the map center of a farm area. */
export function getFarmCenter(farmArea: FarmArea): Coordinate {
  return {
    latitude: (farmArea.minLatitude + farmArea.maxLatitude) / 2,
    longitude: (farmArea.minLongitude + farmArea.maxLongitude) / 2,
  }
}

/** Returns map bounds in the order expected by MapLibre. */
export function getFarmBounds(farmArea: FarmArea): [[number, number], [number, number]] {
  return [
    [farmArea.minLongitude, farmArea.minLatitude],
    [farmArea.maxLongitude, farmArea.maxLatitude],
  ]
}

/** Checks whether a coordinate falls inside the saved farm area. */
export function isCoordinateInsideFarm(farmArea: FarmArea, coordinate: Coordinate) {
  return (
    coordinate.latitude >= farmArea.minLatitude &&
    coordinate.latitude <= farmArea.maxLatitude &&
    coordinate.longitude >= farmArea.minLongitude &&
    coordinate.longitude <= farmArea.maxLongitude
  )
}

/** Clamps a coordinate to the nearest point inside the farm boundary. */
export function clampCoordinateToFarm(farmArea: FarmArea, coordinate: Coordinate): Coordinate {
  return {
    latitude: Math.min(Math.max(coordinate.latitude, farmArea.minLatitude), farmArea.maxLatitude),
    longitude: Math.min(Math.max(coordinate.longitude, farmArea.minLongitude), farmArea.maxLongitude),
  }
}

/** Converts a farm area into polygon data for the map overlay. */
export function createFarmFeatureCollection(farmArea: FarmArea): FarmFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: farmArea.name },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [farmArea.minLongitude, farmArea.minLatitude],
              [farmArea.maxLongitude, farmArea.minLatitude],
              [farmArea.maxLongitude, farmArea.maxLatitude],
              [farmArea.minLongitude, farmArea.maxLatitude],
              [farmArea.minLongitude, farmArea.minLatitude],
            ],
          ],
        },
      },
    ],
  }
}

/** Loads a previously saved farm area from local storage. */
export function loadSavedFarmArea() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem(SAVED_FARM_STORAGE_KEY)
    if (!value) {
      return null
    }

    const parsed = JSON.parse(value) as FarmArea
    if (
      typeof parsed?.name !== 'string' ||
      typeof parsed.minLatitude !== 'number' ||
      typeof parsed.maxLatitude !== 'number' ||
      typeof parsed.minLongitude !== 'number' ||
      typeof parsed.maxLongitude !== 'number'
    ) {
      return null
    }

    return normalizeFarmAreaBounds(parsed)
  } catch {
    return null
  }
}

/** Persists or removes the saved farm area in local storage. */
export function persistFarmArea(farmArea: FarmArea | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!farmArea) {
    window.localStorage.removeItem(SAVED_FARM_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(SAVED_FARM_STORAGE_KEY, JSON.stringify(farmArea))
}
