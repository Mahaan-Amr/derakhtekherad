'use client';

import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { locales, defaultLocale } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// Client-specific options
export const getClientOptions = (lng: string = defaultLocale, ns = 'common') => {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
  };
};

// Initialize i18next for the client-side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getClientOptions(),
    lng: undefined, // Let the detector find the language
    detection: {
      order: ['htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : []
  });

// Export the translation hook that correctly handles client/server
export function useTranslation(ns: string, options: { keyPrefix?: string } = {}) {
  const ret = useTranslationOrg(ns, options);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (runsOnServerSide) return;
    if (ret.i18n.resolvedLanguage === defaultLocale) return;
    if (!initialized) {
      ret.i18n.changeLanguage(ret.i18n.resolvedLanguage);
      setInitialized(true);
    }
  }, [ret.i18n, initialized]);

  if (!initialized && !runsOnServerSide && ret.i18n.resolvedLanguage !== defaultLocale) {
    return {
      ...ret,
      t: (key: string) => key,
    };
  }
  
  return ret;
} 