# Visual Breadcrumb Component Implementation Plan

This document outlines the plan for implementing a visual breadcrumb component that will match the structured data already implemented in the SEO optimization work.

## Overview

The Derakhte Kherad Learning Management System has already implemented breadcrumb structured data (JSON-LD) for key pages to enhance SEO. The next step is to create a user-facing breadcrumb component that visually represents this navigation path, providing users with context about their location in the site hierarchy.

## Current Status

The SEO implementation includes:
- BreadcrumbList structured data via `generateBreadcrumbSchema()` function in `app/lib/seo.ts`
- Implementation on key pages including blog posts, course details, and consultation pages
- Proper localization for breadcrumb items in both German and Persian

## Implementation Goals

1. Create a reusable `Breadcrumb` component that:
   - Matches the data structure used in the structured data implementation
   - Supports RTL/LTR layout based on the current locale
   - Provides a consistent visual representation across all pages
   - Adapts to mobile and desktop views

2. Apply the component to all pages with existing breadcrumb structured data:
   - Blog post pages
   - Course detail pages
   - Consultation page
   - Contact page

3. Ensure proper accessibility and usability:
   - Keyboard navigation support
   - ARIA attributes for screen readers
   - Proper contrast for text and background
   - Clear visual hierarchy

## Component Design

### Interface

```typescript
interface BreadcrumbItem {
  name: string;  // Display name for the breadcrumb item
  item: string;  // URL path for the breadcrumb item
  current?: boolean; // Whether this is the current page
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string; // Optional additional classes
}
```

### Visual Design

- Color scheme: Use primary colors from the theme with proper contrast
- Separator: Use a chevron icon (›) or similar that respects RTL/LTR direction
- Current page: Highlighted and non-clickable
- Hover states: Subtle highlight or underline for interactive items
- Mobile adaptation: Condensed view on smaller screens

## Implementation Steps

1. **Create Base Component (1 day)**
   - Create `app/components/ui/Breadcrumb.tsx` component
   - Implement the core rendering logic for breadcrumb items
   - Add styling using Tailwind CSS
   - Handle RTL/LTR layout based on locale

2. **Add Accessibility Features (0.5 day)**
   - Add proper ARIA roles and attributes
   - Ensure keyboard navigation works correctly
   - Test with screen readers

3. **Integrate with Existing Pages (1 day)**
   - Update pages with existing breadcrumb structured data:
     - Course detail pages: `app/[locale]/courses/[id]/page.tsx`
     - Blog post pages: `app/[locale]/blog/[slug]/page.tsx`
     - Consultation page: `app/[locale]/consultation/page.tsx`
     - Contact page: `app/[locale]/contact/page.tsx`

4. **Create Helper Function (0.5 day)**
   - Add a helper function to `app/lib/seo.ts` to generate breadcrumb items for both structured data and visual component
   - Ensure consistent data structure between visual breadcrumbs and structured data

5. **Testing and Refinement (1 day)**
   - Test across different browsers and devices
   - Verify correct behavior in both German and Persian
   - Make refinements based on testing results

## Code Example

The component implementation might look something like:

```typescript
'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  item: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  
  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className={`flex flex-wrap items-center ${isRTL ? 'space-x-reverse' : 'space-x-2'}`}>
        {items.map((item, index) => (
          <li key={item.item} className="flex items-center">
            {index > 0 && (
              <ChevronIcon className={`mx-2 h-4 w-4 text-gray-400 ${isRTL ? 'transform rotate-180' : ''}`} />
            )}
            
            {item.current ? (
              <span className="text-sm font-medium text-primary" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                href={`/${locale}${item.item}`} 
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

## Integration Example

Implementation in a page component:

```typescript
import Breadcrumb from '@/components/ui/Breadcrumb';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

// Inside page component
const breadcrumbItems = [
  { name: locale === 'de' ? 'Startseite' : 'صفحه اصلی', item: '/' },
  { name: locale === 'de' ? 'Blog' : 'وبلاگ', item: '/blog' },
  { name: post.title, item: `/blog/${post.slug}`, current: true },
];

// Return JSX including both structured data and visual breadcrumbs
return (
  <>
    <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
    <div className="container mx-auto px-4">
      <Breadcrumb items={breadcrumbItems} />
      {/* Rest of the page content */}
    </div>
  </>
);
```

## Measurement of Success

The implementation will be considered successful when:

1. Visual breadcrumbs are present on all pages that have breadcrumb structured data
2. The component properly adapts to RTL/LTR layouts for both languages
3. The component is fully accessible and usable on all devices
4. The visual representation matches the structured data implementation

## Timeline

- Day 1: Create base component and add accessibility features
- Day 2: Integrate with existing pages and create helper function
- Day 3: Testing, refinement, and finalization

## Dependencies

- Tailwind CSS (already installed)
- Lucide React for icons (or alternative icon library)
- Next.js App Router and next-intl (already set up)

## Next Steps After Implementation

1. Consider extending breadcrumbs to additional pages
2. Add visual animations for page transitions
3. Integrate with analytics to track breadcrumb usage
4. Review and optimize breadcrumb performance

## Resources

- [MDN Web Docs: Breadcrumb Navigation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
- [Web Accessibility Initiative: Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [Schema.org: BreadcrumbList](https://schema.org/BreadcrumbList) 