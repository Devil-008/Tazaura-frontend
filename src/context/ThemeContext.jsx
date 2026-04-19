import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('tazaura_dark') === 'true'
  );
  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem('tazaura_font') || 'md'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('tazaura_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
    localStorage.setItem('tazaura_font', fontSize);
  }, [fontSize]);

  const toggleDark = () => setDarkMode((v) => !v);
  const changeFontSize = (size) => setFontSize(size);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark, fontSize, changeFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
