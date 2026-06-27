'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const CLASS_LIGHT = 'theme-light';
const CLASS_DARK = 'theme-dark';
const STORAGE_KEY = 'site-theme-mode';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeClass = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.remove(CLASS_LIGHT, CLASS_DARK);
  root.classList.add(mode === 'dark' ? CLASS_DARK : CLASS_LIGHT);
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    applyThemeClass(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode: setModeState,
      toggleMode: () => setModeState((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
