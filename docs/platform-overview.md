# Derakhte Kherad Platform Overview

## Introduction

Derakhte Kherad is a modern language school platform built with Next.js 15, designed to provide a seamless experience for language learners, teachers, and administrators. The platform supports multiple languages, including English, Persian (with RTL support), and German, making it accessible to a diverse user base.

## Key Features

### Authentication System
- Secure JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- Password reset functionality
- Multilingual login and registration forms

### User Management
- User profiles for different roles
- Account settings and preferences
- Profile image upload with fallback support

### Course Management
- Course creation and editing
- Lesson organization and sequencing
- Material uploading and management
- Assignment creation and grading

### Learning Experience
- Interactive lesson playback
- Progress tracking
- Quiz and assessment tools
- Student performance analytics

### Multilingual Support
- Complete internationalization (i18n)
- Right-to-left (RTL) support for Persian
- Language switching on-the-fly
- Localized content management

### Administrative Tools
- User management dashboard
- Course approval workflow
- System settings configuration
- Analytics and reporting

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Component Library**: Custom components with Tailwind

### Backend
- **API Routes**: Next.js API routes
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **File Storage**: Local (with plans for S3 integration)

### Deployment
- **Platform**: Vercel (planned)
- **CI/CD**: GitHub Actions (planned)

## User Roles and Permissions

### Admin
- Full access to all platform features
- User management
- Course approval and management
- System configuration

### Teacher
- Course creation and management
- Student performance tracking
- Assignment creation and grading
- Limited administrative access

### Student
- Course enrollment
- Lesson access
- Assignment submission
- Progress tracking

## Responsive Design

The platform is fully responsive, providing an optimal experience across:
- Desktop computers
- Tablets
- Mobile devices

All UI components adapt to different screen sizes while maintaining functionality and usability.

## Current Development Status

The platform is currently in active development with the following components completed:
- Core authentication system
- User profile management
- Basic course structure
- Multilingual support
- Responsive UI foundation

In-progress features include:
- Advanced course management
- Assignment submission and grading
- Enhanced administrative tools
- Analytics dashboard

## Future Enhancements

Planned enhancements for future releases:
- Live virtual classroom integration
- AI-powered language practice tools
- Mobile application
- Advanced analytics and reporting
- Integration with third-party learning resources

## Getting Started

For instructions on setting up and testing the platform, please refer to the [Quick Start Guide](./quick-start.md). 