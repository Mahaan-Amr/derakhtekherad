# Developer Guide - Derakhte Kherad

This guide contains comprehensive instructions for developing and maintaining the Derakhte Kherad language school application. It covers setup, recent fixes, best practices, and troubleshooting.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Development Workflow](#development-workflow)
3. [Next.js 15 Adaptations](#nextjs-15-adaptations)
4. [Internationalization (i18n)](#internationalization-i18n)
5. [API Structure](#api-structure)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Development Best Practices](#development-best-practices)

## Project Setup

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd derakhtekherad
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update database connection strings and any other required settings

4. Set up the database:
   ```bash
   npx prisma migrate dev
   # or if using seed data
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Development Workflow

1. **Branch Management**:
   - Use feature branches for new development
   - Create pull requests for code review
   - Merge to main only after review

2. **Code Style**:
   - Follow established project conventions
   - Run linters before committing code

3. **Testing**:
   - Write tests for new functionality
   - Ensure all tests pass before submitting PRs

## Next.js 15 Adaptations

### Page Props and Parameters

In Next.js 15, route parameters are handled as Promises. This pattern must be used in all route components:

```typescript
// Correct pattern for Next.js 15
export default async function PageComponent({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Rest of the component...
}
```

### API Routes

API routes in Next.js 15 should conform to these patterns:

1. Use standard Next.js API route exports (GET, POST, etc.)
2. Don't export helper functions from route files
3. Use proper typing for Prisma queries

Example:

```typescript
export async function GET(request: NextRequest) {
  // Route implementation
}
```

### Configuration

The `next.config.js` file should use the new configuration format:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Other config options...
};

module.exports = nextConfig;
```

## Internationalization (i18n)

### Locale Handling

The application supports multiple locales:
- English (en) - default
- German (de) 
- Persian/Farsi (fa)

Locales are managed through dynamic routes with the `[locale]` parameter.

### RTL Support

For right-to-left languages (Persian):
- Use the `isRtl` variable based on locale
- Apply appropriate CSS classes
- Use directional classnames for spacing

### Translation Process

Translations are managed through:
1. Inline translations for simple cases
2. Translation files for complex cases

## API Structure

The API follows RESTful conventions with these endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/courses` - Course management
- `/api/teachers` - Teacher information
- `/api/students` - Student data
- `/api/blog/*` - Blog functionality
- `/api/enrollments` - Course enrollment

## Common Issues and Solutions

### Next.js Build Errors

#### Problem: Type '{ params: { locale: string } }' does not satisfy the constraint 'PageProps'

**Solution**: Update the component to handle params as a Promise:

```typescript
export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Rest of component
}
```

#### Problem: PostCSS Configuration Error

**Solution**: Use the correct ES module format in `postcss.config.mjs`:

```javascript
// Configuration for PostCSS plugins
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

#### Problem: Image Optimization Error

**Solution**: Ensure:
1. Images are in the correct path (`/public/images/`)
2. Use the `ImageWithFallback` component
3. Provide a valid fallback image

### Prisma Errors

1. **Query Error**: Check that relation names match schema
2. **Connection Error**: Verify database connection string in `.env`

## Development Best Practices

### Component Structure

1. **Client Components**:
   - Add `'use client';` at the top
   - Use for interactive elements
   - Keep them focused on UI concerns

2. **Server Components**:
   - Default in Next.js App Router
   - Use for data fetching and static content

### Performance Optimization

1. **Image Optimization**:
   - Always use Next.js Image component
   - Set appropriate sizes
   - Use WebP format where possible

2. **Code Splitting**:
   - Use dynamic imports for large components
   - Lazy load below-the-fold content

### Accessibility

1. Follow WCAG guidelines
2. Ensure proper keyboard navigation
3. Use semantic HTML elements 