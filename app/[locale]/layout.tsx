import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { locales, isRtl, Locale } from '../i18n/settings';
import { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';

// Load styles
import '../globals.css';
import '@fontsource/vazirmatn';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  // In Next.js 13.4+, params is a Promise that needs to be awaited
  const { locale } = await params;
  
  const title = locale === 'fa' ? 'آکادمی زبان آلمانی درخت خرد' : 'Derakhte Kherad - Deutsches Sprachakademie';
  const description = locale === 'fa' 
    ? 'آموزش زبان آلمانی در شیراز، ایران' 
    : 'Lernen Sie Deutsch in Shiraz, Iran';
  
  // Add a version timestamp to force cache refresh
  const cacheBreaker = `v=${Date.now()}`;
  
  return {
    title,
    description,
    metadataBase: new URL('https://derakhtekherad.com'),
    icons: {
      icon: [
        { url: `/favicon.ico?${cacheBreaker}`, sizes: '32x32' },
        { url: `/favicon.svg?${cacheBreaker}`, type: 'image/svg+xml' },
        { url: `/site-logo/logo.svg?${cacheBreaker}`, type: 'image/svg+xml' }
      ],
      apple: `/site-logo/logo.svg?${cacheBreaker}`,
    },
    openGraph: {
      title,
      description,
      images: [{
        url: `/site-logo/logo.svg?${cacheBreaker}`,
        width: 800,
        height: 800
      }],
      type: 'website',
      url: 'https://derakhtekherad.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/site-logo/logo.svg?${cacheBreaker}`],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // In Next.js 13.4+, params is a Promise that needs to be awaited
  const { locale } = await params;
  
  // Validate the locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Determine direction based on locale
  const dir = isRtl(locale as Locale) ? 'rtl' : 'ltr';
  // Determine if it's Farsi for font selection
  const isFarsi = locale === 'fa';
  
  return (
    <div 
      className={`min-h-screen font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 ${isFarsi ? 'font-vazirmatn' : 'font-sans'}`}
      lang={locale}
      dir={dir}
    >
      {children}
      <Toaster position="bottom-center" />
    </div>
  );
}
 