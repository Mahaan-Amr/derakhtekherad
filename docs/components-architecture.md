# Components Architecture

## Overview

Derakhte Kherad follows a modular component architecture using Next.js with React Server Components (RSC) and TypeScript. The architecture emphasizes:

- Reusability across different parts of the application
- Clear separation of concerns
- Bilingual support (Farsi and German)
- Responsive design for all device sizes

## Directory Structure

Components are organized within the `app/components` directory:

```
app/components/
│
├── common/ - Shared components used throughout the app
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LangSwitcher.tsx
│   ├── Logo.tsx
│   └── ...
│
├── home/ - Components specific to the homepage
│   ├── Hero.tsx
│   ├── CoursePreview.tsx
│   ├── Testimonials.tsx
│   └── ...
│
├── courses/ - Course-related components
│   ├── CourseCard.tsx
│   ├── CourseList.tsx
│   ├── CourseDetail.tsx
│   └── ...
│
├── auth/ - Authentication-related components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ...
│
├── admin/ - Admin dashboard components
│   ├── Sidebar.tsx
│   ├── DataTable.tsx
│   └── ...
│
├── blog/ - Blog-related components
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   └── ...
│
└── ui/ - Basic UI elements
    ├── Input.tsx
    ├── Select.tsx
    ├── Toggle.tsx
    └── ...
```

## Component Types

The project uses three types of components:

1. **Server Components** - Default for data fetching and rendering static content
2. **Client Components** - Used for interactive elements with client-side state
3. **Layout Components** - Used for consistent page structure

### Server Components

Server components are the default in Next.js 13+ App Router. They:

- Handle data fetching directly
- Don't have access to browser APIs
- Don't use hooks or client-side state
- Render on the server for improved performance

Example of a server component:

```tsx
// app/components/courses/CourseList.tsx
import { getCourses } from '@/lib/db-utils';
import CourseCard from './CourseCard';

export default async function CourseList({ locale }: { locale: string }) {
  const courses = await getCourses();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard 
          key={course.id} 
          course={course} 
          isRtl={locale === 'fa'} 
        />
      ))}
    </div>
  );
}
```

### Client Components

Client components are used for interactive elements that require:
- User events (clicks, form submissions)
- Browser APIs
- State and lifecycle effects
- Client-side libraries

They are marked with the `"use client"` directive at the top of the file.

Example of a client component:

```tsx
// app/components/auth/LoginForm.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../common/Button';
import Input from '../ui/Input';

export default function LoginForm({ 
  dictionary 
}: { 
  dictionary: { [key: string]: string } 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={dictionary.emailLabel}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label={dictionary.passwordLabel}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">{dictionary.loginButton}</Button>
    </form>
  );
}
```

### Layout Components

Layout components provide consistent structure across pages:

```tsx
// app/components/common/DashboardLayout.tsx
import Sidebar from '../admin/Sidebar';
import Header from './Header';

export default function DashboardLayout({ 
  children,
  dictionary
}: { 
  children: React.ReactNode;
  dictionary: { [key: string]: string };
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar dictionary={dictionary} />
      <div className="flex flex-col flex-1">
        <Header dictionary={dictionary} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Common Component Patterns

### Internationalization Support

Components receive translations through props:

```tsx
// app/[locale]/courses/page.tsx
import { getDictionary } from '@/app/i18n';
import CourseList from '@/app/components/courses/CourseList';

export default async function CoursesPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const dictionary = await getDictionary(locale);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {dictionary.courses.title}
      </h1>
      <CourseList locale={locale} />
    </div>
  );
}
```

### RTL Support

Components check the `isRtl` prop to adjust layout direction:

```tsx
// app/components/common/Card.tsx
export default function Card({ 
  title,
  children,
  isRtl = false
}: { 
  title: string;
  children: React.ReactNode;
  isRtl?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${isRtl ? 'text-right' : 'text-left'}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
```

### Responsive Design

Components use Tailwind's responsive utility classes:

```tsx
// app/components/common/Header.tsx
"use client"

import { useState, useEffect } from 'react';
import Logo from './Logo';
import LangSwitcher from './LangSwitcher';
import Link from 'next/link';

export default function Header({ 
  dictionary,
  isRtl = false
}: { 
  dictionary: { [key: string]: string };
  isRtl?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          {!isMobile ? (
            <nav className={`flex items-center gap-6 ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
              <Link href={`/${isRtl ? 'fa' : 'de'}`} className="hover:text-primary">
                {dictionary.nav.home}
              </Link>
              <Link href={`/${isRtl ? 'fa' : 'de'}/courses`} className="hover:text-primary">
                {dictionary.nav.courses}
              </Link>
              <Link href={`/${isRtl ? 'fa' : 'de'}/about`} className="hover:text-primary">
                {dictionary.nav.about}
              </Link>
              <Link href={`/${isRtl ? 'fa' : 'de'}/blog`} className="hover:text-primary">
                {dictionary.nav.blog}
              </Link>
              <Link href={`/${isRtl ? 'fa' : 'de'}/contact`} className="hover:text-primary">
                {dictionary.nav.contact}
              </Link>
            </nav>
          ) : (
            // Mobile menu implementation
            <MobileMenu dictionary={dictionary} isRtl={isRtl} />
          )}
          
          <div className={`flex items-center gap-4 ${isRtl ? 'mr-4' : 'ml-4'}`}>
            <LangSwitcher />
            <Link href={`/${isRtl ? 'fa' : 'de'}/login`} className="btn btn-sm">
              {dictionary.nav.login}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile menu component omitted for brevity
```

## Component Composition

Components are composed to build more complex UIs:

```tsx
// app/[locale]/page.tsx
import Hero from '@/app/components/home/Hero';
import FeatureSection from '@/app/components/home/FeatureSection';
import CoursePreview from '@/app/components/home/CoursePreview';
import Testimonials from '@/app/components/home/Testimonials';
import CallToAction from '@/app/components/home/CallToAction';
import { getDictionary } from '@/app/i18n';

export default async function HomePage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const dictionary = await getDictionary(locale);
  const isRtl = locale === 'fa';

  return (
    <main>
      <Hero dictionary={dictionary.home.hero} isRtl={isRtl} />
      <FeatureSection dictionary={dictionary.home.features} isRtl={isRtl} />
      <CoursePreview dictionary={dictionary.home.courses} locale={locale} />
      <Testimonials dictionary={dictionary.home.testimonials} isRtl={isRtl} />
      <CallToAction dictionary={dictionary.home.cta} isRtl={isRtl} />
    </main>
  );
}
```

## Best Practices

1. **Server vs Client Components**
   - Use server components by default
   - Only use client components when necessary for interactivity
   - Keep client components lean to minimize JS bundle size

2. **Props and TypeScript**
   - Define clear TypeScript interfaces for component props
   - Use destructuring with default values for optional props
   - Pass only necessary props to child components

3. **State Management**
   - Use local state for UI-specific state
   - Use React Context for shared state across related components
   - Consider server actions for form submissions

4. **Performance Optimization**
   - Leverage React's memo for expensive client components
   - Use Next.js Image component for optimized images
   - Implement proper loading states and error boundaries

5. **Accessibility**
   - Include proper ARIA attributes
   - Ensure keyboard navigation works
   - Maintain proper color contrast
   - Test with screen readers 