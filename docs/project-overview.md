# Derakht-e-Kherad - Project Overview

## Introduction

Derakht-e-Kherad is an educational platform designed to facilitate language learning through course management, teacher-student interaction, and educational content delivery. The platform supports multilingual interfaces (Persian, German, and English) with right-to-left support for Persian and features a responsive design optimized for various devices.

## Project Goals

1. Create a modern, responsive, and multilingual website that showcases the institute and its offerings
2. Provide a comprehensive admin panel for managing content, courses, teachers, and students
3. Build separate dashboards for teachers to manage their courses and students
4. Implement a student dashboard for tracking progress and accessing resources
5. Establish a robust blog system for publishing educational content and articles

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js and custom JWT implementation
- **Internationalization**: next-intl with RTL support
- **UI Components**: Custom component library built with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API

## Project Structure

```
derakht-e-kherad/
├── app/                      # Next.js app directory
│   ├── [locale]/             # Localized routes
│   │   ├── admin/            # Admin dashboard
│   │   ├── auth/             # Authentication pages
│   │   ├── blog/             # Blog pages
│   │   ├── courses/          # Course pages
│   │   ├── student/          # Student dashboard
│   │   ├── teacher/          # Teacher dashboard
│   │   └── (site)/           # Public website routes
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── blog/             # Blog endpoints
│   │   ├── courses/          # Course endpoints
│   │   ├── users/            # User endpoints
│   │   └── upload/           # File upload endpoints
├── components/               # Reusable components
│   ├── auth/                 # Authentication components
│   ├── blog/                 # Blog components
│   ├── common/               # Common components
│   ├── dashboard/            # Dashboard components
│   ├── forms/                # Form components
│   └── ui/                   # UI components
├── contexts/                 # React context providers
├── dictionaries/             # Translation files
├── lib/                      # Utility functions and libraries
├── middleware.ts             # Next.js middleware
├── prisma/                   # Prisma schema and migrations
└── public/                   # Static assets
```

## Key Features

### Multilingual Support

The application fully supports multiple languages with locale-specific routing:

- **Persian (fa)**: With right-to-left layout
- **German (de)**: With left-to-right layout
- **English (en)**: With left-to-right layout

All routes are prefixed with the locale code (e.g., `/fa/courses`), and a language switcher component allows users to toggle between languages.

### Authentication System

The platform implements a dual authentication system:

1. **Session-based authentication**: Using NextAuth.js for frontend user sessions
2. **Token-based authentication**: Custom JWT implementation for API access

User roles include:
- **Admin**: Full access to all platform features
- **Teacher**: Access to teaching resources and student management
- **Student**: Access to learning resources and personal dashboard

### Blog System

The blog system is fully implemented and includes:

- Admin interface for creating, editing, and managing posts and categories
- Public blog pages with listing, filtering by category, and single post views
- Multi-language content support
- Image upload functionality with fallback mechanisms
- Related posts functionality

### Course Management

The course management system (in progress) includes:

- Course creation and editing interface
- Course enrollment functionality
- Course materials organization
- Assignment creation and submission

### Responsive Design

The application employs a fully responsive design that adapts to:

- Desktop computers
- Tablets
- Mobile devices

All UI components adjust dynamically to different screen sizes while maintaining functionality.

### Dark Mode

The platform includes a built-in dark mode that:

- Respects user system preferences
- Can be toggled manually
- Persists user choice across sessions
- Applies consistent theming across all components

## Implementation Status

### Completed Features (95-100%)

- Project structure and setup
- Database schema and Prisma setup
- Internationalization with RTL support
- Authentication system (session and token-based)
- Blog system with full CRUD operations
- Public website core pages
- Dark mode implementation
- Responsive design framework
- Image handling with fallbacks

### In Progress Features (40-80%)

- Admin dashboard
- Course management system
- User profile management
- Teacher dashboard
- Student dashboard
- Performance optimizations

### Planned Features (0-30%)

- Advanced analytics
- Email notification system
- Payment integration
- Assignment and grading system
- Mobile application
- Advanced search functionality

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Set up environment variables
   ```
   cp .env.example .env.local
   ```
4. Initialize the database
   ```
   npx prisma migrate dev
   ```
5. Start the development server
   ```
   npm run dev
   ```

## Next Steps

See the [PROJECT_ROADMAP.md](../PROJECT_ROADMAP.md) file for detailed information about project progress and upcoming milestones.

For detailed documentation on specific features, refer to:
- [Authentication System](./authentication.md)
- [Blog System](./blog-system.md)
- [Styling Approach](./styling-approach.md)
- [Development Workflow](./development-workflow.md) 