import type { FarmArea } from './farmArea'

export type GridCellContent = 'empty' | 'real-panel' | 'proposed-panel'

export type GridCell = {
  id: string
  row: number
  column: number
  minLatitude: number
  maxLatitude: number
  minLongitude: number
  maxLongitude: number
  centerLatitude: number
  centerLongitude: number
}

type GridFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      row: number
      column: number
      content: GridCellContent
    }
    geometry: {
      type: 'Polygon'
      coordinates: number[][][]
    }
  }>
}

const METERS_PER_LATITUDE_DEGREE = 111_320

/** Converts latitude degrees to meters. */
function latitudeDegreesToMeters(latitudeDegrees: number) {
  return latitudeDegrees * METERS_PER_LATITUDE_DEGREE
}

/** Converts longitude degrees to meters for a latitude. */
function longitudeDegreesToMeters(longitudeDegrees: number, latitude: number) {
  const latitudeRadians = (latitude * Math.PI) / 180
  return longitudeDegrees * METERS_PER_LATITUDE_DEGREE * Math.cos(latitudeRadians)
}

/** Builds deterministic farm grid cells using the requested physical cell size. */
export function createFarmGridCells(farmArea: FarmArea, cellLengthMeters: number, cellWidthMeters: number) {
  const farmLatitudeSpan = farmArea.maxLatitude - farmArea.minLatitude
  const farmLongitudeSpan = farmArea.maxLongitude - farmArea.minLongitude
  const farmCenterLatitude = (farmArea.minLatitude + farmArea.maxLatitude) / 2
  const farmHeightMeters = latitudeDegreesToMeters(farmLatitudeSpan)
  const farmWidthMeters = longitudeDegreesToMeters(farmLongitudeSpan, farmCenterLatitude)
  const rowCount = Math.max(1, Math.floor(farmHeightMeters / cellWidthMeters))
  const columnCount = Math.max(1, Math.floor(farmWidthMeters / cellLengthMeters))
  const latitudeStep = farmLatitudeSpan / rowCount
  const longitudeStep = farmLongitudeSpan / columnCount

  const cells: GridCell[] = []

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const maxLatitude = farmArea.maxLatitude - rowIndex * latitudeStep
    const minLatitude = maxLatitude - latitudeStep

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const minLongitude = farmArea.minLongitude + columnIndex * longitudeStep
      const maxLongitude = minLongitude + longitudeStep
      const row = rowIndex + 1
      const column = columnIndex + 1

      cells.push({
        id: `cell-${row}-${column}`,
        row,
        column,
        minLatitude,
        maxLatitude,
        minLongitude,
        maxLongitude,
        centerLatitude: (minLatitude + maxLatitude) / 2,
        centerLongitude: (minLongitude + maxLongitude) / 2,
      })
    }
  }

  return cells
}

/** Converts farm grid cell state into a map feature collection. */
export function createFarmGridFeatureCollection(
  cells: GridCell[],
  assignments: Record<string, GridCellContent>,
): GridFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: cells.map((cell) => ({
      type: 'Feature',
      properties: {
        id: cell.id,
        row: cell.row,
        column: cell.column,
        content: assignments[cell.id] ?? 'empty',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [cell.minLongitude, cell.minLatitude],
            [cell.maxLongitude, cell.minLatitude],
            [cell.maxLongitude, cell.maxLatitude],
            [cell.minLongitude, cell.maxLatitude],
            [cell.minLongitude, cell.minLatitude],
          ],
        ],
      },
    })),
  }
}

/** Builds a single-cell feature collection for selected highlight rendering. */
export function createSelectedGridCellFeatureCollection(cell: GridCell): GridFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: cell.id,
          row: cell.row,
          column: cell.column,
          content: 'empty',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [cell.minLongitude, cell.minLatitude],
              [cell.maxLongitude, cell.minLatitude],
              [cell.maxLongitude, cell.maxLatitude],
              [cell.minLongitude, cell.maxLatitude],
              [cell.minLongitude, cell.minLatitude],
            ],
          ],
        },
      },
    ],
  }
}
