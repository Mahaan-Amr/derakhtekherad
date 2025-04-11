# Rich Text Editor Implementation

## Overview

The Rich Text Editor implementation adds advanced text editing capabilities to the application, allowing users to create formatted content with embedded images. This feature enhances both blog posts and course descriptions with rich media support.

## Features

- Text formatting (bold, italic, underline, strike-through)
- Headers (h1-h6)
- Lists (ordered and unordered)
- Text alignment
- Text and background colors
- Link embedding
- Image embedding with upload functionality
- RTL support for Farsi content
- Dark mode compatibility

## Components

### RichTextEditor

The core component for editing rich content:

- **Location**: `app/components/ui/RichTextEditor.tsx`
- **Dependencies**: `react-quill`
- **Props**:
  - `value`: Current content value
  - `onChange`: Handler for content changes
  - `placeholder`: Placeholder text
  - `locale`: Current locale (for RTL support)
  - `label`: Input label text
  - `required`: Whether the field is required
  - `height`: Height of the editor
  - `className`: Additional CSS classes
  - `error`: Error message to display

### HtmlContent

A component for safely rendering HTML content:

- **Location**: `app/components/ui/HtmlContent.tsx`
- **Dependencies**: `html-react-parser`
- **Props**:
  - `content`: HTML content to render
  - `className`: Additional CSS classes
  - `locale`: Current locale (for RTL support)

## Implementation Details

### Dynamic Import

The RichTextEditor uses Next.js dynamic imports to avoid SSR hydration issues, since Quill requires browser-specific APIs:

```tsx
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="border rounded p-4 animate-pulse h-64 bg-gray-100 dark:bg-gray-800"></div>
});
```

### Image Upload

The image upload functionality:

1. Uses a custom handler registered with Quill's toolbar
2. Dynamically determines which API endpoint to use based on the current path
3. Uploads the image with proper authentication
4. Inserts the image at the current cursor position

```tsx
const imageHandler = async () => {
  // ... file selection logic ...
  
  // Determine which endpoint to use
  const isCoursesPage = window.location.pathname.includes('/courses/') || 
                         window.location.pathname.includes('/admin/courses');
  const uploadEndpoint = isCoursesPage ? '/api/courses/upload' : '/api/blog/upload';
  
  // ... upload logic ...
  
  // Insert at cursor position
  quill.insertEmbed(range.index, 'image', fileUrl);
}
```

### RTL Support

The editor provides built-in RTL support for Farsi content:

```tsx
<div className={`${isRtl ? 'rtl' : 'ltr'} ${className}`}>
  <ReactQuill
    // ... other props ...
    style={{ 
      height, 
      direction: isRtl ? 'rtl' : 'ltr', 
      fontFamily: isRtl ? 'Vazirmatn, sans-serif' : 'inherit' 
    }}
  />
</div>
```

### Content Rendering

The HtmlContent component safely renders HTML using html-react-parser with Tailwind Typography styles:

```tsx
<div className={`${baseClass} ${rtlClass} ${className}`}>
  {parse(content || '')}
</div>
```

## Usage Examples

### For Blog Posts

```tsx
<RichTextEditor
  label={translations.contentLabel}
  value={formData.content}
  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
  locale="de"
  required
/>
```

### For Course Descriptions

```tsx
<RichTextEditor
  label={translations.descriptionLabel}
  value={formData.description}
  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
  locale="de"
  height="200px"
/>
```

### Displaying Content

```tsx
<HtmlContent
  content={postContent}
  locale={locale as Locale}
  className="prose-lg"
/>
```

## Security Considerations

- HTML content is parsed with html-react-parser, which provides protection against XSS attacks
- The editor enforces allowed formats and elements
- Image uploads validate file types and sizes before accepting

## Styling

The implementation uses Tailwind's Typography plugin for consistent content styling:

```js
// tailwind.config.js
plugins: [
  require('@tailwindcss/typography'),
],
```

## Dependencies Added

- `react-quill`: The Quill rich text editor React wrapper
- `html-react-parser`: For safely parsing and rendering HTML content
- `@tailwindcss/typography`: For styling rich text content

## Future Enhancements

1. **Advanced Media Embedding**: Add support for embedding videos and other media types
2. **Table Support**: Implement table creation and editing
3. **Code Blocks**: Add support for syntax-highlighted code blocks
4. **Custom Formats**: Allow admin-defined custom formats and styling
5. **Collaborative Editing**: Implement real-time collaborative editing capabilities 