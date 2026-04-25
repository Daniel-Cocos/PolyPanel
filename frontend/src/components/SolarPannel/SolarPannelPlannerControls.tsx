import type { AddressSuggestion } from './addressLookup'

type SolarPannelPlannerControlsProps = {
  farmName: string | null
  plannerNotice: string | null
  selectedPanel: {
    id: string
    latitude: string
    longitude: string
    rotation: string
    size: string
  } | null
  addressQuery: string
  addressResults: AddressSuggestion[]
  isOnboardingOpen: boolean
  isSearchFocused: boolean
  isSearching: boolean
  isSelectingFarm: boolean
  onOpenOnboarding: () => void
  onCloseOnboarding: () => void
  onResetFarm: () => void
  onDeleteSelectedPanel: () => void
  onStartDrawingBoundary: () => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onAddressChange: (value: string) => void
  onSearchFocus: () => void
  onSearchBlur: () => void
  onSelectAddress: (result: AddressSuggestion) => void
}

/** Renders a minimal farm selector with modal onboarding. */
function SolarPannelPlannerControls({
  farmName,
  plannerNotice,
  selectedPanel,
  addressQuery,
  addressResults,
  isOnboardingOpen,
  isSearchFocused,
  isSearching,
  isSelectingFarm,
  onOpenOnboarding,
  onCloseOnboarding,
  onResetFarm,
  onDeleteSelectedPanel,
  onStartDrawingBoundary,
  onSearchSubmit,
  onAddressChange,
  onSearchFocus,
  onSearchBlur,
  onSelectAddress,
}: SolarPannelPlannerControlsProps) {
  return (
    <aside className="solar-pannel-map__sidebar">
      <div className="solar-pannel-map__farm-bar">
        {!farmName && !isSelectingFarm && (
          <>
            <span className="solar-pannel-map__farm-label">No farm selected</span>
            <button type="button" className="solar-pannel-map__icon-button" aria-label="Add farm" onClick={onOpenOnboarding}>
              +
            </button>
          </>
        )}

        {isSelectingFarm && (
          <>
            <span className="solar-pannel-map__farm-label">Drawing farm</span>
            <button type="button" className="solar-pannel-map__reset-button" onClick={onResetFarm}>
              Cancel
            </button>
          </>
        )}

        {farmName && !isSelectingFarm && (
          <>
            <span className="solar-pannel-map__farm-label solar-pannel-map__farm-label--selected">{farmName}</span>
            <button type="button" className="solar-pannel-map__reset-button" onClick={onResetFarm}>
              Reset
            </button>
          </>
        )}
      </div>

      {plannerNotice && <p className="solar-pannel-map__notice">{plannerNotice}</p>}

      {isOnboardingOpen && (
        <div className="solar-pannel-map__modal-backdrop" role="presentation" onClick={onCloseOnboarding}>
          <div className="solar-pannel-map__modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h2 className="solar-pannel-map__modal-title">Choose address</h2>

            <form className="solar-pannel-map__search" onSubmit={onSearchSubmit}>
              <div className="solar-pannel-map__search-row">
                <input
                  id="solar-pannel-search-input"
                  className="solar-pannel-map__search-input"
                  type="search"
                  aria-label="Choose address"
                  placeholder="Farm name, address, or postcode"
                  value={addressQuery}
                  onBlur={onSearchBlur}
                  onChange={(event) => onAddressChange(event.target.value)}
                  onFocus={onSearchFocus}
                />
              </div>
            </form>

            {isSearchFocused && (isSearching || addressResults.length > 0) && (
              <div className="solar-pannel-map__results">
                {isSearching && <p className="solar-pannel-map__results-state">Searching...</p>}
                {!isSearching && addressResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="solar-pannel-map__result"
                    onClick={() => onSelectAddress(result)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {result.label}
                  </button>
                ))}
              </div>
            )}

            <div className="solar-pannel-map__modal-actions">
              <button type="button" className="solar-pannel-map__modal-button solar-pannel-map__modal-button--secondary" onClick={onCloseOnboarding}>
                Close
              </button>
              <button type="button" className="solar-pannel-map__modal-button" onClick={onStartDrawingBoundary}>
                Draw farm
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPanel && (
        <div className="solar-pannel-map__panel-box">
          <p className="solar-pannel-map__search-label">Selected panel</p>
          <h3 className="solar-pannel-map__panel-title">{selectedPanel.id}</h3>
          <p className="solar-pannel-map__panel-hint">Drag on the map to reposition</p>
          <dl className="solar-pannel-map__panel-grid">
            <div>
              <dt>Latitude</dt>
              <dd>{selectedPanel.latitude}</dd>
            </div>
            <div>
              <dt>Longitude</dt>
              <dd>{selectedPanel.longitude}</dd>
            </div>
            <div>
              <dt>Rotation</dt>
              <dd>{selectedPanel.rotation}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{selectedPanel.size}</dd>
            </div>
          </dl>
          <button type="button" className="solar-pannel-map__reset-button solar-pannel-map__panel-delete" onClick={onDeleteSelectedPanel}>
            Delete panel
          </button>
        </div>
      )}
    </aside>
  )
}

export default SolarPannelPlannerControls
