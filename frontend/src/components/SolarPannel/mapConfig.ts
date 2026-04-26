import type {
  CircleLayerSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  StyleSpecification,
} from 'maplibre-gl'

export const birdseyeMapStyle: StyleSpecification = {
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

export const savedFarmFillLayer: FillLayerSpecification = {
  id: 'saved-farm-fill',
  source: 'saved-farm',
  type: 'fill',
  paint: {
    'fill-color': '#49c889',
    'fill-opacity': 0.14,
  },
}

export const savedFarmOutlineLayer: LineLayerSpecification = {
  id: 'saved-farm-outline',
  source: 'saved-farm',
  type: 'line',
  paint: {
    'line-color': '#49c889',
    'line-width': 2,
  },
}

export const farmGridFillLayer: FillLayerSpecification = {
  id: 'farm-grid-fill',
  source: 'farm-grid',
  type: 'fill',
  paint: {
    'fill-color': [
      'case',
      ['==', ['get', 'content'], 'real-panel'],
      '#1f7fab',
      ['==', ['get', 'content'], 'fake-panel'],
      '#2f9f72',
      '#a7d2e5',
    ],
    'fill-opacity': [
      'case',
      ['==', ['get', 'content'], 'real-panel'],
      0.8,
      ['==', ['get', 'content'], 'fake-panel'],
      0.74,
      0.14,
    ],
  },
}

export const farmGridOutlineLayer: LineLayerSpecification = {
  id: 'farm-grid-outline',
  source: 'farm-grid',
  type: 'line',
  paint: {
    'line-color': [
      'case',
      ['==', ['get', 'content'], 'real-panel'],
      '#d5f1ff',
      ['==', ['get', 'content'], 'fake-panel'],
      '#d2ffe9',
      'rgba(216, 237, 247, 0.82)',
    ],
    'line-width': [
      'case',
      ['==', ['get', 'content'], 'empty'],
      1,
      1.4,
    ],
  },
}

export const selectedGridCellOutlineLayer: LineLayerSpecification = {
  id: 'selected-grid-cell-outline',
  source: 'selected-grid-cell',
  type: 'line',
  paint: {
    'line-color': '#dff4ff',
    'line-width': 2.6,
  },
}

export const selectedGridCellGlowLayer: LineLayerSpecification = {
  id: 'selected-grid-cell-glow',
  source: 'selected-grid-cell',
  type: 'line',
  paint: {
    'line-color': '#37a5dc',
    'line-width': 8,
    'line-opacity': 0.38,
  },
}

export const selectedGridCellFillLayer: FillLayerSpecification = {
  id: 'selected-grid-cell-fill',
  source: 'selected-grid-cell',
  type: 'fill',
  paint: {
    'fill-color': '#2b96cf',
    'fill-opacity': 0.28,
  },
}

export const draftFarmOutlineLayer: LineLayerSpecification = {
  id: 'draft-farm-outline',
  source: 'draft-farm',
  type: 'line',
  paint: {
    'line-color': '#ffffff',
    'line-width': 2,
    'line-dasharray': [2, 2],
  },
}

export const solarPanelFillLayer: FillLayerSpecification = {
  id: 'solar-panels-fill',
  source: 'solar-panels',
  type: 'fill',
  paint: {
    'fill-color': '#1a6388',
    'fill-opacity': 0.9,
  },
}

export const solarPanelOutlineLayer: LineLayerSpecification = {
  id: 'solar-panels-outline',
  source: 'solar-panels',
  type: 'line',
  paint: {
    'line-color': '#d8edf7',
    'line-width': 1,
  },
}

export const selectedSolarPanelFillLayer: FillLayerSpecification = {
  id: 'selected-solar-panel-fill',
  source: 'selected-solar-panel',
  type: 'fill',
  paint: {
    'fill-color': '#2d6a88',
    'fill-opacity': 0.96,
  },
}

export const selectedSolarPanelGlowLayer: LineLayerSpecification = {
  id: 'selected-solar-panel-glow',
  source: 'selected-solar-panel',
  type: 'line',
  paint: {
    'line-color': '#49c889',
    'line-width': 7,
    'line-opacity': 0.28,
  },
}

export const selectedSolarPanelOutlineLayer: LineLayerSpecification = {
  id: 'selected-solar-panel-outline',
  source: 'selected-solar-panel',
  type: 'line',
  paint: {
    'line-color': '#ffffff',
    'line-width': 2,
  },
}

export const selectedSolarPanelHandleLayer: CircleLayerSpecification = {
  id: 'selected-solar-panel-handles',
  source: 'selected-solar-panel-handles',
  type: 'circle',
  paint: {
    'circle-radius': 4,
    'circle-color': '#ffffff',
    'circle-stroke-color': '#14506d',
    'circle-stroke-width': 2,
  },
}
