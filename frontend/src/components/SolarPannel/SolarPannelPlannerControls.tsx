import { useState } from 'react'
import {
  Backdrop,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import type { AddressSuggestion } from './addressLookup'
import {
  FaArrowsRotate,
  FaBolt,
  FaCircleInfo,
  FaDroplet,
  FaLink,
  FaLocationDot,
  FaSeedling,
  FaSliders,
  FaTemperatureHalf,
  FaTrash,
} from 'react-icons/fa6'
import { dashboardPalette } from './dashboard/styles'
import type { Panel, PanelActionResult, PanelMetrics, PanelMode } from './dashboard/types'

type SolarPannelPlannerControlsProps = {
  farmCenter: { latitude: string; longitude: string } | null
  plannerNotice: string | null
  selectedGridCell: {
    id: string
    row: number
    column: number
    latitude: string
    longitude: string
    content: 'empty' | 'real-panel' | 'fake-panel'
    panel: string
  } | null
  selectedGridCellPanel: Panel | null
  selectedGridCellPanelMetrics: PanelMetrics | null
  addressQuery: string
  addressResults: AddressSuggestion[]
  isOnboardingOpen: boolean
  isSearchFocused: boolean
  isSearching: boolean
  isSelectingFarm: boolean
  onOpenOnboarding: () => void
  onCloseOnboarding: () => void
  onResetFarm: () => void
  onStartDrawingBoundary: () => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onAddressChange: (value: string) => void
  onSearchFocus: () => void
  onSearchBlur: () => void
  onSelectAddress: (result: AddressSuggestion) => void
  onAssignRealPanel: (panelId: string) => Promise<PanelActionResult>
  onAssignFakePanel: () => PanelActionResult
  onClearSelectedGridCellPanel: () => void
  onSetPanelMode: (panelId: string, mode: PanelMode) => void
}

const sectionTitleSx = {
  color: dashboardPalette.accent,
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.6,
  lineHeight: 1.2,
}

const detailsTextSx = {
  color: dashboardPalette.text,
  fontSize: '0.96rem',
  lineHeight: 1.45,
}

const prominentValueSx = {
  color: dashboardPalette.text,
  fontSize: '1.8rem',
  fontWeight: 700,
  letterSpacing: '-0.04em',
  lineHeight: 1,
}

const secondaryValueSx = {
  color: dashboardPalette.muted,
  fontSize: '0.98rem',
  lineHeight: 1.25,
}

const controlButtonSx = {
  minHeight: 50,
  color: dashboardPalette.text,
  fontSize: '0.96rem',
  fontWeight: 650,
  letterSpacing: '0.005em',
  textTransform: 'none',
  borderRadius: 1.2,
}

const actionCardSx = {
  p: 1,
  border: `1px solid ${dashboardPalette.border}`,
  borderRadius: 1.2,
  bgcolor: 'rgba(4, 18, 27, 0.48)',
  display: 'grid',
  gap: 0.75,
}

const actionTitleSx = {
  color: dashboardPalette.text,
  fontSize: '0.92rem',
  fontWeight: 700,
  lineHeight: 1.3,
}

const actionCaptionSx = {
  color: dashboardPalette.muted,
  fontSize: '0.82rem',
  lineHeight: 1.45,
}

const metricValueSx = {
  color: dashboardPalette.text,
  mt: 0.35,
  fontSize: '0.98rem',
  lineHeight: 1.25,
}

const sectionDividerSx = {
  borderColor: dashboardPalette.border,
}

/** Renders left planning controls using MUI primitives only. */
function SolarPannelPlannerControls({
  farmCenter,
  plannerNotice,
  selectedGridCell,
  selectedGridCellPanel,
  selectedGridCellPanelMetrics,
  addressQuery,
  addressResults,
  isOnboardingOpen,
  isSearchFocused,
  isSearching,
  isSelectingFarm,
  onOpenOnboarding,
  onCloseOnboarding,
  onResetFarm,
  onStartDrawingBoundary,
  onSearchSubmit,
  onAddressChange,
  onSearchFocus,
  onSearchBlur,
  onSelectAddress,
  onAssignRealPanel,
  onAssignFakePanel,
  onClearSelectedGridCellPanel,
  onSetPanelMode,
}: SolarPannelPlannerControlsProps) {
  const [realPanelIdInput, setRealPanelIdInput] = useState('')
  const [isSavingPanel, setIsSavingPanel] = useState(false)
  const [panelActionMessage, setPanelActionMessage] = useState('')

  const handleAssignRealPanel = async () => {
    const normalizedPanelId = realPanelIdInput.trim()
    if (!normalizedPanelId) {
      setPanelActionMessage('Enter a panel ID.')
      return
    }

    setIsSavingPanel(true)
    const actionResult = await onAssignRealPanel(normalizedPanelId)
    setPanelActionMessage(actionResult.ok ? '' : actionResult.message)
    setIsSavingPanel(false)
    if (actionResult.ok) {
      setRealPanelIdInput('')
    }
  }

  const handleAssignFakePanel = () => {
    const actionResult = onAssignFakePanel()
    setPanelActionMessage(actionResult.ok ? '' : actionResult.message)
  }

  const handleModeChange = (event: SelectChangeEvent) => {
    if (!selectedGridCellPanel) {
      return
    }

    onSetPanelMode(selectedGridCellPanel.id, event.target.value as PanelMode)
  }

  return (
    <Box
      component="aside"
      sx={{
        borderRight: `1px solid ${dashboardPalette.border}`,
        background: dashboardPalette.panelSoft,
        backdropFilter: 'blur(14px)',
        px: 1.15,
        py: 1,
        display: 'grid',
        alignContent: 'start',
        gap: 1,
        overflowY: 'auto',
      }}
    >
      <Box sx={{ py: 0.25, display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' }}>
        {!farmCenter && !isSelectingFarm && (
          <>
            <Typography sx={{ color: dashboardPalette.muted, alignSelf: 'center' }}>No farm selected</Typography>
            <IconButton size="small" onClick={onOpenOnboarding} aria-label="Add farm" sx={{ color: dashboardPalette.text, bgcolor: dashboardPalette.accent, '&:hover': { bgcolor: dashboardPalette.accentDark }, width: 28, height: 28 }}>
              +
            </IconButton>
          </>
        )}

        {isSelectingFarm && (
          <>
            <Typography sx={{ color: dashboardPalette.muted, alignSelf: 'center' }}>Drawing farm</Typography>
            <Button size="small" onClick={onResetFarm} sx={{ color: dashboardPalette.text, borderColor: dashboardPalette.border }} variant="outlined">
              Cancel
            </Button>
          </>
        )}

        {farmCenter && !isSelectingFarm && (
          <>
            <Stack spacing={0.75}>
              <Typography sx={sectionTitleSx}><FaLocationDot size={11} />Farm center</Typography>
              <Typography sx={detailsTextSx}>Latitude: {farmCenter.latitude}</Typography>
              <Typography sx={detailsTextSx}>Longitude: {farmCenter.longitude}</Typography>
            </Stack>
            <IconButton onClick={onResetFarm} aria-label="Reset farm selection" sx={{ width: 38, height: 38, border: `1px solid ${dashboardPalette.border}`, color: dashboardPalette.muted }}>
              <FaArrowsRotate size={14} />
            </IconButton>
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: dashboardPalette.border, my: 0.2 }} />

      {plannerNotice && <Typography sx={{ color: '#ffcf9e', fontSize: '0.92rem' }}>{plannerNotice}</Typography>}

      <Backdrop open={isOnboardingOpen} sx={{ zIndex: 1200, bgcolor: 'rgba(7,20,28,0.72)' }} onClick={onCloseOnboarding}>
        <Paper sx={{ width: { xs: '92vw', sm: 360 }, p: 1.2, bgcolor: dashboardPalette.panel, marginLeft: "-10px"}} onClick={(event) => event.stopPropagation()}>
          <Typography variant="h6" sx={{ color: dashboardPalette.text, mb: 1 }}>Choose address</Typography>
          <Box component="form" onSubmit={onSearchSubmit} sx={{ display: 'grid', gap: 0.8 }}>
            <TextField
              size="small"
              placeholder="Farm name, address, or postcode"
              value={addressQuery}
              onBlur={onSearchBlur}
              onChange={(event) => onAddressChange(event.target.value)}
              onFocus={onSearchFocus}
              sx={{ '& .MuiInputBase-root': { color: dashboardPalette.text } }}
            />
          </Box>

          {isSearchFocused && (isSearching || addressResults.length > 0) && (
            <Stack spacing={0.4} sx={{ mt: 1 }}>
              {isSearching && <Typography sx={{ color: dashboardPalette.muted }}>Searching...</Typography>}
              {!isSearching && addressResults.map((result) => (
                <Button key={result.id} onMouseDown={(event) => event.preventDefault()} onClick={() => onSelectAddress(result)} sx={{ justifyContent: 'flex-start', color: dashboardPalette.text }}>
                  {result.label}
                </Button>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={0.7} sx={{ mt: 1 }}>
            <Button fullWidth variant="outlined" onClick={onCloseOnboarding} sx={{ borderColor: dashboardPalette.border, color: dashboardPalette.text }}>Close</Button>
            <Button fullWidth variant="contained" onClick={onStartDrawingBoundary} sx={{ bgcolor: dashboardPalette.accentDark }}>Draw farm</Button>
          </Stack>
        </Paper>
      </Backdrop>

      {selectedGridCell && (
        <Box sx={{ pt: 0.35, display: 'grid', gap: 2 }}>
          <Box>
            <Typography sx={sectionTitleSx}><FaLocationDot size={11} />Selected grid</Typography>
            <Typography sx={{ ...prominentValueSx, mt: 0.45 }}>{selectedGridCell.id}</Typography>
            <Typography sx={{ ...secondaryValueSx, mt: 0.25 }}>Row {selectedGridCell.row}, Column {selectedGridCell.column}</Typography>
          </Box>

          <Divider sx={sectionDividerSx} />

          {selectedGridCell.content === 'empty' && (
            <Typography sx={{ color: dashboardPalette.accent, fontWeight: 700, fontSize: '0.86rem', lineHeight: 1.25, display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
              <FaCircleInfo size={12} />No information available
            </Typography>
          )}

          {selectedGridCell.content !== 'empty' && (
            <Box>
              <Typography sx={sectionTitleSx}><FaLink size={11} />Linked panel</Typography>
              <Typography sx={{ ...secondaryValueSx, mt: 0.45 }}>
                {selectedGridCellPanel?.type === 'real'
                  ? `Real panel${selectedGridCellPanel.realPanelId ? ` • ID ${selectedGridCellPanel.realPanelId}` : ''}`
                  : 'Fake panel • Simulation only'}
              </Typography>
            </Box>
          )}

          {selectedGridCell.content !== 'empty' && <Divider sx={sectionDividerSx} />}

          {selectedGridCell.content === 'empty' && (
            <Stack spacing={0.8}>
              <Box sx={actionCardSx}>
                <Typography sx={actionTitleSx}>Simulation panel</Typography>
                <Typography sx={actionCaptionSx}>Use this for planning and testing layouts before linking a physical unit.</Typography>
                <Button
                  variant="outlined"
                  onClick={handleAssignFakePanel}
                  disabled={isSavingPanel}
                  sx={{
                    ...controlButtonSx,
                    borderColor: 'rgba(73,200,137,0.5)',
                    color: dashboardPalette.accent,
                    '&:hover': { borderColor: dashboardPalette.accent, bgcolor: 'rgba(73,200,137,0.08)' },
                  }}
                >
                  Add fake panel
                </Button>
              </Box>

              <Box sx={actionCardSx}>
                <Typography sx={actionTitleSx}>Physical panel</Typography>
                <Typography sx={actionCaptionSx}>Link a real device by entering its panel ID.</Typography>
                <TextField
                  size="small"
                  placeholder="Enter panel ID"
                  value={realPanelIdInput}
                  onChange={(event) => setRealPanelIdInput(event.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      minHeight: 50,
                      color: dashboardPalette.text,
                      fontSize: '0.97rem',
                      borderRadius: 1.2,
                      bgcolor: 'rgba(2, 12, 19, 0.46)',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: dashboardPalette.muted,
                      opacity: 0.9,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => void handleAssignRealPanel()}
                  disabled={isSavingPanel}
                  sx={{ ...controlButtonSx, bgcolor: '#1b6386', '&:hover': { bgcolor: '#2276a0' } }}
                >
                  Add real panel
                </Button>
              </Box>
            </Stack>
          )}

          {panelActionMessage && (
            <>
              <Divider sx={sectionDividerSx} />
              <Typography sx={{ color: '#ffcf9e' }}>{panelActionMessage}</Typography>
            </>
          )}

          {selectedGridCellPanel && (
            <Stack spacing={0.85}>
              <Box>
                <Typography sx={sectionTitleSx}><FaSliders size={11} />Panel mode</Typography>
                <Select fullWidth size="small" value={selectedGridCellPanel.mode} onChange={handleModeChange} sx={{ mt: 0.5, minHeight: 52, color: dashboardPalette.text, fontSize: '1rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: dashboardPalette.border } }}>
                  <MenuItem value="flat_down">flat_down</MenuItem>
                  <MenuItem value="sun_tracking">sun_tracking</MenuItem>
                  <MenuItem value="letting_sun_in">letting_sun_in</MenuItem>
                </Select>
              </Box>

              {selectedGridCellPanelMetrics && (
                <>
                  <Divider sx={sectionDividerSx} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 1, rowGap: 1.1 }}>
                    <Box>
                      <Typography sx={sectionTitleSx}><FaTemperatureHalf size={11} />Temp</Typography>
                      <Typography sx={metricValueSx}>{selectedGridCellPanelMetrics.tempC} degC</Typography>
                    </Box>
                    <Box>
                      <Typography sx={sectionTitleSx}><FaDroplet size={11} />Humidity</Typography>
                      <Typography sx={metricValueSx}>{selectedGridCellPanelMetrics.humidityPct}%</Typography>
                    </Box>
                    <Box>
                      <Typography sx={sectionTitleSx}><FaSeedling size={11} />Soil moisture</Typography>
                      <Typography sx={metricValueSx}>{selectedGridCellPanelMetrics.soilMoisturePct}%</Typography>
                    </Box>
                    <Box>
                      <Typography sx={sectionTitleSx}><FaBolt size={11} />Energy sourced</Typography>
                      <Typography sx={metricValueSx}>{selectedGridCellPanelMetrics.energyKwh.toFixed(2)} kWh</Typography>
                    </Box>
                  </Box>
                </>
              )}

              <Divider sx={sectionDividerSx} />
              <IconButton onClick={onClearSelectedGridCellPanel} aria-label="Remove panel from cell" sx={{ width: 40, height: 40, border: `1px solid ${dashboardPalette.border}`, color: dashboardPalette.muted }}>
                <FaTrash size={15} />
              </IconButton>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  )
}

export default SolarPannelPlannerControls
