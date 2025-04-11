# Blog System Documentation

## Overview

The blog system is a comprehensive content management solution integrated into the admin dashboard. It allows administrators to create, edit, and manage blog posts and categories, with the content being displayed on the public-facing website in multiple languages.

## Features

- **Multilingual Content**: Support for German, Farsi, and English
- **Category Management**: Create, edit, and delete blog categories
- **Post Management**: Create, edit, delete, and publish blog posts
- **Media Integration**: Upload and manage images with robust fallback handling
- **Filtering**: Filter posts by category with post count indicators
- **Related Posts**: Display related posts based on categories
- **Responsive Design**: Optimized for all device sizes
- **SEO Friendly**: Proper meta tags and slugs for better search engine indexing

## Components

### Admin Components

1. **BlogManagement**: Main container component for the blog system with tabs for Posts and Categories.
   - Location: `components/dashboard/admin/blog/BlogManagement.tsx`
   - Features: Tab-based navigation between posts and categories management

2. **PostsList**: Component for listing, filtering, and managing blog posts.
   - Location: `components/dashboard/admin/blog/PostsList.tsx`
   - Features: 
     - Pagination
     - Search functionality
     - Status filtering (draft/published)
     - Quick actions (edit, delete, view)

3. **CategoriesList**: Component for managing blog categories.
   - Location: `components/dashboard/admin/blog/CategoriesList.tsx`
   - Features:
     - Add/edit/delete categories
     - Display post count per category
     - Multilingual category names

4. **PostEditor**: Component for creating and editing blog posts.
   - Location: `components/dashboard/admin/blog/PostEditor.tsx`
   - Features:
     - Form with validation
     - Image upload and preview
     - Category selection
     - Multilingual content fields
     - Toggle for draft/published status

5. **CategoryEditor**: Component for creating and editing categories.
   - Location: `components/dashboard/admin/blog/CategoryEditor.tsx`
   - Features:
     - Form with validation
     - Multilingual name fields

### Public Frontend Components

1. **BlogPage**: Main blog listing page with filtering by categories.
   - Location: `app/[locale]/blog/page.tsx`
   - Features:
     - Post listing with pagination
     - Category sidebar for filtering
     - Responsive grid layout

2. **SinglePostPage**: Detailed view of a single blog post.
   - Location: `app/[locale]/blog/[slug]/page.tsx`
   - Features:
     - Full post content display
     - Related posts section
     - Category links
     - Author and date information

3. **PostCard**: Card component for displaying blog post previews.
   - Location: `components/blog/PostCard.tsx`
   - Features:
     - Image with fallback mechanism
     - Title and excerpt
     - Category and date information
     - Responsive design

4. **CategoryFilter**: Component for filtering posts by category.
   - Location: `components/blog/CategoryFilter.tsx`
   - Features:
     - List of categories with post counts
     - Active state for selected category
     - All posts option

### API Endpoints

1. **Posts API**:
   - `GET /api/blog/posts`: Get all blog posts with pagination and filtering
   - `POST /api/blog/posts`: Create a new blog post
   - `GET /api/blog/posts/[id]`: Get a specific post
   - `PUT /api/blog/posts/[id]`: Update a specific post
   - `DELETE /api/blog/posts/[id]`: Delete a specific post
   - `GET /api/blog/published`: Get all published posts with pagination
   - `GET /api/blog/published/[slug]`: Get a published post by slug

2. **Categories API**:
   - `GET /api/blog/categories`: Get all categories
   - `POST /api/blog/categories`: Create a new category
   - `GET /api/blog/categories/[id]`: Get a specific category
   - `PUT /api/blog/categories/[id]`: Update a specific category
   - `DELETE /api/blog/categories/[id]`: Delete a specific category
   - `GET /api/blog/categories/published`: Get categories with published posts

3. **Image Upload API**:
   - `POST /api/upload/image`: Upload an image for blog posts
   - Features:
     - File validation (size, type)
     - Authentication check
     - Proper error handling

## Database Schema

```prisma
model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  titleEn     String
  titleDe     String
  titleFa     String
  contentEn   String   @db.Text
  contentDe   String   @db.Text
  contentFa   String   @db.Text
  excerptEn   String?  @db.Text
  excerptDe   String?  @db.Text
  excerptFa   String?  @db.Text
  imageUrl    String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  authorId    String?
  author      User?    @relation(fields: [authorId], references: [id])
}

model Category {
  id       String  @id @default(cuid())
  nameEn   String
  nameDe   String
  nameFa   String
  posts    Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Authentication and Authorization

The blog system uses dual authentication:

1. **Session-based Authentication** for admin UI access:
   - NextAuth.js session for authenticated users
   - Role-based access (admin only)

2. **JWT-based Authentication** for API requests:
   - Bearer token in Authorization header
   - Token validation with jose library
   - Example API request:
     ```javascript
     fetch('/api/blog/posts', {
       method: 'GET',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     })
     ```

## Image Handling

The blog system uses a robust image handling approach:

1. **ImageWithFallback Component**:
   - Location: `components/common/ImageWithFallback.tsx`
   - Features:
     - Next.js Image optimization
     - Automatic fallback on load error
     - Responsive sizing

2. **Image Upload**:
   - Validation for file type and size
   - Error handling
   - Secure storage

## Internationalization

The blog system fully supports multiple languages:

1. **Content Storage**:
   - Separate fields for each language (titleEn, titleDe, titleFa, etc.)
   - Language-specific content displayed based on user's locale

2. **UI Localization**:
   - All UI elements localized via translation dictionaries
   - RTL support for Farsi content

## Future Enhancements

1. **Rich Text Editor**: Replace plain text inputs with a WYSIWYG editor
2. **Comment System**: Add commenting functionality with moderation
3. **Social Sharing**: Integrate social media sharing capabilities
4. **Analytics**: Add view tracking and content performance metrics
5. **Tag System**: Implement tags for more granular content organization

## Usage Examples

### Creating a New Post

1. Navigate to the admin dashboard
2. Select "Blog" from the sidebar
3. Click the "Posts" tab
4. Click "Add New Post"
5. Fill in the form with content for all languages
6. Upload a featured image
7. Select a category
8. Choose whether to publish immediately or save as draft
9. Click "Save"

### Editing a Category

1. Navigate to the admin dashboard
2. Select "Blog" from the sidebar
3. Click the "Categories" tab
4. Click the edit icon next to a category
5. Update the names in different languages
6. Click "Save"

### Filtering Posts on the Blog Page

1. Navigate to the blog page
2. Find the category sidebar
3. Click on a category name to filter posts
4. Click "All Posts" to reset the filter 