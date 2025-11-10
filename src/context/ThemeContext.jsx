import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('condominio_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        return settings.darkMode || false;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    // Guardar en localStorage cuando cambie
    const saved = localStorage.getItem('condominio_settings');
    let settings = {};
    if (saved) {
      try {
        settings = JSON.parse(saved);
      } catch {}
    }
    settings.darkMode = darkMode;
    localStorage.setItem('condominio_settings', JSON.stringify(settings));

    // Aplicar clase al body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

