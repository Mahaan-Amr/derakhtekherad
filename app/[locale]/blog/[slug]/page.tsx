import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/app/i18n';
import { formatDate } from '@/lib/utils';
import { Locale } from '@/app/i18n/settings';
import HtmlContent from '@/app/components/ui/HtmlContent';
import MainLayout from '@/app/components/layouts/MainLayout';
import { generateSeoMetadata, generateBlogPostSchema, generateBreadcrumbSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// This interface is used for data returned from the API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Post {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  content: string;
  contentFa: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  author: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
    nameFa: string;
    slug: string;
  }[];
}

interface RelatedPost {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  thumbnailUrl: string;
  createdAt: string;
}

interface PostCategory {
  id: string;
  name: string;
  nameFa: string;
  slug: string;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const data = await fetchPost(locale, slug);
  
  if (!data || !data.post) {
    return {
      title: locale === 'de' ? 'Beitrag nicht gefunden | Derakhte Kherad' : 'مطلب یافت نشد | درخت خرد',
    };
  }
  
  const post = data.post;
  const content = post.content || '';
  const contentFa = post.contentFa || '';
  
  return generateSeoMetadata({
    title: {
      de: post.title,
      fa: post.titleFa || post.title
    },
    description: {
      de: content.substring(0, 160).replace(/<[^>]+>/g, ''),
      fa: contentFa.substring(0, 160).replace(/<[^>]+>/g, '') || content.substring(0, 160).replace(/<[^>]+>/g, '')
    },
    path: `blog/${slug}`,
    image: post.thumbnailUrl ? {
      url: post.thumbnailUrl,
      alt: {
        de: post.title,
        fa: post.titleFa || post.title
      }
    } : undefined,
    type: 'article',
    keywords: {
      de: post.categories.map((cat: PostCategory) => cat.name),
      fa: post.categories.map((cat: PostCategory) => cat.nameFa || cat.name)
    }
  }, locale as Locale);
}

// Fetch a single post by slug
async function fetchPost(locale: string, slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/published/${slug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = params;
  const { blog } = await getDictionary(locale as Locale);
  const data = await fetchPost(locale, slug);
  
  if (!data || !data.post) {
    notFound();
  }
  
  const { post, relatedPosts } = data;
  const isRtl = locale === 'fa';
  const postTitle = isRtl && post.titleFa ? post.titleFa : post.title;
  const postContent = isRtl && post.contentFa ? post.contentFa : post.content;
  
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
  
  // Generate blog post structured data
  const blogPostSchema = generateBlogPostSchema(post, locale as Locale);
  
  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { 
      name: locale === 'de' ? 'Startseite' : 'خانه', 
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}` 
    },
    { 
      name: locale === 'de' ? 'Blog' : 'وبلاگ', 
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/blog` 
    },
    {
      name: postTitle,
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/blog/${slug}`
    }
  ]);
  
  return (
    <>
      <JsonLd data={blogPostSchema} />
      <JsonLd data={breadcrumbSchema} />
      <MainLayout
        locale={locale as Locale}
        navItems={nav}
        footer={footer}
      >
        <main className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`}>
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-primary">
              {blog.home}
            </Link>
            {' '} / {' '}
            <Link href={`/${locale}/blog`} className="hover:text-primary">
              {blog.blog}
            </Link>
            {' '} / {' '}
            <span className="text-gray-700">{postTitle}</span>
          </div>
          
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            <div className="relative w-full h-96">
              <Image
                src={post.thumbnailUrl || '/images/placeholder.jpg'}
                alt={postTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-8">
              {/* Post Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{postTitle}</h1>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-4">
                  <span>{blog.publishedOn} {formatDate(post.createdAt, locale)}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.by} {post.author.name}</span>
                </div>
                
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category: PostCategory) => (
                      <Link 
                        key={category.id}
                        href={`/${locale}/blog?category=${category.slug}`}
                        className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:text-gray-200 transition-colors"
                      >
                        {isRtl && category.nameFa ? category.nameFa : category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Post Content */}
              <HtmlContent 
                content={postContent} 
                locale={locale as Locale} 
                className="prose-lg dark:prose-invert max-w-none" 
              />
            </div>
          </article>
          
          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">{blog.relatedPosts}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: RelatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/${locale}/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative w-full h-48">
                        <Image
                          src={relatedPost.thumbnailUrl || '/images/placeholder.jpg'}
                          alt={isRtl && relatedPost.titleFa ? relatedPost.titleFa : relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors dark:text-white">
                          {isRtl && relatedPost.titleFa ? relatedPost.titleFa : relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(relatedPost.createdAt, locale)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link 
              href={`/${locale}/blog`} 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              {blog.backToAllPosts}
            </Link>
          </div>
        </main>
      </MainLayout>
    </>
  );
} 