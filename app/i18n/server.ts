import { locales, Locale } from './settings';

// Simple options for server-side i18n
export const getOptions = (locale: Locale = 'de', ns = 'common') => {
  return {
    supportedLngs: locales,
    fallbackLng: 'de',
    lng: locale,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns,
  };
};

/**
 * Load dictionary for specific locale and namespaces directly from the filesystem
 * This avoids using react-i18next in server components
 */
export async function getDictionary(locale: Locale) {
  const modules = await Promise.all([
    import(`./locales/${locale}/common.json`).catch(() => ({})),
    import(`./locales/${locale}/blog.json`).catch(() => ({})),
  ]);
  
  return {
    ...modules[0],
    blog: modules[1]
  };
} 