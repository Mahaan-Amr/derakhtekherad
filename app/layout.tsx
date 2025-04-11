import './globals.css';
import { Inter, Vazirmatn } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn' });

export const metadata: Metadata = {
  title: 'Derakhte Kherad | German Language Institute',
  description: 'Learn German with Derakhte Kherad Language Institute',
  metadataBase: new URL('https://derakhtekherad.com'),
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Derakhte Kherad | German Language Institute',
    description: 'Learn German with Derakhte Kherad Language Institute',
    images: ['/logo.png'],
    type: 'website',
    url: 'https://derakhtekherad.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Derakhte Kherad | German Language Institute',
    description: 'Learn German with Derakhte Kherad Language Institute',
    images: ['/logo.png'],
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
