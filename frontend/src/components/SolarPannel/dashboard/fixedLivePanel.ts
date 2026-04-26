import type { Panel } from './types'

export const FIXED_LIVE_PANEL_ID = 'real-panel-cell-1-1'
export const FIXED_LIVE_PANEL_CELL_ID = 'cell-1-1'

/** Returns the hardcoded live panel that must stay attached to cell (1,1). */
export function createFixedLivePanel(): Panel {
  return {
    id: FIXED_LIVE_PANEL_ID,
    name: 'Live Panel 1,1',
    type: 'real',
    realPanelId: 'LIVE-1-1',
    mode: 'sun_tracking',
    linkedGridCellId: FIXED_LIVE_PANEL_CELL_ID,
  }
}

/** Checks whether a panel is the hardcoded live panel. */
export function isFixedLivePanel(panelId: string) {
  return panelId === FIXED_LIVE_PANEL_ID
}
