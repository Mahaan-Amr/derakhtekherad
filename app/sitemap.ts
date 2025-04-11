import { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { locales } from './i18n/settings';

// Date helper to generate lastModified field
const getFormattedDate = () => {
  return new Date().toISOString();
};

// Base URL for the sitemap
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = getFormattedDate();
  
  // Create base static pages for both locales
  const staticPages = [
    'home',
    'about',
    'courses',
    'contact',
    'consultation',
    'blog',
    'login',
  ].map(path => {
    return locales.flatMap(locale => ({
      url: `${baseUrl}/${locale}${path === 'home' ? '' : `/${path}`}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: path === 'home' ? 1 : 0.8,
    }));
  }).flat();
  
  // Fetch all active courses
  const courses = await prisma.course.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  // Create course URLs
  const courseUrls = courses.flatMap(course => {
    return locales.map(locale => ({
      url: `${baseUrl}/${locale}/courses/${course.id}`,
      lastModified: course.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  });
  
  // Fetch all published blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      isPublished: true
    },
    select: {
      slug: true,
      updatedAt: true
    },
  });
  
  // Create blog post URLs
  const blogUrls = blogPosts.flatMap(post => {
    return locales.map(locale => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  });
  
  // Return combined sitemap
  return [
    ...staticPages,
    ...courseUrls,
    ...blogUrls,
  ];
} 