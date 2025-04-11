'use client';

import { ReactNode, useEffect } from 'react';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { initializeDarkMode } from './util/theme';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Initialize theme when component mounts
  useEffect(() => {
    initializeDarkMode();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
} 