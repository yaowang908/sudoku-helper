import React from 'react';
import { ColorMode } from '@/theme';

interface ColorModeContextValue {
  mode: ColorMode;
  toggle: () => void;
}

export const ColorModeContext = React.createContext<ColorModeContextValue>({
  mode: 'light',
  toggle: () => {},
});

export const useColorMode = () => React.useContext(ColorModeContext);
