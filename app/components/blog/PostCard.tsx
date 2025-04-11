'use client';

import Link from 'next/link';
import { Locale } from '@/app/i18n/settings';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    titleFa: string;
    slug: string;
    thumbnail: string | null;
    thumbnailUrl?: string; // For backward compatibility
    published: boolean;
    createdAt: string;
    updatedAt: string;
    author?: {
      id?: string;
      name?: string;
      user?: {
        name?: string;
      };
    };
    categories: Array<{
      id?: string;
      name?: string;
      nameFa?: string;
      slug?: string;
      category?: {
        id: string;
        name: string;
        nameFa: string;
        slug: string;
      }
    }>;
  };
  locale: Locale;
}

const PostCard = ({ post, locale }: PostCardProps) => {
  const isRtl = locale === 'fa';
  const title = locale === 'fa' ? post.titleFa : post.title;
  const [imageError, setImageError] = useState(false);
  
  // Get the image path, with fallbacks
  const imageSrc = post.thumbnail || post.thumbnailUrl || '/images/placeholder.jpg';

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="relative h-52 w-full bg-gray-100">
        {/* Simple image with error handling */}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image not available</span>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 mb-2">
          <span className="font-medium">{post.author?.user?.name || post.author?.name || 'Unknown Author'}</span>
          <span className="mx-1">•</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt, locale)}</time>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        {post.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.categories.map((item) => {
              // Handle both nested and flat category structures
              const category = item.category || item;
              
              if (!category || (!category.id && !category.name)) {
                return null;
              }
              
              return (
                <span
                  key={category.id}
                  className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-2 py-1 rounded"
                >
                  {locale === 'fa' 
                    ? (category.nameFa || category.name || 'Unknown') 
                    : (category.name || 'Unknown')}
                </span>
              );
            })}
          </div>
        )}
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="mt-3 inline-block text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-white text-sm font-medium"
        >
          {locale === 'fa' ? 'ادامه مطلب →' : 'Read more →'}
        </Link>
      </div>
    </div>
  );
};

export default PostCard; 