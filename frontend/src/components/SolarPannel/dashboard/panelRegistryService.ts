import type { PanelActionResult } from './types'

export type RealPanelLookupResult = PanelActionResult & {
  panelName: string
}

/** Defines the panel registry boundary so real API integration stays isolated. */
export interface PanelRegistryService {
  lookupRealPanelById(panelId: string): Promise<RealPanelLookupResult>
}

/** Provides temporary real-panel lookup until Spring Boot integration is wired. */
class LocalPanelRegistryService implements PanelRegistryService {
  async lookupRealPanelById(panelId: string) {
    const normalizedPanelId = panelId.trim().toUpperCase()
    return {
      ok: true,
      message: `Linked real panel ${normalizedPanelId}.`,
      panelName: `Real ${normalizedPanelId}`,
    }
  }
}

export const panelRegistryService: PanelRegistryService = new LocalPanelRegistryService()
