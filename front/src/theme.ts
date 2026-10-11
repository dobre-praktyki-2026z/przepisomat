import { createTheme } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#d64545' },
      secondary: { main: '#f2a65a' },
      background:
        mode === 'light'
          ? { default: '#faf7f5', paper: '#ffffff' }
          : { default: '#141416', paper: '#1e1e21' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily:
        'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { textTransform: 'none' } },
      },
      MuiCard: {
        defaultProps: { elevation: 1 },
      },
    },
  })
}
