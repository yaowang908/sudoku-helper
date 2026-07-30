import { createTheme, ThemeOptions } from '@mui/material/styles';

export type ColorMode = 'light' | 'dark';

// Shared design tokens used across the app (board colors, etc.)
export const tokens = {
  light: {
    appBgFrom: '#eef2ff',
    appBgTo: '#faf5ff',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    boardLine: '#cbd5e1',
    boardLineStrong: '#475569',
    cellText: '#1e293b',
    givenText: '#334155',
    userText: '#4f46e5',
    candidate: '#64748b',
    candidateActive: '#6366f1',
    crossed: '#cbd5e1',
    selectedBg: '#c7d2fe',
    peerBg: '#eef2ff',
    sameNumberBg: '#ddd6fe',
    conflictBg: '#fee2e2',
    conflictText: '#dc2626',
    hintBg: '#dcfce7',
  },
  dark: {
    appBgFrom: '#0f172a',
    appBgTo: '#1e1b4b',
    surface: '#1e293b',
    surfaceMuted: '#0f172a',
    boardLine: '#334155',
    boardLineStrong: '#94a3b8',
    cellText: '#e2e8f0',
    givenText: '#cbd5e1',
    userText: '#a5b4fc',
    candidate: '#94a3b8',
    candidateActive: '#a5b4fc',
    crossed: '#475569',
    selectedBg: '#3730a3',
    peerBg: '#27314f',
    sameNumberBg: '#4338ca',
    conflictBg: '#7f1d1d',
    conflictText: '#fca5a5',
    hintBg: '#14532d',
  },
} as const;

export const getTokens = (mode: ColorMode) => tokens[mode];

const buildThemeOptions = (mode: ColorMode): ThemeOptions => ({
  palette: {
    mode,
    primary: { main: '#6366f1' },
    secondary: { main: '#8b5cf6' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    ...(mode === 'light'
      ? {
          background: { default: '#eef2ff', paper: '#ffffff' },
          text: { primary: '#1e293b', secondary: '#64748b' },
        }
      : {
          background: { default: '#0f172a', paper: '#1e293b' },
          text: { primary: '#e2e8f0', secondary: '#94a3b8' },
        }),
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
  },
});

export const buildTheme = (mode: ColorMode) =>
  createTheme(buildThemeOptions(mode));
