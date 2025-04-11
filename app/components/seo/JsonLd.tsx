'use client';

import { ReactNode } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * Component to add JSON-LD structured data to pages
 * Must be used as a client component due to dangerouslySetInnerHTML
 */
export default function JsonLd({ data }: JsonLdProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
} 