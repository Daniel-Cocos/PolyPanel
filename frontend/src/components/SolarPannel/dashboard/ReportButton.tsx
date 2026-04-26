import { Button } from '@mui/material'
import { FaFileArrowDown } from 'react-icons/fa6'
import { dashboardPalette } from './styles'

type ReportButtonProps = {
  onGenerateReport: () => void
  disabled: boolean
}

/** Renders report download trigger for simulation output. */
function ReportButton({ onGenerateReport, disabled }: ReportButtonProps) {
  return (
    <Button
      variant="outlined"
      endIcon={<FaFileArrowDown size={13} />}
      fullWidth
      onClick={onGenerateReport}
      disabled={disabled}
      sx={{
        mt: 0.9,
        minHeight: 48,
        justifyContent: 'space-between',
        px: 1.1,
        borderRadius: '3px',
        borderColor: dashboardPalette.border,
        bgcolor: 'rgba(255,255,255,0.03)',
        color: dashboardPalette.text,
        fontSize: '0.9rem',
        fontWeight: 650,
        textTransform: 'none',
        '& .MuiButton-endIcon': {
          ml: 1,
          color: dashboardPalette.accent,
        },
        '&:hover': {
          borderColor: 'rgba(73,200,137,0.5)',
          bgcolor: 'rgba(73,200,137,0.09)',
        },
      }}
    >
      Export yearly simulation report
    </Button>
  )
}

export default ReportButton
