import { Metadata } from 'next';
import { Locale } from '../i18n/settings';

/**
 * Interface for page SEO props
 */
export interface SeoProps {
  title: {
    de: string;
    fa: string;
  };
  description: {
    de: string;
    fa: string;
  };
  path?: string;
  image?: {
    url: string;
    alt: {
      de: string;
      fa: string;
    };
    width?: number;
    height?: number;
  };
  type?: 'website' | 'article' | 'profile';
  keywords?: {
    de: string[];
    fa: string[];
  };
}

/**
 * Generate metadata for a page with proper SEO attributes
 */
export function generateSeoMetadata(props: SeoProps, locale: Locale): Metadata {
  const { title, description, path, image, type = 'website', keywords } = props;
  
  // Base URL for the site
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com';
  
  // Default image if none provided
  const defaultImage = {
    url: `${baseUrl}/images/og-default.jpg`,
    alt: {
      de: 'Derakhte Kherad - Deutsches Sprachinstitut',
      fa: 'درخت خرد - موسسه زبان آلمانی'
    },
    width: 1200,
    height: 630
  };
  
  // Use provided image or fallback to default
  const seoImage = image || defaultImage;
  
  // Create full URL for the page
  const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
  
  // Create locale-specific title with site name
  const localizedTitle = locale === 'de' 
    ? `${title.de} | Derakhte Kherad` 
    : `${title.fa} | درخت خرد`;
  
  // Create locale-specific description
  const localizedDescription = locale === 'de' ? description.de : description.fa;
  
  // Create locale-specific image alt text
  const localizedImageAlt = locale === 'de' ? seoImage.alt.de : seoImage.alt.fa;
  
  // Create locale-specific keywords
  const localizedKeywords = keywords 
    ? (locale === 'de' ? keywords.de : keywords.fa)
    : undefined;
  
  return {
    title: localizedTitle,
    description: localizedDescription,
    keywords: localizedKeywords,
    alternates: {
      canonical: url,
      languages: {
        'de': `${baseUrl}/de/${path || ''}`,
        'fa': `${baseUrl}/fa/${path || ''}`
      }
    },
    openGraph: {
      title: localizedTitle,
      description: localizedDescription,
      url: url,
      siteName: locale === 'de' ? 'Derakhte Kherad' : 'درخت خرد',
      images: [
        {
          url: seoImage.url,
          width: seoImage.width || 1200,
          height: seoImage.height || 630,
          alt: localizedImageAlt,
        }
      ],
      locale: locale,
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description: localizedDescription,
      images: [seoImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for an organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LanguageSchool',
    name: 'Derakhte Kherad',
    alternateName: 'درخت خرد',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com'}/site-logo/logo.svg`,
    sameAs: [
      'https://www.facebook.com/derakhtekherad',
      'https://www.instagram.com/derakhtekherad',
      'https://twitter.com/derakhtekherad'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Example Street 123',
      addressLocality: 'Shiraz',
      addressRegion: 'Fars',
      postalCode: '12345',
      addressCountry: 'IR'
    },
    telephone: '+98 71 12345678',
    email: 'info@derakhtekherad.com',
    description: 'Derakhte Kherad is a German language school in Shiraz, Iran, offering comprehensive German language courses.'
  };
}

/**
 * Generate JSON-LD structured data for a course
 */
export function generateCourseSchema(course: any, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: locale === 'de' ? course.title : course.titleFa,
    description: locale === 'de' ? course.description : course.descriptionFa,
    provider: {
      '@type': 'Organization',
      name: 'Derakhte Kherad',
      sameAs: process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com'
    },
    courseCode: course.id,
    coursePrerequisites: `German Language Level ${course.level.charAt(0)}${parseInt(course.level.substring(1)) - 1}`,
    educationalCredentialAwarded: `German Language Certificate Level ${course.level}`,
    startDate: course.startDate,
    endDate: course.endDate,
    timeRequired: 'P12W',
    inLanguage: 'de'
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generateBlogPostSchema(post: any, locale: Locale) {
  // Create a safe excerpt with null checking and fallbacks
  const getExcerpt = (text: string | undefined | null): string => {
    if (!text) return '';
    return text.substring(0, 160);
  };

  const excerpt = locale === 'de' 
    ? getExcerpt(post.excerpt || post.content)
    : getExcerpt(post.excerptFa || post.contentFa || post.excerpt || post.content);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: locale === 'de' ? post.title : post.titleFa,
    image: post.thumbnailUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com'}/images/og-default.jpg`,
    datePublished: post.publishDate,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Derakhte Kherad',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com'}/site-logo/logo.svg`
      }
    },
    description: excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://derakhtekherad.com'}/${locale}/blog/${post.slug}`
    }
  };
}

/**
 * Generate breadcrumb JSON-LD structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string, item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
} 