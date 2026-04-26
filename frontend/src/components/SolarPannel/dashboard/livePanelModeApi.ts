import axios from 'axios'
import type { PanelMode } from './types'

const livePanelModeIds: Record<PanelMode, number> = {
  flat_down: 0,
  sun_tracking: 1,
  letting_sun_in: 2,
}

/** Sends the selected live-panel mode to the backend API. */
export async function syncLivePanelMode(mode: PanelMode) {
  const modeId = livePanelModeIds[mode]
  await axios.get(`http://localhost:8080/API/mode/${modeId}`)
}
