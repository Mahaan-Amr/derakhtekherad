# Course Management System

## Overview

The course management system is a comprehensive solution integrated into the admin dashboard that allows administrators to create, edit, and manage courses and their modules. The system supports multiple languages (Persian and German) and provides a flexible structure for organizing educational content.

## Features

- **Multilingual Content**: Support for German and Farsi course information
- **Course Management**: Create, edit, delete, and activate/deactivate courses
- **Module Management**: Organize course content into modules
- **Teacher Assignment**: Assign teachers to courses
- **Thumbnail Images**: Upload and manage course thumbnail images
- **Course Details**: Manage course attributes like level (with sublevels), capacity, dates, and location
- **Module Ordering**: Order modules sequentially within courses
- **Pricing**: Manage course prices in Toman/تومان currency

## Components

### Admin Components

1. **CourseManagement**: Main container component for the course system with tabs for Courses and Modules.
   - Location: `components/dashboard/admin/courses/CourseManagement.tsx`
   - Features: Tab-based navigation between courses and modules management

2. **CoursesList**: Component for listing, filtering, and managing courses.
   - Location: `components/dashboard/admin/courses/CoursesList.tsx`
   - Features: 
     - Search functionality
     - Status filtering (active/inactive)
     - Quick actions (edit, delete, view modules)
     - Teacher and level filtering
     - Price display in Toman/تومان

3. **CourseEditor**: Component for creating and editing courses.
   - Location: `components/dashboard/admin/courses/CourseEditor.tsx`
   - Features:
     - Form with validation
     - Thumbnail image upload and preview
     - Teacher selection
     - Multilingual content fields
     - Toggle for active/inactive status
     - Date and time selection
     - Level selection with sublevels (A1.1, A1.2, B1.1, etc.)
     - Price input with Toman/تومان display

4. **ModulesList**: Component for managing course modules.
   - Location: `components/dashboard/admin/courses/ModulesList.tsx`
   - Features:
     - Add/edit/delete modules
     - Display module details
     - List lessons per module
     - Navigate to lesson management

5. **ModuleEditor**: Component for creating and editing modules.
   - Location: `components/dashboard/admin/courses/ModuleEditor.tsx`
   - Features:
     - Form with validation
     - Multilingual content fields
     - Order index for module sequencing

## Database Schema

```prisma
model Course {
  id            String    @id @default(cuid())
  title         String
  titleFa       String
  description   String?   @db.Text
  descriptionFa String?   @db.Text
  level         String    // A1.1, A1.2, A2.1, A2.2, B1.1, B1.2, B2.1, B2.2, C1.1, C1.2, C2.1, C2.2
  capacity      Int
  price         Float     @default(0)  // Stored as floating point, displayed as Toman/تومان
  startDate     DateTime
  endDate       DateTime
  timeSlot      String    // e.g., "Monday, Wednesday 18:00-20:00"
  location      String    // e.g., "Online", "Classroom 3"
  thumbnail     String?
  isActive      Boolean   @default(true)
  teacherId     String
  adminId       String
  teacher       Teacher   @relation(fields: [teacherId], references: [id])
  admin         Admin     @relation(fields: [adminId], references: [id])
  modules       Module[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Module {
  id            String    @id @default(cuid())
  title         String
  titleFa       String
  description   String?   @db.Text
  descriptionFa String?   @db.Text
  orderIndex    Int       @default(0)
  courseId      String
  course        Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons       Lesson[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Lesson {
  id            String    @id @default(cuid())
  title         String
  titleFa       String
  content       String    @db.Text
  contentFa     String    @db.Text
  duration      Int?      // in minutes
  orderIndex    Int       @default(0)
  moduleId      String
  module        Module    @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  materials     Material[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Material {
  id            String    @id @default(cuid())
  title         String
  titleFa       String
  description   String?   @db.Text
  descriptionFa String?   @db.Text
  type          MaterialType
  url           String
  lessonId      String
  lesson        Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum MaterialType {
  DOCUMENT
  VIDEO
  AUDIO
  LINK
  OTHER
}
```

## API Endpoints

1. **Courses API**:
   - `GET /api/courses`: Get all courses with pagination and filtering
   - `POST /api/courses`: Create a new course
   - `GET /api/courses/[id]`: Get a specific course
   - `PUT /api/courses/[id]`: Update a specific course
   - `DELETE /api/courses/[id]`: Delete a specific course
   - `GET /api/courses/published`: Get all published/active courses

2. **Modules API**:
   - `GET /api/courses/modules`: Get all modules for a course
   - `POST /api/courses/modules`: Create a new module
   - `GET /api/courses/modules/[id]`: Get a specific module
   - `PUT /api/courses/modules/[id]`: Update a specific module
   - `DELETE /api/courses/modules/[id]`: Delete a specific module

## Authentication and Authorization

The course management system uses the same authentication as the rest of the admin dashboard:

1. **Session-based Authentication** for admin UI access:
   - NextAuth.js session for authenticated users
   - Role-based access (admin only)

2. **JWT-based Authentication** for API requests:
   - Bearer token in Authorization header
   - Token validation with jose library

## Workflow

### Creating a New Course

1. Navigate to the admin dashboard
2. Select "Courses" from the sidebar
3. Click "Add New Course"
4. Fill in the form with content for both languages:
   - Title (German and Farsi)
   - Description (German and Farsi)
   - Level (A1.1, A1.2, A2.1, A2.2, B1.1, B1.2, B2.1, B2.2, C1.1, C1.2, C2.1, C2.2)
   - Capacity
   - Price (in Toman/تومان)
   - Start and end dates
   - Time slot
   - Location
5. Upload a thumbnail image
6. Select a teacher
7. Choose whether to make the course active
8. Click "Save"

### Adding Modules to a Course

1. Navigate to the admin dashboard
2. Select "Courses" from the sidebar
3. Click on a course to view its modules (or use the Modules tab)
4. Click "Add New Module"
5. Fill in the form:
   - Title (German and Farsi)
   - Description (German and Farsi)
   - Order index
6. Click "Save"

## Future Enhancements

1. **Lesson Management**: Implement lesson creation and management within modules
2. **Material Management**: Allow uploading and organizing course materials
3. **Drag-and-Drop Reordering**: Add drag-and-drop functionality for reordering modules and lessons
4. **Rich Text Editor**: Add rich text editing for course and module descriptions
5. **Student Enrollment**: Implement student enrollment and progress tracking
6. **Automated Notifications**: Send notifications for course changes
7. **Course Templates**: Create reusable course templates
8. **Course Duplication**: Allow copying existing courses as templates
9. **Preview Mode**: Preview courses as students would see them 