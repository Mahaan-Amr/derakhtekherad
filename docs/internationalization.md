# Internationalization Guide

This document describes the internationalization (i18n) implementation in the Derakhte Kherad application.

## Overview

The application supports multiple languages with full Right-to-Left (RTL) support for Persian (Farsi) and Left-to-Right (LTR) support for German. The internationalization is implemented using Next.js App Router's built-in internationalization features.

## Directory Structure

```
app/
├── i18n/
│   ├── settings.ts       # i18n configuration settings
│   ├── locales/          # Translation files
│   │   ├── de/           # German translations
│   │   │   └── common.json
│   │   └── fa/           # Persian translations
│   │       └── common.json
│   ├── server.ts         # Server-side i18n utilities
│   └── client.ts         # Client-side i18n utilities
├── [locale]/             # Localized routes (fa, de)
│   ├── layout.tsx        # Locale-aware layout
│   ├── page.tsx          # Root redirect
│   ├── about/
│   ├── home/
│   ├── courses/
│   └── ...
└── ...
```

## Implementation Details

### Configuration

**File**: `app/i18n/settings.ts`

```typescript
export const locales = ['en', 'de', 'fa'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export function isRtl(locale: Locale) {
  return locale === 'fa';
}
```

### Next.js 15 Params Handling

In Next.js 15, route parameters are handled as Promises and must be awaited before use:

**File**: `app/[locale]/layout.tsx`

```typescript
interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  
  return {
    title: locale === 'fa' ? 'درخت خرد - موسسه زبان آلمانی' : 'Derakhte Kherad - Deutsches Sprachinstitut',
    description: locale === 'fa' 
      ? 'آموزش زبان آلمانی در شیراز، ایران' 
      : 'Lernen Sie Deutsch in Shiraz, Iran',
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  
  // Validate the locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Determine direction based on locale
  const dir = isRtl(locale as Locale) ? 'rtl' : 'ltr';
  const isFarsi = locale === 'fa';
  
  return (
    <div 
      className={`min-h-screen ${isFarsi ? 'font-vazirmatn' : 'font-sans'}`}
      dir={dir}
      lang={locale}
    >
      {children}
    </div>
  );
}
```

### Page Components with Async Params

Each page component must also handle the locale parameter as a Promise:

**Example**: `app/[locale]/about/page.tsx`

```tsx
export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Determine RTL direction based on locale
  const isRtl = locale === 'fa';
  
  // Define translations
  const translations = {
    // Translation object structure...
  };
  
  return (
    <MainLayout locale={locale as Locale} translations={translations}>
      {/* Page content */}
    </MainLayout>
  );
}
```

### Translation Implementation

The application uses two approaches for translations:

1. **Inline translations** for simple components:

```tsx
{locale === 'de' ? 'Über uns' : 'درباره ما'}
```

2. **Translation objects** passed to components:

```tsx
const translations = {
  navigation: {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    // Other translations...
  }
};

return <MainLayout locale={locale as Locale} translations={translations}>
```

### RTL Support

For right-to-left languages (Persian), the application applies the appropriate styles:

1. **Direction attribute**:
```tsx
<div dir={isRtl ? 'rtl' : 'ltr'}>
```

2. **RTL-aware classes**:
```tsx
<div className={`${isRtl ? 'rtl' : 'ltr'}`}>
```

3. **Directional spacing**:
```tsx
<div className={`mt-3 sm:mt-0 ${isRtl ? 'sm:mr-3' : 'sm:ml-3'}`}>
```

### Font Management

Different fonts are loaded based on the locale to ensure proper rendering of each language:

```tsx
import '@fontsource/vazirmatn';

// In layout component
const isFarsi = locale === 'fa';

<div className={`min-h-screen ${isFarsi ? 'font-vazirmatn' : 'font-sans'}`}>
```

## Components with i18n Support

### MainLayout Component

The `MainLayout` component accepts translations and locale to render the appropriate UI:

```tsx
interface MainLayoutProps {
  children: ReactNode;
  locale: Locale;
  translations: {
    navigation: {
      home: string;
      about: string;
      // Other navigation items...
    };
    footer: {
      // Footer translations...
    };
  };
}

export default function MainLayout({ children, locale, translations }: MainLayoutProps) {
  const isRtl = locale === 'fa';
  
  return (
    <>
      <Header locale={locale} translations={translations.navigation} />
      <main>{children}</main>
      <Footer locale={locale} translations={translations.footer} />
    </>
  );
}
```

### Client Components with i18n

Client components also handle locale and translations:

```tsx
'use client';

interface ButtonProps {
  children: React.ReactNode;
  locale?: Locale;
  // Other props...
}

export function Button({ children, locale = 'en', ...props }: ButtonProps) {
  const isRtl = locale === 'fa';
  
  return (
    <button 
      className={`btn ${isRtl ? 'rtl-btn' : 'ltr-btn'}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Best Practices

1. **Always await params**: In Next.js 15, always await the params object before accessing locale.
2. **Use type assertions**: Cast locale to the Locale type when passing to components.
3. **RTL considerations**: Always account for RTL text direction in your layout and spacing.
4. **Consistent translations**: Maintain a consistent approach to translations throughout the app.
5. **Fallback handling**: Provide fallbacks for missing translations.
6. **Type safety**: Use TypeScript interfaces for translation objects to ensure completeness.

## Formatting

### Date Formatting

Use locale-specific date formatting:

```tsx
const formatDate = (date: Date, locale: Locale) => {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
```

### Number Formatting

For currency and number formatting:

```tsx
const formatCurrency = (amount: number, locale: Locale) => {
  const currency = locale === 'fa' ? 'IRR' : 'EUR';
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
};
```

## Adding a New Language

To add a new language to the application:

1. Update the `languages` array in `app/i18n/settings.ts` to include the new language code.
2. Create a new translation dictionary file in `app/i18n/dictionaries/`.
3. Update the `dictionaries` object in `app/i18n/server.ts` to include the new language.
4. Add appropriate font support if needed.
5. Update any locale-specific logic in components and utilities.

## Handling Missing Translations

The application uses a fallback mechanism to handle missing translations:

1. If a translation is missing in the current locale, it falls back to the fallback language (Persian).
2. If a translation is missing in both locales, the key itself is displayed.

## Testing Internationalization

To verify that internationalization is working correctly:

1. Test navigation between localized routes.
2. Verify that text is correctly translated in all supported languages.
3. Ensure RTL layout works correctly for Persian.
4. Test that dates, numbers, and other formatted content appear correctly.
5. Verify that font loading works correctly for each language. 