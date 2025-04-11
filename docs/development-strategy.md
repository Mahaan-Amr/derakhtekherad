# Development Strategy for System Implementation

## Overview

This document outlines a structured approach to implementing new systems within the Derakht-e-Kherad platform, based on the successful patterns used in our blog management implementation. Following these guidelines will ensure consistency, maintainability, and quality across different parts of the application.

## System Development Lifecycle

### 1. Planning and Requirements

- **Define Clear Goals**: Establish specific objectives for the system
- **User Stories**: Create detailed user stories for different roles (admin, teacher, student)
- **Feature List**: Develop a comprehensive list of required features
- **Data Requirements**: Identify what data needs to be stored and managed
- **Dependencies**: Identify dependencies on other systems or components

### 2. Database Schema Design

- **Model Definition**: Create Prisma models with appropriate fields and relationships
- **Follow the Pattern**: Base your models on existing patterns (e.g., multilingual fields)
- **Naming Conventions**: Use consistent naming (e.g., `nameEn`, `nameDe`, `nameFa`)
- **Include Timestamps**: Always include `createdAt` and `updatedAt` fields
- **Proper Relations**: Establish clear relationships between models
- **Indexing**: Add indexes for frequently queried fields

```prisma
model ExampleModel {
  id          String    @id @default(cuid())
  titleEn     String
  titleDe     String
  titleFa     String
  contentEn   String    @db.Text
  contentDe   String    @db.Text
  contentFa   String    @db.Text
  slug        String    @unique
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  relatedId   String?
  related     Related?  @relation(fields: [relatedId], references: [id])
}
```

### 3. API Implementation

- **Endpoint Structure**: Create RESTful endpoints following the pattern:
  - GET /api/[system]/[resource] - List resources
  - POST /api/[system]/[resource] - Create resource
  - GET /api/[system]/[resource]/[id] - Get specific resource
  - PUT /api/[system]/[resource]/[id] - Update specific resource
  - DELETE /api/[system]/[resource]/[id] - Delete specific resource

- **Dual Authentication**: Support both session and token-based authentication
- **Error Handling**: Implement consistent error handling with appropriate status codes
- **Validation**: Validate input data before processing
- **Proper TypeScript Types**: Define interfaces for request and response data

```typescript
// Example API handler pattern
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get('authorization');
    
    let isAuthenticated = false;
    
    if (session?.user) {
      isAuthenticated = true;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        await verifyToken(token);
        isAuthenticated = true;
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Data retrieval logic
    const data = await prisma.exampleModel.findMany({
      // Query options
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 4. Component Structure

- **Component Hierarchy**: Organize components in a logical hierarchy:
  - Top-level container component (e.g., `CourseManagement.tsx`)
  - List component (e.g., `CoursesList.tsx`)
  - Editor component (e.g., `CourseEditor.tsx`)
  - Item component (e.g., `CourseItem.tsx`)
  - Common UI components (e.g., `Pagination`, `SearchBar`)

- **Directory Structure**: Keep related components together:
  ```
  components/
    dashboard/
      admin/
        courses/
          CourseManagement.tsx
          CoursesList.tsx
          CourseEditor.tsx
          CourseItem.tsx
  ```

- **Component Template**: Follow this basic pattern for container components:
  ```tsx
  'use client';
  
  import { useState, useEffect } from 'react';
  import { useTranslations } from 'next-intl';
  import { useAuth } from '@/context/AuthContext';
  
  export default function SystemManagement() {
    const t = useTranslations('admin');
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/system/resource', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, [token]);
    
    // Component rendering logic
  }
  ```

### 5. Internationalization

- **Translation Keys**: Define keys in appropriate dictionary files
- **Consistent Pattern**: Follow the established pattern for multilingual content
- **Component Integration**: Use the `useTranslations` hook consistently
- **Direction Handling**: Account for RTL/LTR differences when needed

```json
// Example dictionary entry
{
  "system": {
    "title": "System Title",
    "createNew": "Create New Item",
    "fields": {
      "name": "Name",
      "description": "Description"
    },
    "actions": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete"
    },
    "messages": {
      "saveSuccess": "Item saved successfully",
      "deleteSuccess": "Item deleted successfully",
      "error": "An error occurred"
    }
  }
}
```

### 6. Form Implementation

- **Controlled Inputs**: Use controlled inputs with React state
- **Validation**: Implement client-side validation (consider Zod or similar)
- **Error Feedback**: Provide clear error messages for validation issues
- **Loading States**: Show loading indicators during form submission
- **Success Feedback**: Provide confirmation on successful operations

### 7. Authentication and Authorization

- **Always Check Authentication**: Verify user is authenticated at both API and UI levels
- **Role-Based Access Control**: Implement checks for appropriate user roles
- **Token Handling**: Use the AuthContext for token management
- **Consistent Approach**: Follow the dual authentication pattern

### 8. Error Handling

- **Graceful Degradation**: Ensure the UI handles errors gracefully
- **User Feedback**: Provide clear error messages to users
- **Logging**: Log detailed errors server-side for debugging
- **Retry Mechanisms**: Implement retry logic for temporary failures when appropriate

### 9. Testing Strategy

- **Component Testing**: Test components in isolation
- **API Testing**: Verify API endpoints with different inputs
- **Integration Testing**: Test the integration between components
- **User Flow Testing**: Validate complete user workflows
- **Responsive Testing**: Verify across different screen sizes
- **Multilingual Testing**: Test in all supported languages

## Implementation Checklist

Use this checklist when implementing a new system:

- [ ] Define system requirements and user stories
- [ ] Create database models in Prisma schema
- [ ] Run Prisma migrations
- [ ] Implement API endpoints with authentication
- [ ] Create admin UI components
- [ ] Add translations to dictionary files
- [ ] Implement form validation
- [ ] Add proper error handling
- [ ] Test in all supported languages
- [ ] Test on different devices
- [ ] Document the implementation
- [ ] Update project roadmap

## Best Practices from Blog Implementation

### Database Design

- Use separate fields for each language (`titleEn`, `titleDe`, `titleFa`)
- Include slug fields for SEO-friendly URLs
- Establish clear relationships between models (e.g., Post to Category)
- Add status fields like `published` for content visibility control

### API Design

- Support filtering, pagination, and sorting
- Return appropriate HTTP status codes
- Include related data when appropriate
- Implement proper error handling
- Support both session and token authentication

### Component Design

- Create reusable components for common patterns
- Separate concerns (e.g., list view, edit form)
- Implement proper loading states and error handling
- Use responsive design principles
- Support multilingual content display

### Form Handling

- Show validation errors inline
- Auto-generate slugs from titles
- Preview functionality where appropriate
- Support for drafts and publishing workflow
- Auto-save functionality for long forms

## Lessons Learned

- **Token Verification**: Properly verify JWT tokens using the `jose` library
- **Image Handling**: Implement robust image handling with fallbacks
- **Dual Authentication**: Support both NextAuth sessions and JWT tokens
- **Middleware Configuration**: Properly configure middleware for locale prefixing
- **Error Handling**: Implement comprehensive error handling at all levels

By following these guidelines, we can ensure that future system implementations maintain the same level of quality and consistency as our blog management system.

## Future Considerations

- Consider implementing a more comprehensive role-based access control system
- Explore using React Query for improved data fetching and caching
- Investigate automated testing solutions
- Look into implementing WebSockets for real-time features
- Consider a component library for faster UI development 