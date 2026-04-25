import { createTheme } from '@mui/material/styles'

/** Defines the shared landing page design tokens. */
export const modernTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14506d',
      dark: '#0e3b52',
      light: '#2d6a88',
    },
    secondary: {
      main: '#49c889',
      dark: '#35b576',
      light: '#6fdaa2',
    },
    background: {
      default: '#eef4f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#132733',
      secondary: '#466272',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 0.96,
    },
    h2: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.02,
    },
    h3: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.25,
    },
    body1: {
      fontSize: '1.05rem',
      lineHeight: 1.65,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 52,
          borderRadius: 999,
          paddingInline: 24,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
