# SEO Optimization Roadmap for Derakhte Kherad

This roadmap outlines the implementation plan for enhancing SEO across all public pages of the Derakhte Kherad Learning Management System.

## Current Status

Based on the assessment of the codebase:

- Base metadata is defined in `app/[locale]/layout.tsx` for all pages
- SEO utility functions created in `app/lib/seo.ts` for standardized implementation
- Structured data components implemented with JsonLd
- Several key public pages now have comprehensive SEO optimization:
  - Home page has complete metadata and structured data
  - About page has locale-specific metadata and organization schema
  - Courses page and course detail pages have schema.org Course data
  - Blog listing and detail pages have optimized metadata and structured data
  - Contact page includes LocalBusiness schema with geolocation data
  - Consultation page includes FAQ schema and comprehensive metadata

## Optimization Goals

1. **Implement comprehensive metadata for all public pages** ✅
2. **Add structured data (JSON-LD) for key content types** ✅
3. **Create a sitemap.xml file** ✅
4. **Implement canonical URLs for pages with multiple paths** ✅
5. **Add Open Graph and Twitter card metadata for better social sharing** ✅
6. **Optimize image alt texts and implement lazy loading** ✅
7. **Implement breadcrumbs for better navigation and SEO** ✅

## Implementation Progress

### Completed

- [x] Created SEO utility functions in `app/lib/seo.ts` for reusable SEO implementation
- [x] Created JSON-LD component for structured data in `app/components/seo/JsonLd.tsx`
- [x] Implemented sitemap.xml generation in `app/sitemap.ts`
- [x] Added robots.txt in `app/robots.ts`
- [x] Optimized SEO for Home page with metadata and organization schema
- [x] Optimized SEO for About page with metadata and organization schema
- [x] Optimized SEO for Courses page with metadata and course list schema
- [x] Enhanced SEO for course detail pages with comprehensive metadata and course schema
- [x] Improved Blog listing page with proper metadata and structured data
- [x] Upgraded Blog post pages with article schema and breadcrumb data
- [x] Implemented Contact page SEO with LocalBusiness schema and detailed contact information
- [x] Added Consultation page SEO with FAQ schema and comprehensive metadata

### In Progress

- [x] Home page (`app/[locale]/home/page.tsx`) ✅
- [x] About page (`app/[locale]/about/page.tsx`) ✅
- [x] Courses page (`app/[locale]/courses/page.tsx`) ✅
- [x] Course detail page (`app/[locale]/courses/[id]/page.tsx`) ✅
- [x] Blog listing page (`app/[locale]/blog/page.tsx`) ✅
- [x] Blog post page (`app/[locale]/blog/[slug]/page.tsx`) ✅
- [x] Contact page (`app/[locale]/contact/page.tsx`) ✅
- [x] Consultation page (`app/[locale]/consultation/page.tsx`) ✅

### Phase 2: Structured Data & Rich Results

- [x] Add JSON-LD for organization information (OrganizationSchema) ✅
- [x] Add JSON-LD structured data for courses (CourseSchema) ✅
- [x] Add JSON-LD for blog posts (BlogPostingSchema) ✅
- [x] Add breadcrumb schema for navigation structure ✅
- [x] Add LocalBusiness schema for contact information ✅
- [x] Add FAQ schema for consultation page ✅

### Phase 3: Sitemap and Robots.txt

- [x] Create `app/sitemap.ts` to generate dynamic sitemap ✅
- [x] Implement proper robots.txt ✅

### Phase 4: Open Graph & Twitter Cards

- [x] Create shared utility function for Open Graph metadata ✅
- [x] Implement Open Graph tags for all public pages ✅
- [x] Add Twitter card metadata ✅

### Phase 5: Image Optimization & Accessibility

- [x] Implement proper alt text for key images ✅
- [x] Use Next.js Image component with priority for above-the-fold content ✅
- [ ] Add lazy loading for below-the-fold images (partially implemented)

### Phase 6: Breadcrumbs & Navigation Structure

- [ ] Create reusable visual breadcrumb component (visual component)
- [x] Implement breadcrumb structured data in SEO utils ✅
- [x] Add breadcrumb structured data to key pages ✅

### Phase 7: Performance Optimizations

- [ ] Run Lighthouse audit to identify performance issues
- [ ] Optimize Core Web Vitals metrics
- [ ] Implement preloading for critical resources

## Tracking & Validation

- Use Google Search Console to track indexing and performance
- Validate structured data using Google's Rich Results Test
- Monitor page speed using Lighthouse and PageSpeed Insights
- Test Open Graph tags using social media debuggers

## Next Steps

1. ✅ Complete SEO optimization for all public pages ✅

2. Create a reusable visual breadcrumb component that matches the structured data

3. Run a Lighthouse audit to identify and fix any performance issues

4. Implement additional schema types for improved rich results:
   - ✅ FAQ schema for Consultation page ✅
   - Event schema for upcoming courses or webinars 