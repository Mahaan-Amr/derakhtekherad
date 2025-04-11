'use client';

import { Locale } from '@/app/i18n/settings';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/app/components/ui/Card';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  excerpt: string;
  excerptFa: string;
  author: string;
  authorImage?: string;
  category: string;
  categoryFa: string;
  publishDate: string;
  thumbnailUrl: string;
}

interface LatestBlogsProps {
  locale: Locale;
  posts: BlogPost[];
}

export default function LatestBlogs({ locale, posts = [] }: LatestBlogsProps) {
  const isRtl = locale === 'fa';
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  
  const translations = {
    title: locale === 'de' ? 'Neueste Artikel' : 'آخرین مقالات',
    subtitle: locale === 'de' 
      ? 'Die neuesten Lernmaterialien und Neuigkeiten zur Migration nach Deutschland'
      : 'جدیدترین مطالب آموزشی و اخبار مهاجرت به آلمان',
    readMore: locale === 'de' ? 'Weiterlesen' : 'ادامه مطلب',
    viewAll: locale === 'de' ? 'Alle Artikel anzeigen' : 'مشاهده همه مقالات',
    publishedOn: locale === 'de' ? 'Veröffentlicht am' : 'منتشر شده در',
    by: locale === 'de' ? 'von' : 'توسط'
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 relative inline-block">
            {translations.title}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transform -translate-y-2 opacity-70"></span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">{translations.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="group">
              <Link href={`/${locale}/blog/${post.slug}`} className="block overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/blog-placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold transition-colors duration-300 group-hover:text-primary dark:text-white">{post.title}</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.publishDate).toLocaleDateString(locale === 'de' ? 'de-DE' : 'fa-IR')}</span>
                    </div>
                    <span className="text-sm font-medium text-primary transition-colors duration-300 group-hover:text-primary-dark">
                      {locale === 'de' ? 'Weiterlesen' : 'ادامه مطلب'} →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href={`/${locale}/blog`} passHref>
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-white dark:border-gray-700 hover:border-primary dark:hover:border-primary"
            >
              {translations.viewAll}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRtl ? 'mr-1 rotate-180' : 'ml-1'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 