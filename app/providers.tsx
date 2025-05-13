'use client';

import { ReactNode, useEffect } from 'react';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { initializeDarkMode } from './util/theme';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getClientOptions } from './i18n/client';
import resourcesToBackend from 'i18next-resources-to-backend';

// Initialize i18next instance for providers
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./i18n/locales/${language}/${namespace}.json`)
            .catch(() => ({}))
      )
    )
    .init(getClientOptions());
}

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
        <I18nextProvider i18n={i18next}>
          {children}
        </I18nextProvider>
      </ThemeProvider>
    </AuthProvider>
  );
} 