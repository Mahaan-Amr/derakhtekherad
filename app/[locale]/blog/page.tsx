import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/app/i18n';
import PostCard from '@/app/components/blog/PostCard';
import { Locale } from '@/app/i18n/settings';
import MainLayout from '@/app/components/layouts/MainLayout';
import { generateSeoMetadata, generateBreadcrumbSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

// Define the interface for blog posts that matches what PostCard expects
interface BlogPost {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  thumbnail: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    name?: string;
  };
  categories: Array<{
    id: string;
    name: string;
    nameFa: string;
    slug: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  nameFa?: string;
  slug: string;
}

interface BlogPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    page?: string;
    category?: string;
  };
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = params;
  const dict = await getDictionary(locale as Locale);
  
  return generateSeoMetadata({
    title: {
      de: dict.blog?.blogTitle || 'Blog',
      fa: dict.blog?.blogTitle || 'وبلاگ'
    },
    description: {
      de: 'Neueste Nachrichten und Artikel von Derakhte Kherad zur deutschen Sprache, Kultur und Tipps für das Studium in Deutschland.',
      fa: 'آخرین اخبار و مقالات درخت خرد در مورد زبان آلمانی، فرهنگ و نکات مربوط به تحصیل در آلمان.'
    },
    path: 'blog',
    keywords: {
      de: ['Deutschkurse', 'Deutsche Kultur', 'Sprachschule', 'Studium in Deutschland', 'Deutsch lernen'],
      fa: ['دوره‌های زبان آلمانی', 'فرهنگ آلمانی', 'آموزشگاه زبان', 'تحصیل در آلمان', 'یادگیری زبان آلمانی']
    },
    type: 'website'
  }, locale as Locale);
}

// Function to fetch blog posts
async function getPosts(locale: string) {
  console.log(`[Blog Page] Fetching blog posts for locale: ${locale}`);
  
  try {
    // Try multiple endpoints to find one that works
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // First try the test endpoint to verify API routes are working
    console.log(`[Blog Page] Testing API route access...`);
    const testRes = await fetch(`${baseUrl}/api/test`, { cache: 'no-store' });
    console.log(`[Blog Page] Test API response: ${testRes.status} ${testRes.statusText}`);
    
    // Then try the new all-posts endpoint
    console.log(`[Blog Page] Trying all-posts endpoint...`);
    const postsRes = await fetch(`${baseUrl}/api/blog/all-posts`, { cache: 'no-store' });
    
    if (!postsRes.ok) {
      console.error(`[Blog Page] Failed to fetch from all-posts: ${postsRes.status} ${postsRes.statusText}`);
      
      // If all-posts fails, try the original published endpoint as fallback
      console.log(`[Blog Page] Trying published endpoint as fallback...`);
      const fallbackRes = await fetch(`${baseUrl}/api/blog/published`, { cache: 'no-store' });
      
      if (!fallbackRes.ok) {
        console.error(`[Blog Page] All endpoints failed. Last error: ${fallbackRes.status} ${fallbackRes.statusText}`);
        return [];
      }
      
      const fallbackPosts = await fallbackRes.json();
      console.log(`[Blog Page] Successfully fetched ${fallbackPosts.length} posts from fallback`);
      return fallbackPosts;
    }

    const posts = await postsRes.json();
    console.log(`[Blog Page] Successfully fetched ${posts.length} posts`);
    
    // Filter for published posts only
    const publishedPosts = posts.filter((post: any) => post.published === true);
    console.log(`[Blog Page] After filtering: ${publishedPosts.length} published posts`);
    
    return publishedPosts;
  } catch (error) {
    console.error('[Blog Page] Error fetching blog posts:', error);
    return [];
  }
}

