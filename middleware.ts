import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './app/i18n/settings';
import { verifyJwtToken } from './app/lib/auth';
import { match as matchLocale } from '@formatjs/intl-localematcher';
// Since we don't have @types/negotiator, add a declaration
// @ts-ignore
import Negotiator from 'negotiator';

// Define which paths require authentication
const protectedPaths = [
  '/admin',
  '/student/dashboard',
  '/teacher/dashboard',
  '/profile',
  '/settings',
];

// Define which paths are only accessible by specific roles
const roleBasedPaths = {
  'ADMIN': ['/admin'],
  'TEACHER': ['/teacher'],
  'STUDENT': ['/student'],
};

// Get the preferred locale from headers
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get the best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

// Define paths that should be excluded from internationalization
const EXCLUDED_PATHS = [
  // Static assets
  '/uploads',
  '/images',
  '/assets',
  '/public',
  '/favicon.ico',
  '/favicon.svg',
  '/robots.txt',
  '/sitemap.xml',
  '/site-logo',
  // File extensions
  '.svg',
  '.ico',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  // API routes
  '/api/',
  // Other paths to exclude
  '/_next',
  '/vercel.svg',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the path should be excluded from internationalization
  // Either by prefix or file extension
  const isExcludedPath = EXCLUDED_PATHS.some(path => 
    pathname.startsWith(path) || pathname.endsWith(path)
  );
  
  // If it's an excluded path, don't modify the request
  if (isExcludedPath) {
    return;
  }
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return Response.redirect(request.nextUrl);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|site-logo|public|images|assets).*)',
  ],
}; 