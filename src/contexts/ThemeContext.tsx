// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const lightTheme = {
  background: 'bg-gray-100',
  surface: 'bg-white',
  primary: 'bg-blue-600',
  primaryVariant: 'bg-blue-500',
  secondary: 'bg-purple-400',
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-400',
  },
  input: {
    background: 'bg-gray-50',
    border: 'border-gray-200',
  },
};

const darkTheme = {
  background: 'bg-gray-900',
  surface: 'bg-gray-800',
  primary: 'bg-purple-700',
  primaryVariant: 'bg-purple-800',
  secondary: 'bg-teal-400',
  text: {
    primary: 'text-white',
    secondary: 'text-gray-200',
    tertiary: 'text-gray-500',
  },
  input: {
    background: 'bg-gray-700',
    border: 'border-gray-600',
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