// Function to fetch categories
async function getCategories(locale: string) {
  console.log(`[Blog Page] Fetching blog categories for locale: ${locale}`);
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/categories/published`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch categories:', res.statusText);
      return [];
    }
    
    const categories = await res.json();
    console.log('Fetched categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = params;
  const isRtl = locale === 'fa';
  const dict = await getDictionary(locale as Locale);
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const categorySlug = searchParams.category;
  
  // Fetch posts and categories
  const posts = await getPosts(locale);
  const categories = await getCategories(locale);
  
  console.log(`[Blog Page] Rendering blog page with ${posts.length} posts, locale: ${params.locale}`);
  
  // Filter posts by category if category parameter is present
  const filteredPosts = categorySlug
    ? posts.filter((post: BlogPost) => 
        post.categories?.some((cat: any) => 
          (cat.slug === categorySlug) || 
          (cat.category?.slug === categorySlug)
        )
      )
    : posts;
  
  console.log(`[Blog Page] After category filtering: ${filteredPosts.length} posts`);
    
  // Define translations with fallbacks
  const blogTranslations = dict.blog || {
    blogTitle: locale === 'de' ? 'Blog' : 'وبلاگ',
    noPosts: locale === 'de' ? 'Keine Beiträge gefunden' : 'پستی یافت نشد',
    categories: locale === 'de' ? 'Kategorien' : 'دسته‌بندی‌ها',
    allCategories: locale === 'de' ? 'Alle' : 'همه',
    goBack: locale === 'de' ? 'Zurück' : 'بازگشت',
    nextPage: locale === 'de' ? 'Nächste' : 'بعدی',
    prevPage: locale === 'de' ? 'Zurück' : 'قبلی'
  };
  
  // Navigation translations
  const nav = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره ها',
    blog: locale === 'de' ? 'Blog' : 'بلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    signup: locale === 'de' ? 'Registrieren' : 'ثبت نام',
  };
  
  // Define footer for the MainLayout
  const footer = {
    about: {
      title: locale === 'de' ? 'Über uns' : 'درباره ما',
      description: locale === 'de' 
        ? 'Derakhte Kherad Sprachschule bietet hochwertigen Deutschunterricht und Unterstützung bei der Einwanderung nach Deutschland.' 
        : 'آموزشگاه زبان درخت خرد ارائه دهنده آموزش زبان آلمانی با کیفیت و پشتیبانی برای مهاجرت به آلمان است.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelllinks' : 'لینک‌های سریع',
      links: [
        { title: locale === 'de' ? 'Startseite' : 'خانه', href: `/${locale}` },
        { title: locale === 'de' ? 'Kurse' : 'دوره‌ها', href: `/${locale}/courses` },
        { title: locale === 'de' ? 'Blog' : 'وبلاگ', href: `/${locale}/blog` },
        { title: locale === 'de' ? 'Kontakt' : 'تماس با ما', href: `/${locale}/contact` }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      address: locale === 'de' ? 'Musterstraße 123, 12345 Berlin, Deutschland' : 'خیابان نمونه، پلاک ۱۲۳، تهران، ایران',
      email: 'info@derakhtekherad.com',
      phone: '+49 123 456789'
    }
  };
  
  // Render posts
  const renderPosts = () => {
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">{blogTranslations.noPosts}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post: BlogPost) => (
          <PostCard 
            key={post.id} 
            post={post} 
            locale={params.locale as Locale} 
          />
        ))}
      </div>
    );
  };
  
  // Create breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { 
      name: locale === 'de' ? 'Startseite' : 'خانه', 
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}` 
    },
    { 
      name: locale === 'de' ? 'Blog' : 'وبلاگ', 
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/blog` 
    }
  ]);
  
  // Create organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: locale === 'de' ? 'Derakhte Kherad Blog' : 'وبلاگ درخت خرد',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/blog`,
    inLanguage: locale === 'de' ? 'de' : 'fa',
    publisher: {
      '@type': 'Organization',
      name: 'Derakhte Kherad',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`
      }
    }
  };
  
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={organizationSchema} />
      <MainLayout locale={locale as Locale} navItems={nav} footer={footer}>
        <main className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`}>
          <h1 className="text-3xl font-bold text-center mb-8">{blogTranslations.blogTitle}</h1>
          
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{blogTranslations.categories}</h2>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href={`/${locale}/blog`}
                  className={`px-4 py-2 rounded-full ${
                    !categorySlug 
                      ? 'bg-primary text-white font-bold shadow-md hover:bg-primary-dark'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {blogTranslations.allCategories}
                </Link>
                {categories.map((category: Category) => (
                  <Link
                    key={category.id}
                    href={`/${locale}/blog?category=${category.slug}`}
                    className={`px-4 py-2 rounded-full ${
                      categorySlug === category.slug 
                        ? 'bg-primary text-white font-bold shadow-md hover:bg-primary-dark' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isRtl ? category.nameFa : category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Posts Grid */}
          {renderPosts()}
          
          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-12">
              {currentPage > 1 && (
                <Link
                  href={`/${locale}/blog?page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-4 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300"
                >
                  {isRtl ? blogTranslations.nextPage : blogTranslations.prevPage}
                </Link>
              )}
              
              <span className="px-4 py-2 bg-primary text-white">
                {currentPage}
              </span>
              
              <Link
                href={`/${locale}/blog?page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
              >
                {isRtl ? blogTranslations.prevPage : blogTranslations.nextPage}
              </Link>
            </div>
          )}
        </main>
      </MainLayout>
    </>
  );
} 