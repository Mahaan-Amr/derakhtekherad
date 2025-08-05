'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type ThemeName = 'default' | 'emerald' | 'rose' | 'blue' | 'amber' | 'ocean' | 'forest' | 'olive' | 'sunset' | 'midnight';

interface ThemeContextType {
  theme: ThemeName;
  isDarkMode: boolean;
  isAdminUser: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdminUser = user?.role === 'ADMIN';

  // Fetch global theme settings
  const fetchGlobalTheme = async () => {
    try {
      const response = await fetch('/api/settings/global');
      if (response.ok) {
        const settings = await response.json();
        const globalTheme = settings.theme as ThemeName;
        
        if (globalTheme && [
          'default', 'emerald', 'rose', 'blue', 'amber', 
          'ocean', 'forest', 'olive', 'sunset', 'midnight'
        ].includes(globalTheme)) {
          return globalTheme;
        }
      }
    } catch (error) {
      console.error('Error fetching global theme:', error);
    }
    return null;
  };

  // Update global theme setting
  const updateGlobalTheme = async (newTheme: ThemeName) => {
    try {
      await fetch('/api/settings/global', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'theme',
          value: newTheme,
          description: 'Global website theme color'
        })
      });
    } catch (error) {
      console.error('Error updating global theme:', error);
    }
  };

  // Initialize theme on component mount
  useEffect(() => {
    const initializeTheme = async () => {
      setIsLoading(true);
      
      try {
        // First try to get global theme from database
        const globalTheme = await fetchGlobalTheme();
        
        if (globalTheme) {
          // Use global theme from database
          setThemeState(globalTheme);
          applyTheme(globalTheme);
        } else {
          // Fallback to localStorage for backward compatibility
          const savedTheme = localStorage.getItem('colorTheme') as ThemeName | null;
          if (savedTheme && [
            'default', 'emerald', 'rose', 'blue', 'amber', 
            'ocean', 'forest', 'olive', 'sunset', 'midnight'
          ].includes(savedTheme)) {
            setThemeState(savedTheme);
            applyTheme(savedTheme);
          } else {
            // Apply default theme
            applyTheme('default');
          }
        }

        // Check for dark mode preference (this remains user-specific)
        const savedDarkMode = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const shouldUseDarkMode = savedDarkMode === 'dark' || (!savedDarkMode && systemPrefersDark);
        setIsDarkMode(shouldUseDarkMode);
        
        if (shouldUseDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        // Fallback to default theme
        applyTheme('default');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Helper function to apply theme CSS classes
  const applyTheme = (themeName: ThemeName) => {
    document.documentElement.classList.remove(
      'theme-default', 'theme-emerald', 'theme-rose', 'theme-blue', 'theme-amber',
      'theme-ocean', 'theme-forest', 'theme-olive', 'theme-sunset', 'theme-midnight'
    );
    document.documentElement.classList.add(`theme-${themeName}`);
  };

  // Set theme function
  const setTheme = async (newTheme: ThemeName) => {
    // Only allow admin users to change the color theme
    if (!isAdminUser) {
      console.log('Only admin users can change the color theme');
      return;
    }
    
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Update global theme in database
    await updateGlobalTheme(newTheme);
    
    // Also update localStorage for backward compatibility
    localStorage.setItem('colorTheme', newTheme);
  };

  // Toggle dark mode (this remains user-specific)
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
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode, 
      isAdminUser, 
      setTheme, 
      toggleDarkMode,
      isLoading 
    }}>
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