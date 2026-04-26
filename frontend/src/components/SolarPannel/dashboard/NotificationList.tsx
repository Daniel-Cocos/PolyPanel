import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaBell, FaCircleInfo, FaSliders, FaTriangleExclamation } from 'react-icons/fa6'
import type { DashboardAlert, PanelMode } from './types'
import { dashboardCardSx, dashboardEyebrowSx, dashboardPalette } from './styles'

type NotificationListProps = {
  alerts: DashboardAlert[]
  onAcknowledge: (alertId: string) => void
  onOpenPanelDetails: (panelId: string) => void
  onSetPanelMode: (panelId: string, mode: PanelMode) => Promise<void>
}

/** Renders simulation notifications with recommended actions. */
function NotificationList({ alerts, onAcknowledge, onOpenPanelDetails, onSetPanelMode }: NotificationListProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box sx={{ ...dashboardCardSx, minHeight: 220 }}>
      <Typography sx={dashboardEyebrowSx}>
        <FaBell size={10} />
        Notifications
      </Typography>

      <Stack spacing={0.8} sx={{ mt: 0.9 }}>
        <AnimatePresence initial={false} mode="popLayout">
          {alerts.length === 0 && (
            <Box
              key="empty-notification-list"
              component={motion.div}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Typography sx={{ color: dashboardPalette.muted, fontSize: '0.92rem' }}>No active notifications for this hour.</Typography>
            </Box>
          )}

          {alerts.map((alert) => (
            <Box
              key={alert.id}
              component={motion.div}
              layout={!shouldReduceMotion}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              sx={{
                p: 0.75,
                border: `1px solid ${dashboardPalette.border}`,
                borderRadius: '3px',
                bgcolor: 'rgba(255,255,255,0.03)',
                opacity: alert.acknowledged ? 0.65 : 1,
              }}
            >
              <Stack direction="row" spacing={0.65} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={0.55} sx={{ alignItems: 'center', minWidth: 0 }}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-grid',
                      placeItems: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: alert.severity === 'warning' ? 'rgba(242,109,120,0.22)' : 'rgba(255,255,255,0.1)',
                      color: alert.severity === 'warning' ? '#ffc4c9' : dashboardPalette.text,
                      flexShrink: 0,
                    }}
                  >
                    {alert.severity === 'warning' ? <FaTriangleExclamation size={10} /> : <FaCircleInfo size={10} />}
                  </Box>
                  <Typography sx={{ color: dashboardPalette.text, fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {alert.panelName}
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  label={alert.severity === 'warning' ? 'Warning' : 'Info'}
                  sx={{
                    height: 21,
                    bgcolor: alert.severity === 'warning' ? dashboardPalette.warning : 'rgba(255,255,255,0.1)',
                    color: dashboardPalette.text,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Typography sx={{ mt: 0.5, color: dashboardPalette.muted, fontSize: '0.85rem', lineHeight: 1.4 }}>
                {alert.message}
              </Typography>
              <Typography sx={{ mt: 0.4, color: dashboardPalette.accent, fontSize: '0.8rem', fontWeight: 700 }}>
                Recommended mode: {alert.recommendedMode}
              </Typography>

              <Stack direction="row" spacing={0.55} sx={{ mt: 0.7, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<FaSliders size={10} />}
                  onClick={() => void onSetPanelMode(alert.panelId, alert.recommendedMode)}
                  sx={{ minHeight: 28, px: 0.85, fontSize: '0.76rem' }}
                >
                  Set mode
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onAcknowledge(alert.id)}
                  sx={{ minHeight: 28, px: 0.85, fontSize: '0.76rem', borderColor: dashboardPalette.border, color: dashboardPalette.text }}
                >
                  Acknowledge
                </Button>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => onOpenPanelDetails(alert.panelId)}
                  sx={{ minHeight: 28, px: 0.5, fontSize: '0.76rem', color: dashboardPalette.muted }}
                >
                  Open details
                </Button>
              </Stack>
            </Box>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  )
}

export default NotificationList
