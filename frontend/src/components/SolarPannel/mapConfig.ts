import type { CircleLayerSpecification, FillLayerSpecification, LineLayerSpecification, StyleSpecification } from 'maplibre-gl'

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
