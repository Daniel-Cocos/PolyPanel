/** Shared dashboard design tokens aligned with landing sections. */
export const dashboardPalette = {
  shell: '#07141c',
  panel: 'rgba(8, 24, 34, 0.82)',
  panelSoft: 'rgba(8, 24, 34, 0.7)',
  border: 'rgba(255,255,255,0.1)',
  text: 'rgba(238,247,250,0.92)',
  muted: 'rgba(221,238,244,0.74)',
  accent: '#49c889',
  accentDark: '#35b576',
  warning: 'rgba(242,109,120,0.22)',
}

export const dashboardCardSx = {
  px: 0.25,
  py: 1.1,
  borderBottom: `1px solid rgba(255,255,255,0.1)`,
  bgcolor: 'transparent',
}

export const dashboardEyebrowSx = {
  color: dashboardPalette.accent,
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.55,
  lineHeight: 1.2,
}
