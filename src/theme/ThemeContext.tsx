import { createContext, useContext, useState, ReactNode } from 'react';
import { themes, ThemeName, AppTheme } from '../constants/theme';

type ThemeContextValue = {
  themeName: ThemeName;
  theme: AppTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('pink');

  function toggleTheme() {
    setThemeName((current) => (current === 'pink' ? 'blue' : 'pink'));
  }

  return (
    <ThemeContext.Provider value={{ themeName, theme: themes[themeName], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe usarse dentro de un <ThemeProvider>');
  }
  return context;
}