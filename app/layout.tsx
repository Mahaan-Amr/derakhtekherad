import './globals.css';
import { Inter, Vazirmatn } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';
import CustomHead from './components/common/CustomHead';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn' });

// Add a version timestamp to force cache refresh
const cacheBreaker = `v=${Date.now()}`;

export const metadata: Metadata = {
  title: 'Derakhte Kherad | German Language Institute',
  description: 'Learn German with Derakhte Kherad Language Institute',
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
    title: 'Derakhte Kherad | German Language Institute',
    description: 'Learn German with Derakhte Kherad Language Institute',
    images: [`/site-logo/logo.svg?${cacheBreaker}`],
    type: 'website',
    url: 'https://derakhtekherad.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Derakhte Kherad | German Language Institute',
    description: 'Learn German with Derakhte Kherad Language Institute',
    images: [`/site-logo/logo.svg?${cacheBreaker}`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${vazirmatn.variable}`}>
        <CustomHead />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
