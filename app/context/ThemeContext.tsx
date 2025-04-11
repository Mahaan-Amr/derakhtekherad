'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available themes
export type ThemeName = 'default' | 'emerald' | 'rose' | 'blue' | 'amber' | 'ocean' | 'forest' | 'olive' | 'sunset' | 'midnight';

interface ThemeContextType {
  theme: ThemeName;
  isDarkMode: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('colorTheme') as ThemeName | null;
    if (savedTheme && [
      'default', 'emerald', 'rose', 'blue', 'amber', 
      'ocean', 'forest', 'olive', 'sunset', 'midnight'
    ].includes(savedTheme)) {
      setThemeState(savedTheme);
      
      // Apply theme CSS class
      document.documentElement.classList.remove(
        'theme-default', 'theme-emerald', 'theme-rose', 'theme-blue', 'theme-amber',
        'theme-ocean', 'theme-forest', 'theme-olive', 'theme-sunset', 'theme-midnight'
      );
      document.documentElement.classList.add(`theme-${savedTheme}`);
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedDarkMode === 'dark' || (!savedDarkMode && systemPrefersDark);
    setIsDarkMode(shouldUseDarkMode);
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Set theme function
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('colorTheme', newTheme);
    
    // Apply theme CSS class
    document.documentElement.classList.remove(
      'theme-default', 'theme-emerald', 'theme-rose', 'theme-blue', 'theme-amber',
      'theme-ocean', 'theme-forest', 'theme-olive', 'theme-sunset', 'theme-midnight'
    );
    document.documentElement.classList.add(`theme-${newTheme}`);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 