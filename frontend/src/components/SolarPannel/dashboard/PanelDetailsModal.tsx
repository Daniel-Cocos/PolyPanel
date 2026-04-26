import {
  Alert,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { dashboardPalette } from './styles'
import { useDashboardState } from './useDashboardState'
import type { PanelMode } from './types'

type PanelOption = 'real' | 'fake'

/** Renders the shared panel-grid modal for map and sidebar entry points. */
function PanelDetailsModal() {
  const {
    panels,
    panelMetricsById,
    isPanelModalOpen,
    selectedGridCell,
    selectedGridCellPanel,
    selectedModalPanel,
    closePanelModal,
    assignSelectedCellWithPanelType,
    assignPanelToSelectedCell,
    setPanelMode,
  } = useDashboardState()

  const [panelOption, setPanelOption] = useState<PanelOption>('real')
  const [realPanelIdInput, setRealPanelIdInput] = useState('')
  const [realPanelIdError, setRealPanelIdError] = useState<string | null>(null)
  const selectedPanelMetrics = selectedModalPanel ? panelMetricsById[selectedModalPanel.id] : null

  const realPanels = panels.filter((panel) => panel.type === 'real')
  const isGridCellMissing = !selectedGridCell
  const isSubmitDisabled = panelOption === 'real' ? isGridCellMissing || !realPanelIdInput.trim() : isGridCellMissing
  const sectionLabelSx = { color: dashboardPalette.accent, fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }
  const sectionCardSx = { py: 0.35 }

  const handleModeChange = (mode: PanelMode) => {
    if (!selectedModalPanel) {
      return
    }

    setPanelMode(selectedModalPanel.id, mode)
  }

  const handleAddRealPanel = () => {
    if (!selectedGridCell) {
      setRealPanelIdError('Select a grid cell from the map first.')
      return
    }

    const normalizedValue = realPanelIdInput.trim().toLowerCase()
    if (!normalizedValue) {
      setRealPanelIdError('Enter a real panel ID.')
      return
    }

    const matchingPanel = realPanels.find((panel) => {
      const matchesRealPanelId = panel.realPanelId?.toLowerCase() === normalizedValue
      const matchesInternalId = panel.id.toLowerCase() === normalizedValue
      return matchesRealPanelId || matchesInternalId
    })

    if (!matchingPanel) {
      setRealPanelIdError(`No existing real panel matches '${realPanelIdInput.trim()}'.`)
      return
    }

    assignPanelToSelectedCell(matchingPanel.id)
    setRealPanelIdError(null)
    setRealPanelIdInput('')
    closePanelModal()
  }

  const handleAddFakePanel = () => {
    assignSelectedCellWithPanelType('fake')
    setRealPanelIdError(null)
    closePanelModal()
  }

  const handleCancel = () => {
    setRealPanelIdError(null)
    setRealPanelIdInput('')
    closePanelModal()
  }

  return (
    <Dialog
      open={isPanelModalOpen}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1.5,
            borderTop: `2px solid ${dashboardPalette.accent}`,
            bgcolor: 'rgba(6,20,30,0.96)',
            color: dashboardPalette.text,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.8 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif', lineHeight: 1.2, color: dashboardPalette.text }}>
          Grid and panel configuration
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.35, color: dashboardPalette.muted }}>
          Link the selected grid position to an existing real panel or planning placeholder.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: '10px !important' }}>
        <Stack spacing={1.35}>
          <Box sx={{ pb: 1.15, borderBottom: `1px solid ${dashboardPalette.border}` }}>
            <Typography sx={sectionLabelSx}>Selected grid</Typography>
            <Typography sx={{ mt: 0.45, color: dashboardPalette.text, fontSize: '0.94rem' }}>
              {selectedGridCell
                ? `Cell ${selectedGridCell.id} • Row ${selectedGridCell.row} / Col ${selectedGridCell.column}`
                : 'Select a grid cell from the map to link a panel.'}
            </Typography>
          </Box>

          <ToggleButtonGroup
            exclusive
            value={panelOption}
            onChange={(_, value: PanelOption | null) => {
              if (!value) {
                return
              }
              setPanelOption(value)
              setRealPanelIdError(null)
            }}
            size="small"
            sx={{
              width: 'fit-content',
              '& .MuiToggleButton-root': {
                px: 0,
                mr: 2.6,
                minHeight: 34,
                textTransform: 'none',
                fontWeight: 700,
                border: 0,
                borderBottom: '2px solid transparent',
                borderRadius: 0,
                color: dashboardPalette.muted,
              },
              '& .MuiToggleButton-root:hover': { bgcolor: 'transparent', color: dashboardPalette.text },
              '& .MuiToggleButton-root.Mui-selected': {
                bgcolor: 'transparent',
                color: dashboardPalette.accent,
                borderBottomColor: dashboardPalette.accent,
              },
              '& .MuiToggleButton-root.Mui-selected:hover': { bgcolor: 'transparent' },
            }}
          >
            <ToggleButton value="real" disabled={isGridCellMissing}>
              Real panel
            </ToggleButton>
            <ToggleButton value="fake" disabled={isGridCellMissing}>
              Fake panel
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={sectionCardSx}>
            {panelOption === 'real' && (
              <Stack spacing={0.9}>
                <Typography sx={sectionLabelSx}>Link existing real panel</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="standard"
                  label="Real panel ID"
                  value={realPanelIdInput}
                  onChange={(event) => {
                    setRealPanelIdInput(event.target.value)
                    if (realPanelIdError) {
                      setRealPanelIdError(null)
                    }
                  }}
                  placeholder="e.g. RP-1001"
                  disabled={isGridCellMissing}
                  slotProps={{
                    inputLabel: { sx: { color: dashboardPalette.muted } },
                    input: {
                      sx: {
                        color: dashboardPalette.text,
                        '&::before': { borderBottom: `1px solid ${dashboardPalette.border}` },
                        '&:hover:not(.Mui-disabled)::before': { borderBottom: `1px solid ${dashboardPalette.text}` },
                        '&::after': { borderBottom: `2px solid ${dashboardPalette.accent}` },
                      },
                    },
                  }}
                />
              </Stack>
            )}

            {panelOption === 'fake' && (
              <Stack spacing={0.6}>
                <Typography sx={sectionLabelSx}>Add planning fake panel</Typography>
                <Typography variant="body2" sx={{ color: dashboardPalette.muted }}>
                  Create a placeholder panel for planning and simulation before installation.
                </Typography>
              </Stack>
            )}
          </Box>

          {realPanelIdError && <Alert severity="warning">{realPanelIdError}</Alert>}

          {selectedGridCellPanel && (
            <Typography sx={{ color: dashboardPalette.text, fontSize: '0.9rem' }}>
              Linked panel: {selectedGridCellPanel.name}
              {selectedGridCellPanel.realPanelId ? ` (${selectedGridCellPanel.realPanelId})` : ''}
            </Typography>
          )}

          {selectedModalPanel && selectedPanelMetrics && (
            <>
              <FormControl fullWidth size="small" variant="standard">
                <InputLabel id="panel-mode-label">Panel mode</InputLabel>
                <Select
                  labelId="panel-mode-label"
                  value={selectedModalPanel.mode}
                  label="Panel mode"
                  onChange={(event) => handleModeChange(event.target.value as PanelMode)}
                  sx={{
                    color: dashboardPalette.text,
                    '&::before': { borderBottom: `1px solid ${dashboardPalette.border}` },
                    '&:hover:not(.Mui-disabled)::before': { borderBottom: `1px solid ${dashboardPalette.text}` },
                    '&::after': { borderBottom: `2px solid ${dashboardPalette.accent}` },
                  }}
                >
                  <MenuItem value="flat_down">flat_down</MenuItem>
                  <MenuItem value="sun_tracking">sun_tracking</MenuItem>
                  <MenuItem value="letting_sun_in">letting_sun_in</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ pt: 0.35 }}>
                <Typography sx={sectionLabelSx}>Panel metrics for selected month</Typography>
                <Stack spacing={0.55} sx={{ mt: 0.65 }}>
                  <Typography sx={{ color: dashboardPalette.text, fontSize: '0.9rem' }}>Temp: {selectedPanelMetrics.tempC} degC</Typography>
                  <Divider sx={{ borderColor: dashboardPalette.border }} />
                  <Typography sx={{ color: dashboardPalette.text, fontSize: '0.9rem' }}>Humidity: {selectedPanelMetrics.humidityPct}%</Typography>
                  <Divider sx={{ borderColor: dashboardPalette.border }} />
                  <Typography sx={{ color: dashboardPalette.text, fontSize: '0.9rem' }}>Soil moisture: {selectedPanelMetrics.soilMoisturePct}%</Typography>
                  <Divider sx={{ borderColor: dashboardPalette.border }} />
                  <Typography sx={{ color: dashboardPalette.text, fontSize: '0.9rem' }}>Energy sourced: {selectedPanelMetrics.energyKwh.toFixed(2)} kWh</Typography>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: 'space-between' }}>
        <Button onClick={handleCancel} color="inherit" sx={{ textTransform: 'none', fontWeight: 700, color: dashboardPalette.muted }}>
          Close
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={panelOption === 'real' ? handleAddRealPanel : handleAddFakePanel}
          disabled={isSubmitDisabled}
          sx={{ minHeight: 42, textTransform: 'none', fontWeight: 700, color: '#052018' }}
        >
          {panelOption === 'real' ? 'Link real panel' : 'Add fake panel'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PanelDetailsModal
