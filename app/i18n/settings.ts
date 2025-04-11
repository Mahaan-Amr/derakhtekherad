export const locales = ['fa', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fa';

export const rtlLanguages = ['fa'];
export const isRtl = (locale: Locale) => rtlLanguages.includes(locale); 