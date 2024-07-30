import React, { createContext, useContext, useState, useCallback } from 'react';

const lightTheme = {
  background: 'bg-gray-100',
  surface: 'bg-white',
  primary: 'bg-black',
  accent: 'bg-orange-500',
  text: {
    primary: 'text-black',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-400',
  },
  input: {
    background: 'bg-gray-50',
    border: 'border-gray-200',
  },
  statusBar: {
    backgroundColor: '#f3f4f6',
    barStyle: 'dark-content',
  },
};

const darkTheme = {
  background: 'bg-gray-900',
  surface: 'bg-gray-800',
  primary: 'bg-white',
  accent: 'bg-orange-500',
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-500',
  },
  input: {
    background: 'bg-gray-700',
    border: 'border-gray-600',
  },
  statusBar: {
    backgroundColor: '#111827',
    barStyle: 'light-content',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};