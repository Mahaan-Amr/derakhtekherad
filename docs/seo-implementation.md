# SEO Implementation Documentation

This document provides an overview of the SEO implementation for the Derakhte Kherad Learning Management System. It covers the approach, tools, components, and best practices used to optimize the website for search engines and social media platforms.

## Overview

The SEO strategy for Derakhte Kherad focuses on:

1. **Comprehensive metadata** for all public pages
2. **Structured data** using JSON-LD for rich snippets
3. **Multilingual support** for German and Persian content
4. **Performance optimization** for improved Core Web Vitals
5. **Accessibility enhancements** for better user experience

## Core SEO Components

### 1. SEO Utility Functions

Located in `app/lib/seo.ts`, these functions provide a standardized way to generate metadata and structured data:

```typescript
// Generate metadata for pages
generateSeoMetadata(props: SeoProps, locale: Locale): Metadata

// Generate structured data for different content types
generateOrganizationSchema()
generateCourseSchema(course: any, locale: Locale)
generateBlogPostSchema(post: any, locale: Locale)
generateBreadcrumbSchema(items: Array<{ name: string, item: string }>)
```

### 2. JSON-LD Component

Located in `app/components/seo/JsonLd.tsx`, this component renders structured data in JSON-LD format:

```typescript
interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 3. Sitemap Generation

Located in `app/sitemap.ts`, this file dynamically generates the sitemap for all public pages:

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamically generates sitemap entries for pages, courses, blog posts, etc.
}
```

### 4. Robots.txt Configuration

Located in `app/robots.ts`, this file defines the robots.txt rules:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
```

## Implementation by Page Type

### Home Page

- **Metadata**: Title, description, keywords in German and Persian
- **Structured Data**: OrganizationSchema for the language school
- **Open Graph**: Image, title, and description for social sharing

### Courses Pages

- **Courses Listing**:
  - Metadata optimized for course discovery
  - Structured data for course listings
  
- **Course Detail Pages**:
  - Specific course metadata with level and teacher information
  - Course schema with details like startDate, endDate, and prerequisites
  - Breadcrumb structured data for navigation context

### Blog Pages

- **Blog Listing**:
  - Category-specific metadata when filtering by category
  - Blog schema for the overall blog section
  
- **Blog Post Pages**:
  - Article-specific metadata with author and publication date
  - BlogPosting schema with author, datePublished, and publisher
  - Breadcrumb structured data for navigation context

## Multilingual SEO Strategy

The SEO implementation supports both German and Persian content:

1. **Locale-specific metadata**: Different titles, descriptions, and keywords for each language
2. **Alternate links**: Proper hreflang tags to indicate language alternatives
3. **RTL support**: Special handling for Persian content with RTL text direction

Example from `generateSeoMetadata`:

```typescript
alternates: {
  canonical: url,
  languages: {
    'de': `${baseUrl}/de/${path || ''}`,
    'fa': `${baseUrl}/fa/${path || ''}`
  }
}
```

## Image Optimization

1. **Next.js Image component**: Used for automatic optimization and responsive sizing
2. **Priority loading**: Applied to above-the-fold images
3. **Alt text**: Locale-specific alt text for all images
4. **Lazy loading**: Applied to below-the-fold images

## Open Graph and Twitter Cards

All pages include Open Graph and Twitter card metadata for better social sharing:

```typescript
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
```

## Best Practices Implemented

1. **Canonical URLs**: Prevent duplicate content issues
2. **Structured Data**: Enhance rich snippets in search results
3. **Semantic HTML**: Proper heading hierarchy and semantic elements
4. **Mobile Optimization**: Responsive design for all devices
5. **Performance**: Optimized loading of critical resources

## Monitoring and Testing

- **Google Search Console**: For indexing and performance monitoring
- **Rich Results Test**: For validating structured data
- **Lighthouse**: For performance, accessibility, and SEO audits
- **Social Media Debuggers**: For testing Open Graph implementation

## Future Enhancements

1. **Visual Breadcrumb Component**: To complement the structured data breadcrumbs
2. **FAQ Schema**: For the Consultation page to capture FAQ rich results
3. **Event Schema**: For upcoming courses or webinars
4. **Performance Optimization**: Based on Core Web Vitals analysis

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/) for structured data reference
- [Google Search Central](https://developers.google.com/search) for SEO best practices 