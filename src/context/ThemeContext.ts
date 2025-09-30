import React from 'react';

export type ThemeState = { isDark: boolean; toggle: () => void };

export const ThemeContext = React.createContext<ThemeState>({
  isDark: false,
  toggle: () => {},
});


