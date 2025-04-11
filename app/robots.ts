import { MetadataRoute } from 'next';

// Generate robots.txt content
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/teacher/',
        '/student/',
        '/settings/',
        '/profile/',
        '/dashboard/',
        '/_next/',
        '/reset-password/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 