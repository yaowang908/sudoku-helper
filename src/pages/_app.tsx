import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { wrapper } from '@/store/store';
import { buildTheme, ColorMode } from '@/theme';
import { ColorModeContext } from '@/hooks/useColorMode';

function App({ Component, pageProps }: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps);
  const [mode, setMode] = React.useState<ColorMode>('light');

  React.useEffect(() => {
    const stored = window.localStorage.getItem('sudoku-color-mode');
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const colorMode = React.useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light';
          window.localStorage.setItem('sudoku-color-mode', next);
          return next;
        }),
    }),
    [mode]
  );

  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

export default App;
