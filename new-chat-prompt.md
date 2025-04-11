# Derakhte Kherad Language School Platform Development

I'm working on a multilingual language learning platform called Derakhte Kherad using Next.js 15, TypeScript, and Tailwind CSS. The platform is for a German language institute in Iran, supporting both German and Persian languages (including RTL for Persian). I need assistance with continuing development of this project.

## Current State

The application has these implemented features:
- Next.js 15 setup with App Router
- TypeScript integration 
- Tailwind CSS responsive UI with dark mode
- Internationalization (i18n) with RTL support for Persian
- PostgreSQL database with Prisma ORM
- JWT-based authentication system using jose library (Edge runtime compatible)
- Password reset functionality
- User roles (Admin, Teacher, Student) with test accounts
- Basic API routes for data access
- User profile dropdown in header
- Role-specific dashboard layouts
- Login page with redirect functionality

Recent fixes:
- JWT verification in Edge runtime (replaced Node.js crypto with jose library)
- React rendering issues in dashboard layouts (moved routing logic to useEffect)
- Fixed API routes and prisma model usage
- Added proper login page with callback URL functionality

## Current Issues

The following issues still need to be addressed:
1. Image optimization warnings (deprecated `images.domains` configuration)
2. Async function warnings in some client components
3. Static generation errors with dynamic routes during build
4. Prisma enableTracing field warnings during build

## Project Structure

- `/app`: Next.js app router folders and components
- `/app/[locale]`: Language-specific routes (e.g., /fa/, /de/)
- `/app/api`: API routes for server-side functionality
- `/app/components`: UI components organized by feature/type
- `/app/context`: React context providers (AuthContext, etc.)
- `/app/i18n`: Internationalization configuration
- `/app/lib`: Utility functions and authentication
- `/prisma`: Database schema and migrations
- `/docs`: Project documentation

## Database Structure

The database uses Prisma ORM with a PostgreSQL database and includes models for:
- User (with role-based access)
- Admin, Teacher, Student (role-specific profiles)
- Course, Enrollment, Assignment, Quiz
- Blog posts and categories

## Next Steps

I'd like to work on these priority areas:

### 1. Build Process and Deployment Preparation
- Fix Prisma `enableTracing` field warnings during build
- Update image configuration to use `remotePatterns` instead of deprecated `domains`
- Address dynamic route static generation errors

### 2. Dashboard Enhancement
- Connect dashboards to real data from database
- Implement user statistics components
- Build course management interface
- Create user management tools

### 3. Course Management Implementation
- Implement CRUD operations for courses
- Create lesson structure with modules and units
- Build student enrollment interface

### 4. Form Validation & Error Handling
- Implement Zod validation for all forms
- Create consistent error messaging and toast notifications
- Add loading indicators and skeleton loaders

### 5. Testing & Documentation
- Set up testing framework
- Write tests for authentication flows and API routes
- Update API documentation

## Test Accounts

The database has been seeded with these test accounts:
- Admin: admin@derakhtekherad.com / admin123
- Teacher: teacher@derakhtekherad.com / teacher123
- Student: student@derakhtekherad.com / student123

## Specific Help Needed

I'd like to start by addressing build process issues so we can prepare for deployment, and then move on to enhancing the dashboard functionality with real data. Please help me with:

1. Fixing the Prisma `enableTracing` field warnings
2. Updating the Next.js image configuration
3. Addressing static generation errors with dynamic routes
4. Implementing proper data fetching for dashboard components

Let's start with the build process issues first. How should we approach fixing the Prisma configuration for production builds? 