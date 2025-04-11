import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Locale } from '@/app/i18n/settings';
import { getDictionary } from '@/app/i18n';
import { notFound } from 'next/navigation';
import { Card } from '@/app/components/ui';

// Number of posts per page
const POSTS_PER_PAGE = 8;

// Format date for display
function formatDate(date: string | Date, locale: string) {
  return new Date(date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Extract excerpt from content
function getExcerpt(content: string, maxLength = 150) {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]+>/g, '');
  
  if (plainText.length <= maxLength) return plainText;
  
  // Find last space before maxLength
  const lastSpace = plainText.substring(0, maxLength).lastIndexOf(' ');
  return lastSpace > 0 
    ? plainText.substring(0, lastSpace) + '...' 
    : plainText.substring(0, maxLength) + '...';
}

// Get category by slug
async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug }
  });
}

// Get posts in a category with pagination
async function getCategoryPosts(categorySlug: string, page = 1) {
  const skip = (page - 1) * POSTS_PER_PAGE;
  
  // Get posts with the specified category that are published
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: {
        some: {
          category: {
            slug: categorySlug
          }
        }
      }
    },
    include: {
      author: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: POSTS_PER_PAGE
  });

  // Get total number of posts in this category
  const totalPosts = await prisma.post.count({
    where: {
      published: true,
      categories: {
        some: {
          category: {
            slug: categorySlug
          }
        }
      }
    }
  });

  return {
    posts,
    totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
    currentPage: page
  };
}

// Define props for CategoryPage
interface CategoryPageProps {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ 
  params: { locale, slug },
  searchParams 
}: CategoryPageProps) {
  const dictionary = await getDictionary(locale);
  const { blog } = dictionary;
  
  // Get category details
  const category = await getCategoryBySlug(slug);
  
  // If category doesn't exist, show 404 page
  if (!category) {
    notFound();
  }
  
  // Get current page from URL params
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  
  // Fetch posts in this category
  const { posts, totalPages } = await getCategoryPosts(slug, currentPage);
  
  // Determine if we're showing RTL content
  const isRtl = locale === 'fa';
  
  // Get localized category name and description
  const categoryName = isRtl ? category.nameFa : category.name;
  const categoryDescription = isRtl ? category.descriptionFa : category.description;
  
  return (
    <div className={`container mx-auto px-4 py-12 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href={`/${locale}`} className="hover:text-primary">
            {blog.home}
          </Link>
          {' '} / {' '}
          <Link href={`/${locale}/blog`} className="hover:text-primary">
            {blog.blog}
          </Link>
          {' '} / {' '}
          <Link href={`/${locale}/blog/category/${slug}`} className="hover:text-primary">
            {categoryName}
          </Link>
        </div>
        
        {/* Category Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
          {categoryDescription && (
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {categoryDescription}
            </p>
          )}
        </header>
        
        {/* Current Category Card */}
        {category && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {locale === 'fa' && category.nameFa ? category.nameFa : category.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {blog.postsInCategory.replace('{0}', (category as any).postCount?.toString() || '0')}
            </p>
          </div>
        )}
        
        {/* Posts */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={post.thumbnail || '/images/placeholder.jpg'}
                    alt={isRtl ? post.titleFa : post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link 
                      href={`/${locale}/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {isRtl ? post.titleFa : post.title}
                    </Link>
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {formatDate(post.createdAt, locale)} | {post.author.user.name}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {getExcerpt(isRtl ? post.contentFa : post.content)}
                  </p>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    {blog.readMore} →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {blog.noCategoryPosts.replace('{category}', categoryName)}
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={{
                    pathname: `/${locale}/blog/category/${slug}`,
                    query: { ...(page > 1 && { page }) },
                  }}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </nav>
          </div>
        )}
        
        {/* Back to all posts */}
        <div className="mt-12">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-primary hover:text-primary-dark"
          >
            ← {blog.backToAllPosts}
          </Link>
        </div>
      </div>
    </div>
  );
} 